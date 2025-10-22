<template>
  <client-only>
    <div class="min-h-screen flex flex-col bg-gray-950 text-white font-sans">
      <!-- ===== Header ===== -->
      <header
          class="sticky top-0 z-40 flex justify-between items-center px-8 py-4
               backdrop-blur-md bg-gray-900/50 border-b border-gray-800/70
               shadow-md transition-all"
      >
        <!-- Логотип -->
        <h1
            class="text-2xl font-semibold cursor-pointer text-white/90
                 hover:text-emerald-400 transition-colors duration-200 select-none"
            @click="goHome"
        >
          tipme.<span class="text-emerald-400">app</span>
        </h1>

        <!-- Правая часть шапки -->
        <div class="flex items-center gap-3">
          <!-- Feed -->
<!--          <button-->
<!--              v-if="isConnected"-->
<!--              @click="$router.push('/feed')"-->
<!--              class="px-5 py-2 rounded-xl bg-amber-500/90 text-black font-semibold-->
<!--                   transition-all duration-200 ease-in-out-->
<!--                   hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)]-->
<!--                   active:bg-amber-600 active:scale-95"-->
<!--          >-->
<!--            🌍 Global Tips Feed-->
<!--          </button>-->

          <!-- Вывести чаевые -->
          <button
              v-if="isConnected"
              @click="withdrawTips"
              class="px-5 py-2 rounded-xl bg-emerald-500/90 text-black font-semibold
                   transition-all duration-200 ease-in-out
                   hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.5)]
                   active:bg-emerald-600 active:scale-95"
          >
            💰 Withdraw <span v-if="balance !== null">({{ balance }} ETH)</span>
          </button>

          <!-- View profile -->
          <button
              v-if="isConnected"
              @click="goHome"
              class="px-5 py-2 rounded-xl bg-sky-500/90 text-black font-semibold
                   transition-all duration-200 ease-in-out
                   hover:bg-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]
                   active:bg-sky-600 active:scale-95"
          >
            👀 Profile
          </button>

          <!-- Edit profile -->
          <button
              v-if="isConnected"
              @click="$router.push('/edit')"
              class="px-5 py-2 rounded-xl bg-fuchsia-500/90 text-black font-semibold
                   transition-all duration-200 ease-in-out
                   hover:bg-fuchsia-400 hover:shadow-[0_0_15px_rgba(217,70,239,0.5)]
                   active:bg-fuchsia-600 active:scale-95"
          >
            ✏️ Edit
          </button>

          <!-- Connect Wallet -->
          <button
              v-if="!isConnected"
              class="px-5 py-2 rounded-xl bg-amber-500 text-black font-semibold
                   transition-all duration-200 ease-in-out
                   hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)]
                   active:bg-amber-600 active:scale-95"
              @click="openConnectModal"
          >
            🔗 Connect
          </button>

          <!-- AppKit встроенная кнопка -->
          <appkit-button v-if="isConnected" label="Wallet" />
        </div>
      </header>

      <!-- ===== Main content ===== -->
      <main class="flex-1">
        <NuxtPage />
      </main>

      <!-- ===== Footer ===== -->
      <footer
          class="text-center text-xs text-gray-500 py-6 border-t border-gray-800/70
               backdrop-blur-sm bg-gray-900/40"
      >
        © 2025 <span class="text-emerald-400 font-semibold">Vires Labs</span> — built with 💚 on EVM
      </footer>
    </div>
    <ToastList />
  </client-only>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useAppKit, useAppKitAccount } from "@reown/appkit/vue";
import { useRouter } from "vue-router";
import { ethers } from "ethers";
import TipJar from "~/abi/TipJar.json";
import { useTxToast } from "~/composables/useTxToast";

const router = useRouter();
const account = useAppKitAccount("eip155:11155111");
const isConnected = computed(() => account.value?.status === "connected");

const balance = ref<string | null>(null);
let interval: ReturnType<typeof setInterval> | null = null;

const goHome = () => {
  const addr = account.value?.address;
  router.push(addr ? `/${addr}` : "/");
};

const openConnectModal = () => {
  const { open } = useAppKit();
  open({ view: "Connect" });
};

async function withdrawTips() {
  try {
    if (!window.ethereum) return show("Wallet not detected", "error");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(TipJar.address, TipJar.abi, signer);

    const addr = await signer.getAddress();
    const amountWei = await contract.balances(addr);
    if (amountWei === 0n) return show("No tips to withdraw", "error");

    // 1️⃣ Выполняем транзакцию через helper
    await useTxToast(() => contract.withdrawMyTips(), {
      confirm: "⏳ Confirm withdrawal in wallet…",
      pending: "⏳ Transaction pending… waiting for confirmation",
      success: "✅ Withdrawal confirmed!",
      error: "❌ Withdrawal failed or rejected",
    });

    // 2️⃣ Обновляем баланс после успешного вывода
    await fetchBalance();
  } catch (err) {
    console.error(err);
    show("❌ Withdrawal failed or rejected", "error");
  }
}

async function fetchBalance() {
  if (!isConnected.value || !window.ethereum) {
    balance.value = null;
    return;
  }
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const addr = account.value?.address;
    if (!addr) return;
    const contract = new ethers.Contract(TipJar.address, TipJar.abi, provider);
    const wei = await contract.balances(addr);
    balance.value = parseFloat(ethers.formatEther(wei)).toFixed(4);
  } catch (e) {
    console.error(e);
  }
}

// 🟢 Автообновление каждые 15 секунд
onMounted(() => {
  fetchBalance();
  interval = setInterval(fetchBalance, 15000);
});

// 🧹 Чистим при размонтировании
onUnmounted(() => {
  if (interval) clearInterval(interval);
});

// 🔁 Обновляем, если кошелёк подключился или сменился
watch(isConnected, (connected) => {
  if (connected) fetchBalance();
});
</script>
