# Contributing to PaidAttention

Thank you for helping build **PaidAttention** (*"Pay attention online"*)—the open-source micropayment protocol and browser extension for fair creator remuneration across the web.

---

## 🛠️ Repository Structure

| Directory / File | Description |
| :--- | :--- |
| `extension/` | Manifest V3 Browser Extension (Chrome, Brave, Edge) with minimalist 15s countdown pill & popup |
| `contracts/ImmutableUserVault.sol` | Non-amendable user wallet contract ($200 max cap, instant refund, 60-day auto-refund) |
| `contracts/OpenStreamProtocol.sol` | Core L2 settlement contract (S-curve, 👍 quality pool, domain escrow, AI attribution, DAO) |
| `sdk/openstream-sdk.js` | Drop-in `<meta name="paidattention">` detector, web component, & 3D spatial trigger SDK |
| `index.html`, `styles.css`, `app.js` | Interactive web application & Creator Setup Studio |
| `scripts/deploy-testnet.js` | Deployment script for Ethereum L2 testnets (Base Sepolia / Arbitrum Sepolia) |

---

## 🚀 Quick Local Testing (Zero Dependencies Required)

1. **Test the Web App:**
   Open `index.html` directly in any modern browser.
2. **Test the Browser Extension:**
   - Open `chrome://extensions/` in Chrome, Brave, or Edge.
   - Enable **Developer mode** (top-right toggle).
   - Click **Load unpacked** and select the `extension/` folder.

---

## 🌱 Open-Source Maintainer & Contributor Rewards

PaidAttention includes a voluntary, expiring **1% Open-Source Development Tip** and an **On-Chain Code Registry**:
- Verified contributors who submit merged pull requests (security audits, browser integrations, CMS plugins for WordPress/Ghost/Substack, or open-source AI RAG adapters) are eligible for contributor governance distributions.
- All official extension releases are cryptographically hashed on-chain so users are protected against malicious forks.
