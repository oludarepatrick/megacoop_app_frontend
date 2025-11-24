import { transactionService } from "@/services/transactionService"
import { useQuery } from "@tanstack/react-query"

export const useWalletTransaction = () => {
    return useQuery({
        queryKey: ["wallet-transaction"],
        queryFn: transactionService.getWalletTransaction,
    })
}