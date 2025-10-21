import { ethers } from "ethers";
import TipJar from "~/abi/TipJar.json";

export async function useTipJar() {
    if (!window.ethereum) throw new Error("Wallet not found");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(TipJar.address, TipJar.abi, signer);

    async function sendTip(to: string, amountEth: string) {
        if (!to) throw new Error("Receiver address missing");
        if (!amountEth) throw new Error("Amount missing");

        const value = ethers.parseEther(amountEth.toString());
        const tx = await contract.tip(to, { value });
        return tx; // ✅ возвращаем объект TransactionResponse
    }

    async function withdrawMyTips() {
        const tx = await contract.withdrawMyTips();
        return tx;
    }

    async function getQuote(amountEth: string) {
        const value = ethers.parseEther(amountEth.toString());
        const [fee, net] = await contract.quote(value);
        return {
            fee: ethers.formatEther(fee),
            net: ethers.formatEther(net),
        };
    }

    return { sendTip, withdrawMyTips, getQuote };
}
