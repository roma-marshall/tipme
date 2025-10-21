<template>
  <client-only>
    <div class="min-h-screen flex flex-col bg-gray-950 text-white font-sans">
      <!-- ===== Header ===== -->
      <header class="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <h1
            class="text-xl font-semibold cursor-pointer hover:text-emerald-400 transition"
            @click="goHome"
        >
          tipme.app
        </h1>

        <div
            v-if="isConnected"
            @click="$router.push('/edit')"
            class="btn bg-fuchsia-500 text-black font-semibold px-5 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-fuchsia-400 hover:shadow-lg hover:-translate-y-0.5 active:bg-fuchsia-600 active:translate-y-0"
        >
          Edit Profile
        </div>

        <!-- Wallet connect button -->
        <appkit-button v-if="isConnected" label="Connect Wallet" />
        <button
            v-if="!isConnected"
            class="btn bg-amber-500 text-black font-semibold px-5 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-amber-400 hover:shadow-lg hover:-translate-y-0.5 active:bg-amber-600 active:translate-y-0"
            @click="openConnectModal"
        >
          Connect Wallet
        </button>
      </header>

      <!-- ===== Page Content ===== -->
      <main class="flex-1">
        <NuxtPage />
      </main>

      <!-- ===== Footer ===== -->
      <footer class="text-center text-xs text-gray-500 py-6 border-t border-gray-800">
        © 2025 Vires Labs – built with 💚 on EVM
      </footer>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppKit, useAppKitAccount  } from "@reown/appkit/vue";
import { useRouter } from "vue-router";

const router = useRouter();
const account = useAppKitAccount("eip155:11155111");
const isConnected = computed(() => account.value?.status === "connected");

const goHome = () => {
  const addr = account.value?.address;
  if (addr) {
    router.push(`/${addr}`);
  } else {
    router.push("/");
  }
}

const openConnectModal = () => {
  const { open } = useAppKit();
  open({ view: "Connect" });
};
</script>
