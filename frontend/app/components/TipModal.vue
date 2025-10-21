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
            placeholder="0.005 ETH"
        />

        <p v-if="quote" class="text-xs text-gray-400 mt-2">
          You send: {{ amount }} ETH → Receiver gets: {{ quote.net }} ETH<br />
          Fee: {{ quote.fee }} ETH (5%)
        </p>

        <div class="mt-5 flex flex-col gap-2">
          <button
              @click="send"
              class="bg-emerald-500 text-black font-semibold py-2 rounded-lg
                   transition-all duration-200 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.5)]"
          >
            Send Tip
          </button>
          <button
              @click="$emit('close')"
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

const props = defineProps<{ visible: boolean; to: string }>();
const emit = defineEmits(["close"]);

const amount = ref("0.005");
const quote = ref<{ fee: string; net: string } | null>(null);

const { sendTip, getQuote } = await useTipJar();

watch(amount, async (val) => {
  if (!val || Number(val) < 0.001) return (quote.value = null);
  quote.value = await getQuote(val);
});

async function send() {
  if (!props.to) return alert("No receiver address");
  if (Number(amount.value) < 0.001) return alert("Min tip 0.001 ETH");
  try {
    const hash = await sendTip(props.to, amount.value);
    console.log("✅ Tip tx:", hash);
    alert("Tip sent successfully!");
    emit("close");
  } catch (err) {
    console.error(err);
    alert("Transaction failed.");
  }
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
