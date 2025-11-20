import {z} from 'zod';

export const savingPlanSchema = z.object({
    goal_name: z.enum([
        "Property Purchase", 
        "House Rent", 
        "Personal Project",
        "Car",
        "Home Appliances",
        "Travelling",
        "Others"
    ], { message: "this field is required",}), 
    purpose: z.string().nonempty("field cannot be empty"),
    amount_saved: z.string().nonempty("field cannot be empty"),
    target_amount: z.string().nonempty("field cannot be empty"),
    frequency:z.enum([
        "daily", 
        "weekly", 
        "monthly",
        "6months",
        "1year",
        "2years",
        "3years"
    ], { message: "this field is required",}),
})

export const withdrawAmountSchema = (maxAmount: number) => {
    return z.object({
        amount: z.string().min(1, "Please enter amount to withdraw")
        .refine(val => Number(val) > 0, "Amount must be greater than zero")
        .refine(val => Number(val) <= maxAmount, 
        `Amount cannot exceed ₦${maxAmount.toLocaleString()}`)
    })
}

export const partialWithdrawSchema = (maxAmount: number) => {
    return z.object({
        amount: z.string()
        .min(1, "Please enter an amount")
        .refine((val) => Number(val) > 0, "Amount must be greater than zero")
        .refine(
            (val) => Number(val) <= maxAmount, 
            `Amount cannot exceed ₦${maxAmount.toLocaleString()}`
        )
    });
};

export type WithdrawAmountFormData =z.infer<ReturnType<typeof withdrawAmountSchema>>
export type SavingFormData = z.infer<typeof savingPlanSchema>
export type PartialWithdrawFormData = z.infer<ReturnType<typeof partialWithdrawSchema>>;