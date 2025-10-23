import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import type { DetailedInvestment} from "@/types/investmentType"
import { Banknote, Building2, Calendar, Check, House, Key, Play, TrendingUp } from "lucide-react"
import { Card, CardContent, } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { useState } from "react";
// import { Badge } from "../ui/badge";


interface HousingInvestmentModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  modalData: DetailedInvestment
}

const HousingInvestmentModal = ({isOpen, onClose, onApply, modalData}: HousingInvestmentModalProps) => {
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
            <DialogContent className="font-poppins sm:max-w-[800px] p-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">{modalData.title} Benefits</DialogTitle>
                </DialogHeader>
                {/*Main content */}
                <section className="flex flex-col sm:flex-row gap-4 justify-between items-center py-4">
                    <div className="w-full flex flex-col gap-5">
                        <div className="flex items-center justify-between w-full flex-wrap gap-y-2">
                            <h4 className="text-sm font-semibold">{modalData.title}</h4> 
                            <div className="flex items-center bg-[#F8C060] rounded-full px-2 py-1 gap-1">
                                <Banknote className="w-4 h-4" />
                                <p className="text-gray-600 text-xs font-medium">Min: 500K</p>
                            </div>
                        </div>
                        {/* investment benefits */}
                        <div className="flex flex-wrap items-center gap-2 text-sm font-medium ">
                            <div className="px-2 py-1 rounded-md border border-green-200 text-xs flex gap-2 items-center">
                                <TrendingUp className="w-3 h-3 text-megagreen" />
                                {modalData.roi}
                            </div>
                            <div className="px-2 py-1 rounded-md border border-green-200 text-xs flex gap-2 items-center">
                                <Calendar className="w-3 h-3 text-megagreen" />
                                18–36 months
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-green-200 text-xs">
                                <div className="w-2 h-2 bg-megagreen rounded" />
                                Risk: {modalData.riskLevel}
                            </div>

                        </div>
                        {/* Allocation Filled */}
                        <div className="flex flex-col sm:flex-row py-1 text-sm gap-2">
                            <div className="flex flex-1  flex-col border border-[#E6F6EB] p-2 rounded-lg space-y-2 ">
                                <h4 className="text-xs text-muted-foreground font-medium">Allocation Filled</h4>
                                <p className="font-semibold">{modalData.allocationFilled}%</p>
                                <Progress value={65} className="w-full bg-megagreen/10 " />
                            </div>
                            <div className="flex flex-col border border-[#E6F6EB] p-2 rounded-lg flex-1 gap-1 space-y-2">
                                <h4 className="text-xs text-muted-foreground font-medium">Avg Ticket Size</h4>
                                <p className="font-semibold">₦{modalData.averageTicket}m</p>
                                <div className="flex items-center justify-between gap-1 [&_span]:bg-megagreen/8 [&_span]:rounded-full flex-wrap">
                                    <span className="text-[9px] px-2 py-1 text-muted-foreground font-medium">Timeline: 24m</span>
                                    <span className="text-[9px] px-2 py-1 text-muted-foreground font-medium">Reinvest: Yes</span>
                                </div>
                            </div>
                        </div>

                        {/* Active Project */}
                        <Card className="border-none shadow-none p-0 gap-2">
                            {modalData.activeProject.map((project, index) => (
                                <CardContent key={index} className="p-3 border border-icon/20 rounded-lg flex  gap-2 gap-y-3">
                                    {project.name === "Igando Estate" ? (
                                        <Building2 className="w-4 h-4 text-megagreen" />
                                    ) : (
                                        <House className="w-4 h-4 text-megagreen" />
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-xs font-semibold">{project.name}</h3>
                                        <p className="text-[10px] text-muted-foreground font-medium">
                                            {project?.unit && <span>{project?.unit}units •</span>}
                                            {typeof project.amount === 'number' ? 
                                                <span> ₦{project.amount}m</span> 
                                                : <span>{project.amount}</span> 
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            ))}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <div className="w-2 h-2 bg-megagreen rounded" />
                                {modalData.riskLevel} Risk
                            </div>
                        </Card>

                        {/* Housing Fund */}
                        <div className="flex items-center justify-between w-full flex-wrap gap-y-2">
                            <h4 className="text-sm font-semibold text-[#E4AC2E]">{modalData.investName}</h4> 
                            <div className="flex items-center bg-[#F8C060] rounded-full px-2 py-1 gap-1">
                                <Banknote className="w-4 h-4" />
                                <p className="text-gray-600 text-xs font-medium">Min: 50,000K</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm font-medium ">
                            <div className="px-2 py-1 rounded-md bg-[#E6FBEE] text-xs flex gap-2 items-center">
                                <Key className="w-3 h-3 text-megagreen" />
                                Home loan access
                            </div>
                            <div className="px-2 py-1 rounded-md border border-green-200 text-xs flex gap-2 items-center">
                                <Calendar className="w-3 h-3 text-megagreen" />
                                6 months+
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-green-200 text-xs">
                                <div className="w-2 h-2 bg-megagreen rounded" />
                                Risk: Low
                            </div>
                        </div>

                        {/* Contribution */}
                        <Card className="p-4 gap-4">
                            <div className="flex justify-between font-medium">
                                <h4 className="font-semibold text-xs">Start contributing</h4>
                                <span className="text-gray-600 text-[10px]">To get started, click "Start Contributing"</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm [&_span]:bg-megagreen/8 ">
                                <span className="px-2 py-1 rounded-md text-[10px]">
                                    Flexible options
                                </span>
                                <span className="px-2 py-1 rounded-md text-[10px]"> 
                                    Automated savings
                                </span>
                                <span className=" px-2 py-1 rounded-md text-[10px]">         
                                    Transparent fees
                                </span>
                            </div>
                            <Button size="sm"
                                className="bg-megagreen hover:bg-megagreen/90 text-white w-fit text-xs"
                                >
                                    <Play className="w-3 h-3 " />
                                Start Contributing
                            </Button>

                        </Card>

                        {/* Investment plan detail */}
                        <Card className="p-0 border-none shadow-none grid grid-cols-1 md:grid-cols-2 gap-y-2">
                            <CardContent className="border border-megagreen/20 shadow-sm p-4 rounded-lg">
                                <h3 className="font-semibold text-[11px] pb-2 ">NHF: government backed</h3>
                                {modalData.NHFPlan.map((feature, index) => {
                                    const Icon = feature.icon
                                    return (
                                        <div key={index} className="flex gap-4 text-[10px] mb-2">
                                            <Icon className="w-4 h-4 text-megagreen shrink-0" />
                                            <span>{feature.feature}</span>
                                        </div>
                                    )
                                })}

                            </CardContent>
                            <CardContent className="border border-megagreen/20 shadow-sm p-4 rounded-lg">
                                <h3 className="font-semibold text-[11px] pb-2 text-[#E6AF2E]">MoFI Housing Fund: Real estate investment fund</h3>
                                {modalData.MoFiPlan.map((feature, index) => {
                                    const Icon = feature.icon
                                    return (
                                        <div key={index} className="flex gap-4 text-[10px] mb-2">
                                            <Icon className="w-4 h-4 text-megagreen shrink-0 " />
                                            <span>{feature.feature}</span>
                                        </div>
                                    )
                                })}
                            </CardContent>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <div className="w-2 h-2 bg-megagreen rounded" />
                                Low Risk
                            </div>
                        </Card>

                        <div className="flex flex-col space-y-2">
                            <div className="flex space-x-4">
                                <Checkbox  id="terms" checked={termsAccepted}
                                    onCheckedChange={(checked) => {
                                        setTermsAccepted(!!checked)
                                        if (checked) setShowError(false)
                                    }}
                                    className="border-megagreen border-2 rounded-sm data-[state=checked]:border-megagreen data-[state=checked]:bg-megagreen"
                                />
                                <label htmlFor="terms" className="text-xs text-megagreen">
                                    By clicking on Apply, you have agreed with our{' '}
                                    <span className="text-black font-medium inline-block pl-10">Terms of use & Privacy Policy.</span>
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
                        <img src={modalData.image} alt="" aria-hidden="true" className="object-contain w-full h-70" />
                    </div>
                </section>
            </DialogContent>
        </Dialog>
    )
}
export default HousingInvestmentModal;