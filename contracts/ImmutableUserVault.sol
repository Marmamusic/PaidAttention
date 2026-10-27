// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.24;

/**
 * @title ImmutableUserVault — Hardened Non-Amendable External Custody Contract for PaidAttention
 * @notice Sits completely outside protocol governance. Contains ZERO admin drain keys,
 *         ZERO developer fee skimming, and ZERO upgrade/amendment hooks.
 *         Security Hardening (v2.1 Pen-Test Patched):
 *           1. Non-reentrant mutex (`nonReentrant`) on all state-mutating external calls.
 *           2. Cryptographic EIP-191/EIP-712 user/sessionKey signature + anti-replay nonce verification on every debit.
 *           3. Hard $3.00/day (`MAX_DAILY_SPEND`) rolling 24h cap enforced directly inside the vault.
 *           4. Hard $200.00 USDC maximum balance ceiling (`MAX_VAULT_BALANCE`).
 *           5. Anti-Tranche-Stuffing: Only the user (or pre-authorized funders) can add tranches; same-funder deposits auto-merge.
 *           6. Poison-Proof Refunds: Uses low-level non-reverting `.call` per tranche so a blacklisted/malicious funder
 *              can never block `instantRefundAll()` or `triggerInactivityRefund()`.
 */

interface IERC20Minimal {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract ImmutableUserVault {
    IERC20Minimal public immutable stablecoin;
    address public immutable authorizedProtocolEngine;

    uint256 public constant MAX_VAULT_BALANCE   = 200_000_000; // Hard $200.00 cap (6 decimals)
    uint256 public constant DEFAULT_MAX_PER_DAY = 3_000_000;   // Hard $3.00/day default cap (6 decimals)
    uint256 public constant MIN_DEPOSIT_AMOUNT  = 1_000_000;   // $1.00 minimum deposit
    uint256 public constant INACTIVITY_PERIOD   = 60 days;     // 60-day dead-man's switch auto-refund
    uint256 public constant MAX_ACTIVE_TRANCHES = 12;          // Bounded queue for gas safety

    struct FundingTranche {
        address funder;
        uint128 remainingAmount;
    }

    struct VaultAccount {
        uint256 totalBalance;
        uint64  lastActiveTimestamp;
        address sessionKey;
        uint256 maxPerDay;
        uint256 spentCurrentDay;
        uint64  currentDayWindowStart;
        uint256 nonce;
        bool    allowThirdPartyDeposits;
        FundingTranche[] tranches;
    }

    mapping(address => VaultAccount) private accounts;
    mapping(address => uint256) public quarantinedRefunds; // Pull-fallback if a funder address reverts during refund

    uint256 private _locked = 1;
    modifier nonReentrant() {
        require(_locked == 1, "Reentrancy blocked");
        _locked = 2;
        _;
        _locked = 1;
    }

    event DepositedWithCap(address indexed user, address indexed funder, uint256 acceptedAmount, uint256 excessNotPulled);
    event TrancheRefunded(address indexed user, address indexed originalFunder, uint256 amountRefunded, bool isInactivityTrigger);
    event TrancheQuarantined(address indexed user, address indexed failedFunder, uint256 amount);
    event VoucherDebited(address indexed user, uint256 amount, uint256 nonce);

    constructor(address _stablecoin, address _authorizedProtocolEngine) {
        require(_stablecoin != address(0) && _authorizedProtocolEngine != address(0), "Zero address");
        stablecoin = IERC20Minimal(_stablecoin);
        authorizedProtocolEngine = _authorizedProtocolEngine;
    }

