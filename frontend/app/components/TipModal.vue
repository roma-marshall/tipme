<template>
  <transition name="fade">
    <div
        v-if="visible"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-80 text-center">
        <h2 class="text-xl font-semibold mb-4 text-white">💸 Send a Tip</h2>

        <input
            v-model="amount"
            min="0.001"
            step="0.001"
            class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-center"
            placeholder=""
        />

        <p v-if="quote" class="text-xs text-gray-400 mt-2">
          You send: {{ amount }} FLOW → Receiver gets: {{ quote.net }} FLOW<br />
          Fee: {{ quote.fee }} FLOW (5%)
        </p>

        <div class="mt-5 flex flex-col gap-2">
          <button
              @click="send"
              :disabled="loading"
              class="px-5 py-2 rounded-xl bg-emerald-500/90 text-black font-semibold
                   transition-all duration-200 ease-in-out
                   hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.5)]
                   active:bg-emerald-600 active:scale-95"
          >

            {{ loading ? "Tipping..." : "Send Tip" }}
          </button>
          <button
              @click="$emit('close')"
              :disabled="loading"
              class="text-gray-400 text-sm hover:text-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useTipJar } from "~/composables/useTipJar";
import { useTxToast } from "~/composables/useTxToast";

const props = defineProps<{ visible: boolean; to: string }>();
const emit = defineEmits(["close"]);

const amount = ref("5");
const quote = ref<{ fee: string; net: string } | null>(null);
const loading = ref(false);

const { sendTip, getQuote } = await useTipJar();

watch(amount, async (val) => {
  if (!val || Number(val) < 0.001) return (quote.value = null);
  quote.value = await getQuote(val);
});

async function send() {

  await useTxToast(() => sendTip(props.to, amount.value), {
    confirm: "⏳ Sending tip… please confirm in wallet",
    pending: "⏳ Tip pending… waiting for confirmation",
    success: "✅ Tip confirmed!",
    error: "❌ Tip failed or rejected",
  });

  emit("close");
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
