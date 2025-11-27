import { z } from "zod";


export const personalInfoSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    middle_name: z.string().min(1, "Middle name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of birth is required"),
    age_range: z.string().min(1, "Age range is required"),
    code: z.string().optional(),
});

export const accountInfoSchema = z.object({
    bank_name: z.string().min(1, "Bank name is required"),
    account_number: z.string().min(1, "Account number is required"),
    account_holder_name: z.string().optional(),
});


export const combinedSchema = personalInfoSchema.and(accountInfoSchema);


// Types - extracted exactly from AuthForm component
export type ProfileDetailsData = z.infer<typeof combinedSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AccountInfoFormData = z.infer<typeof accountInfoSchema>;