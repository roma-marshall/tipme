import { ref } from "vue";

export const toasts = ref<{ id: number; text: string; type: string }[]>([]);

export function useToast() {
    function show(text: string, type: "info" | "success" | "error" = "info") {
        const id = Date.now();
        toasts.value.push({ id, text, type });
        setTimeout(() => {
            toasts.value = toasts.value.filter((t) => t.id !== id);
        }, 4000);
    }
    return { show };
}
