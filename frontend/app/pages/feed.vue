<template>
  <div class="max-w-4xl mx-auto py-10 px-4 text-white">
    <h1 class="text-2xl font-semibold mb-6">🌍 Global Tips Feed</h1>

    <div v-if="loading" class="text-gray-400 animate-pulse">Loading aggregated tips...</div>

    <div v-else>
      <div v-if="tips.length === 0" class="text-gray-400 text-center py-10">
        No tips yet 💭
      </div>

      <div v-else class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50">
        <table class="w-full text-left border-collapse">
          <thead>
          <tr class="text-gray-400 text-sm border-b border-gray-800 bg-gray-950/70">
            <th class="py-3 px-4">Donor</th>
            <th class="py-3 px-4">Last Recipient</th>
            <th class="py-3 px-4 text-right">Total Donated</th>
            <th class="py-3 px-4 text-right">Last Tip</th>
            <th class="py-3 px-4 text-right"></th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="tip in tips"
              :key="tip.from"
              class="border-b border-gray-800 hover:bg-gray-900/60 transition"
          >
            <td class="py-3 px-4 truncate max-w-[140px] text-emerald-400">
              <a
                  :href="`https://sepolia.etherscan.io/address/${tip.from}`"
                  target="_blank"
                  class="hover:underline"
              >
                {{ short(tip.from) }}
              </a>
            </td>

            <td class="py-3 px-4 truncate max-w-[140px] text-sky-400">
              <NuxtLink :to="`/${tip.to}`" class="hover:underline">
                {{ short(tip.to) }}
              </NuxtLink>
            </td>

            <td class="py-3 px-4 text-right font-semibold text-emerald-400">
              {{ tip.total.toFixed(4) }} ETH
            </td>

            <td class="py-3 px-4 text-right text-gray-400 text-sm">
              {{ formatDate(tip.lastDate) }}
            </td>

            <td class="py-3 px-4 text-right">
              <a
                  :href="`https://sepolia.etherscan.io/address/${tip.from}`"
                  target="_blank"
                  class="text-xs text-gray-400 hover:text-gray-200"
              >
                🔗
              </a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTipsFeed } from "~/composables/useTipsFeed";

const tips = ref<any[]>([]);
const loading = ref(true);

function short(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function formatDate(date: Date) {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(async () => {
  const { getTips } = await useTipsFeed();
  tips.value = await getTips();
  loading.value = false;
});
</script>
