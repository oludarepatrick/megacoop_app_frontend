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

export type SavingFormData = z.infer<typeof savingPlanSchema>