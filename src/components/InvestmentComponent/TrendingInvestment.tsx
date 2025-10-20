import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


type TrendingStock = {
  id: string
  name: string
  price: number
  returnPercentage: number
}

type TrendingInvestmentProps = {
    trendingStocks?: TrendingStock[]
}

const defaultTrendingStocks: TrendingStock[] = [
    { id: "1", name: "Trivago", price: 520, returnPercentage: 5 },
    { id: "2", name: "Canon", price: 480, returnPercentage: 10 },
    { id: "3", name: "Uber Food", price: 350, returnPercentage: -3 },
    { id: "4", name: "Nokia", price: 940, returnPercentage: 2 },
    { id: "5", name: "Tiktok", price: 670, returnPercentage: -12 },
]
const TrendingInvestment = ({trendingStocks}: TrendingInvestmentProps) => {
      const stocks = trendingStocks || defaultTrendingStocks
    return (
        <Card className="border-0 bg-inherit border-gray-200 shadow-none">
            <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold ">Trending Investment</CardTitle>
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
    )
}

export default TrendingInvestment;