import { detailedInvestment, simpleInvestment } from "@/common/investmentData"
import { investmentService } from "@/services/InvestmentService"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { AvailableInvestment } from "@/types/investmentType"
import type { InvestPaymentFormData } from "@/schemas/investSchema"
import type { AxiosError } from "axios"

export function useInvestmentData() {
  return useQuery({
    queryKey: ["investment-data"],
    queryFn: investmentService.getInvestmentData
  })
}

export function useActiveInvestments() {
  const query = useQuery({
    queryKey: ["available-investments"],
    queryFn: investmentService.getActiveInvestment,
  })
  
  // Always include hardcoded investments, merge with API data when available
  const hardcodedInvestments: AvailableInvestment[] = [simpleInvestment, detailedInvestment]
  const apiInvestments = query.data || []
  const allInvestments = [...hardcodedInvestments, ...apiInvestments]
  
  return {
    data: allInvestments
  }
}

export function useApplyInvestment(){
  return useMutation({
    mutationFn: (data: InvestPaymentFormData) => investmentService.applyInvestment(data),
    onSuccess: () => {
      console.log("investment application successful")
    },
    onError: (error: AxiosError<{message:string}>) => {
      console.log("error on investment application", error)
    }
  })
}

export function useUserInvestment(){
  return useQuery({
    queryKey: ["user-investment"],
    queryFn: investmentService.getUserInvestments,
  })
}


export function useTrendingInvestment() {
  return useQuery({
    queryKey: ["trending-investments"],
    queryFn: investmentService.getTrendingInvestment,
  })
}

// export function useTotalInvested() {
//   return useQuery({
//     queryKey: ["total-invested"],
//     queryFn: investmentService.getTotalInvested,
//   })
// }

