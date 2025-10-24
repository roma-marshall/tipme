import { ethers } from "ethers";
import TipMe from "~/abi/TipMe.json";
import { useAppKitNetwork } from "@reown/appkit/vue";

/**
 * Создаёт контракт TipMe с автоматическим выбором:
 * - signer (если есть window.ethereum)
 * - provider (если нет кошелька)
 */
export async function useContract() {
    let provider: ethers.Provider;
    let signer: ethers.Signer | null = null;
    const network = useAppKitNetwork();
    const config = useRuntimeConfig()

    // карта RPC по сетям
    const rpcByChain = {
        11155111: config.public.rpc?.sepolia || "https://ethereum-sepolia.publicnode.com",
        545: config.public.rpc?.flow_evm_testnet || "https://testnet.evm.nodes.onflow.org",
    };

    // определяем текущую сеть
    const chainId = network.value?.chainId || 11155111; // default Sepolia
    const rpcUrl = rpcByChain[chainId as keyof typeof rpcByChain];

    if (!rpcUrl) {
        console.error("❌ Unknown RPC for chain:", chainId);
        return;
    }

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
        provider = new ethers.JsonRpcProvider(rpcUrl);
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
