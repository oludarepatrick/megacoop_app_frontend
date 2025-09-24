import DashboardOverview from "@/components/DashboardComponent/DashboardOverview";
import TransactionsHeader from "@/components/TransactionComponent/TransactionHeader";
import TransactionPagination from "@/components/TransactionComponent/TransactionPagination";
import TransactionTabs from "@/components/TransactionComponent/TransactionTabs";
import { useState } from "react";


export type Transaction ={
    id: string;
    description: string;
    remark: string;
    date: string;
    amount: number;
    type: "credit" | "debit";
}

export type TabType = "all" | "income" | "expense"

const allTransactions: Transaction[] = [
  {
    description: "Spotify Subscription",
    id: "#12548796",
    remark: "Shopping",
    date: "28 Jan, 12:08 AM",
    amount: 2500,
    type: "debit"
  },
  {
    description: "Freepik Sales",
    id: "#12548712",
    remark: "Transfer",
    date: "10 Jan, 12:08 AM",
    amount: 750,
    type: "credit"
  },
  {
    description: "Mobile Service",
    id: "#12593796",
    remark: "Service",
    date: "25 Jan, 10:08 PM",
    amount: 150,
    type: "debit"
  },
  {
    description: "Wilson",
    id: "#12511296",
    remark: "Transfer",
    date: "15 Jan, 10:39 PM",
    amount: 1050,
    type: "debit"
  },
  {
    description: "Emilly",
    id: "#12548006",
    remark: "Transfer",
    date: "14 Jan, 10:40 PM",
    amount: 840,
    type: "credit"
  },
{
    description: "Netflix Subscription",
    id: "#12548799",
    remark: "Shopping",
    date: "12 Jan, 08:30 AM",
    amount: 1200,
    type: "debit"
  },
  {
    description: "Freelance Payment",
    id: "#12548800",
    remark: "Transfer",
    date: "11 Jan, 02:15 PM",
    amount: 3500,
    type: "credit"
  },
  {
    description: "Grocery Shopping",
    id: "#12548801",
    remark: "Shopping",
    date: "09 Jan, 06:45 PM",
    amount: 580,
    type: "debit"
  },
  {
    description: "Salary Deposit",
    id: "#12548802",
    remark: "Transfer",
    date: "01 Jan, 09:00 AM",
    amount: 15000,
    type: "credit"
  },
  {
    description: "Uber Ride",
    id: "#12548803",
    remark: "Service",
    date: "31 Dec, 11:30 PM",
    amount: 85,
    type: "debit"
  },
  {
    description: "Online Course",
    id: "#12548804",
    remark: "Shopping",
    date: "30 Dec, 03:20 PM",
    amount: 450,
    type: "debit"
  },
  {
    description: "Investment Return",
    id: "#12548805",
    remark: "Transfer",
    date: "29 Dec, 10:15 AM",
    amount: 2200,
    type: "credit"
  }
];



const ITEMS_PER_PAGE = 5;

const Transactions = () => {
    const [activeTab, setActiveTab] = useState<TabType>("all")
    const [currentPage, setCurrentPage] = useState(1);

    // Handle tab change with page reset
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // filter tabs
    const filteredTransactions = allTransactions.filter(tr => {
        switch(activeTab){
            case "income" : return tr.type === "credit";
            case "expense" : return tr.type === "debit";
            default: return true;
        }
    })

    // pagination
    const totalPages = Math.ceil(filteredTransactions.length/ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex )


    return (
        <div className="font-poppins space-y-6">
            <DashboardOverview/>

            <section className="space-y-6">
                <TransactionsHeader/>
                <TransactionTabs
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    transactions={paginatedTransactions}
                />
                <TransactionPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </section>
        </div>
    )
}

export default Transactions;
