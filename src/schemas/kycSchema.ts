import {z} from 'zod';

export const ninSchema = z.object({
    nin: z.string().nonempty("field cannot be empty").length(11, "11-digits number required"),
})

export const bvnSchema = z.object({
    bvn: z.string().nonempty("field cannot be empty").length(11, "11-digits number required"),
})

const MAX_FILE_SIZE = 3 * 1024 * 1024;

export const IDUploadSchema = z.object({
    card_type: z.enum(["international-passport", "drivers-license", "others"], { message: "Card type is required",}), 
    file: z.any()
    .refine((files) => files?.length === 1, {message: "Please upload a valid ID card"})
    .transform(files => files[0])
    .refine((file) => file.size <= MAX_FILE_SIZE, {message: "File must be 3MB or smaller"})
    .refine((file) => ["image/png", "image/jpeg"].includes(file.type), {message: "only .jpg, or .png file is allowed"}),
})

export const addressSchema = z.object({
    address: z.string().nonempty("your address is required"), 
    file: z.any()
    .refine((files) => files?.length === 1, {message: "Please upload a valid proof of address"})
    .transform(files => files[0])
    .refine((file) => file.size <= MAX_FILE_SIZE, {message: "File must be 3MB or smaller"})
    .refine((file) => ["image/png", "image/jpeg"].includes(file.type), {message: "only .jpg, or .png file is allowed"}),
})

export type NinFormData = z.infer<typeof ninSchema>
export type BvnFormData = z.infer<typeof bvnSchema>
export type UploadIDFormData = z.infer<typeof IDUploadSchema>
export type AddressFormData = z.infer<typeof addressSchema>

