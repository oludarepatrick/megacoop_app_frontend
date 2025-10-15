import {z} from 'zod';

export const savingPlanSchema = z.object({
    saving_goal: z.enum([
        "property-purchase", 
        "house-rent", 
        "personal-project",
        "car",
        "home-appliances",
        "travelling",
        "others"
    ], { message: "this field is required",}), 
    goal_name: z.string().nonempty("field cannot be empty"),
    amount: z.string().nonempty("field cannot be empty"),
    target_amount: z.string().nonempty("field cannot be empty"),
    saving_frequency:z.enum([
        "daily", 
        "weekly", 
        "monthly",
        "6months",
        "1year",
        "2years",
        "3years"
    ], { message: "this field is required",}),
})

export type FormData = z.infer<typeof savingPlanSchema>