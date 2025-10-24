<template>
  <client-only>
    <main class="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-8">
      <!-- Проверяем подключение кошелька -->
      <div v-if="!isConnected" class="text-center space-y-4">
        <p class="text-gray-400">Connect your wallet to create a profile 💳</p>
        <!-- Reown Connect Button -->
        <appkit-button v-if="isConnected" label="Connect Wallet" />
        <button
            v-if="!isConnected"
            class="px-5 py-2 rounded-xl bg-amber-500 text-black font-semibold
                   transition-all duration-200 ease-in-out
                   hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)]
                   active:bg-amber-600 active:scale-95"
            @click="openConnectModal"
        >
          Connect Wallet
        </button>
      </div>

      <!-- Форма создания профиля -->
      <div v-else class="w-full max-w-md space-y-5">
        <h2 class="text-2xl font-semibold text-center mb-4">Create your Profile</h2>

        <div v-if="loading" class="text-gray-400 text-center">Checking profile...</div>

        <div v-else class="space-y-3">
          <input v-model="username" placeholder="Username" class="input" />
          <textarea v-model="bio" placeholder="Short bio" class="input h-24" />
          <input v-model="x" placeholder="Link to X" class="input" />
          <input v-model="tg" placeholder="Link to Telegram" class="input" />
          <input v-model="image" placeholder="Image URL" class="input" />

          <button :disabled="isSaving" @click="saveProfile" class="btn w-full mt-4">
            {{ isSaving ? "Saving..." : "💾 Save Profile" }}
          </button>
        </div>
      </div>
    </main>
  </client-only>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAppKit, useAppKitAccount } from "@reown/appkit/vue";
import { useContract } from "~/composables/useContract";
import { navigateTo } from "#app";
import { useTxToast } from "~/composables/useTxToast";

const isSaving = ref(false);
const account = useAppKitAccount("eip155:11155111");
const isConnected = computed(() => account.value?.status === "connected");

const username = ref("");
const bio = ref("");
const x = ref("");
const tg = ref("");
const image = ref("");
const loading = ref(true);

onMounted(async () => {
  if (!isConnected.value) {
    loading.value = false;
    return;
  }

  const { getProfile } = await useContract();
  const addr = account.value?.address;
  if (!addr) return (loading.value = false);

  try {
    const res = await getProfile(addr);
    const usernameOnChain = res?.username || res?.[0] || "";
    if (usernameOnChain) navigateTo("/edit");
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

async function saveProfile() {
  try {
    isSaving.value = true;
    const { setProfile } = await useContract();

    await useTxToast(
        () =>
            setProfile(
                username.value,
                bio.value,
                x.value,
                tg.value,
                image.value
            ),
        {
          confirm: "⏳ Saving profile on-chain… Please confirm in wallet",
          pending: "⏳ Transaction pending… waiting for confirmation",
          success: "✅ Profile successfully saved!",
          error: "❌ Error saving profile or transaction rejected",
        }
    );

    const addr = account.value?.address;
    if (addr) navigateTo(`/${addr}`);
  } finally {
    isSaving.value = false;
  }
}

const openConnectModal = () => {
  const { open } = useAppKit();
  open({ view: "Connect" });
};
</script>

<style scoped>
.input {
  width: 100%;
  background: #111;
  border: 1px solid #333;
  padding: 10px;
  border-radius: 8px;
}
.btn {
  background: #10b981;
  color: black;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
}
</style>
