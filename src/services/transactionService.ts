import axios from "@/lib/axiosInstance"
import type { WalletTransaction } from "@/types/transaction";

export const transactionService = {
    getWalletTransaction: async () : Promise<WalletTransaction[]>  => {
        const response = await axios.get("/transactions/getUserTransactions");
        return response.data.transactions
    }
}