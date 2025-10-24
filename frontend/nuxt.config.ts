import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    vite: {
        plugins: [tailwindcss()],
    },
    runtimeConfig: {
        public: {
            // projectId: process.env.NUXT_PUBLIC_PROJECT_ID,
            projectId: import.meta.env.NUXT_PUBLIC_PROJECT_ID,
            // rpcUrl: import.meta.env.NUXT_PUBLIC_SEPOLIA_RPC_URL,
            rpc: {
                sepolia: import.meta.env.NUXT_PUBLIC_SEPOLIA_RPC_URL,
                flow_evm_testnet: 'https://testnet.evm.nodes.onflow.org',
                flow_evm: 'https://mainnet.evm.nodes.onflow.org'
            }
        },
    },
    app: {
        head: {
            title: "tipme.app",
            htmlAttrs: {
                lang: "en",
            },
        },
    },
});