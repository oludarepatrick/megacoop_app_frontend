import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {  Check, Users, Layers, Star } from "lucide-react"
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pooledInvestTypeSchema, housingInvestTypeSchema, type PooledFormData, type HousingFormData } from "@/schemas/investSchema";
import type { AvailableInvestmentCard, DetailedInvestmentModal, SimpleInvestmentModal } from "@/types/investmentType";


interface InvestmentTypeModalProps {
  isOpen: boolean
  onClose: () => void
  investmentType: "pooled" | "housing"
  cardData: AvailableInvestmentCard
  modalData: SimpleInvestmentModal | DetailedInvestmentModal
  onProceedToPayment: (data: PooledFormData | HousingFormData) => void
}

const InvestmentTypeModal = ({isOpen, onClose, investmentType, cardData, modalData, onProceedToPayment}: InvestmentTypeModalProps) => {
    const investment = investmentType
    
    const pooledForm = useForm<PooledFormData>({
        resolver: zodResolver(pooledInvestTypeSchema),
        defaultValues: {
            investmentType: "starter-pool"
        }
    })
    
    const housingForm = useForm<HousingFormData>({
        resolver: zodResolver(housingInvestTypeSchema),
        defaultValues: {
            investmentType: "MoFi-housing-fund"
        }
    })
    
    const handlePooledSubmit = (data: PooledFormData) => {
        console.log('Pooled investment data:', data)
        onClose()
        onProceedToPayment(data)
    }
    
    const handleHousingSubmit = (data: HousingFormData) => {
        console.log('Housing investment data:', data)
        onClose()
        onProceedToPayment(data)
    }
    
    return investment === "pooled" ? (
            <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="font-poppins p-10 pb-30 max-h-[90vh] overflow-y-auto scrollbar-hide"
                style={{
                    backgroundImage: `url(${cardData.image})`,
                    backgroundPosition: "bottom right",
                    backgroundRepeat: " no-repeat",
                    backgroundSize: "120px",
                }}
            >
                <DialogHeader className="max-w-[358px] w-full">
                    <DialogTitle className="text-lg font-semibold">Choose your pooled Investment Type to Proceed</DialogTitle>
                </DialogHeader>
                {/*Main content */}

                {/* Selected Pool Display */}
                <div className="max-w-[358px] w-full mx-auto">
                    <Card className="border-none shadow-none p-0">
                        {(() => {
                            const selectedValue = pooledForm.watch("investmentType")
                            
                            // Map form values to pool option names
                            const valueToPoolName = {
                                "starter-pool": "Starter Pool",
                                "growth-pool": "Growth Pool", 
                                "premium-pool": "Premium Pool"
                            }
                            
                            const selectedPool = (modalData as SimpleInvestmentModal).poolOption.find(
                                pool => pool.name === valueToPoolName[selectedValue]
                            )
                            
                            if (!selectedPool) return null
                            
                            const Icon = selectedPool.icon
                            
                            return (
                                <CardContent className="p-2 border-2 border-icon/50 rounded-2xl flex items-center justify-between flex-wrap gap-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge className={`h-4 w-3 ${selectedPool.color}`}/>
                                        <div className="font-semibold">
                                            <h3 className="text-xs">{selectedPool.name}</h3>
                                            <p className="text-[10px] text-muted-foreground">{selectedPool.range}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="text-[10px] bg-[#E6F8EE] px-3 py-1 rounded-full flex gap-1 items-center">
                                            <Icon className="w-3 h-3" />
                                            <span className="uppercase font-semibold">roi:{selectedPool.roi}</span>
                                        </div>
                                        <div className="text-[10px] bg-[#E6F8EE] px-2 py-1 rounded-full flex gap-1 items-center">
                                            {selectedPool.entry === "Entry" ? (
                                                <Users className="w-3 h-3" />
                                            ) : selectedPool.entry === "Diversified" ? (
                                                <Layers className="w-3 h-3" />
                                            ) : (
                                                <Star className="w-3 h-3" />
                                            )}
                                            <span className="font-semibold">{selectedPool.entry}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            )
                        })()
                        }
                    </Card>
                </div>

                <form className="max-w-[358px] w-full mx-auto flex flex-col gap-6 mt-10" onSubmit={pooledForm.handleSubmit(handlePooledSubmit)} >
                    <div className="flex flex-col gap-4">
                        <Label>Investment Type</Label>
                        <Controller
                            name="investmentType"
                            control={pooledForm.control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full border py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md">
                                        <SelectValue placeholder="Select Investment Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="starter-pool">Starter Pool</SelectItem>
                                        <SelectItem value="growth-pool">Growth Pool</SelectItem>
                                        <SelectItem value="premium-pool">Premium Pool</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {pooledForm.formState.errors.investmentType && (
                            <p className="text-sm text-red-500 mt-1">
                                {pooledForm.formState.errors.investmentType.message}
                            </p>
                        )}
                    </div>
                    <Button type="submit" disabled={pooledForm.formState.isSubmitting} className="bg-megagreen hover:bg-megagreen/95">
                        <Check/>Proceed
                    </Button>
                </form>

            
                
            </DialogContent>

        </Dialog>
    ) : (
            <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="font-poppins p-10 pb-30 max-h-[90vh] overflow-y-auto scrollbar-hide"
                style={{
                    backgroundImage: `url(${cardData.image})`,
                    backgroundPosition: "bottom right",
                    backgroundRepeat: " no-repeat",
                    backgroundSize: "100px",
                }}
            >
                <DialogHeader className="max-w-[358px] w-full px-8">
                    <DialogTitle className="text-lg font-semibold">Choose your Housing Projects Investment type to Proceed</DialogTitle>
                </DialogHeader>
                {/*Main content */}

                {/* Selected Housing Investment Display */}
                <div className="">
                    <Card className="border-none shadow-none">
                        {(() => {
                            const selectedValue = housingForm.watch("investmentType")
                            const investmentDetails = {
                                "MoFi-housing-fund": {
                                    name: "MoFi Housing Fund: Real estate investment fund"},
                                "NHF": {
                                    name: "National Housing Fund (NHF): Government backed"},
                                "housing-project-investment": {
                                    name: "Housing Project Investment" },
                            }
                            
                            const selected = investmentDetails[selectedValue]
                            return (
                                <div className="max-w-[358px] w-full mx-auto">
                                    <h3 className="font-semibold text-sm text-[#E6AF2E] mb-2 w-full pr-20">{selected.name}</h3>
                                </div>
                            )
                        })()
                        }
                    </Card>
                </div>

                <form className="max-w-[358px] w-full mx-auto flex flex-col gap-6" onSubmit={housingForm.handleSubmit(handleHousingSubmit)} >
                    <div className="flex flex-col gap-4 w-full">
                        <Label>Investment Type</Label>
                        <Controller
                            name="investmentType"
                            control={housingForm.control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full border py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md">
                                        <SelectValue placeholder="Select Investment Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MoFi-housing-fund">MoFi Housing Fund</SelectItem>
                                        <SelectItem value="NHF">NHF</SelectItem>
                                        <SelectItem value="housing-project-investment">Housing Project Investment</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {housingForm.formState.errors.investmentType && (
                            <p className="text-sm text-red-500 mt-1">
                                {housingForm.formState.errors.investmentType.message}
                            </p>
                        )}
                    </div>
                    <Button type="submit" className="bg-megagreen hover:bg-megagreen/90" disabled={housingForm.formState.isSubmitting}>
                        <Check/>Proceed
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default InvestmentTypeModal;