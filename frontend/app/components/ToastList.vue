<template>
  <div class="fixed bottom-5 right-5 space-y-2 z-50">
    <div
        v-for="t in toasts"
        :key="t.id"
        class="px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
        :class="{
        'bg-gray-800 text-white': t.type === 'info',
        'bg-emerald-500 text-black': t.type === 'success',
        'bg-rose-600 text-white': t.type === 'error',
      }"
    >
      {{ t.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { toasts } from "~/composables/useToast";
</script>
