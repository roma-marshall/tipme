<template>
  <div class="max-w-5xl mx-auto py-10 px-4 text-white">
    <h1 class="text-2xl font-semibold mb-8">🏅 NFT Achievements</h1>

    <div v-if="loading" class="text-gray-400 animate-pulse">Loading achievements...</div>

    <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
          v-for="ach in achievements"
          :key="ach.id"
          :class="[
          'rounded-2xl p-5 border flex flex-col items-center gap-3 text-center transition-all duration-300',
          ach.unlocked
            ? 'border-emerald-400 bg-gray-900/70 hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]'
            : 'border-gray-800 bg-gray-900/40 grayscale opacity-50'
        ]"
      >
        <img :src="ach.icon" class="w-16 h-16" alt="achievement icon" />

        <div class="font-semibold">{{ ach.title }}</div>
        <div class="text-sm text-gray-400">{{ ach.description }}</div>

        <div v-if="ach.minted" class="text-emerald-400 text-sm font-medium mt-2">✅ Minted</div>
        <button
            v-else-if="ach.unlocked"
            class="mt-3 bg-emerald-500 text-black px-4 py-1.5 rounded-lg font-semibold text-sm transition hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.5)]"
        >
          Mint NFT
        </button>
        <div v-else class="text-xs text-gray-500 mt-2 italic">🔒 Locked</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAchievements } from "~/composables/useAchievements";

const { achievements, loadStatuses } = useAchievements();
const loading = ref(true);

onMounted(async () => {
  await loadStatuses();
  loading.value = false;
});
</script>
