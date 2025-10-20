import { useQuery } from "@tanstack/react-query"
import { getInvestmentData, getPortfolioData, getTrendingStocks, getAvailableInvestments } from "@/services/InvestmentService"

export function useInvestmentData() {
  return useQuery({
    queryKey: ["investment-data"],
    queryFn: getInvestmentData,
  })
}

export function usePortfolioData() {
  return useQuery({
    queryKey: ["portfolio-data"],
    queryFn: getPortfolioData,
  })
}

export function useTrendingStocks() {
  return useQuery({
    queryKey: ["trending-stocks"],
    queryFn: getTrendingStocks,
  })
}

export function useAvailableInvestments() {
  return useQuery({
    queryKey: ["available-investments"],
    queryFn: getAvailableInvestments,
  })
}
