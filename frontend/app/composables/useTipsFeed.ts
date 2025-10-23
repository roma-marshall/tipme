// import { ethers } from "ethers";
// import TipJar from "~/abi/TipJar.json";
//
// export async function useTipsFeed() {
//     const config = useRuntimeConfig()
//     if (!config.public.rpcUrl)
//         throw new Error("Missing RPC URL");
//
//     const provider = new ethers.JsonRpcProvider(config.public.rpcUrl);
//     const contract = new ethers.Contract(TipJar.address, TipJar.abi, provider);
//
//     async function getTips(limit = 1000) {
//         const latestBlock = await provider.getBlockNumber();
//         const fromBlock = latestBlock - 7_200;
//         const events = await contract.queryFilter("TipSent", fromBlock, latestBlock);
//
//         const parsed = await Promise.all(
//             events.map(async (e) => {
//                 const args = e.args;
//                 const from = args?.from ?? args?.[0];
//                 const to = args?.to ?? args?.[1];
//                 const net = args?.net ?? args?.[4] ?? 0n;
//                 const block = await e.getBlock();
//
//                 return {
//                     tx: e.transactionHash,
//                     from,
//                     to,
//                     net: Number(ethers.formatEther(net)),
//                     date: new Date(block.timestamp * 1000),
//                 };
//             })
//         );
//
//         // 🧮 Агрегируем по отправителю (from)
//         const map = new Map<string, { from: string; to: string; total: number; lastDate: Date }>();
//         for (const p of parsed) {
//             if (!map.has(p.from)) {
//                 map.set(p.from, { ...p, total: p.net, lastDate: p.date });
//             } else {
//                 const existing = map.get(p.from)!;
//                 existing.total += p.net;
//                 if (p.date > existing.lastDate) existing.lastDate = p.date;
//             }
//         }
//
//         // превращаем Map обратно в массив и сортируем по сумме
//         const unique = [...map.values()]
//             .sort((a, b) => b.total - a.total)
//             .slice(0, limit);
//
//         return unique;
//     }
//
//     return { getTips };
// }
