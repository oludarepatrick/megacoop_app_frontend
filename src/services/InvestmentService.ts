import axios from "@/lib/axiosInstance";

export interface InvestmentData {
  totalInvested: number
  numberOfInvestments: number
  rateOfReturn: number
}

export interface ChartDataPoint {
  year: number
  investment: number
  revenue: number
}

export interface Investment {
  id: string
  name: string
  category: string
  value: number
  returnValue: number
  returnPercentage: number
  icon: string
}

export interface TrendingStock {
  id: string
  name: string
  price: number
  returnPercentage: number
}

export async function getInvestmentData(): Promise<InvestmentData> {
  try {
    // TODO: Will Replace with actual API call when ready
    // const response = await apiClient.get('/investments/summary')
    // return response.data

    // Dummy data for now
    return {
      totalInvested: 0.00,
      numberOfInvestments: 2,
      rateOfReturn: 5.8,
    }
  } catch (error) {
    console.error("Error fetching investment data:", error)
    throw error
  }
}

export async function getChartData(): Promise<ChartDataPoint[]> {
  try {
    // TODO: Will Replace with actual API call when ready
    // const response = await apiClient.get('/investments/charts')
    // return response.data

    // Dummy data for now
    return [
      { year: 2016, investment: 5000, revenue: 10000 },
      { year: 2017, investment: 23000, revenue: 15000 },
      { year: 2018, investment: 16000, revenue: 20000 },
      { year: 2019, investment: 35000, revenue: 30000 },
      { year: 2020, investment: 20000, revenue: 25000 },
      { year: 2021, investment: 28000, revenue: 35000 },
    ]
  } catch (error) {
    console.error("Error fetching chart data:", error)
    throw error
  }
}

export async function getPortfolioData(): Promise<Investment[]> {
  try {
    // TODO: Will Replace with actual API call when ready
    // const response = await apiClient.get('/investments/portfolio')
    // return response.data

    // Dummy data for now
    return [
      {
        id: "1",
        name: "Apple Store",
        category: "E-commerce, Marketplace",
        value: 54000,
        returnValue: 8640,
        returnPercentage: 16,
        icon: "🍎",
      },
      {
        id: "2",
        name: "Samsung Mobile",
        category: "E-commerce, Marketplace",
        value: 25300,
        returnValue: -1012,
        returnPercentage: -4,
        icon: "📱",
      },
      {
        id: "3",
        name: "Tesla Motors",
        category: "Electric Vehicles",
        value: 8200,
        returnValue: 2050,
        returnPercentage: 25,
        icon: "🚗",
      },
    ]
  } catch (error) {
    console.error("Error fetching portfolio data:", error)
    throw error
  }
}

export async function getTrendingStocks(): Promise<TrendingStock[]> {
  try {
    // TODO: Will Replace with actual API call when ready
    // const response = await apiClient.get('/stocks/trending')
    // return response.data

    // Dummy data for now
    return [
      { id: "1", name: "Trivago", price: 520, returnPercentage: 5 },
      { id: "2", name: "Canon", price: 480, returnPercentage: 10 },
      { id: "3", name: "Uber Food", price: 350, returnPercentage: -3 },
      { id: "4", name: "Nokia", price: 940, returnPercentage: 2 },
      { id: "5", name: "Tiktok", price: 670, returnPercentage: -12 },
    ]
  } catch (error) {
    console.error("Error fetching trending stocks:", error)
    throw error
  }
}

export async function createInvestment(investmentData: Partial<Investment>): Promise<Investment> {
  try {
    // TODO: Replace with actual API call when ready
    const response = await axios.post('/investments', investmentData)
    return response.data

    // throw new Error("API not implemented yet")
  } catch (error) {
    console.error("Error creating investment:", error)
    throw error
  }
}

// export async function updateInvestment(id: string, investmentData: Partial<Investment>): Promise<Investment> {
//   try {
//     // TODO: Replace with actual API call when ready
//     // const response = await apiClient.put(`/investments/${id}`, investmentData)
//     // return response.data

//     throw new Error("API not implemented yet")
//   } catch (error) {
//     console.error("Error updating investment:", error)
//     throw error
//   }
// }

