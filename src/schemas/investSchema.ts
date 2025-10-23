import { z } from "zod"

const baseInvestmentSchema = z.object({
  investment_id: z.number(),
  inv_name: z.string(),
  amount: z.number(),
})

export const pooledInvestTypeSchema = baseInvestmentSchema.extend({
  sub_type: z.enum(["starter-pool", "growth-pool", "premium-pool"]),
})

export const housingInvestTypeSchema = baseInvestmentSchema.extend({
  sub_type: z.enum(["MoFi-housing-fund", "NHF", "housing-project-investment"]),
})

export const investmentPaymentSchema = baseInvestmentSchema.extend({
  sub_type: z.string().optional(),
  consent: z.boolean().refine(val => val === true, {
    message: "You must accept the terms to apply",
  }),
})

export const apiInvestmentSchema = z.object({
    investment_id: z.number(),
    inv_name: z.string(),
    sub_type: z.string().optional(),
    amount: z.number(),
    consent: z.boolean().refine(val => val === true, {
        message: "You must accept the terms to apply",
    }),
})


export type PooledFormData = z.infer<typeof pooledInvestTypeSchema>
export type HousingFormData = z.infer<typeof housingInvestTypeSchema>
export type ApiInvestmentFormData = z.infer<typeof apiInvestmentSchema>
export type InvestPaymentFormData = z.infer<typeof investmentPaymentSchema>
