// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ImmutableUserVault — Non-Amendable External Custody Contract for OpenStream
 * @notice Sits completely outside protocol governance. Contains ZERO admin drain keys
 *         and ZERO upgrade/amendment hooks so existing user funds can never be compromised.
 *         Enforces:
 *           1. Hard $200.00 USDC maximum balance ceiling (auto-reimbursing any excess to sender).
 *           2. First-In-First-Out (FIFO) multi-wallet deposit tranche tracking (defeating $1 dust-hijack attacks).
 *           3. 1-Tap Instant Exit (`instantRefundAll`) returning unspent funds to original funding wallets.
 *           4. 60-Day Inactivity Auto-Refund (`triggerInactivityRefund`) returning unspent tranches proportionally/FIFO.
 */

interface IERC20Minimal {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract ImmutableUserVault {
    IERC20Minimal public immutable stablecoin;
    address public immutable authorizedProtocolEngine;

    uint256 public constant MAX_VAULT_BALANCE = 200_000_000;   // Hard $200.00 cap (6 decimals)
    uint256 public constant MIN_DEPOSIT_AMOUNT = 1_000_000;    // $1.00 minimum tranche to prevent dust griefing
    uint256 public constant INACTIVITY_PERIOD = 60 days;       // 60-day dead-man's switch auto-refund
    uint256 public constant MAX_ACTIVE_TRANCHES = 12;          // Bounded queue for gas safety

    struct FundingTranche {
        address funder;
        uint128 remainingAmount;
    }

    struct VaultAccount {
        uint256 totalBalance;
        uint64 lastActiveTimestamp;
        address sessionKey;
        uint256 maxPerDay;
        FundingTranche[] tranches;
    }

    mapping(address => VaultAccount) private accounts;

    event DepositedWithCap(address indexed user, address indexed funder, uint256 acceptedAmount, uint256 excessReimbursed);
    event TrancheRefunded(address indexed user, address indexed originalFunder, uint256 amountRefunded, bool isInactivityTrigger);
    event VoucherDebited(address indexed user, uint256 amount);

    constructor(address _stablecoin, address _authorizedProtocolEngine) {
        require(_stablecoin != address(0) && _authorizedProtocolEngine != address(0), "Zero address");
        stablecoin = IERC20Minimal(_stablecoin);
        authorizedProtocolEngine = _authorizedProtocolEngine;
    }

    /**
     * @notice Funds a user's vault account up to the strict $200.00 ceiling.
     *         Any amount above $200.00 is automatically reimbursed to msg.sender.
     *         Records the deposit source wallet for FIFO proportional refund safety.
     */
    function depositFor(address user, uint256 amount, address sessionKey, uint256 maxPerDay) external {
        require(amount >= MIN_DEPOSIT_AMOUNT, "Below minimum deposit");
        VaultAccount storage acct = accounts[user];

        uint256 availableRoom = acct.totalBalance >= MAX_VAULT_BALANCE
            ? 0
            : MAX_VAULT_BALANCE - acct.totalBalance;

        uint256 acceptedAmount = amount > availableRoom ? availableRoom : amount;
        uint256 excessToReimburse = amount - acceptedAmount;

        if (acceptedAmount > 0) {
            require(acct.tranches.length < MAX_ACTIVE_TRANCHES, "Max active funding tranches reached");
            require(stablecoin.transferFrom(msg.sender, address(this), acceptedAmount), "Deposit transfer failed");
            acct.totalBalance += acceptedAmount;
            acct.tranches.push(FundingTranche({
                funder: msg.sender,
                remainingAmount: uint128(acceptedAmount)
            }));
        }

        if (user == msg.sender) {
            acct.lastActiveTimestamp = uint64(block.timestamp);
            if (sessionKey != address(0)) acct.sessionKey = sessionKey;
            if (maxPerDay > 0) acct.maxPerDay = maxPerDay;
        }

        emit DepositedWithCap(user, msg.sender, acceptedAmount, excessToReimburse);
    }

    /**
     * @notice Called exclusively by the authorized OpenStreamEngine when verifying a user's signed voucher.
     *         Spends down the oldest deposit tranches first (First-In-First-Out) and updates lastActiveTimestamp.
     */
    function debitFIFO(address user, uint256 amount) external {
        require(msg.sender == authorizedProtocolEngine, "Only authorized engine");
        VaultAccount storage acct = accounts[user];
        require(acct.totalBalance >= amount, "Insufficient vault balance");

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

        // Compact exhausted leading tranches
        _compactEmptyTranches(acct);
        emit VoucherDebited(user, amount);
    }

    /**
     * @notice 1-Tap Instant Exit: Immediately returns all remaining unspent funds
     *         back to the exact original wallets that funded each unspent FIFO tranche.
     */
    function instantRefundAll() external {
        _executeProportionalFIFORefund(msg.sender, false);
    }

    /**
     * @notice 60-Day Inactivity Auto-Refund: If an account has been inactive for >= 60 days
     *         (lost key, uninstalled app, or frozen device), anyone or any automated keeper
     *         can trigger a full refund strictly back to the original funding wallets.
     *         Immune to the "$1 Dust Last-Sender Attack" because each funder only receives
     *         their own unspent FIFO tranche!
     */
    function triggerInactivityRefund(address user) external {
        VaultAccount storage acct = accounts[user];
        require(acct.totalBalance > 0, "Nothing to refund");
        require(block.timestamp >= acct.lastActiveTimestamp + INACTIVITY_PERIOD, "Account still active (< 60 days)");
        _executeProportionalFIFORefund(user, true);
    }

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
                require(stablecoin.transfer(funder, rem), "Refund transfer failed");
                emit TrancheRefunded(user, funder, rem, isInactivity);
            }
        }
        delete acct.tranches;
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
        uint256 activeTrancheCount
    ) {
        VaultAccount storage acct = accounts[user];
        return (acct.totalBalance, acct.lastActiveTimestamp, acct.sessionKey, acct.tranches.length);
    }
}
