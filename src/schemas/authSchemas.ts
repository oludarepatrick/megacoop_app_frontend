import { z } from 'zod';

// Zod schemas - extracted exactly from AuthForm component
export const accessCodeSchema = z.object({
    code: z.string().nonempty("Access code is required").length(8, "Put in your 8 digit access code"),
});

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
    address: z.string().min(1, "Home address is required"),
    whatshapp_no: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

// const combinedSchema = personalInfoSchema.merge(accountInfoSchema);
export const combinedSchema = personalInfoSchema.and(accountInfoSchema);

export const verificationSchema = z.object({
    verificationCode: z.string().min(1, "Verification code is required"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    // rememberMe: z.boolean().optional().default(false),
    rememberMe: z.boolean().optional(),
});

export const forgotPasswordEmailSchema = z.object({
    email: z.string().nonempty("email is required").email("Invalid email format"),
});

export const sendPasswordSchema = z.object({
    email: z.string().email("Invalid email"),
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(8, "Confirm Password must be at least 8 characters"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"], // Set the path of the error to password_confirmation field
});



// Types - extracted exactly from AuthForm component
export type AccessCodeFormData = z.infer<typeof accessCodeSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AccountInfoFormData = z.infer<typeof accountInfoSchema>;
export type VerificationFormData = z.infer<typeof verificationSchema>;
export type CombinedFormData = z.infer<typeof combinedSchema>;
export type CombinedAccessCodeData = AccessCodeFormData & PersonalInfoFormData & AccountInfoFormData;
export type LoginFormData = z.infer<typeof loginSchema>;
export type FinalSubmitData = Omit<z.infer<typeof combinedSchema>,"first_name" | "middle_name" | "last_name" | "email" | "phone">;
export type ForgotPasswordEmailFormData = z.infer<typeof forgotPasswordEmailSchema>;
export type SendPasswordFormData = z.infer<typeof sendPasswordSchema>;




// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

// export const fileSchema = z.object({
//   image: z
//     .instanceof(File)
//     .refine((file) => file.size <= MAX_FILE_SIZE, {
//       message: "Max image size is 5MB.",
//     })
//     .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
//       message: "Only .jpg, .png, and .gif formats are supported.",
//     }),
// });


// import { z } from "zod";

    // const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    // const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

    // const fileSchema = z.object({
    //   image: z
    //     .any() // Or z.instanceof(File) if strictly validating a File object
    //     .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
    //     .refine((file) => file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .png, and .gif formats are supported."),
    // });


    
//     export const imageSchema = z.object({
//   file: z
//     .instanceof(File, { message: "Please upload an image" })
//     .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
//       message: "Only .jpg or .png files are allowed",
//     })
//     .refine((file) => file.size <= 2 * 1024 * 1024, {
//       message: "File must be 2MB or smaller",
//     }),
// });