// export async function deleteInvestment(id: string): Promise<void> {
//   try {
//     // TODO: Replace with actual API call when ready
//     // await apiClient.delete(`/investments/${id}`)

//     throw new Error("API not implemented yet")
//   } catch (error) {
//     console.error("Error deleting investment:", error)
//     throw error
//   }
// }



// import axios from "axios"

// const baseUrl = import.meta.env.VITE_API_URL ?? 'http://34.56.64.14/api/v1/';


// const apiClient = axios.create({
//   baseURL: baseUrl,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// export interface InvestmentData {
//   totalInvested: number
//   numberOfInvestments: number
//   rateOfReturn: number
// }

// export interface ChartDataPoint {
//   year: number
//   investment: number
//   revenue: number
// }

// export interface Investment {
//   id: string
//   name: string
//   category: string
//   value: number
//   returnValue: number
//   returnPercentage: number
//   icon: string
// }

// export interface TrendingStock {
//   id: string
//   name: string
//   price: number
//   returnPercentage: number
// }

// export async function getInvestmentData(): Promise<InvestmentData> {
//   try {
//     // TODO: Will Replace with actual API call when ready
//     // const response = await apiClient.get('/investments/summary')
//     // return response.data

//     // Dummy data for now
//     return {
//       totalInvested: 150000,
//       numberOfInvestments: 1250,
//       rateOfReturn: 5.8,
//     }
//   } catch (error) {
//     console.error("Error fetching investment data:", error)
//     throw error
//   }
// }

// export async function getChartData(): Promise<ChartDataPoint[]> {
//   try {
//     // TODO: Will Replace with actual API call when ready
//     // const response = await apiClient.get('/investments/charts')
//     // return response.data

//     // Dummy data for now
//     return [
//       { year: 2016, investment: 5000, revenue: 10000 },
//       { year: 2017, investment: 23000, revenue: 15000 },
//       { year: 2018, investment: 16000, revenue: 20000 },
//       { year: 2019, investment: 35000, revenue: 30000 },
//       { year: 2020, investment: 20000, revenue: 25000 },
//       { year: 2021, investment: 28000, revenue: 35000 },
//     ]
//   } catch (error) {
//     console.error("Error fetching chart data:", error)
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
//       {
//         id: "1",
//         name: "Apple Store",
//         category: "E-commerce, Marketplace",
//         value: 54000,
//         returnValue: 8640,
//         returnPercentage: 16,
//         icon: "🍎",
//       },
//       {
//         id: "2",
//         name: "Samsung Mobile",
//         category: "E-commerce, Marketplace",
//         value: 25300,
//         returnValue: -1012,
//         returnPercentage: -4,
//         icon: "📱",
//       },
//       {
//         id: "3",
//         name: "Tesla Motors",
//         category: "Electric Vehicles",
//         value: 8200,
//         returnValue: 2050,
//         returnPercentage: 25,
//         icon: "🚗",
//       },
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

// export async function createInvestment(investmentData: Partial<Investment>): Promise<Investment> {
//   try {
//     // TODO: Replace with actual API call when ready
//     const response = await apiClient.post('/investments', investmentData)
//     return response.data

//     // throw new Error("API not implemented yet")
//   } catch (error) {
//     console.error("Error creating investment:", error)
//     throw error
//   }
// }

// // export async function updateInvestment(id: string, investmentData: Partial<Investment>): Promise<Investment> {
// //   try {
// //     // TODO: Replace with actual API call when ready
// //     // const response = await apiClient.put(`/investments/${id}`, investmentData)
// //     // return response.data

// //     throw new Error("API not implemented yet")
// //   } catch (error) {
// //     console.error("Error updating investment:", error)
// //     throw error
// //   }
// // }

// // export async function deleteInvestment(id: string): Promise<void> {
// //   try {
// //     // TODO: Replace with actual API call when ready
// //     // await apiClient.delete(`/investments/${id}`)

// //     throw new Error("API not implemented yet")
// //   } catch (error) {
// //     console.error("Error deleting investment:", error)
// //     throw error
// //   }
// // }
