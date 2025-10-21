import { useToast } from "~/composables/useToast";

/**
 * Универсальный хелпер для отображения уведомлений во время транзакций
 * @param actionFn — функция, которая возвращает tx (например contract.tip(...) )
 * @param messages — тексты уведомлений (опционально)
 */
export async function useTxToast<T extends (...args: any[]) => Promise<any>>(
    actionFn: T,
    messages?: {
        confirm?: string;
        pending?: string;
        success?: string;
        error?: string;
    }
) {
    const { show, close } = useToast();
    let confirmId: number | null = null;
    let waitId: number | null = null;

    try {
        // 1️⃣ Confirm phase
        confirmId = show(messages?.confirm || "⏳ Please confirm transaction in wallet", "info", true);

        const tx = await actionFn(); // ожидаем подпись
        close(confirmId);

        // 2️⃣ Pending phase
        waitId = show(messages?.pending || "⏳ Transaction pending… waiting for confirmation", "info", true);
        const receipt = await tx.wait();
        close(waitId);

        // 3️⃣ Success phase
        if (receipt.status === 1) {
            const link = `https://sepolia.etherscan.io/tx/${tx.hash}`;
            show(messages?.success || "✅ Transaction confirmed!", "success", false, link);
        } else {
            show("⚠️ Transaction reverted on-chain", "error");
        }

        return receipt;
    } catch (err) {
        console.error(err);

        // всегда очищаем pending уведомления
        if (confirmId) close(confirmId);
        if (waitId) close(waitId);

        show(messages?.error || "❌ Transaction cancelled or failed", "error");
        throw err; // чтобы код, вызывающий хелпер, мог поймать ошибку при необходимости
    }
}
