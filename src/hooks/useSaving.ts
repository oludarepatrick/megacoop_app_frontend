import type { SavingFormData } from "@/schemas/savingsPlanSchema"
import { savingService } from "@/services/savingsService"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"

export const useCreatePlan = (
    onSuccess: () => void,
    // onError: (message: string) => void
) => {
    return useMutation({
        mutationFn: (data: SavingFormData) => savingService.createSavingPlan(data),
        onSuccess: (response) =>{
            console.log("saving plans created successfully", response)
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
        queryFn: savingService.getSavingPlans
    })
}