import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

type Transaction ={
    id: string;
    description: string;
    remark: string;
    date: string;
    amount: number;
    type: "credit" | "debit";
}
type TransactionTableProps = {
    transactions: Transaction[];
    onClick: (transaction: Transaction) => void
}

const TransactionTable = ({transactions, onClick}: TransactionTableProps) => {
    return (
        <Card className="p-4">
            <div className="overflow-x-auto green-scrollbar">
                <Table>
                        <TableHeader className="[&_tr]:border-b-0">
                            <TableRow className="bg-transparent [&_th]:text-xs ">
                                <TableHead>Description</TableHead>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Receipt</TableHead>
                            </TableRow>
                        </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id} className="hover:bg-transparent [&_td]:text-xs">
                                <TableCell className="flex items-center gap-3">
                                    <div className="rounded-full border border-megagreen p-1 ">
                                        {transaction.type === "debit" ? <ArrowUp className="w-4 h-4 text-megagreen" /> : <ArrowDown className="w-4 h-4 text-megagreen" />}
                                    </div>
                                    {transaction.description}
                                </TableCell>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{transaction.remark}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell className={transaction.type === "credit" ? "text-megagreen" : "text-red-500"}>
                                    {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                                </TableCell>
                                <TableCell className=" w-[120px] cursor-pointer">
                                    <span className="border-megagreen border text-megagreen py-1 px-3 rounded-2xl " onClick={() => onClick(transaction)}>
                                        Download
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}

export default TransactionTable;
