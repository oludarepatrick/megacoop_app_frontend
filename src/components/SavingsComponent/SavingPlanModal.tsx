import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import walletBcg from "../../assets/wallet-background.png"
import starCoin1 from "../../assets/star-coin-1.png"
import starCoin2 from "../../assets/star-coin-2.png"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useState } from "react"
import checkIcon from "../../assets/checkmark-icon.svg"
import { ChevronRight } from "lucide-react"
import SavingPayment from "./SavingPayment"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { savingPlanSchema } from "@/schemas/savingsPlanSchema"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import type { SavingFormData } from "@/schemas/savingsPlanSchema"
import { SavingPlanSuccessModal } from "./SavingPlanSuccessModal"
import { useNavigate } from "react-router-dom"
import { useCreatePlan } from "@/hooks/useSaving"


const SavingPlanModal = () => {
    const {mutate: createPlan, isPending} = useCreatePlan(() => {
        setShowPaymentModal(false)
        setSuccessModal(true)}
    )
    const navigate = useNavigate();

    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [planModalOpen, setPlanModalOpen] = useState(false)
    const [formData, setFormData] = useState<SavingFormData | null>(null)
    const [successModal, setSuccessModal] = useState(false)
    
    const form = useForm<SavingFormData>({
        resolver: zodResolver(savingPlanSchema),
        defaultValues: {
            goal_name: undefined,
            purpose: "",
            amount_saved: "",
            target_amount: "",
            frequency: undefined
        }
    })

    const onSubmit = (data: SavingFormData) => {
        console.log("Form submitted:", data)
        setFormData(data)
        setPlanModalOpen(false)
        setShowPaymentModal(true)
        form.reset()
    }

    return (
        <>
            <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-megagreen hover:bg-megagreen/50 "> + Create Plan</Button>
                </DialogTrigger>
            <DialogContent className="p-0 font-poppins overflow-y-auto max-h-[90vh] scrollbar-hide"
                style={{
                        backgroundImage: `url(${starCoin1}), url(${starCoin2})`,
                        backgroundPosition: "right center, bottom left",
                        backgroundRepeat: "no-repeat, no-repeat",
                        backgroundSize: "30px, 40px",
                    }}
            >
                <DialogHeader className="rounded-lg bg-wallet p-8 sm:px-20 gap-0"
                    style={{
                        backgroundImage: `linear-gradient(to bottom right, #F7F7F7, #E4FBE1, #D1FFCC), url(${walletBcg})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom left",
                        backgroundSize: "contain",
                        backgroundBlendMode: "darken",
                    }}
                >
                    <DialogTitle className="text-[24px] font-semibold">Create Savings Plan</DialogTitle>
                    <DialogDescription>What are you saving for?</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 pb-12 flex flex-col gap-5 sm:px-18">
                        <FormField control={form.control} name="goal_name"
                            render={({ field }) => (
                                <FormItem className="">
                                    <Label className="font-normal pb-2">What are you Saving For?</Label>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full border py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md">
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Property Purchase">Property Purchase</SelectItem>
                                            <SelectItem value="House Rent">House Rent</SelectItem>
                                            <SelectItem value="Personal Project">Personal Project</SelectItem>
                                            <SelectItem value="Car">Car</SelectItem>
                                            <SelectItem value="Home Appliances">Home Appliances</SelectItem>
                                            <SelectItem value="Travelling">Travelling</SelectItem>
                                            <SelectItem value="Others">Others</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="purpose"
                            render={({ field }) => (
                                <FormItem className="">
                                    <Label htmlFor="goalName" className="font-normal pb-2">Enter Goal Name</Label>
                                    <FormControl>
                                        <Input 
                                            type="text" 
                                            id="goalName"
                                            {...field}
                                            className="py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md" 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="amount_saved"
                            render={({ field }) => (
                                <FormItem className="relative">
                                    <Label htmlFor="amount" className="font-normal pb-2">Enter Amount you want to save</Label>
                                    <FormControl>
                                        <Input 
                                            type="text" 
                                            id="amount"
                                            {...field}
                                            className="relative py-5 pl-8 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md" 
                                        />
                                    </FormControl>
                                    <span className="absolute top-10 left-2">₦</span>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="target_amount"
                            render={({ field }) => (
                                <FormItem className="relative">
                                    <Label htmlFor="target" className="font-normal pb-2">Target Amount</Label>
                                    <FormControl>
                                        <Input type="text" id="target" {...field}
                                            className="relative py-5 pl-8 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md" 
                                        />
                                    </FormControl>
                                    <span className="absolute top-10 left-2">₦</span>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="frequency"
                            render={({ field }) => (
                                <FormItem >
                                    <Label className="font-normal pb-2">How often would you like to save?</Label>
                                    <div className="flex flex-wrap gap-4">
                                        {savingFrequency.map((btn, index) => {
                                            const isSelected = field.value === btn.toLowerCase().replace(/ /g, '')
                                            return (
                                                <Button key={index} type="button" variant="outline" 
                                                    className={`relative font-normal text-xs text-muted-foreground bg-green-50
                                                        ${isSelected ? "border-megagreen" : "border-icon"}
                                                    `}
                                                    onClick={() => field.onChange(btn.toLowerCase().replace(/ /g, ''))}
                                                >
                                                    {btn}
                                                    {isSelected && <img src={checkIcon} alt="" aria-hidden="true" className="absolute -right-1 -top-2" />}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="bg-gradient-to-t from-[#105D38] to-[#1BE572]">
                            Next<ChevronRight/>
                        </Button>
                    </form>
                </Form>
                </DialogContent>
            </Dialog>
            
            {formData && (
                <SavingPayment 
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    isPending={isPending}
                    onSuccess={() => {
                        if(formData) {
                            createPlan(formData)
                        }
                        // setShowPaymentModal(false)
                        // setSuccessModal(true)
                    }}
                    savingData={formData}
                />
            )}

            {successModal && (
                <SavingPlanSuccessModal 
                    isOpen={successModal}
                    onConfirm={() =>setSuccessModal(false)}
                    onClose={() => {
                        setSuccessModal(false)
                        navigate("/user/dashboard")
                    }}
                />
            )}
        </>
    )
}
export default SavingPlanModal


const savingFrequency = [
    "Daily", "Weekly", "Monthly", "6 months", "1 year", "2 years", "3 years"
]