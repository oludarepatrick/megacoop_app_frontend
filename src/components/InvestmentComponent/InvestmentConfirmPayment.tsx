import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import walletBcg from "../../assets/wallet-background.png"
import starCoin1 from "../../assets/star-coin-1.png"
import starCoin2 from "../../assets/star-coin-2.png"
import { Label } from "../ui/label"
import { useAuthStore } from "@/store/authStore"
import type { PooledFormData, HousingFormData } from "@/schemas/investSchema"
import warningIcon from "@/assets/warning-icon.svg"
import { CancelModal } from "./investmentSecondaryModals"
import { useState } from "react"

interface InvestmentConfirmPaymentProps {
    isOpen: boolean
    onClose: () => void
    onCancel: () => void
    onSuccess: () => void
    onFailure: () => void
    investData: PooledFormData | HousingFormData
    amount: number
}

const InvestmentConfirmPayment = ({ isOpen, onCancel, onClose, onSuccess, onFailure, investData, amount }: InvestmentConfirmPaymentProps) => {
    const { user } = useAuthStore()
    const [isProcessing, setIsProcessing] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    
    const investmentAmount = amount
    
    // Simulate payment processing
    const processPayment = async () => {
        setIsProcessing(true)
        
        try {
            // TODO: Replace with actual payment API call
            const paymentData = {
                investmentType: investData.investmentType,
                amount: investmentAmount,
                userId: user?.id
            }
            
            console.log('Processing payment:', paymentData)
            
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // Simulate 90% success rate for demo
            const isSuccess = Math.random() > 0.1
            
            if (isSuccess) {
                onClose()
                onSuccess()
            } else {
                onClose()
                onFailure()
            }
        } catch (error) {
            console.error('Payment failed:', error)
            onClose()
            onFailure()
        } finally {
            setIsProcessing(false)
        }
    }
    
    const handleCancelConfirmation = () => {
        setShowCancelModal(false)
        onClose()
        onCancel()
    }
    
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
                    <DialogTitle className="text-[24px] font-semibold">Payment</DialogTitle>
                    <DialogDescription className="text-black text-center text-xs">
                        pay as you invest today!
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 flex flex-col gap-4 sm:px-18">
                    <div className="space-y-4 flex justify-center flex-col items-center text-center">
                        <Label className="font-normal text-muted-foreground">Amount</Label>
                        <Button type="button" variant="outline" className="bg-[#14AB550D] text-4xl p-8">
                            {formatAmount(investmentAmount)}
                        </Button>
                    </div>
                    <div className="">
                        <div className=" w-full text-center flex item-center justify-center">
                            <img src={warningIcon} alt="warning-icon" />
                        </div>
                        <p className="text-sm font-bold">
                            Initiating Transaction! Understand that {investmentAmount} 
                            Will be Deducted Automatically from your Account. Click on 
                            Pay now to Continue or Cancel to Terminate the Transaction.
                        </p>
                    </div>
                    
                    <Button 
                        onClick={processPayment}
                        disabled={isProcessing}
                        className="bg-gradient-to-t from-[#105D38] to-[#1BE572] disabled:opacity-50"
                    >
                        {isProcessing ? 'Processing...' : 'Pay Now'}
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        onClick={() => setShowCancelModal(true)}
                        disabled={isProcessing}
                        className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                        Cancel Transaction
                    </Button>
                    
                    {showCancelModal && (
                        <CancelModal 
                            onClose={() => setShowCancelModal(false)}
                            onCancel={handleCancelConfirmation}
                        />
                    )}
                    
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default InvestmentConfirmPayment
