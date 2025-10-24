import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper для BigInt → число процентов
function formatBps(bps) {
  return Number(bps) / 100;
}

async function main() {
  const rpcUrl = process.env.FLOW_EVM_RPC_URL;
  const privateKey = process.env.FLOW_EVM_PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error("❌ Missing SEPOLIA_RPC_URL or SEPOLIA_PRIVATE_KEY in .env");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  // путь к ABI
  const tipJarPath = path.join(__dirname, "..", "..", "frontend", "app", "abi", "TipJar.json");
  const { address, abi } = JSON.parse(fs.readFileSync(tipJarPath, "utf8"));
  const contract = new ethers.Contract(address, abi, wallet);

  console.log("🧑‍💼 Connected as owner:", wallet.address);
  console.log("📍 Contract:", address);

  // показать общую инфу
  const [owner, feeBps, feesAccrued] = await Promise.all([
    contract.owner(),
    contract.feeBps(),
    contract.feesAccrued(),
  ]);

  const contractBalance = await provider.getBalance(address);

  console.log(`👑 Owner: ${owner}`);
  console.log(`💸 Current fee: ${formatBps(feeBps)}%`);
  console.log(`💰 Accrued fees: ${ethers.formatEther(feesAccrued)} ETH`);
  console.log(`🏦 Contract total balance: ${ethers.formatEther(contractBalance)} ETH\n`);

  // меню
  const readline = await import("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question(
    "Choose action:\n1️⃣  Withdraw fees\n2️⃣  Change fee\n3️⃣  Show balances again\nPress Enter to exit\n> ",
    async (opt) => {
      try {
        if (opt === "1") {
          console.log("🚀 Sending withdraw transaction...");
          const tx = await contract.withdrawFees(wallet.address);
          await tx.wait();
          console.log("✅ Fees withdrawn to owner wallet:", wallet.address);
        } else if (opt === "2") {
          rl.question("Enter new fee in % (max 100): ", async (v) => {
            const percent = parseFloat(v);
            if (isNaN(percent) || percent < 0 || percent > 100) {
              console.log("❌ Invalid fee value (must be 0–100%)");
              rl.close();
              return;
            }
            const newFeeBps = Math.round(percent * 100);
            console.log(`🛠 Updating fee to ${percent}%...`);
            const tx = await contract.setFeeBps(newFeeBps);
            await tx.wait();
            console.log(`✅ Fee updated to ${percent}%`);
            rl.close();
          });
          return;
        } else if (opt === "3") {
          const [feeBpsNew, feesNew] = await Promise.all([
            contract.feeBps(),
            contract.feesAccrued(),
          ]);
          const balanceNew = await provider.getBalance(address);
          console.log("\n📊 Updated balances:");
          console.log(`💸 Fee: ${formatBps(feeBpsNew)}%`);
          console.log(`💰 Accrued fees: ${ethers.formatEther(feesNew)} ETH`);
          console.log(`🏦 Contract total balance: ${ethers.formatEther(balanceNew)} ETH`);
        } else {
          console.log("👋 Exit.");
        }
      } catch (err) {
        console.error("❌ Transaction failed:", err.message);
      }
      rl.close();
    }
  );
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
