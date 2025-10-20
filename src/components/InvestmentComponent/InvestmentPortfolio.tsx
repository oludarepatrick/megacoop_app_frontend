import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Investment } from "@/types/investmentType"
import emptyBox from "@/assets/empty-box.svg"

interface InvestmentPortfolioProps {
  investments?: Investment[]
}

export default function InvestmentPortfolio({ investments }: InvestmentPortfolioProps) {
  const defaultInvestments: Investment[] = [
    // {
    //     id: "1",
    //     name: "Apple Store",
    //     category: "E-commerce, Marketplace",
    //     value: 54000,
    //     returnValue: 8640,
    //     returnPercentage: 16,
    //     icon: "🍎",
    // },
  ]

  const myInvestments = investments || defaultInvestments

  return (
    <Card className="border-0 bg-inherit border-gray-200 shadow-none">
        <CardHeader className="p-0">
          <CardTitle className="text-lg font-semibold">My Investment</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4 ">
          {myInvestments.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <div>
                <img src={emptyBox} alt="" />
              </div>
              <p className="font-medium text-muted-foreground">No Investment Plan Available yet!</p>
            </div>
          ): (
            myInvestments.map(investment => (
              <div key={investment.id} className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between space-x-3 p-3 py-6  rounded-lg border border-gray-200">
             <div className="flex flex-col lg:flex-row lg:items-center space-x-4 min-w-0">
              <div className="text-xl lg:text-2xl bg-gray-100">{investment.icon}</div>
              <div className=" min-w-0">
                <h4 className="font-semibold text-sm lg:text-base truncate">{investment.name}</h4>
                <p className="text-xs lg:text-sm text-green-600 text-wrap">{investment.category}</p>
              </div>
             </div>
              <div className="flex flex-col lg:ml-auto border-red-200 pr-4"> 
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
            ))
          )}
{/* 
          {myInvestments.map((investment) => (
            <div key={investment.id} className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between space-x-3 p-3 py-6  rounded-lg border border-gray-200">
             <div className="flex flex-col lg:flex-row lg:items-center space-x-4 min-w-0">
              <div className="text-xl lg:text-2xl bg-gray-100">{investment.icon}</div>
              <div className=" min-w-0">
                <h4 className="font-semibold text-sm lg:text-base truncate">{investment.name}</h4>
                <p className="text-xs lg:text-sm text-green-600 text-wrap">{investment.category}</p>
              </div>
             </div>
              <div className="flex flex-col lg:ml-auto border-red-200 pr-4"> 
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
          ))} */}
        </CardContent>
      </Card>
  )
}
