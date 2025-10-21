<template>
  <client-only>
    <main class="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-8">
      <!-- Если не подключен -->
      <div v-if="!isConnected" class="text-center space-y-4">
        <p class="text-gray-400">Connect your wallet to edit your profile 💳</p>
        <appkit-button label="Connect Wallet" />
      </div>

      <!-- Если подключен -->
      <div v-else class="w-full max-w-md space-y-5">
        <h2 class="text-2xl font-semibold text-center mb-4">Edit your Profile</h2>

        <div v-if="loading" class="text-gray-400 text-center">Loading...</div>

        <div v-else class="space-y-3">
          <input v-model="username" placeholder="Username" class="input" />
          <textarea v-model="bio" placeholder="Short bio" class="input h-24" />
          <input v-model="x" placeholder="Link to X" class="input" />
          <input v-model="tg" placeholder="Link to Telegram" class="input" />
          <input v-model="image" placeholder="Image URL" class="input" />

          <button :disabled="isUpdating" @click="updateProfile" class="px-5 py-2 rounded-xl bg-emerald-500/90 text-black font-semibold
                   transition-all duration-200 ease-in-out
                   hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.5)]
                   active:bg-emerald-600 active:scale-95 w-full">
            {{ isUpdating ? "Updating..." : "💾 Update Profile" }}
          </button>

          <p v-if="txHash" class="text-xs text-emerald-400 mt-3 break-all">
            Tx: {{ txHash }}
          </p>
        </div>
      </div>
    </main>
  </client-only>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAppKitAccount } from "@reown/appkit/vue";
import { useContract } from "~/composables/useContract";
import { navigateTo } from "#app";
import { useToast } from "~/composables/useToast";

const { show, close } = useToast();
const isUpdating = ref(false);
const account = useAppKitAccount("eip155:11155111");
const isConnected = computed(() => account.value?.status === "connected");

const username = ref("");
const bio = ref("");
const x = ref("");
const tg = ref("");
const image = ref("");
const txHash = ref("");
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
    username.value = res?.username || res?.[0] || "";
    bio.value = res?.bio || res?.[1] || "";
    x.value = res?.x || res?.[2] || "";
    tg.value = res?.tg || res?.[3] || "";
    image.value = res?.image || res?.[4] || "";
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

async function updateProfile() {
  try {
    isUpdating.value = true;
    const { setProfile } = await useContract();

    // 1️⃣ подтверждение в кошельке
    const confirmId = show("⏳ Updating profile on-chain… Please confirm in wallet", "info", true);

    const tx = await setProfile(
        username.value,
        bio.value,
        x.value,
        tg.value,
        image.value
    );

    // 2️⃣ ожидание включения в блок
    close(confirmId);
    const waitId = show("⏳ Transaction pending… waiting for confirmation", "info", true);
    const receipt = await tx.wait();
    close(waitId);

    // 3️⃣ успех
    if (receipt.status === 1) {
      show("✅ Profile updated successfully!", "success", false);
      const addr = account.value?.address;
      if (addr) navigateTo(`/${addr}`);
    } else {
      show("⚠️ Transaction reverted on-chain", "error");
    }
  } catch (err) {
    console.error(err);
    show("❌ Error updating profile or transaction rejected", "error");
  } finally {
    isUpdating.value = false;
  }
}
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
