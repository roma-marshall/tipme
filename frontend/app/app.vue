<template>
  <client-only>
    <div class="p-8 flex flex-col items-center gap-4">
      <appkit-button label="Connect Wallet" />
      <div v-if="account?.address" class="mt-4 text-sm">
        Connected: {{ account.address }}
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAppKitAccount, useAppKit } from '@reown/appkit/vue'

// 🔌 Account info
const account = useAppKitAccount("eip155:11155111");
const isConnected = computed(() => account.value?.status === "connected");
</script>
