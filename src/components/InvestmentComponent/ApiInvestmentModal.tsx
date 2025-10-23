import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import type { ApiInvestment } from "@/types/investmentType"
import { Check, TrendingUp } from "lucide-react"
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import type { ApiInvestmentFormData } from "@/schemas/investSchema";


interface ApiInvestmentModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (data: ApiInvestmentFormData) => void
  modalData:  ApiInvestment
  
}

const ApiInvestmentModal = ({isOpen, onClose, onApply, modalData}: ApiInvestmentModalProps) => {
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [showError, setShowError] = useState(false)
    
    const handleApplyClick = () => {
        if (!termsAccepted) {
            setShowError(true)
            return
        }
        setShowError(false)

        //setPaymentData by default
        const formData : ApiInvestmentFormData = {
            investment_id: modalData.id,
            inv_name: modalData.title,
            sub_type: undefined,
            amount: Number(modalData.minimum_amount),
            consent: termsAccepted,
        }
        onApply(formData)
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="font-poppins sm:max-w-2xl p-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">{modalData.title} Benefit</DialogTitle>
                </DialogHeader>
                {/*Main content */}
                <section className="flex flex-col sm:flex-row gap-4 justify-between items-center py-4">
                    <div className="w-full flex flex-col gap-5">
                        <div>
                            <h3 className="font-semibold">Investment Name</h3>
                            <p className="text-megagreen font-semibold">{modalData.company_name}.</p>
                        </div>
                        <div>
                            <h3 className="text-[#D57725] font-semibold">Amount to Raise</h3>
                            <p className="text-megagreen font-semibold">{Number(modalData.amount_needed).toLocaleString()}</p>
                        </div>

                        {/* investment benefit */}
                        <div className="grid grid-cols-2 grid-cols-auto gap-4 text-sm">
                            <div className="p-3 bg-[#D57725] rounded-2xl text-white">
                                <p className="text-xs font-medium">Minimum Investment</p>
                                <p className="font-semibold text-sm">{modalData.minimum_amount.toLocaleString()}K</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg font-semibold text-xs space-y-1">
                                <p className="text-gray-500">ROI <TrendingUp/></p>
                                <p className="font-semibold">{modalData.roi}%</p>
                            </div>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg font-semibold text-xs space-y-1">
                            <p className="text-gray-500">Vesting Period</p>
                            <p className="font-semibold" >{modalData.vesting_period}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg font-semibold text-xs space-y-1">
                            <p className="text-gray-500 ">Description</p>
                            <p className="font-medium text-xs">{modalData.brief_description}
                                {modalData.detail_description}
                            </p>
                        </div>

                        
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms"  checked={termsAccepted}
                                    onCheckedChange={(checked) => {
                                        setTermsAccepted(!!checked)
                                        if(checked) setShowError(false)
                                    }}
                                    className="border-megagreen border-2 rounded-sm data-[state=checked]:border-megagreen data-[state=checked]:bg-megagreen"
                                />
                                <label htmlFor="terms" className="text-xs text-megagreen text-center">
                                    By clicking on Apply, you have agreed with our{' '}
                                    <span className="text-black font-medium">Terms of use & Privacy Policy.</span>
                                </label>
                            </div>
                            {showError && (
                                <p className="text-[10px] text-red-500">
                                    You must accept the terms and conditions to proceed
                                </p>
                            )}
                        </div>
                        <Button 
                            className="bg-megagreen hover:bg-megagreen/95 text-white"
                            onClick={handleApplyClick}
                        >
                            <Check className="w-4 h-4 " /> Apply now
                        </Button>
                    </div>

                    <div className="max-w-[250px] w-full">
                        <img src={modalData.image} alt="" aria-hidden="true" className="object-contain w-full h-50" />
                    </div>

                </section>
            </DialogContent>

        </Dialog>
    )
}

export default ApiInvestmentModal;