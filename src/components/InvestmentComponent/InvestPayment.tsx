import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import walletBcg from "../../assets/wallet-background.png"
import savingIcon from "../../assets/saving-wallet-icon.svg"
import bankCardIcon from "../../assets/bank-card-icon.svg"
import starCoin1 from "../../assets/star-coin-1.png"
import starCoin2 from "../../assets/star-coin-2.png"
import { Label } from "../ui/label"
import { useState, useEffect,
    //  useMemo 
} from "react"
import checkIcon from "../../assets/checkmark-icon.svg"
import { ChevronRight, Plus, Minus } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import type { 
    // PooledFormData, HousingFormData, ApiInvestmentFormData, 
    InvestPaymentFormData } from "@/schemas/investSchema"
import { useInvestmentPayment } from "@/hooks/useInvestmentPayment"
import { useUserWallet } from "@/hooks/useAuth"

interface InvestPaymentProps {
    isOpen: boolean
    onClose: () => void
    onProceedToConfirmation: (data: InvestPaymentFormData) => void
    investData:InvestPaymentFormData
}

const InvestPayment = ({ isOpen, onClose, onProceedToConfirmation, investData }: InvestPaymentProps) => {
    // const { user } = useAuthStore()
    const {data} = useUserWallet()
    const walletBalance = Number(data?.balance) || 0;
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null)

    const {
    amount: investmentAmount,
    error: amountError,
    isEligible,
    increment: incrementAmount,
    decrement: decrementAmount,
    handleChange: handleAmountChange,
    minimumAmount,
    validateAmount
    } = useInvestmentPayment(investData, walletBalance);
    
    useEffect(() => {
        if (isEligible) {
            setPaymentMethod("wallet")
        } else {
            setPaymentMethod("bank")
        }
    }, [isEligible])

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount).replace('NGN', '₦')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-0 pb-10 font-poppins overflow-y-auto max-h-[90vh] scrollbar-hide"
                style={{
                    backgroundImage: `url(${starCoin1}), url(${starCoin2})`,
                    backgroundPosition: "right center, bottom left",
                    backgroundRepeat: "no-repeat, no-repeat",
                    backgroundSize: "30px, 40px",
                }}
            >
                <DialogHeader className="rounded-lg bg-wallet p-8 sm:px-20 gap-0 items-center"
                    style={{
                        backgroundImage: `linear-gradient(to bottom right, #F7F7F7, #E4FBE1, #D1FFCC), url(${walletBcg})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom left",
                        backgroundSize: "contain",
                        backgroundBlendMode: "darken",
                    }}
                >
                    <DialogTitle className="text-[24px] font-semibold">Add a Payment Method</DialogTitle>
                    <DialogDescription className="text-black text-center text-xs">
                        Your Wallet Balance is <span className={`font-bold ${isEligible ? 'text-green-600' : 'text-red-600'}`}>
                            {isEligible ? 'Eligible' : 'Not Eligible'}
                        </span> for this Transaction {!isEligible && <strong>Please Top Up Your Account to Continue!</strong>}
                    </DialogDescription>
                </DialogHeader>
                <form className="p-6 flex flex-col gap-4 sm:px-18">
                    <div className="space-y-4 flex justify-center flex-col items-center text-center">
                        <Label className="font-normal text-muted-foreground">Input Amount</Label>
                        <div className="flex items-center gap-4">
                            <Button 
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={decrementAmount}
                                disabled={investmentAmount <= minimumAmount}
                                className="h-12 w-12 rounded-full"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            
                            <div className="flex flex-col items-center">
                                <Input
                                    type="text"
                                    value={investmentAmount.toLocaleString()}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    className="text-center !text-4xl bg-[#14AB550D] border-2 border-none focus-visible:ring-0 w-48 h-16"
                                />
                            </div>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={incrementAmount}
                                className="h-12 w-12 rounded-full"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {amountError && (
                            <p className="text-sm text-red-500">{amountError}</p>
                        )}
                    </div>
                    <div className="space-y-4">
                        <Label className="font-normal">Select Payment to proceed</Label>
                        <div className="flex flex-wrap gap-4">
                            <Card className={`relative p-0 w-full rounded-lg cursor-pointer transition-all ${
                                paymentMethod === "wallet" ? "ring-2 ring-megagreen bg-[#F5FFF9]" : ""
                                } ${!isEligible ? "opacity-50 cursor-not-allowed" : ""}`}  
                                onClick={() => isEligible && setPaymentMethod("wallet")}
                            >
                                <CardContent className="flex p-4 gap-4">
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-[#E6FFE3]`}>
                                        <img src={savingIcon} alt="" aria-hidden="true" className="" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-xs">Wallet balance</h3>
                                        <p className={`font-semibold text-lg ${isEligible ? 'text-megagreen' : 'text-red-500'}`}>
                                            {formatAmount(walletBalance)}
                                        </p>
                                    </div>
                                </CardContent>
                                {paymentMethod === "wallet" && <img src={checkIcon} alt="" aria-hidden="true" className="absolute -right-1 -top-2" />}
                            </Card>
                            <Card className={`relative p-0 w-full rounded-lg cursor-pointer transition-all ${
                                paymentMethod === "bank" ? "ring-2 ring-megagreen bg-[#F5FFF9]" : ""
                                }`}  onClick={() => setPaymentMethod("bank")}
                            >
                                <CardContent className="flex p-4 gap-4">
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-[#FFF5D9]`}>
                                        <img src={bankCardIcon} alt="" aria-hidden="true" className="" />
                                    </div>
                                    <div className="text-[11px] space-y-1">
                                        <h3 className="font-medium ">Bank</h3>
                                        <p className="text-megagreen">GTBank</p>
                                    </div>
                                    <div className="text-[11px] space-y-1">
                                        <h3 className="font-medium">Account Number</h3>
                                        <p className="text-megagreen">2034567804</p>
                                    </div>
                                    <div className="text-[11px] space-y-1">
                                        <h3 className="font-medium">Account Name</h3>
                                        <p className="text-megagreen">Williams</p>
                                    </div>
                                </CardContent>
                                {paymentMethod === "bank" && <img src={checkIcon} alt="" aria-hidden="true" className="absolute -right-1 -top-2" />}
                            </Card>
                        </div>
                    </div>
                    <Button 
                        onClick={(e) => {
                            e.preventDefault()
                            
                            if (!validateAmount(investmentAmount)) {
                                return
                            }
                            console.log('Proceeding to confirmation:', {
                                investData,
                                amount: investmentAmount,
                                paymentMethod,
                                minimumAmount
                            })
                            
                            // Don't call onClose() here - let the parent handle modal transitions
                            onProceedToConfirmation({...investData, amount: investmentAmount})
                        }}
                        disabled={!paymentMethod || !!amountError || investmentAmount < minimumAmount || paymentMethod==="bank"}
                        className="bg-gradient-to-t from-[#105D38] to-[#1BE572] disabled:opacity-50"
                    >
                        Proceed<ChevronRight/>
                    </Button>
                    
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default InvestPayment
