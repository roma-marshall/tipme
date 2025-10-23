import { defineNuxtPlugin } from "#app";
import { createAppKit } from "@reown/appkit/vue";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, sepolia } from "@reown/appkit/networks";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    createAppKit({
        adapters: [new EthersAdapter()],
        networks: [mainnet, sepolia],
        projectId: config.public.projectId,
        metadata: {
            name: "tipme.app",
            description: "decentralized tipping & creator rewards platform",
            url: "https://tipmeapp.vercel.app",
            icons: ["https://tipmeapp.vercel.app/favicon.ico"],
        },
        features: {
            analytics: false,
        },
    });
});