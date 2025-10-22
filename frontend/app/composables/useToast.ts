import { ref } from "vue";

export const toasts = ref<
    { id: number; text: string; type: "info" | "success" | "error"; link?: string; persistent?: boolean }[]
>([]);

export function useToast() {
    function show(
        text: string,
        type: "info" | "success" | "error" = "info",
        persistent = false,
        link?: string
    ) {
        const id = Date.now();
        toasts.value.push({ id, text, type, persistent, link });

        // ⏳ Уведомления успеха/ошибок исчезают автоматически
        if (!persistent && type !== "info") {
            setTimeout(() => close(id), 5000); // 5 сек на экране
        }
        return id;
    }

    function close(id: number) {
        toasts.value = toasts.value.filter((t) => t.id !== id);
    }

    return { show, close };
}
