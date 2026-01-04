import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, AlertCircle, BarChart3, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchCreditLimit, fetchLoans } from "@/services/loanService";
import { formatCurrency, formatDate } from "@/common/utils";
import LoanModal from "@/components/LoansComponent/ApplyLoanModal";
import PageLoader from "@/components/PageLoader";
import type { Loan } from "@/types/loanTypes";
import type { CreditLimit } from "@/types/loanTypes";


export default function LoanDashboard() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [maxLimit, setMaxLimit] = useState<number>(0)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [openDropdown, setOpenDropdown] = useState<boolean>(false)
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const itemsPerPage = 5

  const navigate = useNavigate();

  // --- Queries with dummy fallback using || so you can remove the fallback when API is ready
  const { data: creditLimitData, isLoading: creditLoading } = useQuery({
    queryKey: ["credit-limit"],
    queryFn: async () => {
      try {
        const v = await fetchCreditLimit();
        console.log("Fetched credit limit:", v);
        return v;
      } catch {
        // fallback dummy data
        return {
          credit_limit: 0,
          remaining_limit: 0,
          total_borrowed: 0,
          total_savings: 0,
          utilization_percentage: 0,
        } as CreditLimit;
      }
    },
  });

  const { data: loansData, isLoading: loansLoading } = useQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      try {
        const v = await fetchLoans();
        return v;
      } catch {
        return [] ;
      }
    },
  });

  // 👇 whenever loansData or creditLimitData changes, sync it to local state
  useEffect(() => {
    if (loansData) {
      setLoans(loansData);
    }
    if (creditLimitData) {
      setMaxLimit(creditLimitData.credit_limit);
    }

  }, [loansData, creditLimitData]);

  // for dummy calculation of used limit
  // const usedLimit = useMemo(() => {
  //   const total = loans
  //     .filter((l) => ["active", "overdue", "disbursed", "pending", "paid"].includes(l.status))
  //     .reduce((sum, l) => sum + l.amount, 0)
  //   return Math.min(total, maxLimit)
  // }, [loans, maxLimit])

  console.log("Used limit:", maxLimit);

  // const remainingLimit = Math.max(maxLimit - usedLimit, 0)

  const filteredLoans = useMemo(() => {
    if (activeFilter === "all") return loans
    return loans.filter((l) => l.status === activeFilter)
  }, [loans, activeFilter])

  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage)
  const paginatedLoans = filteredLoans.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const headingMap: Record<string, string> = {
    all: "All Loans",
    disbursed: "Disbursed Loans",
    active: "Active Loans",
    overdue: "Overdue Loans",
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* LEFT SIDE - CARDS SECTION (2/3 on desktop) */}
        <div className="flex-1 md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Max Limit */}
            <Card className="bg-emerald-50 border-emerald-100 flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                  <DollarSign className="text-emerald-500" size={18} />
                  Maximum Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-800">
                  {creditLoading ? "Loading..." : formatCurrency(maxLimit)}
                </p>
              </CardContent>
            </Card>

            {/* Remaining Limit */}
            {creditLimitData && creditLimitData.remaining_limit <= 1000 ? (
            <Card className="bg-red-50 border-red-100 flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                    <AlertCircle className="text-red-500" size={18} />
                    Remaining Limit
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-700">
                  {/* {formatCurrency(remainingLimit)} */}
                  {creditLoading ? "Loading..." : formatCurrency(creditLimitData?.remaining_limit ?? 2000)}
                </p>
              </CardContent>
            </Card>
            ) : (
            <Card className="bg-blue-50 border-blue-100 flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                    <DollarSign className="text-blue-500" size={18} />
                    Remaining Limit
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-800">
                  {/* {formatCurrency(remainingLimit)} */}
                  {creditLoading ? "Loading..." : formatCurrency(creditLimitData?.remaining_limit ?? 2000)}
                </p>
              </CardContent>
            </Card>
                )}
          </div>

          {/* SECOND ROW (Used Limit + Apply Button) */}
          <div className="mt-4">
            <Card className="border bg-inherit shadow-sm flex flex-col justify-center">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-4 gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium">
                      Used Limit Info
                    </p>
                    <p className="text-2xl font-semibold">
                      {/* {formatCurrency(usedLimit)} */}
                      {creditLoading ? "Loading..." : formatCurrency((creditLimitData?.credit_limit ?? 0) - (creditLimitData?.remaining_limit ?? 0))}
                    </p>
                  </div>
                </div>
                <Button
                  // disabled={remainingLimit <= 0}
                  className={cn(
                    "bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold w-full sm:w-auto cursor-pointer",
                    (creditLimitData?.remaining_limit ?? 0) <= 0 && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => setIsLoanModalOpen(true)}
                >
                  Apply
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/3">
          <Card className="border shadow-sm">
            <CardHeader
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex flex-row items-center justify-between cursor-pointer pb-2"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="text-emerald-600" size={18} />
                <CardTitle className="text-sm font-medium">Repayment</CardTitle>
              </div>
              <ChevronDown
                size={18}
                className={cn(
                  "transition-transform",
                  openDropdown && "rotate-180"
                )}
              />
            </CardHeader>
            {openDropdown && (
              <CardContent className="space-y-2">
                {["all", "disbursed", "active", "overdue"].map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    onClick={() => {
                      setActiveFilter(filter);
                      setPage(1);
                    }}
                    className={cn(
                      "w-full justify-start",
                      activeFilter === filter
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "text-gray-700"
                    )}
                  >
                    {filter === "all"
                      ? "All Loans"
                      : filter.charAt(0).toUpperCase() +
                      filter.slice(1) +
                      " Loan"}
                  </Button>
                ))}
              </CardContent>
            )}
          </Card>
        </div>
      </div>


      {/* --- TABLE SECTION --- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{headingMap[activeFilter]}</h2>

        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Repayment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead >Progress</TableHead>
                <TableHead className="text-center" >Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loansLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    <PageLoader />
                    Loading loans...
                  </TableCell>
                </TableRow>
              ) : paginatedLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No loans found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell>{loan.name}</TableCell>
                    <TableCell>₦{loan.amount.toLocaleString()}</TableCell>
                    {/* <TableCell>{loan.repaymentDate}</TableCell> */}
                    <TableCell>{formatDate(loan.next_repayment_date)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex px-3 py-1 rounded-full text-xs font-medium",
                          loan.status === "overdue"
                            ? "bg-red-50 text-red-600"
                            : loan.status === "paid"
                              ? "bg-emerald-50 text-emerald-600"
                              : loan.status === "pending"
                                ? "bg-yellow-50 text-yellow-600"
                                : loan.status === "active"
                                  ? "bg-blue-50 text-blue-600"
                                  : loan.status === "disbursed"
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </TableCell>

                    {/* Visual progress meter */}
                    <TableCell className="text-right">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full",
                            loan.status === "paid"
                              ? "bg-emerald-600 w-full"
                              : loan.status === "pending"
                                ? "bg-yellow-500 w-1/2"
                                : loan.status === "overdue"
                                  ? "bg-red-500 w-[80%]"
                                  : loan.status === "active"
                                    ? "bg-blue-500 w-2/3"
                                    : loan.status === "disbursed"
                                      ? "bg-indigo-500 w-1/4"
                                      : "bg-gray-400 w-1/3"
                          )}
                        ></div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center" >
                      <Button variant="link" className="text-emerald-600" onClick={() => navigate(`/loans/${loan.id}`)}>
                        More details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      {/* Apply Loan Modal */}
      <LoanModal open={isLoanModalOpen} onClose={() => setIsLoanModalOpen(false)} />
    </div>
  )
}
