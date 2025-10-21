<template>
  <client-only>
    <main class="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-8">
      <div class="w-full max-w-md text-center space-y-4">
        <div v-if="loading" class="text-gray-400">Loading profile…</div>

        <template v-else-if="error">
          <p class="text-red-400">Failed to load profile.</p>
          <p class="text-xs text-gray-500 break-all">{{ error }}</p>
        </template>

        <template v-else-if="isEmpty">
          <h2 class="text-xl font-semibold">No profile yet</h2>
          <p class="text-gray-400 text-sm">
            This address has not created a profile on-chain.
          </p>
        </template>

        <template v-else>
          <div class="mx-auto w-24 h-24 rounded-full overflow-hidden">
            <img
                v-if="profile.image"
                :src="profile.image"
                alt="avatar"
                class="w-full h-full object-cover"
            />

            <!-- красивый плейсхолдер -->
            <div
                v-else
                class="flex items-center justify-center w-full h-full rounded-full
           bg-gradient-to-br from-emerald-500 to-teal-600 text-black
           font-bold text-2xl shadow-inner select-none"
            >
              {{ profile.username ? profile.username[0].toUpperCase() : "?" }}
            </div>
          </div>

          <h2 class="text-2xl font-semibold">{{ profile.username }}</h2>
          <p class="text-gray-400">{{ profile.bio }}</p>

          <div class="text-xs text-gray-500 mt-1 break-all">
            {{ shortAddress(addressParam) }}
          </div>

          <div class="flex justify-center gap-4 mt-4">
            <a
                v-if="profile.x"
                :href="profile.x"
                target="_blank"
                class="text-emerald-400 hover:underline"
                rel="noopener"
            >
              X
            </a>
            <a
                v-if="profile.tg"
                :href="profile.tg"
                target="_blank"
                class="text-emerald-400 hover:underline"
                rel="noopener"
            >
              Telegram
            </a>
          </div>

          <div class="mt-6">
            <button @click="showTipModal = true"
                    class="px-5 py-2 rounded-xl bg-emerald-500/90 text-black font-semibold
                   transition-all duration-200 ease-in-out
                   hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.5)]
                   active:bg-emerald-600 active:scale-95">💸 Tip Me</button>

            <TipModal :visible="showTipModal" :to="addressParam" @close="showTipModal = false" />
          </div>
        </template>
      </div>
    </main>
  </client-only>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRoute } from "#app";
import { useContract } from "~/composables/useContract";
import TipModal from "~/components/TipModal.vue";

const showTipModal = ref(false);
type Prof = { username: string; bio: string; x: string; tg: string; image: string };

const route = useRoute();
const addressParam = computed(() => String(route.params.address || ""));

const loading = ref(true);
const error = ref<string | null>(null);
const profile = ref<Prof>({ username: "", bio: "", x: "", tg: "", image: "" });

const isEmpty = computed(
    () =>
        !profile.value.username &&
        !profile.value.bio &&
        !profile.value.x &&
        !profile.value.tg &&
        !profile.value.image
);

const shortAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

async function fetchProfile() {
  loading.value = true;
  error.value = null;

  try {
    // ВАЖНО: useContract — async, нужно await
    const { getProfile } = await useContract();
    const res: any = await getProfile(addressParam.value);

    // Ethers v6 возвращает struct как объект с именованными полями (и может дублировать индексами).
    profile.value = {
      username: res?.username ?? res?.[0] ?? "",
      bio: res?.bio ?? res?.[1] ?? "",
      x: res?.x ?? res?.[2] ?? "",
      tg: res?.tg ?? res?.[3] ?? "",
      image: res?.image ?? res?.[4] ?? "",
    };
  } catch (e: any) {
    console.error(e);
    error.value = e?.message || String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchProfile);

// если адрес в URL поменяется — перезагрузим профиль
watch(addressParam, () => fetchProfile());
</script>

<style scoped>
</style>
