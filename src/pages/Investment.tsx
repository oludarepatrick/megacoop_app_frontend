import { useQuery } from "@tanstack/react-query"
import { getInvestmentData, getChartData, getPortfolioData, getTrendingStocks } from "@/services/InvestmentService"
import InvestmentCards from "@/components/InvestmentComponent/InvestmentCards"
import InvestmentCharts from "@/components/InvestmentComponent/InvestmentCharts"
import PageLoader from "@/components/PageLoader"
import InvestmentPortfolio from "@/components/InvestmentComponent/InvestmentPortfolio"

export default function InvestmentDashboard() {
  const { data: investmentData, isLoading, isError } = useQuery({
    queryKey: ["investment-data"],
    queryFn: getInvestmentData,
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const { data: chartData } = useQuery({
    queryKey: ["chart-data"],
    queryFn: getChartData,
    refetchInterval: 60000, // Refresh every minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const { data: portfolioData } = useQuery({
    queryKey: ["portfolio-data"],
    queryFn: getPortfolioData,
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const { data: trendingStocks } = useQuery({
    queryKey: ["trending-stocks"],
    queryFn: getTrendingStocks,
    refetchInterval: 15000, // Refresh every 15 seconds for trending stocks
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

    if (isLoading) return <PageLoader />
    if (isError) return <div className="text-red-500">Error loading investment data. Please try again later.</div>

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Investment Cards - Top Row */}
      <InvestmentCards data={investmentData} />

      {/* Charts and Portfolio - Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
        {/* Charts Section - Takes 2 columns on xl screens */}
        {/* <div className="xl:col-span-2"> */}
          <InvestmentCharts data={chartData} />
        {/* </div> */}
          </div>
          {/* Portfolio Section - Takes 1 column on xl screens */}
        <div className="xl:col-span-1">
          <InvestmentPortfolio investments={portfolioData} trendingStocks={trendingStocks} />
        </div>
    </div>
  )
}
