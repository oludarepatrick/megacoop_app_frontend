import axios from "@/lib/axiosInstance";
import type { InvestmentData, AvailableInvestment, ApiInvestment, UserInvestment, TopTrendingInvestment} from "@/types/investmentType";
import image1 from "@/assets/money-growth-img.png";
import type { InvestPaymentFormData } from "@/schemas/investSchema";


export const investmentService = {
  getInvestmentData: async () : Promise<InvestmentData> => {
    const response = await axios.get('/investments/total-invested');
    return response.data
  },

  getActiveInvestment: async (): Promise<AvailableInvestment[]> => {
    try {
      const response = await axios.get("/investments/active")
      
      if (response.data.success === true && Array.isArray(response.data.data)) {
        const apiInvestments: AvailableInvestment[] = response.data.data.map((item: ApiInvestment) => ({
          ...item,
          image: image1,
          detailType: "api"
        }))
        
        return apiInvestments
      }
      
      return []
    } catch (error) {
      console.error('Failed to fetch API investments:', error)
      return []
    }
  },

  applyInvestment: async(data: InvestPaymentFormData) => {
    const response = await axios.post('/investments/user-investments-apply', data)
    console.log(response.data)
    return response.data
    
  },

  getUserInvestments: async () : Promise<UserInvestment[]> => {
    const response = await axios.get('/investments/get-investments')
    return response.data.data
  },

  getTrendingInvestment: async (): Promise<TopTrendingInvestment[]> => {
    const response = await axios.get('/investments/top');
    return response.data.data
  },
}




// export async function getInvestmentData(): Promise<InvestmentData> {
//   try {
//     // TODO: Will Replace with actual API call when ready
//     // const response = await apiClient.get('/investments/summary')
//     // return response.data

//     // Get available investments count dynamically
//     // const availableInvestments = await getAvailableInvestments()
    
//     // Dummy data for now
//     return {
//       totalInvested: 0.00,
//       myInvestments: 0, // Dynamic count
//       rateOfReturn: 5.8,
//     }
//   } catch (error) {
//     console.error("Error fetching investment data:", error)
//     throw error
//   }
// }


// export async function getPortfolioData(): Promise<Investment[]> {
//   try {
//     // TODO: Will Replace with actual API call when ready
//     // const response = await apiClient.get('/investments/portfolio')
//     // return response.data

//     // Dummy data for now
//     return [
//       // g
//       // {
//       //   id: "2",
//       //   name: "Samsung Mobile",
//       //   category: "E-commerce, Marketplace",
//       //   value: 25300,
//       //   returnValue: -1012,
//       //   returnPercentage: -4,
//       //   icon: "📱",
//       // },
//       // {
//       //   id: "3",
//       //   name: "Tesla Motors",
//       //   category: "Electric Vehicles",
//       //   value: 8200,
//       //   returnValue: 2050,
//       //   returnPercentage: 25,
//       //   icon: "🚗",
//       // },
//     ]
//   } catch (error) {
//     console.error("Error fetching portfolio data:", error)
//     throw error
//   }
// }

// export async function getTrendingStocks(): Promise<TrendingStock[]> {
//   try {
//     // TODO: Will Replace with actual API call when ready
//     // const response = await apiClient.get('/stocks/trending')
//     // return response.data

//     // Dummy data for now
//     return [
//       { id: "1", name: "Trivago", price: 520, returnPercentage: 5 },
//       { id: "2", name: "Canon", price: 480, returnPercentage: 10 },
//       { id: "3", name: "Uber Food", price: 350, returnPercentage: -3 },
//       { id: "4", name: "Nokia", price: 940, returnPercentage: 2 },
//       { id: "5", name: "Tiktok", price: 670, returnPercentage: -12 },
//     ]
//   } catch (error) {
//     console.error("Error fetching trending stocks:", error)
//     throw error
//   }
// }

// export async function getAvailableInvestments(): Promise<AvailableInvestment[]> {
//   try {

