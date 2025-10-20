import { z } from "zod"

export const pooledInvestTypeSchema = z.object({
    investmentType: z.enum(["starter-pool", "growth-pool", "premium-pool" ])
}) 

export const housingInvestTypeSchema = z.object({
    investmentType: z.enum(["MoFi-housing-fund", "NHF", "housing-project-investment"])
}) 


export type PooledFormData = z.infer<typeof pooledInvestTypeSchema>
export type HousingFormData = z.infer<typeof housingInvestTypeSchema>
