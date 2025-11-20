import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import type { SimpleInvestment } from "@/types/investmentType"
import { ArrowUpRight, ChartColumnIncreasing, ChartLine, Check, Clock, Info } from "lucide-react"
import progressline from "@/assets/progress-bar-line.png";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Users, Star,  Layers } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";


interface PooledInvestmentModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  modalData:  SimpleInvestment
}

const PooledInvestmentModal = ({isOpen, onClose, onApply, modalData}: PooledInvestmentModalProps) => {
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [showError, setShowError] = useState(false)
    
    const handleApplyClick = () => {
        if (!termsAccepted) {
            setShowError(true)
            return
        }
        setShowError(false)
        onApply()
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="font-poppins sm:max-w-2xl p-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">{modalData.title} Benefit</DialogTitle>
                    <DialogDescription className="text-megagreen font-semibold">{modalData.basicDescription}</DialogDescription>
                </DialogHeader>
                {/*Main content */}
                <section className="flex flex-col sm:flex-row gap-4 justify-between items-center py-4">
                    <div className="w-full flex flex-col gap-5">
                        {/* investment benefit */}
                        <div className="grid grid-cols-2 grid-cols-auto gap-4 text-sm">
                            <div className="p-3 bg-[#D57725] rounded-2xl text-white">
                                <p className="text-xs font-medium">Minimum Investment</p>
                                <p className="font-semibold text-sm">{modalData.minimum_amount.toLocaleString()}K</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg font-semibold text-xs space-y-1">
                                <p className="text-gray-500">ROI</p>
                                <p className="font-semibold">16–20% p.a</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg font-semibold text-xs space-y-1">
                                <p className="text-gray-500">Lock Up Period</p>
                                <p className="font-semibold" >6–24 months</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg font-semibold text-xs space-y-1">
                                <p className="text-gray-500">Risk Level</p>
                                <p className="font-semibold">{modalData.riskLevel}</p>
                            </div>
                        </div>

                        {/* ROI Range */}
                         <div className="flex flex-col pt-4">
                            <div className="flex items-center justify-between mb-2 text-muted-foreground"> 
                                <div className="flex items-center gap-1 ">
                                    <span><ChartColumnIncreasing size={20} /></span>
                                    <p className="text-sm font-medium">
                                        ROI Range
                                    </p>
                                </div>
                                <span className="font-semibold">{modalData.roi}</span>
                            </div>
                            <img src={progressline} alt="Progress Line" className="w-full mb-2" />
                            <div className="flex flex-wrap gap-2 [&_div]:bg-[#E6F8EE] [&_div]:px-2 [&_div]:py-[2px]  ">
                              <div className="flex items-center gap-1 rounded-xl">
                                    <span><ChartLine className="w-4" /></span>
                                    <p className="text-gray-600 text-xs font-medium">
                                        Growth
                                    </p>
                                </div> 
                                <div className="flex items-center gap-1  rounded-xl">
                                    <span><ArrowUpRight className="w-4" /></span>
                                    <p className="text-gray-600 text-xs font-medium">
                                        Yield
                                    </p>
                                </div> 
                                <div className="flex items-center gap-1 rounded-xl">
                                    <span><Clock className="w-4" /></span>
                                    <p className="text-gray-600 text-xs font-medium">
                                        Medium
                                    </p>
                                </div> 
                            </div>
                            <div className="flex flex-wrap my-3 px-2 border-dashed border-1 border-accent-foreground/15 rounded-full">
                                <div className="flex items-center bg-[#F97316] px-2 my-1 rounded-xl mr-1 gap-1">
                                    <span><Clock className="text-white w-3" /></span>
                                    <p className="text-white text-xs font-medium">Medium Risk</p>
                                </div> 
                                <div className="flex items-center bg-white pl-2 my-1 rounded-lg gap-1">
                                    <span><Info className="text-icon w-3" /></span>
                                    <p className="text-muted-foreground text-xs ">Balanced growth & safety</p>
                                </div> 
                            </div>

                            <Card className="border-none shadow-none p-0">
                                {modalData.poolOption.map((pool) => {
                                    const Icon = pool.icon
                                    return (
                                        <CardContent key={pool.id} className="p-2 border-2 border-icon/50 rounded-2xl flex items-center justify-between flex-wrap gap-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`h-4 w-3 ${pool.color}`}/>
                                                <div className="font-semibold">
                                                    <h3 className="text-xs">{pool.name}</h3>
                                                    <p className="text-[10px] text-muted-foreground">{pool.range}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <div className="text-[10px] bg-[#E6F8EE] px-3 py-1 rounded-full flex gap-1 items-center">
                                                    <Icon className="w-3 h-3" />
                                                    <span className="uppercase font-semibold">roi:{pool.roi}</span>
                                                </div>
                                                <div className="text-[10px] bg-[#E6F8EE] px-2 py-1 rounded-full flex gap-1 items-center">
                                                    {pool.entry === "Entry" ? (
                                                        <Users className="w-3 h-3" />
                                                    ) : pool.entry === "Diversified" ? (
                                                        <Layers className="w-3 h-3" />
                                                    ) : (
                                                        <Star className="w-3 h-3" />
                                                    )}
                                                    {/* <Icon className="w-3 h-3" /> */}
                                                    <span className="font-semibold">{pool.entry}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                )})}
                            </Card>
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

export default PooledInvestmentModal;