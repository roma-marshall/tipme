import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const rpcUrl = process.env.FLOW_EVM_TESTNET_RPC_URL;
  const privateKey = process.env.FLOW_EVM_TESTNET_PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error("❌ Missing RPC URL or SEPOLIA_PRIVATE_KEY in .env");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("🚀 Deploying TipMe with account:", wallet.address);

  // читаем артефакт контракта
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "TipMe.sol",
    "TipMe.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // создаём фабрику и деплоим
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );
  const contract = await factory.deploy();

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ TipMe deployed to:", contractAddress);

  // сохраняем ABI и адрес для фронта
  const frontendDir = path.join(__dirname, "..", "..", "frontend", "app", "abi");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const abiExport = {
    address: contractAddress,
    abi: artifact.abi,
  };

  fs.writeFileSync(
    path.join(frontendDir, "TipMe.json"),
    JSON.stringify(abiExport, null, 2)
  );

  console.log("📦 ABI and address saved to frontend/app/abi/TipMe.json");
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exitCode = 1;
});
