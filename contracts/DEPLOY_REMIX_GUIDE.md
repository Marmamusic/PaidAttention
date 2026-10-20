# ⛓️ Deploy PaidAttention Smart Contracts to Base Sepolia Testnet (Zero Install via Browser)

You can deploy both [`OpenStreamProtocol.sol`](OpenStreamProtocol.sol) and [`ImmutableUserVault.sol`](ImmutableUserVault.sol) directly from your Chrome browser to the free **Base Sepolia Testnet** in ~2 minutes using **Remix IDE** and **MetaMask**—no command-line tools required.

---

## Step 1: Get Free Base Sepolia Testnet ETH & USDC (1 Minute)

1. Open [index.html](../index.html) in Chrome and click **`🦊 Connect`** in the top Wallet bar—this automatically adds and switches your MetaMask to **Base Sepolia Testnet** (`Chain ID: 84532`).
2. Copy your MetaMask `0x...` address and claim free Testnet ETH (for deployment gas) from any of these free faucets:
   - **Alchemy Base Sepolia Faucet:** [https://www.alchemy.com/faucets/base-sepolia](https://www.alchemy.com/faucets/base-sepolia)
   - **Coinbase Developer Faucet:** [https://portal.cdp.coinbase.com/products/faucet](https://portal.cdp.coinbase.com/products/faucet)
3. *(Optional for testing deposits)* Claim free **Testnet USDC** on **Base Sepolia** from Circle's official faucet:
   - **Circle USDC Faucet:** [https://faucet.circle.com/](https://faucet.circle.com/) *(Select **"Base Sepolia"** and paste your address)*
   - Official Base Sepolia USDC Contract Address: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

---

## Step 2: Deploy `OpenStreamProtocol.sol` in Remix IDE

1. Open **[https://remix.ethereum.org](https://remix.ethereum.org)** in Chrome.
2. In the left **File Explorer**, click the **New File** icon, name it `OpenStreamProtocol.sol`, and paste the contents of [`contracts/OpenStreamProtocol.sol`](OpenStreamProtocol.sol).
3. Click the **Solidity Compiler** icon on the left sidebar (3rd icon down), select compiler version **`0.8.20+`**, and click **Compile OpenStreamProtocol.sol**.
4. Click the **Deploy & Run Transactions** icon on the left sidebar (4th icon down):
   - Change **ENVIRONMENT** at the top to **`Injected Provider - MetaMask`** (confirm MetaMask is on **Base Sepolia**).
   - Select **`OpenStreamProtocol`** in the **CONTRACT** dropdown.
   - Click the arrow next to **Deploy** to expand the 4 constructor parameters and paste:
     - `_stablecoin`: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` *(Base Sepolia USDC)*
     - `_founder`: *Your MetaMask `0x...` address*
     - `_oracleUpdater`: *Your MetaMask `0x...` address*
     - `_initialCodeHash`: `0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d91a4`
   - Click **transact** and confirm in MetaMask.
   - Copy the deployed **`OpenStreamProtocol` contract address** from Remix's *Deployed Contracts* list at the bottom-left!

---

## Step 3: Deploy `ImmutableUserVault.sol` (The Non-Amendable User Wallet)

1. In Remix File Explorer, create a second file named `ImmutableUserVault.sol` and paste the contents of [`contracts/ImmutableUserVault.sol`](ImmutableUserVault.sol).
2. Compile `ImmutableUserVault.sol` (Compiler `0.8.20+`).
3. In **Deploy & Run Transactions**, select **`ImmutableUserVault`** and fill in its 2 constructor parameters:
   - `_stablecoin`: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` *(Base Sepolia USDC)*
   - `_protocolEngine`: *Paste the `OpenStreamProtocol` address you deployed in Step 2*
4. Click **transact** and confirm in MetaMask.
5. Copy your deployed **`ImmutableUserVault` address**!

---

## Step 4: Link Both Contracts (`setVaultContract`) & Save in PaidAttention

1. In Remix under **Deployed Contracts**, expand your **`OpenStreamProtocol`** instance, find `setVaultContract`, paste your **`ImmutableUserVault`** address, and click **transact** (this permanently links the two contracts).
2. Open the **PaidAttention** Chrome Extension (`⚙️ Advanced Settings`) or Web App (`🔒 Wallet Safety & Grants` tab) and paste your two Base Sepolia contract addresses!
