import type { AvailableInvestment, DetailedInvestmentModal, SimpleInvestmentModal } from "@/types/investmentType";
import image1 from "@/assets/money-growth-img.png"
import image2 from "@/assets/home-investment-img.png"
import {TrendingUp, Sparkles, Rocket, LayoutDashboard, Calendar, Hourglass, House, ShieldCheck, Percent, Wallet, Banknote, BadgeDollarSign, SquarePen, Columns2, Briefcase, CalendarRange} from "lucide-react";

export const simpleInvestment: AvailableInvestment = {
    card: {
        id: "megacoop-invest-1",
        name: "Pooled Investment Products",
        category: "Savings Plan",
        minInvestment: 100000,
        expectedReturn: '16% - 20%',
        duration: "3 years",
        riskLevel: "Medium",
        image: image1,
        detailType: "pooled"
    },
    modalData: {
        id: "megacoop-invest-1",
        basicDescription: "Grow your wealth with diversified pooled investments",
        poolOption: [
          {
            name: "Starter Pool",
            range: "100k-499,999",
            roi: "16-18%",
            entry: "Entry",
            color: "bg-orange-400",
            icon: Sparkles,
          },
          {
            name: "Growth Pool",
            range: "500k-1,999,999",
            roi: "17-19%",
            entry: "Diversified",
            color: "bg-blue-500",
            icon: TrendingUp,
          },
          {
            name: "Premium Pool",
            range: "2m+",
            roi: "18-20%",
            entry: "Premium",
            color: "bg-green-500",
            icon: Rocket,
          }
        ],
        keyBenefits: [
            "Low minimum investment",
            "Guaranteed returns",
            "Flexible withdrawal options",
            "No hidden charges"
        ],
        requirements: [
            "Minimum age: 18 years",
            "Valid government ID",
            "Bank account for direct debit",
            "Initial deposit of ₦5,000"
        ]
    } as SimpleInvestmentModal
} 

// Second hardcoded investment - with detailed modal
    
export const detailedInvestment: AvailableInvestment = {
    card: {
        id: "megacoop-invest-2",
        name: "Housing Projects Investments",
        category: "Real Estate Investment",
        minInvestment: 500000,
        expectedReturn: '16% - 20%',
        duration: "3 years",
        riskLevel: "Medium",
        image: image2,
        detailType: "housing"
    },
    modalData: {
        id: "megacoop-invest-2",
        investName: "Housing Fund programs",
        description: "Grow your wealth with diversified pooled investments",
        NHFPlan: [
            {feature: "6% interest pa", icon: LayoutDashboard},
            {feature: "Tenure up to 30 years", icon: Calendar},
            {feature: "Min 6 months contributions required", icon: Hourglass},
            {feature: "Access to affordable housing units", icon: House},
            {feature: "Government guarantee and protection", icon: ShieldCheck},
            {feature: "Contribution rate 2.5% of basic salary", icon: Percent},
            {feature: "Min contribution 5k", icon: Wallet},
            {feature: "Max loan 50m", icon: Banknote},
        ],
        MoFiPlan: [
            {feature: "Flexible contribution", icon: LayoutDashboard},
            {feature: "Competitive interest 9.75%", icon: BadgeDollarSign},
            {feature: "Simple application process", icon: SquarePen},
            {feature: "Various housing options", icon: Columns2},
            {feature: "Professional project management", icon: Briefcase},
            {feature: "Min contribution: 10k pm", icon: Wallet},
            {feature: "Period 6-12 months", icon: CalendarRange},
            {feature: "Loan coverage: up to 80% of the property value", icon: House},
        ],
        allocationFilled: 65,
        averageTicket: 2.1,
        activeProject: [
            { name: "Igando Estate", unit: 24, amount: 30 },
            { name: "Modera Estate", amount: 35 },
            { name: "Alleluia Estate", amount: "Funding in Progress" },
        ],
        managementFee: 2.5,
        exitTerms: "Early exit allowed after 18 months with 2% penalty fee. Full exit available at maturity with no penalties.",
        documentation: ["Property Portfolio Report", "Legal Documentation", "Insurance Certificates", "Management Agreement"]
    } as DetailedInvestmentModal
}