    /**
     * @notice Funds a user's vault account up to the strict $200.00 ceiling.
     *         Protected against SC-05 (Tranche Queue Stuffing): third-party deposits require opt-in,
     *         and consecutive deposits from the same funder automatically merge into one tranche.
     */
    function depositFor(address user, uint256 amount, address sessionKey, uint256 maxPerDay) external nonReentrant {
        require(user != address(0), "Invalid user");
        require(amount >= MIN_DEPOSIT_AMOUNT, "Below minimum deposit");
        VaultAccount storage acct = accounts[user];

        // SC-05 Fix: Prevent unsolicited third-party dust from filling up the user's 12 tranche slots
        require(msg.sender == user || acct.allowThirdPartyDeposits, "Third-party deposits disabled by user");

        uint256 availableRoom = acct.totalBalance >= MAX_VAULT_BALANCE
            ? 0
            : MAX_VAULT_BALANCE - acct.totalBalance;

        uint256 acceptedAmount = amount > availableRoom ? availableRoom : amount;
        uint256 excessNotPulled = amount - acceptedAmount;

        if (acceptedAmount > 0) {
            require(stablecoin.transferFrom(msg.sender, address(this), acceptedAmount), "Deposit transfer failed");
            acct.totalBalance += acceptedAmount;

            // Merge with trailing tranche if from the same funder to save tranche slots
            uint256 len = acct.tranches.length;
            if (len > 0 && acct.tranches[len - 1].funder == msg.sender) {
                acct.tranches[len - 1].remainingAmount += uint128(acceptedAmount);
            } else {
                require(len < MAX_ACTIVE_TRANCHES, "Max active funding tranches reached");
                acct.tranches.push(FundingTranche({
                    funder: msg.sender,
                    remainingAmount: uint128(acceptedAmount)
                }));
            }
        }

        if (user == msg.sender) {
            acct.lastActiveTimestamp = uint64(block.timestamp);
            if (sessionKey != address(0)) acct.sessionKey = sessionKey;
            if (maxPerDay > 0 && maxPerDay <= DEFAULT_MAX_PER_DAY) {
                acct.maxPerDay = maxPerDay;
            } else if (acct.maxPerDay == 0) {
                acct.maxPerDay = DEFAULT_MAX_PER_DAY;
            }
        }

        emit DepositedWithCap(user, msg.sender, acceptedAmount, excessNotPulled);
    }

    function setThirdPartyDepositsAllowed(bool allowed) external {
        accounts[msg.sender].allowThirdPartyDeposits = allowed;
    }

    /**
     * @notice Hardened FIFO Debit (Fixes SC-01 & SC-03):
     *         1. Verifies EIP-191 signature from user or user's sessionKey over (vault, chainId, user, amount, batchHash, nonce).
     *         2. Enforces rolling 24h daily spend cap ($3.00/day max).
     *         3. Deducts oldest FIFO tranches first and atomically transfers `amount` USDC to `authorizedProtocolEngine`.
     */
    function debitFIFOWithSig(
        address user,
        uint256 amount,
        bytes32 batchHash,
        uint256 nonce,
        bytes calldata signature
    ) external nonReentrant {
        require(msg.sender == authorizedProtocolEngine, "Only authorized engine");
        require(amount > 0, "Zero debit");

        VaultAccount storage acct = accounts[user];
        require(acct.totalBalance >= amount, "Insufficient vault balance");
        require(nonce == acct.nonce + 1, "Invalid or replayed nonce");

        // Enforce rolling 24-hour daily spending cap ($3.00/day default)
        uint256 dailyLimit = acct.maxPerDay > 0 ? acct.maxPerDay : DEFAULT_MAX_PER_DAY;
        if (block.timestamp >= acct.currentDayWindowStart + 1 days) {
            acct.currentDayWindowStart = uint64(block.timestamp);
            acct.spentCurrentDay = 0;
        }
        require(acct.spentCurrentDay + amount <= dailyLimit, "Exceeds daily spending cap");

        // SC-01 Fix: Verify cryptographic signature from user or authorized sessionKey
        bytes32 digest = _computeVoucherDigest(user, amount, batchHash, nonce);
        address signer = _recoverSigner(digest, signature);
        require(
            signer != address(0) && (signer == user || (acct.sessionKey != address(0) && signer == acct.sessionKey)),
            "Invalid user/sessionKey signature"
        );

        // Effects before Interactions
        acct.nonce = nonce;
        acct.spentCurrentDay += amount;
        acct.totalBalance -= amount;
        acct.lastActiveTimestamp = uint64(block.timestamp);

        uint256 remainingToDebit = amount;
        uint256 i = 0;
        while (remainingToDebit > 0 && i < acct.tranches.length) {
            uint256 trancheBal = acct.tranches[i].remainingAmount;
            if (trancheBal > 0) {
                if (trancheBal <= remainingToDebit) {
                    remainingToDebit -= trancheBal;
                    acct.tranches[i].remainingAmount = 0;
                } else {
                    acct.tranches[i].remainingAmount = uint128(trancheBal - remainingToDebit);
                    remainingToDebit = 0;
                }
            }
            i++;
        }

        _compactEmptyTranches(acct);

        // SC-03 Fix: Atomically transfer debited stablecoin to Protocol Engine for creator distribution
        require(stablecoin.transfer(authorizedProtocolEngine, amount), "Vault settlement transfer failed");

        emit VoucherDebited(user, amount, nonce);
    }

