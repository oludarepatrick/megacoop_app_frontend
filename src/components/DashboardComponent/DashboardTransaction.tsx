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


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";


const transactions = [
  {
    invoice: "Adobe After Effect",
    paymentStatus: "Completed",
    totalAmount: "N800.09",
    date: "Sat, 20 Apr 2020",
  },
  {
    invoice: "Mcdonald's",
    paymentStatus: "Completed",
    totalAmount: "N800.09",
    date: "Sat, 20 Apr 2020",
  },
  {
    invoice: "Adobe After Effect",
    paymentStatus: "Completed",
    totalAmount: "N800.09",
    date: "Sat, 20 Apr 2020",
  },
  {
    invoice: "Mcdonald's",
    paymentStatus: "Completed",
    totalAmount: "N800.09",
    date: "Sat, 20 Apr 2020",
  },
  {
    invoice: "Mcdonald's",
    paymentStatus: "Completed",
    totalAmount: "N800.09",
    date: "Sat, 20 Apr 2020",
  },
  
]

const DashboardTransation= () => {
    
    return (
        // <section className="">
        <Card className="px-4 pb-2 ">
            <CardHeader className="flex justify-between px-2">
                <CardTitle className="text-2xl font-semibold">Transaction</CardTitle>
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
                <Table>
                    <TableHeader className="[&_tr]:border-b-0">
                        <TableRow className="bg-fadegrey [&_th]:text-xs ">
                            <TableHead className="text-icon/80 font-normal rounded-l-lg pl-4">Name</TableHead>
                            <TableHead className="text-icon/80 font-normal border-l-1  border-icon/80">Date</TableHead>
                            <TableHead className="text-icon/80 font-normal border-l-1 border-icon/80">Price</TableHead>
                            <TableHead className="text-icon/80 w-[120px] font-normal border-l-1 border-icon/80 rounded-r-lg">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                <TableBody>
                    {transactions.slice(0,3).map((invoice) => (
                        <TableRow key={crypto.randomUUID()} className="hover:bg-transparent [&_td]:text-xs">
                            <TableCell className="flex items-center gap-2">
                                <Avatar className="rounded-full">
                                    <AvatarImage src="" alt="" />
                                    <AvatarFallback className="bg-[#EAE5FA] text-dark">TN</AvatarFallback>
                                </Avatar>
                                {invoice.invoice}
                            </TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell className="">{invoice.totalAmount}</TableCell>
                            <TableCell className=" w-[120px] "><span className="bg-[#CFF0E0] text-megagreen py-1 px-3 rounded-2xl">{invoice.paymentStatus}</span></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </Card>
        // </section>
    )
}

export default DashboardTransation;