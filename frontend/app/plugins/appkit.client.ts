import { defineNuxtPlugin } from "#app";
import { createAppKit } from "@reown/appkit/vue";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, sepolia } from "@reown/appkit/networks";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    const flow_evm_testnet = {
        id: 545,
        name: 'Flow EVM Testnet',
        nativeCurrency: {
            decimals: 18,
            name: 'FLOW',
            symbol: 'FLOW',
        },
        rpcUrls: {
            default: {
                http: ['https://testnet.evm.nodes.onflow.org'],
            },
            public: {
                http: ['https://testnet.evm.nodes.onflow.org'],
            },
        },
        blockExplorers: {
            default: { name: 'Flowscan', url: 'https://evm-testnet.flowscan.io' },
        },
    }

    createAppKit({
        adapters: [new EthersAdapter()],
        // networks: [mainnet, sepolia, flow_evm_testnet],
        networks: [flow_evm_testnet],
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