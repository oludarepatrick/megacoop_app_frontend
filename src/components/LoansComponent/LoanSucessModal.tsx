import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, File, Image } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDownloadReceipt } from "@/hooks/useTransactionReceipt";
import { useRef } from "react";
import Logo from "/Logo.svg";
import coffetiImg from "@/assets/coffetti-img.png";
import receiptBg from "@/assets/receipt-bcg.png";
import type { CalculateLoan } from "@/types/loanTypes";
import { formatCurrency } from "@/common/utils";

type LoanSuccessModalProps = {
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

const frequencyLabel = (freq: string) => {
  switch (freq) {
    case "week": return "Weekly";
    case "month": return "Monthly";
    case "quarter": return "Quarterly";
    default: return freq;
  }
};

const LoanSuccessModal = ({
  open,
  onClose,
  onConfirm,
  values,
  loanCalc,
}: LoanSuccessModalProps) => {
  const receiptRef = useRef<HTMLDivElement>(null!) as React.RefObject<HTMLDivElement>;
  const { downloadAsPDF, downloadAsImage } = useDownloadReceipt(receiptRef, `loan-receipt-${Date.now()}`);


  const ReceiptContent = (
    <div className="pb-4">
      <DialogHeader className="text-center px-4 py-4 rounded-lg bg-gradient-to-b from-[#E6FFE3] to-white">
        <div
          className="flex justify-center relative pb-4"
          style={{
            backgroundImage: `url(${coffetiImg})`,
            backgroundPosition: "bottom center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <img src={Logo} alt="megacoop-logo" className="w-40 relative z-10" crossOrigin="anonymous" />
        </div>
      </DialogHeader>

      <p className="text-green-800 text-center font-semibold text-base py-3">
        Congrats! Your loan application was successful.
      </p>

      <div
        className="relative sm:mx-8"
        style={{
          backgroundImage: `url(${receiptBg})`,
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="text-white p-6">
          <h3 className="font-semibold text-center text-sm pb-3 border-b-2 border-dashed loose-dash">
            Loan Receipt
          </h3>
          <div className="py-4 max-w-[307px] mx-auto [&_div]:grid [&_div]:grid-cols-2 space-y-3 text-xs">
            <h3 className="text-xl font-semibold text-center">
              {formatCurrency(values?.loanAmount ?? 0)}
            </h3>
            <div><h4>Loan Type:</h4><span className="font-medium">{values.reason || "Simple Loan"}</span></div>
            <div><h4>Duration:</h4><span className="font-medium">{values.duration} Months</span></div>
            <div><h4>Interest Rate:</h4><span className="font-medium">15%</span></div>
            <div><h4>Total Interest:</h4><span className="font-medium">{formatCurrency(loanCalc?.totalInterest ?? 0)}</span></div>
            <div><h4>Tax:</h4><span className="font-medium">{formatCurrency(loanCalc?.taxAmount ?? 0)}</span></div>
            <div>
              <h4>Repayment:</h4>
              <span className="font-medium">{frequencyLabel(values.repaymentFrequency)} ({loanCalc?.numberOfPayments ?? 0}x)</span>
            </div>
            <div><h4>Installment:</h4><span className="font-medium">{formatCurrency(loanCalc?.installment ?? 0)}</span></div>
            <div><h4>Auto Payment:</h4><span className="font-medium">{values.autoPayment ? "Enabled" : "Disabled"}</span></div>
            <hr className="loose-dash my-8" />
            <div><h4>Total Payback:</h4><span className="font-medium">{formatCurrency(loanCalc?.totalPayable ?? 0)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {open && (
        <div
          ref={receiptRef}
          className="font-poppins bg-white"
          style={{
            position: "fixed",
            top: "-9999px",   // off-screen but still in the DOM and painted
            left: "-9999px",
            width: "448px",   // match sm:max-w-md
            zIndex: -1,
          }}
        >
          {ReceiptContent}
          <p>Thank you for choosing MegaCoop!</p>
        </div>
      )}
    
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="font-poppins sm:max-w-md p-0 pb-10 overflow-y-auto max-h-[90vh] scrollbar-hide">
        {ReceiptContent}
        {/* <div ref={receiptRef} className="pb-4">
          <DialogHeader className="text-center px-4 py-4 rounded-lg bg-gradient-to-b from-[#E6FFE3] to-white">
            <div
              className="flex justify-center relative pb-4"
              style={{
                backgroundImage: `url(${coffetiImg})`,
                backgroundPosition: "bottom center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <img
                src={Logo}
                alt="megacoop-logo"
                className="w-40 relative z-10"
                crossOrigin="anonymous"
              />
            </div>
          </DialogHeader>

          <p className="text-green-800 text-center font-semibold text-base py-3">
            Congrats! Your loan application was successful.
          </p>

          <div
            className="relative sm:mx-8"
            style={{
              backgroundImage: `url(${receiptBg})`,
              backgroundPosition: "top",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="text-white p-6">
              <h3 className="font-semibold text-center text-sm pb-3 border-b-2 border-dashed loose-dash">
                Loan Receipt
              </h3>

              <div className="py-4 max-w-[307px] mx-auto [&_div]:grid [&_div]:grid-cols-2 space-y-3 text-xs">
                <h3 className="text-xl font-semibold text-center">
                  ₦{values.loanAmount?.toLocaleString() ?? "0"}
                </h3>
                <div>
                  <h4>Loan Type:</h4>
                  <span className="font-medium">{values.reason || "Simple Loan"}</span>
                </div>
                <div>
                  <h4>Duration:</h4>
                  <span className="font-medium">{values.duration} Months</span>
                </div>
                <div>
                  <h4>Interest Rate:</h4>
                  <span className="font-medium">15%</span>
                </div>
                <div>
                  <h4>Total Interest:</h4>
                  <span className="font-medium">₦{loanCalc?.totalInterest?.toLocaleString() ?? "0"}</span>
                </div>
                <div>
                  <h4>Tax:</h4>
                  <span className="font-medium">₦{loanCalc?.taxAmount?.toLocaleString() ?? "0"}</span>
                </div>
                <div>
                  <h4>Repayment:</h4>
                  <span className="font-medium">
                    {frequencyLabel(values.repaymentFrequency)} ({loanCalc?.numberOfPayments ?? 0}x)
                  </span>
                </div>
                <div>
                  <h4>Installment:</h4>
                  <span className="font-medium">₦{loanCalc?.installment?.toLocaleString() ?? "0"}</span>
                </div>
                <div>
                  <h4>Auto Payment:</h4>
                  <span className="font-medium">{values.autoPayment ? "Enabled" : "Disabled"}</span>
                </div>

                <hr className="loose-dash my-8" />

                <div>
                  <h4>Total Payback:</h4>
                  <span className="font-medium">₦{loanCalc?.totalPayable?.toLocaleString() ?? "0"}</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="flex items-center justify-center flex-wrap gap-4 mx-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-megagreen flex-1 font-normal">
                <Download /> Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-w-[180px]">
              <DropdownMenuItem onClick={downloadAsPDF}>
                <File className="text-megagreen" /> Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadAsImage("png")}>
                <Image className="text-megagreen" /> Download as Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={onConfirm}
            variant="outline"
            className="border-megagreen text-megagreen flex-1"
          >
            View Loans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
};

export default LoanSuccessModal;
