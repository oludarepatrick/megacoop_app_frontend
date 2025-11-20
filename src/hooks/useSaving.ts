import type { SavingFormData } from "@/schemas/savingsPlanSchema"
import { savingService } from "@/services/savingsService"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"

export const useCreatePlan = (onSuccess: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: SavingFormData) => savingService.createSavingPlan(data),
        onSuccess: (response) =>{
            console.log("saving plans created successfully", response)
            queryClient.invalidateQueries({ queryKey: ["my-plans"] });
            queryClient.invalidateQueries({ queryKey: ["get-user-wallet"] });
            onSuccess()
        },
        onError: (error: AxiosError<{message: string}>) => {
            console.log("error creating savings plan", error);
        }
    })
}

export const useSavingPlans = () => {
    return useQuery({
        queryKey: ["my-plans"],
        queryFn: savingService.getSavingPlans,
    })
}

export const useCancelSavingPlan = (onClose: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {saving_id:number}) => savingService.cancelSavingPlan(data),
        onSuccess: () => {
            console.log("saving plans canceled successfully")
            queryClient.invalidateQueries({queryKey: ["my-plans"]})
            queryClient.invalidateQueries({ queryKey: ["get-user-wallet"] });
            onClose();
        },
        onError:(error: AxiosError) => {
            console.log("error", error)
        }
    })
}

export const usePartialWithdrawSaving = (onClose: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {saving_id: number, amount: number}) => savingService.partialWithdraw(data),
        onSuccess: () => {
            console.log("saving plans canceled successfully")
            queryClient.invalidateQueries({queryKey: ["my-plans"]})
            queryClient.invalidateQueries({ queryKey: ["get-user-wallet"] });
            onClose();
        },
        onError:(error: AxiosError) => {
            console.log("error", error)
        }
    })
}