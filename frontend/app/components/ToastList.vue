<template>
  <div class="fixed bottom-8 right-8 space-y-3 z-50">
    <transition-group name="toast-fade">
      <div
          v-for="t in toasts"
          :key="t.id"
          class="flex flex-col gap-2 p-5 rounded-2xl shadow-xl text-base font-medium
               backdrop-blur-md border transition-all duration-300 w-80"
          :class="{
          'bg-gray-900/90 border-gray-700 text-white': t.type === 'info',
          'bg-emerald-500/90 border-emerald-400 text-black': t.type === 'success',
          'bg-rose-600/90 border-rose-400 text-white': t.type === 'error',
        }"
      >
        <div class="flex items-center gap-3">
          <!-- Spinner -->
          <svg
              v-if="t.type === 'info'"
              class="animate-spin h-5 w-5 text-emerald-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span>{{ t.text }}</span>
        </div>

        <!-- Explorer link -->
        <a
            v-if="t.link"
            :href="t.link"
            target="_blank"
            class="ml-8 px-3 py-1 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 text-xs text-gray-200 border border-gray-600 transition-all"
        >
          🔗 View on Explorer
        </a>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { toasts } from "~/composables/useToast";
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.6s, transform 0.6s;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
