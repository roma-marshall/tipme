<template>
  <client-only>
    <main
        class="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-8"
    >
      <h1 class="text-3xl font-semibold mb-4">tipme.app</h1>
      <p class="opacity-70 mb-8 text-sm text-center max-w-md">
        Connect your wallet to create your on-chain profile.
      </p>

      <!-- Reown Connect Button -->
      <appkit-button v-if="isConnected" label="Connect Wallet" />
      <button
          v-if="!isConnected"
          class="btn bg-amber-500 text-black font-semibold px-5 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-amber-400 hover:shadow-lg hover:-translate-y-0.5 active:bg-amber-600 active:translate-y-0"
          @click="openConnectModal"
      >
        Connect Wallet
      </button>

      <div v-if="account?.address" class="mt-6">
        <p class="text-sm opacity-70">Connected:</p>
        <p class="text-emerald-400 font-mono">{{ shortAddress(account.address) }}</p>
      </div>
    </main>
  </client-only>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useAppKit, useAppKitAccount } from "@reown/appkit/vue";
import { navigateTo } from "#app";

// подписываемся на состояние аккаунта (reactive)
const account = useAppKitAccount("eip155:11155111");
const isConnected = computed(() => account.value?.status === "connected");

// наблюдаем за статусом
watch(
    () => account.value?.status,
    (status) => {
      console.log("Wallet status:", status);
      if (status === "connected") {
        navigateTo("/setup");
      }
    }
);

const shortAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

const openConnectModal = () => {
  const { open } = useAppKit();
  open({ view: "Connect" });
};
</script>
