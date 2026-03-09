import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import bcgImg from "@/assets/coin-wallet-3d.png"
import { formatCurrency } from "@/common/utils"
import type { LoanDetail } from "@/types/loanTypes"


interface LoanDetailModalProps {
    isOpen: boolean
    onClose: () => void
    loan: LoanDetail | null
    isLoading?: boolean
}

const LoanDetailModal = ({isOpen, onClose, loan, isLoading}: LoanDetailModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="font-jakarta sm:max-w-lg p-10 pt-4 pb-20 max-h-[90vh] overflow-y-auto scrollbar-hide"
                    style={{
                        backgroundImage: `url(${bcgImg})`,
                        backgroundPosition: "bottom right",
                        backgroundRepeat: " no-repeat",
                        backgroundSize: "120px",
                    }}
                >
                    <DialogHeader className="py-4 border-b border-icon/30">
                        <DialogTitle className="text-lg font-semibold text-megagreen text-center">Loan Details</DialogTitle>
                    </DialogHeader>

                    {isLoading || !loan ? (
                        <div className="py-8 flex justify-center items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-megagreen"/>
                            <span className="text-sm text-muted-foreground"> Loading details</span>
                        </div>
                    ): (
                        <div className="py-4 space-y-3 text-xs">
                        <div>
                            <p className="text-muted-foreground">Loan Purpose</p>
                            <p className="font-medium">{loan.purpose} </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-medium text-megagreen">{formatCurrency(Number(loan.loan_amount))}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Tax</p>
                            <p className="font-medium text-megagreen">{formatCurrency(Number(loan.tax))}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Payback</p>
                            <p className="font-medium text-megagreen">{formatCurrency((Number(loan.total_payback)))}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Monthly Repayment</p>
                            <p className="font-medium text-megagreen">{formatCurrency(Number(loan.monthly_repayment))}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Next Repayment Date</p>
                            <p className="font-medium">{loan.next_repayment_date}</p>
                        </div>
                        {/* <div>
                            <p className="text-muted-foreground">Transaction Date</p>
                            <p className="font-medium">{formatDate(loan.created_at)}</p>
                        </div> */}
                        
                        <div className="space-y-2">
                            <p className="text-muted-foreground">Status</p>
                            <span className={`font-medium py-1 px-3 rounded-2xl ${
                                loan.status === "approved" ? "bg-megagreen/20 text-megagreen" :
                                loan.status==="pending" ? "bg-megaorange/30 text-megaorange"  : 
                                "bg-gray-300 text-gray-600"}`}>
                                {loan.status === "approved" ? "Successful": loan.status}
                            </span>
                        </div>

                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default LoanDetailModal;