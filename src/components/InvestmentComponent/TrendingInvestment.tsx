import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TopTrendingInvestment } from "@/types/investmentType"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import emptyBox from "@/assets/empty-box.svg";



type TrendingInvestmentProps = {
    trendingInvestment: TopTrendingInvestment[],
    isLoading: boolean
}

// const defaultTrendingStocks: TrendingInvestment[] = [
//     { id: "1", name: "Trivago", price: 520, returnPercentage: 5 },
//     { id: "2", name: "Canon", price: 480, returnPercentage: 10 },
//     { id: "3", name: "Uber Food", price: 350, returnPercentage: -3 },
//     { id: "4", name: "Nokia", price: 940, returnPercentage: 2 },
//     { id: "5", name: "Tiktok", price: 670, returnPercentage: -12 },
// ]
const TrendingInvestment = ({trendingInvestment, isLoading}: TrendingInvestmentProps) => {
    return (
        <Card className="border-0 bg-inherit border-gray-200 shadow-none">
            <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold ">Trending Investment</CardTitle>
            </CardHeader>
            <CardContent className=" p-5.5 border rounded-lg border-gray-200">
                <div className="overflow-x-auto greenScrollbar">
                    {isLoading || trendingInvestment.length === 0 ? (
                        <div className="flex flex-col justify-center items-center py-6">
                            <img src={emptyBox} alt="No transactions" />
                            <p className="font-medium text-muted-foreground">No Saving plan created yet</p>
                        </div>
                    ) : (
                        <Table className="w-full min-w-[250px]">
                            <TableHeader>
                                <TableRow className="border-b border-gray-200">
                                    <TableHead className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-green-600">S/N</TableHead>
                                    <TableHead className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-green-600">Name</TableHead>
                                    <TableHead className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-green-600">Price</TableHead>
                                    <TableHead className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-green-600">Return</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trendingInvestment.map((investment, index) => (
                                    <TableRow key={investment.id} className="border-b border-gray-100 last:border-b-0">
                                        <TableCell className="py-2 lg:py-3 text-xs lg:text-sm ">
                                            {String(index + 1).padStart(2, "0")}.
                                        </TableCell>
                                        <TableCell className="py-2 lg:py-3 text-xs lg:text-sm font-medium truncate max-w-40">{investment.company_name}</TableCell>
                                        <TableCell className="py-2 lg:py-3 text-xs lg:text-sm">₦{investment.investors_count}</TableCell>
                                        <TableCell
                                            className={`py-2 lg:py-3 text-xs lg:text-sm font-medium ${
                                                Number(investment.roi) >= 0 ? "text-green-600" : "text-red-500"
                                            }`}
                                        >
                                            {Number(investment.roi) >= 0 ? "+" : ""}
                                            {Number(investment.roi)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default TrendingInvestment;