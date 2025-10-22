import { ethers } from "ethers";
import TipMe from "~/abi/TipMe.json";

/**
 * Создаёт контракт TipMe с автоматическим выбором:
 * - signer (если есть window.ethereum)
 * - provider (если нет кошелька)
 */
export async function useContract() {
    let provider: ethers.Provider;
    let signer: ethers.Signer | null = null;
    const config = useRuntimeConfig()

    if (typeof window !== "undefined" && window.ethereum) {
        // Web3-провайдер из MetaMask (read+write)
        provider = new ethers.BrowserProvider(window.ethereum);
        try {
            signer = await provider.getSigner();
        } catch {
            signer = null;
        }
    } else {
        // Публичный RPC-провайдер (только чтение)
        provider = new ethers.JsonRpcProvider(config.public.rpcUrl);
    }

    // если signer есть → контракт с подписью, иначе только чтение
    const runner = signer || provider;
    const contract = new ethers.Contract(TipMe.address, TipMe.abi, runner);

    async function setProfile(username: string, bio: string, x: string, tg: string, image: string) {
        if (!signer) throw new Error("Wallet not connected");
        return await contract.setProfile(username, bio, x, tg, image);
    }

    async function getProfile(address: string) {
        return await contract.getProfile(address);
    }

    return { contract, setProfile, getProfile };
}
