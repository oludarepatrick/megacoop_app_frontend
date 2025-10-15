import { Button } from "../ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
// import TransactionPagination from "./TransactionPagination";
import TransactionTable from "./TransactionTable";
import type { TabType, Transaction } from "@/pages/Transactions";
import LoanModal from "../LoansComponent/ApplyLoanModal";
import { useState } from "react";

type TabProps = {
    activeTab: TabType
    setActiveTab: (tab: TabType ) => void;
    transactions: Transaction[]

}

const TransactionTabs = ({ activeTab, setActiveTab, transactions }: TabProps) => {
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    
    return (
        <>
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabType)}>
                <TabsList className="flex sm:gap-8 bg-transparent border-b rounded-none pb-0" >
                    <TabsTrigger value="all" className="pb-2 border-0 border-b  data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-megagreen data-[state=active]:text-megagreen ">All Transactions</TabsTrigger>
                    <TabsTrigger value="income" className="pb-2 border-0 border-b  data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-megagreen data-[state=active]:text-megagreen ">Income</TabsTrigger>
                    <TabsTrigger value="expense" className="pb-2 border-0 border-b  data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-megagreen data-[state=active]:text-megagreen ">Expense</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <TransactionTable transactions={transactions} />
                </TabsContent>
                <TabsContent value="income">
                    <TransactionTable transactions={transactions} />
                </TabsContent>
                <TabsContent value="expense">
                    <TransactionTable transactions={transactions} />
                </TabsContent>

            </Tabs>
            <Button variant="ghost" className="text-megagreen underline mt-4" onClick={() => setIsLoanModalOpen(true)}>Apply Loan</Button>
            <LoanModal open={isLoanModalOpen} onClose={() => setIsLoanModalOpen(false)} />
        </>
    )
}

export default TransactionTabs;
