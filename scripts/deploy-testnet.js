/**
 * PaidAttention v2.0 — Ethereum L2 Testnet Deployment Script (Base Sepolia / Arbitrum Sepolia)
 *
 * Deploys:
 *   1. ImmutableUserVault.sol (Non-amendable user wallet with $200 cap & 60-day FIFO auto-refund)
 *   2. OpenStreamProtocol.sol (Core attention settlement, 👍 quality pool, & domain escrow)
 *
 * Usage (when ready to deploy to Base Sepolia Testnet with Hardhat/Foundry):
 *   npx hardhat run scripts/deploy-testnet.js --network baseSepolia
 */

async function main() {
  console.log("🚀 Preparing PaidAttention v2.0 deployment to Base Sepolia Testnet...");

  // Base Sepolia Testnet USDC address (Circle official testnet faucet token)
  const BASE_SEPOLIA_USDC = process.env.TESTNET_USDC || "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const INITIAL_CODE_HASH = "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d91a4";

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy Protocol Engine first (or predict address)
  const ProtocolFactory = await ethers.getContractFactory("OpenStreamProtocol");
  const protocol = await ProtocolFactory.deploy(
    BASE_SEPOLIA_USDC,
    deployer.address, // Founder address (receives 1/3 arbitration share & dev treasury)
    deployer.address, // Oracle / Aggregator relayer on testnet
    INITIAL_CODE_HASH
  );
  await protocol.waitForDeployment();
  const protocolAddress = await protocol.getAddress();
  console.log("✅ OpenStreamProtocol deployed to:", protocolAddress);

  // 2. Deploy Standalone Non-Amendable User Wallet Vault
  const VaultFactory = await ethers.getContractFactory("ImmutableUserVault");
  const vault = await VaultFactory.deploy(BASE_SEPOLIA_USDC, protocolAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ ImmutableUserVault deployed to:", vaultAddress);

  console.log("\n🎉 Testnet Deployment Complete!");
  console.log("Next step: Paste these two addresses into extension/background.js to connect MetaMask on Base Sepolia.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
