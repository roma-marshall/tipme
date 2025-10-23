import { ref, computed } from "vue";
import { useAppKitAccount } from "@reown/appkit/vue";

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

    // 🏅 List of all NFT achievements
    const achievements = ref<Achievement[]>([
        {
            id: "profile",
            title: "🪪 Profile Creator",
            description: "Create your personal TipMe profile.",
            icon: "/icons/profile.png",
            unlocked: false,
            minted: false,
        },
        {
            id: "first_tip",
            title: "💸 First Tip",
            description: "Send your very first tip to another user.",
            icon: "/icons/tip.png",
            unlocked: false,
            minted: false,
        },
        {
            id: "big_donor",
            title: "💰 Generous Donor",
            description: "Send a single tip worth more than 0.1 ETH.",
            icon: "/icons/generous.png",
            unlocked: false,
            minted: false,
        },
        {
            id: "ten_tips",
            title: "🧾 10 Tips Sent",
            description: "Send at least 10 tips in total.",
            icon: "/icons/multi.png",
            unlocked: false,
            minted: false,
        },
        {
            id: "top_supporter",
            title: "🏆 Top 1% Supporter",
            description: "Become one of the top 1% donors on TipMe.",
            icon: "/icons/top.png",
            unlocked: false,
            minted: false,
        },
        {
            id: "fee_helper",
            title: "🪙 Fee Helper",
            description: "Send a tip when a platform fee is active.",
            icon: "/icons/fee.png",
            unlocked: false,
            minted: false,
        },
    ]);

    // позже сюда добавим ончейн-проверки (на события и баланс)
    async function loadStatuses() {
        if (!address.value) return;
        // пример временной логики:
        achievements.value[0].unlocked = true; // допустим, профиль создан
        achievements.value[1].unlocked = true; // первый tip сделан
    }

    return { achievements, loadStatuses };
}
