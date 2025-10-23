import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
  if (!rpcUrl || !privateKey) throw new Error("Missing RPC or PRIVATE_KEY");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("🚀 Deploying NFTAchievements with account:", wallet.address);

  const artifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "artifacts", "contracts", "NFTAchievements.sol", "NFTAchievements.json"),
      "utf8"
    )
  );

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy(wallet.address);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ NFTAchievements deployed at:", address);

  // Save ABI + address to frontend
  const frontendAbiDir = path.join(__dirname, "..", "..", "frontend", "app", "abi");
  fs.mkdirSync(frontendAbiDir, { recursive: true });
  fs.writeFileSync(
    path.join(frontendAbiDir, "NFTAchievements.json"),
    JSON.stringify({ address, abi: artifact.abi }, null, 2)
  );
  console.log("📦 ABI saved to frontend/app/abi/NFTAchievements.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
