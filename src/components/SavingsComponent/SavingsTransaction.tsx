import { Card, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../ui/table"


import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";


const transactions = [
  {
    invoice: "Adobe After Effect",
    totalAmount: "800.09",
    date: "Sat, 20 Apr 2020",
  },
  {
    invoice: "Mcdonald's",
    totalAmount: "800.09",
    date: "Sat, 20 Apr 2020",
  },
  {
    invoice: "Adobe After Effect",
    totalAmount: "800.09",
    date: "Sat, 20 Apr 2020",
  },
  {
    invoice: "Mcdonald's",
    totalAmount: "800.09",
    date: "Sat, 20 Apr 2020",
  },
  {
    invoice: "Mcdonald's",
    totalAmount: "800.09",
    date: "Sat, 20 Apr 2020",
  },
  
]

const SavingsTransaction= () => {
    
    return (
        // <section className="">
        <Card className="px-4 pb-2 ">
            <CardHeader className="flex items-center justify-between px-2">
                <CardTitle className="text-2xl font-semibold">Recent Transactions</CardTitle>
                <div>
                  <Link to="/user/transactions" className="uppercase text-megagreen">View All</Link>
                </div>
            </CardHeader>
            <div className="overflow-x-auto green-scrollbar">
                <Table>
                <TableBody>
                    {transactions.slice(0,3).map((invoice) => (
                        <TableRow key={crypto.randomUUID()} className="hover:bg-transparent space-y-4 border-t">
                            <TableCell className="flex items-center gap-4">
                                <Avatar className="rounded-full">
                                    <AvatarImage src="" alt="" />
                                    <AvatarFallback className="bg-[#EAE5FA] text-dark">TN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col space-y-2">
                                    <p >{invoice.invoice}</p>
                                    <span className="text-xs text-muted-foreground">{invoice.date}</span>
                                </div>
                            </TableCell>
                            <TableCell className=" text-right font-medium">₦{invoice.totalAmount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </Card>
        // </section>
    )
}

export default SavingsTransaction;