# 🛡️ PaidAttention Security Architecture & Penetration Testing Protocol (v2.1)

This document outlines all potential attack vectors against **PaidAttention** and documents the cryptographic, smart-contract, and browser-sandbox defenses implemented in v2.1.

---

## 1. Zero Developer Fee Pool (Eliminating Treasury Abuse)

To eliminate the risk of governance capture, malicious fork fee-skimming, or admin treasury abuse, **PaidAttention has zero in-protocol developer fee pools**.
- **100% of user micropayments** flow strictly from [`ImmutableUserVault.sol`](contracts/ImmutableUserVault.sol) to the verified content creators/platforms in [`OpenStreamProtocol.sol`](contracts/OpenStreamProtocol.sol).
- Open-source development is supported purely via voluntary, out-of-band donations on GitHub.

---

## 2. Smart Contract Defenses (`ImmutableUserVault.sol` & `OpenStreamProtocol.sol`)

| Vulnerability ID | Attack Vector | Hardened Defense in v2.1 |
| :--- | :--- | :--- |
| **SC-01** | **Unauthenticated Settlement / Replay Attack** | `ImmutableUserVault.debitFIFOWithSig()` verifies an **EIP-191 cryptographic signature** from the user or their authorized `sessionKey` over `(vaultAddress, block.chainid, user, amount, batchHash, nonce)` and enforces `nonce == acct.nonce + 1`. |
| **SC-02** | **Basis-Points Inflation (>100% Co-Creator / AI Split Drain)** | `registerContentV2()` enforces `sum(coCreatorBps) == 10_000` (100.00%) and `settleAIAttributionPrompt()` enforces `sum(citationWeightsBps) == 10_000` on-chain, with exact remainder rounding on the final recipient so payouts can never exceed 100% of the debited amount. |
| **SC-03** | **Atomic Vault-to-Protocol Settlement** | `debitFIFOWithSig()` follows strict Checks-Effects-Interactions, deducts FIFO tranches, and atomically executes `stablecoin.transfer(authorizedProtocolEngine, amount)` while enforcing the user's rolling 24-hour **$3.00/day (`DEFAULT_MAX_PER_DAY`)** spending cap. |
| **SC-04** | **Refund Loop Poisoning (Blacklisted / Reverting Funder DoS)** | `_executeProportionalFIFORefund()` uses a non-reverting low-level `.call` (`_safeTryTransfer`) per tranche. If one funder address reverts or is blacklisted, that tranche is isolated into `quarantinedRefunds[funder]` while all healthy tranches refund 100% to the user without reverting. |
| **SC-05** | **12-Tranche Queue Stuffing ($1 Dust Griefing)** | `depositFor()` blocks third-party deposits by default (`require(msg.sender == user || acct.allowThirdPartyDeposits)`) and automatically merges consecutive deposits from the same funder into a single tranche. |
| **SC-06** | **Reentrancy & Trapped Cap Dust** | Both contracts enforce a `nonReentrant` mutex on all external state-changing calls, and `settleUserThumbsUpEpoch()` debits only `actualTotalPayout` (after applying the `2.0x` 👍 boost cap) so zero dust is ever trapped. |
| **SC-07** | **Sybil Double-Voting on Regional Grants** | `voteRegionalGrant()` enforces `require(!hasVotedOnGrant[proposalId][msg.sender])` in addition to requiring $\ge 365\text{ days}$ of organic account age. |

---

## 3. Browser Extension Sandbox Defenses (`extension/`)

| Vulnerability ID | Attack Vector | Hardened Defense in v2.1 |
| :--- | :--- | :--- |
| **EXT-01** | **Hidden Iframe Farming & Background Tab Spoofing** | [`content-script.js`](extension/content-script.js) aborts immediately if `window !== window.top`. [`background.js`](extension/background.js) rejects ticks from inactive tabs, sub-frames (`sender.frameId !== 0`), or ticks arriving faster than once per `900ms`. |
| **EXT-02** | **Clickjacking / Programmatic `.click()` on `👍` Pill** | The overlay pill runs inside a **Closed Shadow DOM** (`attachShadow({ mode: 'closed' })`) and rejects any click event where `!event.isTrusted`. |
| **EXT-03** | **Comment-Section XSS `<meta>` Tag Hijacking** | `content-script.js` only reads `<meta name="paidattention">` from `document.head` at initial page load, ignoring any dynamically injected tags inside `<body>`. |
| **EXT-04** | **Forged `deltaCost` or Privileged Wallet Messages from Webpages** | `background.js` blocks `INSTANT_REFUND_EXIT` and `TOP_UP_WALLET` if `sender.tab` is present (only the extension popup can call them) and strictly clamps `deltaCost` to `MAX_TICK_RATE_USD ($0.0005/s)` and `MAX_DOMAIN_SESSION_USD ($0.05)`. |

---

## 4. Running the Automated Penetration Test Suite

See [`test/security-pentest.js`](test/security-pentest.js) for the automated Hardhat/Ethers security test suite covering `SC-01` through `SC-07`.
