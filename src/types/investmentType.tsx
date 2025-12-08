import type { LucideIcon } from "lucide-react";

export type InvestmentData = {
  total_invested: number
  total_return: number
  rate_of_return: number
};

export type ChartDataPoint = {
  year: number;
  investment: number;
  revenue: number;
};

// Common display properties for card view (all investments show the same basic info)
export type InvestmentBase = {
  id: number;
  title: string;
  industry: string;
  minimum_amount: string;
  roi: string;
  vesting_period?: string;
  riskLevel?: "Low" | "Medium" | "High";
  image?: string;
  detailType?: "housing" | "pooled" | "api"; // Determines which modal to show
};

// Detailed modal data (for first hardcoded investment)
export type DetailedInvestment = InvestmentBase & {
  investName: string;
  description: string;
  NHFPlan: { feature: string; icon: LucideIcon }[];
  MoFiPlan: { feature: string; icon: LucideIcon }[];
  allocationFilled: number;
  averageTicket: number;
  activeProject: { name: string; unit?: number; amount: number | string }[];
  managementFee: number;
  exitTerms: string;
  documentation: string[];
};

type PoolOption = {
  id: number
  name: string;
  range: string;
  roi: string;
  entry: string;
  color: string;
  icon: LucideIcon;
};

// Simple modal data (for second hardcoded investment)
export type SimpleInvestment = InvestmentBase & {
  basicDescription: string;
  poolOption: PoolOption[];
  keyBenefits: string[];
  requirements: string[];
};

// API modal data (future from backend)
export type ApiInvestment = InvestmentBase & {
  company_name: string;
  founder_name: string;
  brief_description: string;
  detail_description: string;
  state: string;
  city: string;
  office_address: string;
  phone: string;
  email: string;
  website: string;
  current_valuation: string;
  amount_needed: string;
  investors_count: number;
  max_amount: string;
  status: string;
  created_at: string;
  updated_at: string;
};

// Combined type for the complete available investment
export type AvailableInvestment = DetailedInvestment | SimpleInvestment | ApiInvestment;

export type UserInvestment = {
  id: number;
  user_id: number;
  investment_id: number;
  inv_name: string;
  sub_type?: string | null;
  amount: string;
  status: string;
  denied_reason?: string | null;
  consent: number;
  created_at: string;
  updated_at: string;
  investment: { id: number; title: string; company_name: string; roi: string};
};

export type TopTrendingInvestment = {
  id: number;
  title: string;
  company_name: string
  industry: string
  roi: string
  minimum_amount: string 
  investors_count: number
  status: string;
}

export type TotalInvested = {
  total_invested: number
  total_return: number
  rate_of_return: number
}