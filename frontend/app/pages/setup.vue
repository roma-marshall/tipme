<template>
  <client-only>
    <main class="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-8">
      <div class="w-full max-w-md space-y-5">
        <h2 class="text-2xl font-semibold text-center mb-4">Create your Profile</h2>

        <div class="space-y-3">
          <input v-model="username" placeholder="Username" class="input" />
          <textarea v-model="bio" placeholder="Short bio" class="input h-24" />
          <input v-model="x" placeholder="Link to X" class="input" />
          <input v-model="tg" placeholder="Link to Telegram" class="input" />
          <input v-model="image" placeholder="Image URL (optional)" class="input" />
        </div>

        <button @click="saveProfile" class="btn w-full mt-4">
          💾 Save Profile
        </button>

        <p v-if="txHash" class="text-xs text-emerald-400 mt-3 break-all">
          Tx: {{ txHash }}
        </p>
      </div>
    </main>
  </client-only>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAppKitAccount } from "@reown/appkit/vue";
import { useContract } from "../composables/useContract";
import { navigateTo } from "#app";

const account = useAppKitAccount("eip155:11155111");

const username = ref("");
const bio = ref("");
const x = ref("");
const tg = ref("");
const image = ref("");
const txHash = ref("");

async function saveProfile() {
  try {
    // получаем доступ к контракту (теперь функция async)
    const { setProfile } = await useContract();

    // отправляем транзакцию
    const tx = await setProfile(
        username.value,
        bio.value,
        x.value,
        tg.value,
        image.value
    );

    txHash.value = tx.hash;
    console.log("✅ Transaction sent:", tx.hash);

    const addr = account.value?.address;
    if (addr) navigateTo(`/${addr}`);
  } catch (err) {
    console.error("❌ Error saving profile:", err);
    alert("Error saving profile. Check console.");
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
