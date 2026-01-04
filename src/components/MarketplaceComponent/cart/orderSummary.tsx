import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Cart } from "@/types/cartTypes";
import { useState } from "react";
import { BuyOnCreditModal } from "./buyOnCreditModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ceilTo2DP } from "@/common/utils";

interface OrderSummaryProps {
  cart: Cart;
  walletBalance: number;
  onCheckout: () => void;
  onCheckoutOnCredit: (data: { duration: number; interest: number; total: number }) => void;
  isBuyingOnCredit: boolean;
  onStartBuyOnCredit: () => void;
  onCancelBuyOnCredit: () => void;
  isLoading?: boolean;
}

export function OrderSummary({
  cart,
  walletBalance,
  onCheckout,
  onCheckoutOnCredit,
  isLoading,
  isBuyingOnCredit,
  onStartBuyOnCredit,
  onCancelBuyOnCredit,
}: OrderSummaryProps) {
  const [isOnCreditOpen, setIsOnCreditOpen] = useState(false);
  const [duration, setDuration] = useState<number>(2);

  // ✅ SIMPLE CREDIT CALCULATION
  const calculateCreditDetails = (months: number) => {
    const totalCart = cart?.total || 0;
    
    // Step 1: Initial payment = entire wallet balance
    const initialPayment = walletBalance;
    
    // Step 2: Remaining balance
    const remainingBalance = ceilTo2DP(totalCart - initialPayment);
    
    // Step 3: Interest on remaining balance (7.5%)
    const interestRate = 0.075;
    const interest = ceilTo2DP(remainingBalance * interestRate);
    
    // Step 4: Total to pay in installments
    const installmentTotal = ceilTo2DP(remainingBalance + interest);
    
    // Step 5: Monthly payment
    const monthlyPayment = ceilTo2DP(installmentTotal / months);
    
    // Step 6: Grand total
    const grandTotal = ceilTo2DP(initialPayment + installmentTotal);
    
    return {
      initialPayment,
      remainingBalance,
      interest,
      installmentTotal,
      monthlyPayment,
      payToday: initialPayment,
      grandTotal,
    };
  };

  const creditDetails = calculateCreditDetails(duration);

  // Check if user can afford full payment
  const canAffordFullPayment = walletBalance >= (cart?.total ?? 0);

  return (
    <div className="rounded-lg border border-gray-200 p-4 sticky top-24 h-fit">
      <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

      {/* Wallet Balance Display */}
      {walletBalance < (cart?.total ?? 0) && walletBalance > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Wallet Balance:</span>
            <span className="font-bold text-blue-600">
              ₦{walletBalance.toLocaleString()}
            </span>
          </div>
        </div>
            
      )}

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-green-600">
          <span>Items total</span>
          <span>₦{cart?.subtotal?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT (7.5%)</span>
          <span>₦{cart?.vat?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery fee</span>
          <span>₦{cart?.deliveryFee?.toLocaleString()}</span>
        </div>

        {/* Show credit breakdown when buying on credit */}
        {isBuyingOnCredit && (
          <>
            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between text-blue-600 text-sm">
                <span>Initial Payment (Wallet)</span>
                <span className="font-medium">₦{creditDetails.initialPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Remaining Balance</span>
                <span>₦{creditDetails.remainingBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-orange-600 text-sm">
                <span>Interest (7.5% on balance)</span>
                <span className="font-medium">₦{creditDetails.interest.toLocaleString()}</span>
              </div>
            </div>
          </>
        )}

        <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold">
          <span>{isBuyingOnCredit ? "Pay Today" : "Total"}</span>
          <span className="text-green-600">
            ₦{isBuyingOnCredit ? creditDetails.payToday.toLocaleString() : cart?.total?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* NORMAL CHECKOUT BUTTONS */}
      {!isBuyingOnCredit && (
        <div className="flex flex-col gap-4">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
            onClick={onCheckout}
            disabled={isLoading || walletBalance < (cart?.total ?? 0)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {walletBalance < (cart?.total ?? 0) ? "Insufficient Balance" : `Checkout ₦${cart?.total?.toLocaleString()}`}
          </Button>

          {/* Only show credit option if wallet balance is insufficient */}
          {!canAffordFullPayment && (
            <Button
              className="w-full bg-[#9A9936] hover:bg-[#8A8926] text-white py-6"
              onClick={() => setIsOnCreditOpen(true)}
              disabled={isLoading || walletBalance === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Checkout on credit
            </Button>
          )}

          {walletBalance < (cart?.total ?? 0) && walletBalance > 0 && (
            <p className="text-xs text-center text-orange-600">
              ℹ️ You can pay ₦{walletBalance.toLocaleString()} now and pay the rest in installments
            </p>
          )}
        </div>
      )}

      {/* CREDIT FLOW */}
      {isBuyingOnCredit && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Repayment Duration</Label>
            <Select
              value={String(duration)}
              onValueChange={(value) => setDuration(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="2">2 Months</SelectItem>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="4">4 Months</SelectItem>
                <SelectItem value="5">5 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Show clear payment breakdown */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm space-y-2">
              <p className="font-semibold text-blue-900 mb-2">📋 Payment Plan:</p>
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-700">💰 Pay Today:</span>
                  <span className="font-bold text-green-600">
                    ₦{creditDetails.payToday.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 pl-5">
                  (Your entire wallet balance)
                </p>
              </div>

              <div className="border-t border-blue-200 pt-2 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-700">📅 Monthly Payment:</span>
                  <span className="font-bold text-orange-600">
                    ₦{creditDetails.monthlyPayment.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 pl-5">
                  for {duration} month{duration > 1 ? 's' : ''}
                </p>
              </div>

              <div className="border-t border-blue-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">🔢 Total Amount:</span>
                  <span className="font-bold">
                    ₦{creditDetails.grandTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 pl-5">
                  (Includes ₦{creditDetails.interest.toLocaleString()} interest)
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
            onClick={() => onCheckoutOnCredit({
              duration,
              interest: creditDetails.interest,
              total: creditDetails.grandTotal,
            })}
            disabled={isLoading}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isLoading ? "Processing..." : `Pay ₦${creditDetails.payToday.toLocaleString()} Now`}
          </Button>

          <Button
            variant="ghost"
            className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={onCancelBuyOnCredit}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
        </div>
      )}

      <BuyOnCreditModal
        isOpen={isOnCreditOpen}
        onClose={() => setIsOnCreditOpen(false)}
        onProceed={() => {
          setIsOnCreditOpen(false);
          onStartBuyOnCredit();
        }}
      />
    </div>
  );
}








// import { ArrowLeft, ShoppingCart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import type { Cart } from "@/types/cartTypes";
// import { useState } from "react";
// import { BuyOnCreditModal } from "./buyOnCreditModal";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";

// interface OrderSummaryProps {
//   cart: Cart;
//   walletBalance: number;
//   onCheckout: () => void;
//   onCheckoutOnCredit: (data: { duration: number; interest: number; total: number }) => void;
//   isBuyingOnCredit: boolean;
//   onStartBuyOnCredit: () => void;
//   onCancelBuyOnCredit: () => void;
//   isLoading?: boolean;
// }

// export function OrderSummary({
//   cart,
//   walletBalance,
//   onCheckout,
//   onCheckoutOnCredit,
//   isLoading,
//   isBuyingOnCredit,
//   onStartBuyOnCredit,
//   onCancelBuyOnCredit,
// }: OrderSummaryProps) {
//   const [isOnCreditOpen, setIsOnCreditOpen] = useState(false);
//   const [duration, setDuration] = useState<number>(2);

//   // ✅ CORRECT CREDIT CALCULATION
//   const calculateCreditDetails = (months: number) => {
//     const itemsTotal = cart?.subtotal || 0; // Product price only
//     const vat = cart?.vat || 0;
//     const deliveryFee = cart?.deliveryFee || 0;
    
//     // Step 1: Calculate initial payment (30% of items only)
//     // const initialPercentage = (itemsTotal - walletBalance) /100
//     const initialPayment = walletBalance;
    
//     // Step 2: Remaining balance (items only)
//     const remainingBalance = itemsTotal - (initialPayment - vat - deliveryFee);
    
//     // Step 3: Interest on remaining balance (10%)
//     const interestRate = 0.075;
//     const interest = remainingBalance * interestRate;
    
//     // Step 4: Total to pay in installments (remaining + interest)
//     const installmentTotal = remainingBalance + interest;
    
//     // Step 5: Monthly payment
//     const monthlyPayment = installmentTotal / months;
    
//     // Step 6: Pay today (initial + VAT + delivery)
//     const payToday = initialPayment;
    
//     // Step 7: Grand total
//     const grandTotal = itemsTotal + interest + vat + deliveryFee;
    
//     return {
//       itemsTotal,
//       initialPayment,
//       remainingBalance,
//       interest,
//       installmentTotal,
//       monthlyPayment,
//       payToday,
//       grandTotal,
//       vat,
//       deliveryFee,
//     };
//   };

//   const creditDetails = calculateCreditDetails(duration);

//   return (
//     <div className="rounded-lg border border-gray-200 p-4 sticky top-24 h-fit">
//       <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

//       <div className="space-y-4 mb-6">
//         <div className="flex justify-between text-green-600">
//           <span>Items total</span>
//           <span>₦{cart?.subtotal?.toLocaleString()}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>VAT (7.5%)</span>
//           <span>₦{cart?.vat?.toLocaleString()}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Delivery fee</span>
//           <span>₦{cart?.deliveryFee?.toLocaleString()}</span>
//         </div>

//         {/* Show credit breakdown when buying on credit */}
//         {isBuyingOnCredit && (
//           <>
//             <div className="border-t border-gray-200 pt-3 space-y-2">
//               <div className="flex justify-between text-blue-600 text-sm">
//                 <span>Initial Payment (%) </span>
//                 <span className="font-medium">₦{creditDetails.initialPayment.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-gray-600 text-sm">
//                 <span>Remaining Balance</span>
//                 <span>₦{creditDetails.remainingBalance.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-orange-600 text-sm">
//                 <span>Interest (7.5% on balance)</span>
//                 <span className="font-medium">₦{creditDetails.interest.toLocaleString()}</span>
//               </div>
//             </div>
//           </>
//         )}

//         <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold">
//           <span>{isBuyingOnCredit ? "Pay Today" : "Total"}</span>
//           <span className="text-green-600">
//             ₦{isBuyingOnCredit ? creditDetails.payToday.toLocaleString() : cart?.total?.toLocaleString()}
//           </span>
//         </div>
//       </div>

//       {/* NORMAL CHECKOUT BUTTONS */}
//       {!isBuyingOnCredit && (
//         <div className="flex flex-col gap-4">
//           <Button
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
//             onClick={onCheckout}
//             disabled={isLoading}
//           >
//             <ShoppingCart className="w-4 h-4 mr-2" />
//             Checkout ₦{cart?.total?.toLocaleString()}
//           </Button>

//           <Button
//             className="w-full bg-[#9A9936] hover:bg-[#8A8926] text-white py-6"
//             onClick={() => setIsOnCreditOpen(true)}
//             disabled={isLoading}
//           >
//             <ShoppingCart className="w-4 h-4 mr-2" />
//             Checkout on credit
//           </Button>
//         </div>
//       )}

//       {/* CREDIT FLOW */}
//       {isBuyingOnCredit && (
//         <div className="space-y-4">
//           <div>
//             <Label className="text-sm font-medium mb-2 block">Repayment Duration</Label>
//             <Select
//               value={String(duration)}
//               onValueChange={(value) => setDuration(Number(value))}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select duration" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="1">1 Month</SelectItem>
//                 <SelectItem value="2">2 Months</SelectItem>
//                 <SelectItem value="3">3 Months</SelectItem>
//                 <SelectItem value="4">4 Months</SelectItem>
//                 <SelectItem value="5">5 Months</SelectItem>
//                 <SelectItem value="6">6 Months</SelectItem>
//               </SelectContent>
//             </Select>
            
//             {/* Show clear payment breakdown */}
//             <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm space-y-2">
//               <p className="font-semibold text-blue-900 mb-2">📋 Payment Plan:</p>
              
//               <div className="space-y-1.5">
//                 <div className="flex justify-between">
//                   <span className="text-gray-700">💰 Pay Today:</span>
//                   <span className="font-bold text-green-600">
//                     ₦{creditDetails.payToday.toLocaleString()}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 pl-5">
//                   (30% + VAT + Delivery)
//                 </p>
//               </div>

//               <div className="border-t border-blue-200 pt-2 space-y-1.5">
//                 <div className="flex justify-between">
//                   <span className="text-gray-700">📅 Monthly Payment:</span>
//                   <span className="font-bold text-orange-600">
//                     ₦{creditDetails.monthlyPayment.toLocaleString()}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 pl-5">
//                   for {duration} month{duration > 1 ? 's' : ''}
//                 </p>
//               </div>

//               <div className="border-t border-blue-200 pt-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-700">🔢 Total Amount:</span>
//                   <span className="font-bold">
//                     ₦{creditDetails.grandTotal.toLocaleString()}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 pl-5">
//                   (Includes ₦{creditDetails.interest.toLocaleString()} interest)
//                 </p>
//               </div>
//             </div>
//           </div>

//           <Button
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
//             onClick={() => onCheckoutOnCredit({
//               duration,
//               interest: creditDetails.interest,
//               total: creditDetails.grandTotal,
//             })}
//             disabled={isLoading}
//           >
//             <ShoppingCart className="w-4 h-4 mr-2" />
//             {isLoading ? "Processing..." : `Pay ₦${creditDetails.payToday.toLocaleString()} Now`}
//           </Button>

//           <Button
//             variant="ghost"
//             className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
//             onClick={onCancelBuyOnCredit}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" /> Previous
//           </Button>
//         </div>
//       )}

//       <BuyOnCreditModal
//         isOpen={isOnCreditOpen}
//         onClose={() => setIsOnCreditOpen(false)}
//         onProceed={() => {
//           setIsOnCreditOpen(false);
//           onStartBuyOnCredit();
//         }}
//       />
//     </div>
//   );
// }










// import { ArrowLeft, ShoppingCart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import type { Cart } from "@/types/cartTypes";
// import { useState } from "react";
// import { BuyOnCreditModal } from "./buyOnCreditModal";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";

// interface OrderSummaryProps {
//   cart: Cart;
//   onCheckout: () => void;
//   onCheckoutOnCredit: (data: { duration: number; interest: number; total: number }) => void;
//   isBuyingOnCredit: boolean;
//   onStartBuyOnCredit: () => void;
//   onCancelBuyOnCredit: () => void;
//   isLoading?: boolean;
// }

// export function OrderSummary({
//   cart,
//   onCheckout,
//   onCheckoutOnCredit,
//   isLoading,
//   isBuyingOnCredit,
//   onStartBuyOnCredit,
//   onCancelBuyOnCredit,
// }: OrderSummaryProps) {
//   const [isOnCreditOpen, setIsOnCreditOpen] = useState(false);
//   const [duration, setDuration] = useState<number>(2);

//   // Calculate interest (10% of items total only, no VAT/delivery)
//   const calculateCreditDetails = (months: number) => {
//     const itemsTotal = cart?.subtotal || 0;
//     const interestRate = 0.10; // 10% flat
//     const interest = itemsTotal * interestRate;
//     const totalWithInterest = itemsTotal + interest + (cart?.vat || 0) + (cart?.deliveryFee || 0);
    
//     return {
//       interest,
//       total: totalWithInterest,
//       monthlyPayment: totalWithInterest / months,
//     };
//   };

//   const creditDetails = calculateCreditDetails(duration);

//   return (
//     <div className="rounded-lg border border-gray-200 p-4 sticky top-24 h-fit">
//       <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

//       <div className="space-y-4 mb-6">
//         <div className="flex justify-between text-green-600">
//           <span>Items total</span>
//           <span>₦{cart?.subtotal?.toLocaleString()}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>VAT (7.5%)</span>
//           <span>₦{cart?.vat?.toLocaleString()}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Delivery fee</span>
//           <span>₦{cart?.deliveryFee?.toLocaleString()}</span>
//         </div>

//         {/* Show interest when buying on credit */}
//         {isBuyingOnCredit && (
//           <div className="flex justify-between text-orange-600">
//             <span>Interest Rate (10%)</span>
//             <span>₦{creditDetails.interest.toLocaleString()}</span>
//           </div>
//         )}

//         <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold">
//           <span>Total</span>
//           <span className="text-green-600">
//             ₦{isBuyingOnCredit ? creditDetails.total.toLocaleString() : cart?.total?.toLocaleString()}
//           </span>
//         </div>
//       </div>

//       {/* NORMAL CHECKOUT BUTTONS */}
//       {!isBuyingOnCredit && (
//         <div className="flex flex-col gap-4">
//           <Button
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
//             onClick={onCheckout}
//             disabled={isLoading}
//           >
//             <ShoppingCart className="w-4 h-4 mr-2" />
//             Checkout ₦{cart?.total?.toLocaleString()}
//           </Button>

//           <Button
//             className="w-full bg-[#9A9936] hover:bg-[#8A8926] text-white py-6"
//             onClick={() => setIsOnCreditOpen(true)}
//             disabled={isLoading}
//           >
//             <ShoppingCart className="w-4 h-4 mr-2" />
//             Checkout on credit
//           </Button>
//         </div>
//       )}

//       {/* CREDIT FLOW */}
//       {isBuyingOnCredit && (
//         <div className="space-y-4">
//           <div>
//             <Label className="text-sm font-medium mb-2 block">Duration</Label>
//             <Select
//               value={String(duration)}
//               onValueChange={(value) => setDuration(Number(value))}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select duration" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="1">1 Month</SelectItem>
//                 <SelectItem value="2">2 Months</SelectItem>
//                 <SelectItem value="3">3 Months</SelectItem>
//                 <SelectItem value="4">4 Months</SelectItem>
//                 <SelectItem value="5">5 Months</SelectItem>
//                 <SelectItem value="6">6 Months</SelectItem>
//               </SelectContent>
//             </Select>
            
//             {/* Show payment breakdown */}
//             <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm space-y-1">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Monthly Payment:</span>
//                 <span className="font-semibold">₦{creditDetails.monthlyPayment.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Duration:</span>
//                 <span className="font-semibold">{duration} Month{duration > 1 ? 's' : ''}</span>
//               </div>
//             </div>
//           </div>

//           <Button
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
//             onClick={() => onCheckoutOnCredit({
//               duration,
//               interest: creditDetails.interest,
//               total: creditDetails.total,
//             })}
//             disabled={isLoading}
//           >
//             <ShoppingCart className="w-4 h-4 mr-2" />
//             {isLoading ? "Processing..." : "Proceed"}
//           </Button>

//           <Button
//             variant="ghost"
//             className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
//             onClick={onCancelBuyOnCredit}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" /> Previous
//           </Button>
//         </div>
//       )}

//       <BuyOnCreditModal
//         isOpen={isOnCreditOpen}
//         onClose={() => setIsOnCreditOpen(false)}
//         onProceed={() => {
//           setIsOnCreditOpen(false);
//           onStartBuyOnCredit();
//         }}
//       />
//     </div>
//   );
// }











// import { ArrowLeft, ShoppingCart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import type { Cart } from "@/types/cartTypes";
// import { useState } from "react";
// import { BuyOnCreditModal } from "./buyOnCreditModal";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";

// // import { useNavigate } from "react-router-dom"

// interface OrderSummaryProps {
//   cart: Cart;
//   onCheckout: () => void;
//   onCheckoutOnCredit: (data: { duration: number; interest: number; total: number }) => void;
//   isBuyingOnCredit: boolean;
//   onStartBuyOnCredit: () => void;
//   onCancelBuyOnCredit: () => void;
//   isLoading?: boolean;
// }

// export function OrderSummary({
//   cart,
//   onCheckout,
//   onCheckoutOnCredit,
//   isLoading,
//   isBuyingOnCredit,
//   onStartBuyOnCredit,
//   onCancelBuyOnCredit,
// }: OrderSummaryProps) {
//   const [isOnCreditOpen, setIsOnCreditOpen] = useState(false);
//   const [duration, setDuration] = useState<number>();

//   console.log("OrderSummary cart:", cart);

//   return (
//     <div className=" rounded-lg border border-gray-200 p-4 sticky top-24 h-fit">
//       <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

//       <div className="space-y-4 mb-6">
//         <div className="flex justify-between text-green-600">
//           <span>Items total</span>
//           <span>₦{cart?.subtotal?.toLocaleString()}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>VAT (7.5%)</span>
//           <span>₦{cart?.vat?.toLocaleString()}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Delivery fee</span>
//           <span>₦{cart?.deliveryFee?.toLocaleString()}</span>
//         </div>
//         <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold">
//           <span>Subtotal</span>
//           <span>₦{cart?.total?.toLocaleString()}</span>
//         </div>
//       </div>

//       {/* 🔥 NORMAL CHECKOUT BUTTONS */}
//       {!isBuyingOnCredit && (
//         <div className="flex flex-col gap-4">
//           <Button
//             className="w-full bg-green-600 text-white py-6"
//             onClick={onCheckout}
//             disabled={isLoading}
//           >
//             <ShoppingCart className="w-3 h-3 " />
//             Checkout ₦{cart?.total?.toLocaleString()}
//           </Button>

//           <Button
//             className="w-full bg-[#9A9936] text-white py-6"
//             onClick={() => setIsOnCreditOpen(true)}
//             disabled={isLoading}
//           >
//             <ShoppingCart className="w-3 h-3 " />
//             Checkout on credit
//           </Button>
//         </div>
//       )}

//       {/* 🔥 CREDIT FLOW */}
//       {isBuyingOnCredit && (
//         <div className="space-y-4">
//           <div>
//             <Label className="text-sm font-medium">Duration</Label>
//             <Select
//               defaultValue={String(duration)}
//               onValueChange={(value) => setDuration(Number(value))}
//               value={String(duration)}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="2 Months" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="1">1 Month</SelectItem>
//                 <SelectItem value="2">2 Months</SelectItem>
//                 <SelectItem value="3">3 Months</SelectItem>
//                 <SelectItem value="4">4 Months</SelectItem>
//                 <SelectItem value="5">4 Months</SelectItem>
//                 <SelectItem value="6">6 Months</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <Button
//             className="w-full bg-green-600 text-white py-6"
//             onClick={() => onCheckoutOnCredit(duration)}
//             disabled={isLoading}
//           >
//             <ShoppingCart className="w-3 h-3 " />
//             Proceed
//           </Button>

//           <Button
//             variant="ghost"
//             className="w-full text-megagreen"
//             onClick={onCancelBuyOnCredit}
//           >
//             <ArrowLeft/> Previous
//           </Button>
//         </div>
//       )}

//       {/* <div className="flex flex-col gap-4">
//         <Button
//           className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-md font-semibold"
//           onClick={onCheckout}
//           disabled={isLoading || cart.items.length === 0}
//         >
//           <ShoppingCart className="w-3 h-3 " />
//           Checkout
//           <span className="ml-1">₦{cart?.total?.toLocaleString()}</span>
//         </Button>
        
//         <Button
//           className="w-full bg-[#9A9936] hover:bg-green-700 text-white py-6 text-md font-semibold"
//           onClick={() => setIsOnCreditOpen(true)}
//           disabled={isLoading || cart.items.length === 0}
//         >
//           <ShoppingCart className="w-3 h-3 " />
//           Checkout on credit
//            <span className="ml-1">₦{cart?.total?.toLocaleString()}</span>
//         </Button>
//       </div> */}

//       {/* <BuyOnCreditModal
//         isOpen={isOnCreditOpen}
//         onClose={() => setIsOnCreditOpen(false)}
//         onProceed={onCheckoutOnCredit}
      
//       /> */}

//       <BuyOnCreditModal
//         isOpen={isOnCreditOpen}
//         onClose={() => setIsOnCreditOpen(false)}
//         onProceed={() => {
//           setIsOnCreditOpen(false);
//           onStartBuyOnCredit();
//         }}
//       />
//     </div>
//   );
// }
