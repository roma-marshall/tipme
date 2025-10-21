<template>
  <client-only>
    <div class="min-h-screen bg-gray-950 text-white flex flex-col">
      <!-- ===== Header ===== -->
      <header
          class="w-full flex justify-between items-center px-8 py-4 border-b border-gray-800"
      >
        <h1 class="text-xl font-semibold tracking-wide">tipme.app</h1>
        <!-- Connect button -->
        <appkit-button v-if="isConnected" label="Connect Wallet" />
        <button
            v-if="!isConnected"
            class="mt-6 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-amber-500/20"
            @click="openConnectModal"
        >
          Connect Wallet
        </button>
      </header>

      <div class="flex flex-1">
        <!-- ===== Sidebar ===== -->
        <aside
            class="hidden md:flex flex-col justify-between w-56 border-r border-gray-800 p-6"
        >
          <nav class="space-y-3">
            <button class="w-full text-left hover:text-emerald-400 transition">
              Dashboard
            </button>
            <button class="w-full text-left hover:text-emerald-400 transition">
              My Tips
            </button>
            <button class="w-full text-left hover:text-emerald-400 transition">
              Settings
            </button>
          </nav>
          <div class="text-xs text-gray-500">
            © 2025 Vires Labs<br />All rights reserved.
          </div>
        </aside>

        <!-- ===== Main Content ===== -->
        <main
            class="flex-1 flex flex-col items-center justify-center p-8 space-y-6"
        >
          <div class="text-center space-y-3">
            <div
                class="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 mx-auto"
            ></div>
            <h2 class="text-2xl font-semibold mt-4">Roman Lytin</h2>
            <p class="text-gray-400 text-sm">
              Building Web3 apps at Vires Labs 🌐
            </p>

            <div
                v-if="account?.address"
                class="text-gray-500 text-xs mt-2 break-all"
            >
              {{ shortAddress(account.address) }}
            </div>

            <div class="flex justify-center gap-4 mt-4">
              <a
                  href="#"
                  target="_blank"
                  class="hover:text-emerald-400 transition"
              >
                <i class="i-tabler-brand-x text-lg"></i> X
              </a>
              <a
                  href="#"
                  target="_blank"
                  class="hover:text-emerald-400 transition"
              >
                <i class="i-tabler-brand-telegram text-lg"></i> Telegram
              </a>
            </div>
          </div>

          <button
              class="mt-6 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
          >
            💸 Tip Me
          </button>
        </main>
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppKitAccount, useAppKit } from "@reown/appkit/vue";

const account = useAppKitAccount("eip155:11155111");
const isConnected = computed(() => account.value?.status === "connected");

const shortAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

const openConnectModal = () => {
  const { open } = useAppKit();
  open({ view: "Connect" });
};
</script>
