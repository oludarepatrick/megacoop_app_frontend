/* eslint-disable no-constant-condition */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserInvestment } from "@/types/investmentType";
import emptyBox from "@/assets/empty-box.svg";

interface InvestmentPortfolioProps {
  investments: UserInvestment[];
  isLoading: boolean;
}

export default function InvestmentPortfolio({
  investments,
  isLoading,
}: InvestmentPortfolioProps) {
  return (
    <Card className="border-0 bg-inherit border-gray-200 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold">My Investment</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {investments.length === 0 || isLoading ? (
          <div className="flex flex-col justify-center items-center">
            <img src={emptyBox} alt="" />
            <p className="font-medium text-muted-foreground">
              No Investment Plan Available yet!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-max space-y-4">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="flex gap-4 lg:items-center justify-between space-x-3 p-3 py-6 rounded-lg border border-gray-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center space-x-4 min-w-0">
                    <div className="min-w-0">
                      <h4 className="font-medium text-xs lg:text-sm truncate">
                        {investment.inv_name}
                      </h4>
                      <p className="text-xs lg:text-sm text-green-600 text-wrap">
                        {investment.investment.company_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:ml-auto pr-4">
                    <p className="font-medium text-xs lg:text-sm">
                      ₦{investment.amount.toLocaleString()}
                    </p>
                    <p className="text-xs lg:text-sm text-green-600">
                      Investment Value
                    </p>
                  </div>

                  <div className="text-left flex flex-col pr-4">
                    <p
                      className={`font-medium text-xs lg:text-sm ${
                        5 >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {5 >= 0 ? "+" : ""}
                      {investment.investment.roi}%
                    </p>
                    <p className="text-xs lg:text-sm text-green-600">
                      Return Value
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    //     <Card className="border-0 bg-inherit border-gray-200 shadow-none">
    //         <CardHeader className="p-0">
    //           <CardTitle className="text-lg font-semibold">My Investment</CardTitle>
    //         </CardHeader>
    //         <CardContent className="p-0 space-y-4 not-last:overflow-x-auto">
    //           {investments.length === 0 || isLoading ?  (
    //             <div className="flex flex-col justify-center items-center">
    //               <div>
    //                 <img src={emptyBox} alt="" />
    //               </div>
    //               <p className="font-medium text-muted-foreground">No Investment Plan Available yet!</p>
    //             </div>
    //           ): (
    //             investments.map(investment => (
    //               <div key={investment.id} className="flex  gap-4 lg:items-center justify-between space-x-3 p-3 py-6  rounded-lg border border-gray-200">
    //                 <div className="flex flex-col lg:flex-row lg:items-center space-x-4 min-w-0">
    //                   {/* <div className="text-xl lg:text-2xl bg-gray-100">{investment.icon}</div> */}
    //                   <div className=" min-w-0">
    //                     <h4 className="font-medium text-xs lg:text-sm truncate">{investment.inv_name}</h4>
    //                     <p className="text-xs lg:text-sm text-green-600 text-wrap">{investment.investment.company_name}</p>
    //                   </div>
    //                 </div>
    //                 <div className="flex flex-col lg:ml-auto border-red-200 pr-4">
    //                   <p className="font-medium  text-xs lg:text-sm">₦{investment.amount.toLocaleString()}</p>
    //                   <p className="text-xs lg:text-sm text-green-600">Investment Value</p>
    //                 </div>
    //               <div className="text-left flex flex-col border-red-200 pr-4">
    //                 <p
    //                   className={`font-mediym text-xs lg:text-sm ${
    //                     5 >= 0 ? "text-green-600" : "text-red-500"
    //                   }`}
    //                 >
    //                   {5 >= 0 ? "+" : ""}
    //                   {5}%
    //                 </p>
    //                 <p className="text-xs lg:text-sm text-green-600">Return Value</p>
    //               </div>
    //               {/* <div className="text-left lg:text-right flex flex-col border-red-200 pr-4">
    //                 <p
    //                   className={`font-semibold text-sm lg:text-base ${
    //                     investment.returnPercentage >= 0 ? "text-green-600" : "text-red-500"
    //                   }`}
    //                 >
    //                   {investment.returnPercentage >= 0 ? "+" : ""}
    //                   {investment.returnPercentage}%
    //                 </p>
    //                 <p className="text-xs lg:text-sm text-green-600">Return Value</p>
    //               </div> */}
    //             </div>
    //             ))
    //           )}
    // {/*
    //           {investments.map((investment) => (
    //             <div key={investment.id} className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between space-x-3 p-3 py-6  rounded-lg border border-gray-200">
    //              <div className="flex flex-col lg:flex-row lg:items-center space-x-4 min-w-0">
    //               <div className="text-xl lg:text-2xl bg-gray-100">{investment.icon}</div>
    //               <div className=" min-w-0">
    //                 <h4 className="font-semibold text-sm lg:text-base truncate">{investment.name}</h4>
    //                 <p className="text-xs lg:text-sm text-green-600 text-wrap">{investment.category}</p>
    //               </div>
    //              </div>
    //               <div className="flex flex-col lg:ml-auto border-red-200 pr-4">
    //                 <p className="font-semibold  text-sm lg:text-base">${investment.value.toLocaleString()}</p>
    //                 <p className="text-xs lg:text-sm text-green-600">Investment Value</p>
    //               </div>
    //               <div className="text-left lg:text-right flex flex-col border-red-200 pr-4">
    //                 <p
    //                   className={`font-semibold text-sm lg:text-base ${
    //                     investment.returnPercentage >= 0 ? "text-green-600" : "text-red-500"
    //                   }`}
    //                 >
    //                   {investment.returnPercentage >= 0 ? "+" : ""}
    //                   {investment.returnPercentage}%
    //                 </p>
    //                 <p className="text-xs lg:text-sm text-green-600">Return Value</p>
    //               </div>
    //             </div>
    //           ))} */}
    //         </CardContent>
    //       </Card>
  );
}
