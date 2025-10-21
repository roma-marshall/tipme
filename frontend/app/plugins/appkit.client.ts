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
            name: "Nuxt app",
            description: "Description",
            url: "http://localhost:3000",
            icons: ["http://localhost:3000/favicon.ico"],
        },
        features: {
            analytics: false,
        },
    });
});