//     // // First hardcoded investment - with simple modal 
//     // const simpleInvestment: AvailableInvestment = {
//     //   card: {
//     //     id: "megacoop-invest-1",
//     //     name: "Pooled Investment Products",
//     //     category: "Savings Plan",
//     //     minInvestment: 100000,
//     //     expectedReturn: '16% - 20%',
//     //     duration: "3 years",
//     //     riskLevel: "Medium",
//     //     image: image1,
//     //     shortDescription: "Start investing with as little as ₦5,000",
//     //     detailType: "pooled"
//     //   },
//     //   modalData: {
//     //     id: "megacoop-invest-1",
//     //     basicDescription: "A straightforward savings plan designed for beginners. Perfect for those looking to start their investment journey with minimal risk and guaranteed returns.",
//     //     poolOption: [
//     //       {
//     //         name: "Starter Pool",
//     //         range: "100k-499,999",
//     //         roi: "16-18%",
//     //         entry: "Entry",
//     //         color: "bg-orange-100 text-orange-800",
//     //         icon: "💼"
//     //       },
//     //       {
//     //         name: "Growth Pool",
//     //         range: "500k-1,999,999",
//     //         roi: "17-19%",
//     //         entry: "Diversified",
//     //         color: "bg-blue-100 text-blue-800",
//     //         icon: "📈"
//     //       },
//     //       {
//     //         name: "Premium Pool",
//     //         range: "2m+",
//     //         roi: "18-20%",
//     //         entry: "Premium",
//     //         color: "bg-green-100 text-green-800",
//     //         icon: "⭐"
//     //       }
//     //     ],
//     //     keyBenefits: [
//     //       "Low minimum investment",
//     //       "Guaranteed returns",
//     //       "Flexible withdrawal options",
//     //       "No hidden charges"
//     //     ],
//     //     requirements: [
//     //       "Minimum age: 18 years",
//     //       "Valid government ID",
//     //       "Bank account for direct debit",
//     //       "Initial deposit of ₦5,000"
//     //     ]
//     //   } as SimpleInvestmentModal
//     // } 

//     // // Second hardcoded investment - with detailed modal
    
//     // const detailedInvestment: AvailableInvestment = {
//     //   card: {
//     //     id: "megacoop-invest-2",
//     //     name: "Housing Projects Investment",
//     //     category: "Real Estate Investment",
//     //     minInvestment: 500000,
//     //     expectedReturn: '16% - 20%',
//     //     duration: "3 years",
//     //     riskLevel: "Medium",
//     //     image: image2,
//     //     shortDescription: "Invest in premium commercial and residential properties",
//     //     detailType: "housing"
//     //   },
//     //   modalData: {
//     //     id: "megacoop-invest-2",
//     //     description: "Our Premium Real Estate Fund offers exposure to carefully selected commercial and residential properties across major metropolitan areas. Properties are managed by experienced real estate professionals with a track record of delivering consistent returns.",
//     //     features: [
//     //       "Quarterly dividend payments",
//     //       "Professional property management",
//     //       "Full insurance coverage included",
//     //       "Early exit option after 18 months with 2% penalty",
//     //       "Monthly performance reports",
//     //       "Direct property ownership certificates"
//     //     ],
//     //     totalSlots: 50,
//     //     availableSlots: 23,
//     //     historicalReturns: [
//     //       { year: 2021, return: 16.2 },
//     //       { year: 2022, return: 19.1 },
//     //       { year: 2023, return: 17.8 }
//     //     ],
//     //     managementFee: 2.5,
//     //     exitTerms: "Early exit allowed after 18 months with 2% penalty fee. Full exit available at maturity with no penalties.",
//     //     documentation: ["Property Portfolio Report", "Legal Documentation", "Insurance Certificates", "Management Agreement"]
//     //   } as DetailedInvestmentModal
//     // }

//     // TODO: Fetch additional investments from API when ready
//     // const response = await axios.get('/investments/available')
//     // const apiInvestments = response.data
//     const apiInvestments: AvailableInvestment[] = [] 

//     // Combine all investments
//     const allInvestments = [simpleInvestment, detailedInvestment, ...apiInvestments]
    
//     return allInvestments
//   } catch (error) {
//     console.error("Error fetching available investments:", error)
//     throw error
//   }
// }

// export async function createInvestment(investmentData: Partial<Investment>): Promise<Investment> {
//   try {
//     // TODO: Replace with actual API call when ready
//     const response = await axios.post('/investments', investmentData)
//     return response.data

//     // throw new Error("API not implemented yet")
//   } catch (error) {
//     console.error("Error creating investment:", error)
//     throw error
//   }
// }

