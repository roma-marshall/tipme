import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const rpcUrl = process.env.FLOW_EVM_RPC_URL;
  const privateKey = process.env.FLOW_EVM_PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error("❌ Missing RPC URL or SEPOLIA_PRIVATE_KEY in .env");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("🚀 Deploying TipJar with account:", wallet.address);

  const artifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "artifacts", "contracts", "TipJar.sol", "TipJar.json"), "utf8")
  );

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy(wallet.address);
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("✅ TipJar deployed at:", addr);

  // сохранить в frontend
  const frontendAbiDir = path.join(__dirname, "..", "..", "frontend", "app", "abi");
  fs.mkdirSync(frontendAbiDir, { recursive: true });
  fs.writeFileSync(path.join(frontendAbiDir, "TipJar.json"), JSON.stringify({ address: addr, abi: artifact.abi }, null, 2));
  console.log("📦 ABI saved to frontend/app/abi/TipJar.json");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
