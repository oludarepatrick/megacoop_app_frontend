import type { LucideIcon } from "lucide-react"

export type InvestmentData = {
  totalInvested: number
  myInvestments: number
  rateOfReturn: number
}

export type ChartDataPoint = {
  year: number
  investment: number
  revenue: number
}

export type Investment = {
  id: string
  name: string
  category: string
  value: number
  returnValue: number
  returnPercentage: number
  icon: string
}

export type TrendingStock = {
  id: string
  name: string
  price: number
  returnPercentage: number
}

// Common display properties for card view (all investments show the same basic info)
export type AvailableInvestmentCard = {
  id: string
  name: string
  category: string
  minInvestment: number
  expectedReturn: string
  duration: string
  riskLevel: 'Low' | 'Medium' | 'High'
  image: string
  detailType: 'housing' | 'pooled' | 'api' // Determines which modal to show
}

// Detailed modal data (for first hardcoded investment)
export type DetailedInvestmentModal = {
  id: string
  investName: string
  description: string
  NHFPlan: {feature: string, icon: LucideIcon}[]
  MoFiPlan: {feature: string, icon: LucideIcon}[]
  allocationFilled: number
  averageTicket: number
  activeProject: { name: string; unit?: number,  amount:number | string}[]
  managementFee: number
  exitTerms: string
  documentation: string[]
}

type PoolOption = {
  name: string
  range: string
  roi: string
  entry: string
  color: string
  icon: LucideIcon
}

// Simple modal data (for second hardcoded investment)
export type SimpleInvestmentModal = {
  id: string
  basicDescription: string
  poolOption: PoolOption[]
  keyBenefits: string[]
  requirements: string[]
}

// API modal data (future from backend)
export type ApiInvestmentModal = {
  id: string
  [key: string]: any // Will be defined when backend is ready
}

// Combined type for the complete available investment
export type AvailableInvestment = {
  card: AvailableInvestmentCard
  modalData: DetailedInvestmentModal | SimpleInvestmentModal | ApiInvestmentModal
}
