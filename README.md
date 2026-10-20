# ⚡ PaidAttention (v2.0) — Pay Attention Online

[![License: AGPLv3 + MIT SDK](https://img.shields.io/badge/License-AGPLv3%20%28Core%29%20%2B%20MIT%20%28SDK%29-emerald.svg)](LICENSE)
[![Network: Ethereum L2](https://img.shields.io/badge/Network-Base%20%7C%20Arbitrum%20%7C%20Optimism-06b6d4.svg)](contracts/OpenStreamProtocol.sol)
[![Zero Gas: Yield Subsidized](https://img.shields.io/badge/Gas-100%25%20Yield%20Subsidized-10b981.svg)](SPECIFICATION.md)

**PaidAttention** is an open-source, privacy-preserving, universally deployable micropayment protocol and planetary DAO for digital content and services—including **newspapers, music & video streaming (Netflix/YouTube), open-web blogs, 3D metaverses, AI compute, and online lessons**.

> 📄 **Read the Full v2.0 Technical & Mathematical Whitepaper:** [SPECIFICATION.md](SPECIFICATION.md)

---

## ✨ Core Architectural Pillars (v2.0)

1. **🛡️ Anti-Clickbait S-Curve with Hard Session Cap ($t_{\text{grace}} \to t_{\text{cap}}$)**
   - **First $t_{\text{grace}}$ seconds (e.g., 10–15s) cost \$0.0000:** Bouncing from clickbait costs the user nothing and pays clickbait nothing.
   - **Smooth S-Curve Ramp & Hard Cap ($t_{\text{cap}}$):** Payment accelerates only during genuine engagement and hits a strict cap $P_{\max}$ at $t_{\text{cap}}$, after which the marginal rate drops to **\$0.0000/sec**.
2. **📉 Creator-Defined Collective Buyout Target ($R_{\text{target}}$) & Two-Axis Transparency**
   - Creators set the cumulative revenue target $R_{\text{target}}$ (e.g., \$500 for an article, \$50M for a film) at which the content becomes "collectively purchased by humanity" and drops to its near-free floor $P_{\text{floor}}$.
   - Users compare both the individual per-second rate and the collective buyout target $R_{\text{target}}$ against category averages, alongside a **Creator Pricing Rationale Box** (e.g., frontline war reporting vs. high-budget production).
3. **👍 Zero-Sum $K/N$ Thumbs-Up Quality Pool (50% Floor / +100% Boost Cap)**
   - Users can give a **Thumbs Up (👍)** to content they loved (with no Thumbs Down). Clicking 👍 is 100% budget-neutral for the user: a fraction $\rho = \min(K/N, 50\%)$ of their category spend is withheld into a **Thumbs-Up Pool** and redistributed to upvoted content—bounded so non-upvoted content never receives less than **50%** of its normal payout and upvoted content receives at most a **+100% boost** ($2\times$ normal payout).
4. **⏳ 24h–48h Attention Epoch Reset & Anti-Restreaming Defense**
   - Reaching $t_{\text{cap}}$ unlocks content for a 24h–48h epoch (bounded to $1.5\times$ media stream chunks to block pirate restreaming proxies). Returning days later to re-watch or re-read starts a fresh S-curve at the newly decayed price.
5. **🎬 Enterprise Platform Splits (Netflix / YouTube) & Multi-Creator Royalties**
   - Native smart-contract routing for platform vs. creator splits (from 100% platform share for Netflix licensing buyouts to 30%/70% splits for YouTube) plus multi-wallet percentage splitters for co-creators.
6. **🌐 Paywall-Free "Open Web / Passive Patronage" Mode (`UN_PAYWALLED`) & Open-Source-First AI Attribution**
   - **`UN_PAYWALLED` Category:** Websites and Wikipedia-like commons remain 100% free and unblocked for visitors without the plugin, while automatically streaming floor-level patronage ($P_{\text{floor}}$) after 15s from visitors with OpenStream active.
   - **Phased AI Attribution (Open-Source AI First $\to$ EU AI Act Mandate):** Starts with drop-in open-source RAG middleware (`@openstream/ai-rag-attribution` for LangChain, LlamaIndex, Ollama, and HuggingFace) that splits prompt fees between AI compute (25–30%) and cited original human websites (70–75%, with DNSSEC escrow for unregistered sites). Once battle-tested with empirical creator revenue data in open-source AI, this serves as the reference standard to amend the EU AI Act and copyright law.
7. **📊 Anti-Cartel Historical Inflation Tracker, Market-Band Guardrails & Macro Thermostat**
   - Tracks historical category prices against real-world CPI inflation (~3–4%/yr) to defeat coordinated creator price-fixing cartels, flags statistical outliers ($Z > 1.5\sigma$), and uses a **Macroeconomic Purchasing-Power Thermostat ($\gamma_{\text{macro}}$)** to keep average human digital expenditure below an inflation- and salary-indexed **\$90–\$100/month** ceiling.
8. **🎁 Promotional \$2.00 Virtual Trial Meter (Auto-Sunsetting at 1 Million Users)**
   - During the bootstrap phase (< 1,000,000 organic users), new users get a non-withdrawable, expiring **\$2.00 Virtual Trial Meter** (paying \$0 to creators, eliminating Sybil faucet farming). When exhausted, a **Subscription Comparison Receipt Popup** shows their exact projected monthly savings vs. legacy subscriptions. Auto-discontinues once the network reaches 1M organic users.
9. **🔒 Non-Amendable Custody Vault (`ImmutableUserVault.sol`) & 60-Day FIFO Auto-Refund**
   - User funds sit in an immutable external smart contract outside governance control, enforcing a hard **\$100–\$200 max balance cap** (auto-reimbursing excess deposits), a **1-Tap Exit**, and a **60-Day Inactivity FIFO Proportional Auto-Refund** back to original funding wallets (defeating \$1 dust-hijack attacks).
10. **🕵️ Dual-Sided ZK/Stealth Privacy, OpenStream Commons DAO & 1/3 Founder-Arbitrated Code Registry**
    - Blinded ZK vouchers unlink user wallets from consumed content, and ERC-5564 Stealth Addresses protect creator anonymity—while aggregate encrypted regional telemetry powers a public **Human Value Index** ranking top qualitative content by region, language, and culture.
    - Excess pool yield (above L2 gas) and excess **1% expiring developer surcharges** fund localized **OpenStream Commons DAO** creator grants voted on by 1-year+ organic users. Official code updates are pushed via an on-chain registry governed by a token where the founder permanently retains a **1/3 (33.33%) anti-dilution arbitration share**.
11. **⚡ Animated Electric Utility Meter HUD, Private 2D History & 3D/Metaverse Trigger API**
    - Features a mechanical-style spend velocity odometer, 100% on-device private consumption history (list view + interactive 2D price-vs-time curve), and a spatial event API (`onEnterZone`/`onExitZone`) for 3D virtual worlds like Decentraland.
12. **🚀 60-Second Zero-Friction Creator Setup ("Personal Website to Bank Account") & `x402`/W3C Bridge**
    - **Tier 1 (Zero-Wallet `<meta>` Tag):** Paste `<meta name="openstream" content="domain:aliceblog.com" />` on any personal website. Non-clickbait attention payments accumulate automatically in on-chain DNSSEC escrow before the creator even sets up a wallet.
    - **Tier 2 (1-Click Passkey Biometric Smart Wallet):** Claim accumulated funds in 30 seconds via FaceID / TouchID / Windows Hello (`ERC-4337`) with zero seed phrases and zero gas fees (sponsored by the DeFi Yield Pool).
    - **Tier 3 (Auto-Bank Off-Ramp):** Optional auto-sweep of L2 USDC into local EUR/USD bank accounts via SEPA IBAN / ACH / Stripe bridges.
    - **W3C & `x402` Bridge:** Automatically wraps legacy `<meta name="monetization">` tags and `HTTP 402` endpoints with OpenStream's Anti-Clickbait S-Curve and $K/N$ Thumbs-Up Pool.

---

## 🚀 Quickstart

```bash
# 1. Open the interactive full-stack simulator & Publisher Embed Studio directly in your browser:
start index.html

# 2. Or view the 3-line standalone publisher integration demo:
start examples/newspaper-demo.html
```

### 🧩 Load the Universal Browser Extension (`extension/`) in Chrome / Brave / Edge
1. Open `chrome://extensions/` in your browser and enable **Developer mode** (top-right toggle).
2. Click **Load unpacked** and select the `extension/` folder inside this repository (`c:\Users\RepairTest\Documents\Micro_pay\extension`).
3. Visit any website or blog: the non-intrusive floating **OpenStream Ambient Pill** will track active focus past the 12-second anti-clickbait grace shield, let you boost pages with **👍 Thumbs Up ($K/N$ Pool)**, and let website owners copy their 1-line `<meta>` tag or claim DNSSEC escrow via Passkey!

---

## 📄 License

Dual-licensed under **[GNU AGPLv3 (Core Protocol, Contracts & Browser Extension) + MIT License (`sdk/` & `examples/`)](LICENSE)**:
- **Core Platform (`AGPL-3.0-or-later`):** Ensures the protocol, browser extension, and AI attribution algorithms remain permanently open-source and prevents closed-source commercial clones.
- **Website Embed SDK (`MIT`):** Allows any personal website, blog, newspaper, or streaming service to embed `<meta name="paidattention">` tags and `sdk/openstream-sdk.js` with zero legal friction.