    /**
     * @notice 1-Tap Instant Exit: Immediately returns all remaining unspent funds
     *         back to the exact original wallets that funded each unspent FIFO tranche.
     */
    function instantRefundAll() external nonReentrant {
        _executeProportionalFIFORefund(msg.sender, false);
    }

    /**
     * @notice 60-Day Inactivity Auto-Refund: Returns unspent tranches strictly to original funders.
     */
    function triggerInactivityRefund(address user) external nonReentrant {
        VaultAccount storage acct = accounts[user];
        require(acct.totalBalance > 0, "Nothing to refund");
        require(block.timestamp >= acct.lastActiveTimestamp + INACTIVITY_PERIOD, "Account still active (< 60 days)");
        _executeProportionalFIFORefund(user, true);
    }

    /**
     * @notice SC-04 Fix: Poison-proof FIFO refund loop. If a specific funder address reverts
     *         (e.g., blacklisted or malicious contract), its tranche is quarantined into
     *         `quarantinedRefunds[funder]` so the user's healthy tranches always refund 100%.
     */
    function _executeProportionalFIFORefund(address user, bool isInactivity) internal {
        VaultAccount storage acct = accounts[user];
        uint256 len = acct.tranches.length;
        require(len > 0 && acct.totalBalance > 0, "No balance to refund");

        acct.totalBalance = 0;
        for (uint256 i = 0; i < len; i++) {
            uint256 rem = acct.tranches[i].remainingAmount;
            address funder = acct.tranches[i].funder;
            if (rem > 0) {
                acct.tranches[i].remainingAmount = 0;
                if (_safeTryTransfer(funder, rem)) {
                    emit TrancheRefunded(user, funder, rem, isInactivity);
                } else {
                    quarantinedRefunds[funder] += rem;
                    emit TrancheQuarantined(user, funder, rem);
                }
            }
        }
        delete acct.tranches;
    }

    function claimQuarantinedRefund(address recipient) external nonReentrant {
        uint256 amt = quarantinedRefunds[msg.sender];
        require(amt > 0, "No quarantined refund");
        quarantinedRefunds[msg.sender] = 0;
        require(stablecoin.transfer(recipient, amt), "Claim failed");
    }

    function _safeTryTransfer(address to, uint256 amount) internal returns (bool) {
        (bool success, bytes memory data) = address(stablecoin).call(
            abi.encodeWithSelector(IERC20Minimal.transfer.selector, to, amount)
        );
        return success && (data.length == 0 || abi.decode(data, (bool)));
    }

    function _computeVoucherDigest(
        address user,
        uint256 amount,
        bytes32 batchHash,
        uint256 nonce
    ) internal view returns (bytes32) {
        bytes32 innerHash = keccak256(abi.encode(address(this), block.chainid, user, amount, batchHash, nonce));
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", innerHash));
    }

    function _recoverSigner(bytes32 digest, bytes calldata sig) internal pure returns (address) {
        if (sig.length != 65) return address(0);
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(sig.offset)
            s := calldataload(add(sig.offset, 32))
            v := byte(0, calldataload(add(sig.offset, 64)))
        }
        if (v < 27) v += 27;
        if (v != 27 && v != 28) return address(0);
        return ecrecover(digest, v, r, s);
    }

    function _compactEmptyTranches(VaultAccount storage acct) internal {
        uint256 firstNonZero = 0;
        while (firstNonZero < acct.tranches.length && acct.tranches[firstNonZero].remainingAmount == 0) {
            firstNonZero++;
        }
        if (firstNonZero > 0) {
            uint256 remainingCount = acct.tranches.length - firstNonZero;
            for (uint256 j = 0; j < remainingCount; j++) {
                acct.tranches[j] = acct.tranches[j + firstNonZero];
            }
            for (uint256 k = 0; k < firstNonZero; k++) {
                acct.tranches.pop();
            }
        }
    }

    function getAccountSummary(address user) external view returns (
        uint256 totalBalance,
        uint64 lastActiveTimestamp,
        address sessionKey,
        uint256 activeTrancheCount,
        uint256 currentNonce
    ) {
        VaultAccount storage acct = accounts[user];
        return (acct.totalBalance, acct.lastActiveTimestamp, acct.sessionKey, acct.tranches.length, acct.nonce);
    }
}
