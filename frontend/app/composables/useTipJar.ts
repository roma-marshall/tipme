import { ethers } from "ethers";
import TipJar from "~/abi/TipJar.json";

export async function useTipJar() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(TipJar.address, TipJar.abi, signer);

    async function sendTip(to: string, amountEth: string) {
        const value = ethers.parseEther(amountEth);
        const tx = await contract.tip(to, { value });
        await tx.wait();
        return tx.hash;
    }

    async function withdrawMyTips() {
        const tx = await contract.withdrawMyTips();
        await tx.wait();
        return tx.hash;
    }

    async function getQuote(amountEth: string) {
        const value = ethers.parseEther(amountEth);
        const [fee, net] = await contract.quote(value);
        return { fee: ethers.formatEther(fee), net: ethers.formatEther(net) };
    }

    return { sendTip, withdrawMyTips, getQuote };
}
