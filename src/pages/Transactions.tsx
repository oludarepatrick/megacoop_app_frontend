import DashboardOverview from "@/components/DashboardComponent/DashboardOverview";
import TransactionsHeader from "@/components/TransactionComponent/TransactionHeader";
import TransactionPagination from "@/components/TransactionComponent/TransactionPagination";
import TransactionTabs from "@/components/TransactionComponent/TransactionTabs";
import { useWalletTransaction } from "@/hooks/useWalletTransaction";
import { useState } from "react";


export type TabType = "all" | "income" | "expense";

const ITEMS_PER_PAGE = 10;

const Transactions = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const {data:allTransactions = [], isLoading} = useWalletTransaction();
  console.log(allTransactions)


  // Handle tab change with page reset
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // filter tabs
  const filteredTransactions = allTransactions.filter((tr) => {
    switch (activeTab) {
      case "income":
        return tr.type === "credit";
      case "expense":
        return tr.type === "debit";
      default:
        return true;
    }
  });

  // pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex
  );
  return (
    <div className="font-poppins">
      <DashboardOverview />
      <section className="grid grid-cols-1 gap-6 pt-8">
        {/* <div className="flex flex-col md:flex-row gap-12 pt-2 bg-green-400"> */}
        <TransactionsHeader />
        <TransactionTabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          transactions={paginatedTransactions}
          isLoading={isLoading}
        />
        <TransactionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </section>
    </div>
  );
};

export default Transactions;
