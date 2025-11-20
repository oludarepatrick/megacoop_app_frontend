import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Check } from "lucide-react";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { partialWithdrawSchema, type PartialWithdrawFormData } from "@/schemas/savingsPlanSchema";
import { zodResolver } from "@hookform/resolvers/zod";


type PartialWithdrawModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (amount: number) => void
  isPending: boolean
  savedAmount: number
}

const PartialWithdrawModal = ({isOpen, onClose, isPending, savedAmount, onSubmit}: PartialWithdrawModalProps) => {
    
    const {register, handleSubmit, formState: {errors}, reset} = useForm<PartialWithdrawFormData>({
        resolver: zodResolver(partialWithdrawSchema(savedAmount)),
        mode: 'onChange'
    })

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value.replace(/[^0-9]/g, "")
    //     setAmount(value)

    //     if(Number(value) > savedAmount){
    //         setError(`amount cannot be more than ₦${savedAmount.toLocaleString()}`)
    //     } else {
    //         setError("")
    //     }
    // }
    const handleFormSubmit = (data: PartialWithdrawFormData) => {
        onSubmit(Number(data.amount));
        reset();
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="font-poppins p-10 pb-30 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader className="max-w-[358px] w-full">
                    <DialogTitle className="text-lg font-semibold">Enter amount to be deducted</DialogTitle>
                </DialogHeader>
                    
                    <form className="max-w-[358px] w-full mx-auto flex flex-col gap-6 mt-10" onSubmit={handleSubmit(handleFormSubmit)}>
                        <p className="text-xs ">
                            Amount Saved: ₦{savedAmount.toLocaleString()}
                        </p>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="amount">Amount</Label>
                            <Input type="text" id="amount" 
                                {...register("amount")}
                                disabled={isPending} 
                                className="py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md"
                            />
                            { errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p> }
                            
                        </div>
                        <Button type="submit" disabled={isPending} className="bg-megagreen hover:bg-megagreen/95">
                            {isPending ? "Processing..." : (
                                <>
                                    <Check /> Proceed
                                </>
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
   
    )
}
export default PartialWithdrawModal;

