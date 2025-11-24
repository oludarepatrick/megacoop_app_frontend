import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWithdrawalOtp } from "@/hooks/useSaving"
import { withdrawAmountSchema, type WithdrawAmountFormData } from "@/schemas/savingsPlanSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"
import { useForm } from "react-hook-form"


type WithdrawFormProps ={
    onProceed: (data: WithdrawAmountFormData) => void
}
const WithdrawForm = ({onProceed}: WithdrawFormProps) => {
    const form = useForm<WithdrawAmountFormData>({
            resolver: zodResolver(withdrawAmountSchema(250000.00)),
            defaultValues: {
                amount: "",
            }
    })
    const {mutate, isPending} = useWithdrawalOtp(
        (data: WithdrawAmountFormData) => {
            onProceed(data)
        },
        (msg) => {
            form.setError("amount", {
                type: "server",
                message: msg
            })
        }
    )
    
    const onSubmit = (data: WithdrawAmountFormData) => {
        console.log("Form submitted:", data)
        mutate(data)
        // form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[400px] w-full mx-auto p-4 pb-12 flex flex-col gap-5 sm:px-0">
                <FormField control={form.control} name="amount"
                    render={({ field }) => (
                        <FormItem className="">
                            <Label htmlFor="amount" className="font-normal pb-2">Amount</Label>
                            <FormControl>
                                <Input 
                                    type="text" 
                                    id="amount"
                                    {...field}
                                    disabled={isPending}
                                    className="py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md" 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="bg-megagreen hover:bg-green-600" disabled={isPending}>
                    <Check/> Proceed
                </Button>
            </form>
        </Form>
    )
}
export default WithdrawForm