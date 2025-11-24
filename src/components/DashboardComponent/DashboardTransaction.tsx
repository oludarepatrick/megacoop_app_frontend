import { Card, CardHeader, CardTitle } from "../ui/card";
import {
    Filter, 
    // Search
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import emptyBox from "@/assets/empty-box.svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Link } from "react-router-dom";
import { useWalletTransaction } from "@/hooks/useWalletTransaction";
import { formatDateTime } from "@/common/utils";

// const transactions = [
//   {
//     transaction: "Adobe After Effect",
//     paymentStatus: "Completed",
//     totalAmount: "N800.09",
//     date: "Sat, 20 Apr 2020",
//   },
//   {
//     invoice: "Mcdonald's",
//     paymentStatus: "Completed",
//     totalAmount: "N800.09",
//     date: "Sat, 20 Apr 2020",
//   },
//   {
//     invoice: "Adobe After Effect",
//     paymentStatus: "Completed",
//     totalAmount: "N800.09",
//     date: "Sat, 20 Apr 2020",
//   },
//   {
//     invoice: "Mcdonald's",
//     paymentStatus: "Completed",
//     totalAmount: "N800.09",
//     date: "Sat, 20 Apr 2020",
//   },
//   {
//     invoice: "Mcdonald's",
//     paymentStatus: "Completed",
//     totalAmount: "N800.09",
//     date: "Sat, 20 Apr 2020",
//   },
  
// ]

const DashboardTransation= () => {
    const {data:transactions =[], isLoading} = useWalletTransaction();
    
    
    return (
        <Card className="px-4 pb-2 ">
            <CardHeader className="flex justify-between px-2">
                <CardTitle className="text-2xl font-semibold">Recent Transaction</CardTitle>
                <div className="flex gap-4 items-center">
                    {/* <div className="relative bg-text-muted/10 rounded-xl hidden lg:flex">
                            <Input
                                type="text"
                                placeholder="Search for anything"
                                className="pr-6  border-transparent shadow-none placeholder:text-icon placeholder:text-xs text-sm"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-icon w-4 h-4" />
                    </div> */}
                    <div className="relative hidden sm:flex">
                        <Select>
                            <SelectTrigger className="pl-10">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icon w-4 h-4" />
                    </div>
                    <Link to="/user/transactions" className="text-footertext text-sm hover:text-megagreen ">See All</Link>
                </div>
            </CardHeader>
            <div className="overflow-x-auto green-scrollbar">
                {isLoading && (
                    <div className="flex items-center justify-center p-6 ">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-megagreen"></div>
                    </div>
                )}
                {!isLoading && transactions.length === 0 && (
                    <div className="flex flex-col justify-center items-center py-6">
                        <img src={emptyBox} alt="No transactions" />
                        <p className="font-medium text-muted-foreground">No Transaction!</p>
                    </div>
                )}
                {!isLoading &&  transactions.length > 0 && (
                    <Table>
                        <TableHeader className="[&_tr]:border-b-0">
                            <TableRow className="bg-fadegrey [&_th]:text-xs">
                                <TableHead className="text-icon/80 font-normal rounded-l-lg pl-4">Name</TableHead>
                                <TableHead className="text-icon/80 font-normal border-l-1  border-icon/80">Date</TableHead>
                                <TableHead className="text-icon/80 font-normal border-l-1 border-icon/80">Price</TableHead>
                                <TableHead className="text-icon/80 w-[120px] font-normal border-l-1 border-icon/80 rounded-r-lg">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                    <TableBody>
                        {transactions.slice(0,3).map((transaction) => (
                            <TableRow key={crypto.randomUUID()} className="hover:bg-transparent [&_td]:text-xs [&_td]:py-4">
                                <TableCell className="truncate max-w-40">
                                    {transaction.description}
                                </TableCell>
                                <TableCell>{formatDateTime(transaction.created_at)}</TableCell>
                                <TableCell className="">{transaction.amount}</TableCell>
                                <TableCell className=" w-[120px] "><span className="bg-[#CFF0E0] text-megagreen py-1 px-3 rounded-2xl">{transaction.status}</span></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                )}
            </div>
        </Card>
        // </section>
    )
}

export default DashboardTransation;