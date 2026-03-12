import axios from "@/lib/axiosInstance"
import type { DashboardCharts } from "@/types/dashboard";
import type { WalletTransaction } from "@/types/transaction";

export const transactionService = {
    getDashboardStats: async () : Promise<DashboardCharts> => {
        const response = await axios.get("/transactions/monthly-summary", {
            params: { year: new Date().getFullYear() }
        });
        return response.data
    },
    getWalletTransaction: async () : Promise<WalletTransaction[]>  => {
        const response = await axios.get("/transactions/getUserTransactions");
        return response.data.transactions
    }
}