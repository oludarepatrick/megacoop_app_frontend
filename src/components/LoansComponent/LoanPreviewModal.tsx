import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CalculateLoan } from "@/types/loanTypes";


type LoanPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  values: {
    reason: string;
    loanAmount: number;
    duration: string;
    repaymentFrequency: string;
    autoPayment: boolean;
  };
  loanCalc: CalculateLoan | null;
};

const LoanPreviewModal = ({
  open,
  onClose,
  onConfirm,
  values,
  loanCalc,
}: LoanPreviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden shadow-lg">
        {/* Header */}
        <DialogHeader className="border-b border-gray-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold text-gray-800">
            LOAN DETAILS
          </DialogTitle>
        </DialogHeader>

        {/* Green Loan Details Card */}
        <div className="relative bg-green-700 text-white mx-6 mt-5  shadow-inner">
          {/* Scallop edge (top and bottom) */}
          <div className="absolute inset-x-0 top-[-4px] h-2.5 bg-[radial-gradient(circle,white_4px,transparent_3px)] [background-size:10px_10px]"></div>

          <div className="px-6 py-5">
            <h3 className="font-semibold text-lg mb-2">Loan Details</h3>
            <div className="border-t border-dashed border-white/60 mb-4"></div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Loan Type</span>
                <span className="font-semibold">Simple Loan</span>
              </div>
              <div className="flex justify-between">
                <span>Amount</span>
                <span className="font-semibold">
                  ₦{values.loanAmount?.toLocaleString() ?? "0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Loan Duration</span>
                <span className="font-semibold">{values.duration} Months</span>
              </div>
              <div className="flex justify-between">
                <span>Interest Rate</span>
                <span className="font-semibold">10.5%</span>
              </div>
              <div className="flex justify-between">
                <span>Total Interest</span>
                <span className="font-semibold">{loanCalc?.totalInterest.toLocaleString() ?? "0"}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-semibold">₦5,000</span>
              </div>
              {values.repaymentFrequency === "monthly" && (
                <div className="flex justify-between">
                  <span>Monthly Repayment({loanCalc?.numberOfPayments})</span>
                  <span className="font-semibold">
                    ₦{loanCalc?.installment.toLocaleString() ?? "0"}
                  </span>
                </div>
              )}
              {values.repaymentFrequency === "weekly" && (
                <div className="flex justify-between">
                  <span>Weekly Repayment({loanCalc?.numberOfPayments})</span>
                  <span className="font-semibold">
                    ₦{loanCalc?.installment.toLocaleString() ?? "0"}
                  </span>
                </div>
              )}

              {values.repaymentFrequency === "quarterly" && (
                <div className="flex justify-between">
                  <span>Quarterly Repayment({loanCalc?.numberOfPayments})</span>
                  <span className="font-semibold">
                    ₦{loanCalc?.installment.toLocaleString() ?? "0"}
                  </span>
                </div>
              )}
              <div className="border-t border-dashed border-white/60 my-3"></div>
              <div className="flex justify-between text-base">
                <span>Total Payback Amount</span>
                <span className="font-bold">₦{loanCalc?.totalPayable.toLocaleString() ?? "0"}</span>
              </div>
            </div>
          </div>

          {/* <div className="h-3 bg-[radial-gradient(circle,white_2px,transparent_3px)] [background-size:10px_10px]"></div> */}
          <div className="absolute inset-x-0 bottom-[-4px] h-2.5 bg-[radial-gradient(circle,white_4px,transparent_3px)] [background-size:10px_10px]"></div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-6 pt-4">
          <Button
            onClick={onConfirm}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-6 rounded-md text-lg"
          >
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoanPreviewModal;
