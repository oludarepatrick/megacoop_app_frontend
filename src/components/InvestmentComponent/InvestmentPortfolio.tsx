import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Investment {
  id: string
  name: string
  category: string
  value: number
  returnValue: number
  returnPercentage: number
  icon: string
}

interface TrendingStock {
  id: string
  name: string
  price: number
  returnPercentage: number
}

interface InvestmentPortfolioProps {
  investments?: Investment[]
  trendingStocks?: TrendingStock[]
}

export default function InvestmentPortfolio({ investments, trendingStocks }: InvestmentPortfolioProps) {
  const defaultInvestments: Investment[] = [
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

  const defaultTrendingStocks: TrendingStock[] = [
    { id: "1", name: "Trivago", price: 520, returnPercentage: 5 },
    { id: "2", name: "Canon", price: 480, returnPercentage: 10 },
    { id: "3", name: "Uber Food", price: 350, returnPercentage: -3 },
    { id: "4", name: "Nokia", price: 940, returnPercentage: 2 },
    { id: "5", name: "Tiktok", price: 670, returnPercentage: -12 },
  ]

  const myInvestments = investments || defaultInvestments
  const stocks = trendingStocks || defaultTrendingStocks

  return (
    <div className="space-y-6 grid grid-cols-1 xl:grid-cols-[63%_34%] gap-6">
      {/* My Investment Section */}
      <Card className="border-0 bg-inherit border-gray-200 shadow-none">
        <CardHeader className="p-0">
          <CardTitle className="text-lg font-semibold">My Investment</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4 ">
          {myInvestments.map((investment) => (
            <div key={investment.id} className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between space-x-3 p-3 py-6  rounded-lg border border-gray-200">
             <div className="flex flex-col lg:flex-row lg:items-center space-x-4 min-w-0">
              <div className="text-xl lg:text-2xl bg-gray-100">{investment.icon}</div>
              <div className=" min-w-0">
                <h4 className="font-semibold text-sm lg:text-base truncate">{investment.name}</h4>
                <p className="text-xs lg:text-sm text-green-600 text-wrap">{investment.category}</p>
              </div>
             </div>
              <div className="flex flex-col  lg:ml-auto border-red-200 pr-4"> 
                <p className="font-semibold  text-sm lg:text-base">${investment.value.toLocaleString()}</p>
                <p className="text-xs lg:text-sm text-green-600">Investment Value</p>
              </div>
              <div className="text-left lg:text-right flex flex-col border-red-200 pr-4">
                <p
                  className={`font-semibold text-sm lg:text-base ${
                    investment.returnPercentage >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {investment.returnPercentage >= 0 ? "+" : ""}
                  {investment.returnPercentage}%
                </p>
                <p className="text-xs lg:text-sm text-green-600">Return Value</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trending Stock Section */}
      <Card className="border-0 bg-inherit border-gray-200 shadow-none">
        <CardHeader className="p-0">
          <CardTitle className="text-lg font-semibold ">Trending Stock</CardTitle>
        </CardHeader>
        <CardContent className=" p-5.5 border rounded-lg border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[250px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-green-600">SL No</th>
                  <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-green-600">Name</th>
                  <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-green-600">Price</th>
                  <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-green-600">Return</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock, index) => (
                  <tr key={stock.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-2 lg:py-3 text-xs lg:text-sm ">
                      {String(index + 1).padStart(2, "0")}.
                    </td>
                    <td className="py-2 lg:py-3 text-xs lg:text-sm font-medium">{stock.name}</td>
                    <td className="py-2 lg:py-3 text-xs lg:text-sm">₦{stock.price}</td>
                    <td
                      className={`py-2 lg:py-3 text-xs lg:text-sm font-medium ${
                        stock.returnPercentage >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {stock.returnPercentage >= 0 ? "+" : ""}
                      {stock.returnPercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
