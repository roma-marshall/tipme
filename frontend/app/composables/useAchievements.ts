import { ref, computed } from "vue";
import { ethers } from "ethers";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/vue";
import { useTxToast } from "~/composables/useTxToast";
import NFTAchievements from "~/abi/NFTAchievements.json";
import TipJar from "~/abi/TipJar.json";
import TipMe from "~/abi/TipMe.json";

export type Achievement = {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    minted: boolean;
};

export function useAchievements() {
    const account = useAppKitAccount("eip155:11155111");
    const address = computed(() => account.value?.address);
    const network = useAppKitNetwork();

    const achievements = ref<Achievement[]>([
        {
            id: "profile",
            title: "🪪 Profile Creator",
            description: "Create your TipMe profile.",
            icon: "/profile.png",
            unlocked: false,
            minted: false,
        },
        {
            id: "first_tip",
            title: "💸 First Tip",
            description: "Send your first tip to another user.",
            icon: "/tip.png",
            unlocked: false,
            minted: false,
        },
        {
            id: "big_donor",
            title: "💰 Generous Donor",
            description: "Send a tip worth more than 0.1 ETH.",
            icon: "/generous.png",
            unlocked: false,
            minted: false,
        },
        {
            id: "ten_tips",
            title: "🧾 10 Tips Sent",
            description: "Send at least 10 tips.",
            icon: "/multi.png",
            unlocked: false,
            minted: false,
        },
        {
            id: "fee_helper",
            title: "🪙 Fee Helper",
            description: "Send a tip while platform fee is active.",
            icon: "/fee.png",
            unlocked: false,
            minted: false,
        },
        {
            id: "top_supporter",
            title: "🏆 Top 1% Supporter",
            description: "Join the top 1% of TipMe donors.",
            icon: "/top.png",
            unlocked: false,
            minted: false,
        },
    ]);

    // inside useAchievements.ts
    async function loadStatuses() {
        const config = useRuntimeConfig()

        if (!account.value?.address) {
            console.warn("⛔ No wallet connected — skipping achievements load");
            return;
        }

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

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const nft = new ethers.Contract(NFTAchievements.address, NFTAchievements.abi, provider);
        const tipJar = new ethers.Contract(TipJar.address, TipJar.abi, provider);
        const tipMe = new ethers.Contract(TipMe.address, TipMe.abi, provider);

        for (const a of achievements.value) {
            a.loading = true;
            try {
                // --- Проверяем minted статус ---
                a.minted = await nft.hasMinted(address.value, a.id);

                // --- По умолчанию ---
                a.unlocked = false;

                // --- 🪪 Profile Creator ---
                if (a.id === "profile") {
                    const profile = await tipMe.getProfile(address.value);
                    if (profile && profile.username && profile.username.length > 0) {
                        a.unlocked = true;
                    }
                }

                // --- 💸 События чаевых ---
                const latestBlock = await provider.getBlockNumber();
                const fromBlock = Math.max(latestBlock - 200_000, 0);
                const events = await tipJar.queryFilter("TipSent", fromBlock, latestBlock);
                const myTips = events.filter(
                    (e) => e.args?.from?.toLowerCase() === address.value.toLowerCase()
                );

                if (myTips.length > 0 && a.id === "first_tip") {
                    a.unlocked = true;
                }
                if (myTips.length >= 10 && a.id === "ten_tips") {
                    a.unlocked = true;
                }
                if (
                    myTips.some((e) => Number(ethers.formatEther(e.args?.net ?? 0n)) > 0.1) &&
                    a.id === "big_donor"
                ) {
                    a.unlocked = true;
                }
                if (
                    myTips.some((e) => Number(ethers.formatEther(e.args?.fee ?? 0n)) > 0) &&
                    a.id === "fee_helper"
                ) {
                    a.unlocked = true;
                }

                // (🏆 Top 1% Supporter — позже)
            } catch (err) {
                console.error(`Failed to check ${a.id}`, err);
            } finally {
                a.loading = false;
            }
        }
    }



    // 🔹 Минт NFT за ачивку
    async function mintAchievement(id: string) {
        if (!window.ethereum) throw new Error("Wallet not detected");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(NFTAchievements.address, NFTAchievements.abi, signer);

        const tokenURI = `${window.location.origin}/achievements/${id}.json`;
        const txFn = () => contract.mintAchievement(id, tokenURI);
        await useTxToast(txFn, {
            confirm: "⏳ Confirm NFT mint in wallet…",
            pending: "⏳ Minting in progress… waiting for confirmation",
            success: "✅ NFT minted successfully!",
            error: "❌ Mint transaction failed or rejected",
        });

        const ach = achievements.value.find((a) => a.id === id);
        if (ach) ach.minted = true;
    }

    return { achievements, loadStatuses, mintAchievement };
}
