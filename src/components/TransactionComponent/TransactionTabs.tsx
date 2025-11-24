import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import TransactionTable from "./TransactionTable";
import type { TabType, } from "@/pages/Transactions";
// import LoanModal from "../LoansComponent/ApplyLoanModal";
import { useState } from "react";
import TransactionReceipt from "./TransactionReceipt";
import type { WalletTransaction } from "@/types/transaction";

type TabProps = {
    activeTab: TabType
    setActiveTab: (tab: TabType ) => void;
    transactions: WalletTransaction[]
    isLoading: boolean

}

const TransactionTabs = ({ activeTab, setActiveTab, transactions, isLoading }: TabProps) => {
    // const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [isReceiptModal, setIsReceiptModal]  = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null)

    const handleClick = (transaction: WalletTransaction) => {
        setSelectedTransaction(transaction)
        setIsReceiptModal(true)
    }
    
    return (
        <>
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabType)}>
                <TabsList className="flex sm:gap-8 bg-transparent border-b rounded-none pb-0" >
                    <TabsTrigger value="all" className="pb-2 border-0 border-b  data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-megagreen data-[state=active]:text-megagreen ">All Transactions</TabsTrigger>
                    <TabsTrigger value="income" className="pb-2 border-0 border-b  data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-megagreen data-[state=active]:text-megagreen ">Income</TabsTrigger>
                    <TabsTrigger value="expense" className="pb-2 border-0 border-b  data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-megagreen data-[state=active]:text-megagreen ">Expense</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <TransactionTable transactions={transactions} isLoading={isLoading} onClick={handleClick} />
                </TabsContent>
                <TabsContent value="income">
                    <TransactionTable transactions={transactions} isLoading={isLoading} onClick={handleClick} />
                </TabsContent>
                <TabsContent value="expense">
                    <TransactionTable transactions={transactions} isLoading={isLoading} onClick={handleClick} />
                </TabsContent>

            </Tabs>
            {/* <Button variant="ghost" className="text-megagreen underline mt-4" onClick={() => setIsLoanModalOpen(true)}>Apply Loan</Button> */}
            {/* <LoanModal open={isLoanModalOpen} onClose={() => setIsLoanModalOpen(false)} /> */}
            
            {selectedTransaction && (
                <TransactionReceipt 
                    isOpen={isReceiptModal} 
                    onClose={()=> setIsReceiptModal(false)}
                    transactions={selectedTransaction}
                />
            )}
        </>
    )
}

export default TransactionTabs;
