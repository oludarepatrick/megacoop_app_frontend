import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "../ui/card";
import emptyBox from "@/assets/empty-box.svg";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import type { WalletTransaction } from "@/types/transaction";
import { formatDateTime } from "@/common/utils";

type TransactionTableProps = {
    transactions: WalletTransaction[];
    onClick: (transaction: WalletTransaction) => void
    isLoading: boolean
}

const TransactionTable = ({transactions, onClick, isLoading}: TransactionTableProps) => {
    return (
        <Card className="px-4 py-0 mt-5">
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
                <Table className="mb-4">
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
                                <TableCell className="flex items-center gap-3 ">
                                    <div className="rounded-full border border-megagreen p-1 ">
                                        {transaction.type === "debit" ? <ArrowUp className="w-4 h-4 text-megagreen" /> : <ArrowDown className="w-4 h-4 text-megagreen" />}
                                    </div>
                                    <span className="truncate max-w-45">{transaction.description}</span>
                                    
                                </TableCell>
                                <TableCell className="truncate max-w-40">{transaction.reference}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{formatDateTime(transaction.created_at)}</TableCell>
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

                )}
            </div>
        </Card>
    )
}

export default TransactionTable;
