import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoanSuccessConfetti from "../../assets/LoanSuccessConfetti.png";
import LoanSuccessIcon from "../../assets/LoanSucessHeader.png";
import { X } from "lucide-react";
import type { CalculateLoan } from "@/types/loanTypes";

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

const LoanSuccessModal = ({
  open,
  onClose,
  onConfirm,
  values,
  loanCalc,
}: LoanSuccessModalProps) => {
console.log("loanCalc in success modal:", loanCalc);
//     function handleReceiptDownload2(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
//         event.preventDefault();
//         // Simulate receipt content
//         const receiptContent = `
// Loan Receipt

// Loan Type: Simple Loan
// Amount: ₦${values.loanAmount?.toLocaleString() || "50,000"}
// Loan Duration: ${values.duration} Months
// Interest Rate: 10%
// Tax: ₦5,000
// Monthly Payment: ₦4,500
// Total Payback Amount: ₦58,000

// Congratulations on your successful loan application!
//         `.trim();

//         const blob = new Blob([receiptContent], { type: "text/plain" });
//         const url = URL.createObjectURL(blob);

//         const link = document.createElement("a");
//         link.href = url;
//         link.download = "loan-receipt.txt";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     }

    const handleReceiptDownload = () => {
    // Create receipt content
    const receiptContent = generateReceiptContent();
    
    // Create a blob with the receipt content
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `loan-receipt-${timestamp}.txt`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  const generateReceiptContent = () => {
    const currentDate = new Date().toLocaleDateString();
    // const totalAmount = calculateTotalPayback(values.loanAmount);
    // const monthlyPayment = calculateMonthlyPayment(values.loanAmount, parseInt(values.duration));
    
    return `
MEGACOOP LOAN RECEIPT
=====================

Date: ${currentDate}
Transaction ID: MC${Date.now()}

LOAN DETAILS:
-------------
Loan Type: ${values.reason || "Simple Loan"}
Loan Amount: ₦${values.loanAmount?.toLocaleString() || "50,000"}
Loan Duration: ${values.duration} Months
Interest Rate: 10%
Repayment Frequency: ${values.repaymentFrequency}
Auto Payment: ${values.autoPayment ? "Enabled" : "Disabled"}

BREAKDOWN:
----------
Principal: ₦${values.loanAmount?.toLocaleString()}
Interest (10.5%): ₦${loanCalc?.totalInterest.toLocaleString() || "0"}
Tax: ₦5,000
Processing Fee: ₦1,500

MONTHLY PAYMENT: ₦${loanCalc?.installment.toLocaleString() || "0"}
TOTAL PAYBACK: ₦${loanCalc?.totalPayable.toLocaleString() || "0"}

TERMS & CONDITIONS:
-------------------
• Loan must be repaid within ${values.duration} months
• Late payments attract additional 2% monthly penalty
• Early repayment is allowed without penalties

Thank you for choosing MegaCoop!

Contact: support@megacoop.com
Phone: +234-800-MEGACOOP
    `.trim();
  };

  // const calculateInterest = (amount: number) => {
  //   return amount * 0.105; // 10.5% interest
  // };

  // const calculateTotalPayback = (amount: number) => {
  //   const interest = calculateInterest(amount);
  //   const tax = 5000;
  //   const processingFee = 1500;
  //   return amount + interest + tax + processingFee;
  // };

  // const calculateMonthlyPayment = (amount: number, duration: number) => {
  //   const total = calculateTotalPayback(amount);
  //   return Math.round(total / duration);
  // };


  return (
    <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="max-w-md  bg-green-100 rounded-2xl p-0   shadow-lg">
              
              {/* Custom Close Button */}
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="absolute right-3 top-4 z-50 h-8 w-8 p-0 rounded-full bg-green-600 hover:bg-white text-gray-600 hover:text-gray-800 border border-gray-300 shadow-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        {/* Header */}
              <DialogHeader
                  className="relative h-18 px-6 py-4  bg-cover bg-center"
                  style={{ backgroundImage: `url('${LoanSuccessConfetti}')` }}
              >
          <DialogTitle  className="absolute inset-x-0 top-[-40px] text-lg font-bold text-gray-800 mx-auto w-fit flex items-center">
            {/* LOAN DETAILS */}
            <img src={LoanSuccessIcon} alt="Success" className="w-22 h-22 mr-2" />
          </DialogTitle>
        </DialogHeader>
        <p className="text-green-800 text-center font-semibold text-lg">
          Congrats! Your loan application was successful.
        </p>
        {/* Green Loan Details Card */}
        <div className="relative bg-green-700 text-white mx-6 shadow-inner">
          {/* Scallop edge (top and bottom) */}
            <div className="absolute inset-x-0 top-[-4px] h-2.5 bg-[radial-gradient(circle,#E6FFE3_4px,transparent_3px)] [background-size:10px_10px]"></div>

          <div className="px-6 py-3">
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
                  ₦{values.loanAmount?.toLocaleString() || "50,000"}
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
                <span>Tax</span>
                <span className="font-semibold">₦5,000</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Payment</span>
                <span className="font-semibold">₦{loanCalc?.installment.toLocaleString() || "0"}</span>
              </div>
              <div className="border-t border-dashed border-white/60 my-3"></div>
              <div className="flex justify-between text-base">
                <span>Total Payback Amount</span>
                <span className="font-bold">₦{loanCalc?.totalPayable.toLocaleString() || "0"}</span>
              </div>
            </div>
          </div>

          {/* <div className="h-3 bg-[radial-gradient(circle,white_2px,transparent_3px)] [background-size:10px_10px]"></div> */}
          <div className="absolute inset-x-0 bottom-[-4px] h-2.5 bg-[radial-gradient(circle,#E6FFE3_4px,transparent_3px)] [background-size:10px_10px]"></div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-6">
  <div className="flex sm:flex-row gap-3 w-full">
    <Button
      onClick={handleReceiptDownload}
      className="bg-green-700 hover:bg-green-800 text-white font-semibold py-5 rounded-md text-sm flex-1"
    >
      Download Receipt
    </Button>
    <Button
      onClick={onConfirm}
      className="font-semibold py-5 rounded-md text-sm flex-1"
      // variant="outline"
    >
      View Loans
    </Button>
  </div>
</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoanSuccessModal;