import { z } from "zod"

export const amountSchema = z
    .number({error:"Amount must be a number"})
    .positive("Amount must be positive")

export const dateSchema = z
    .string()
    .min(1,"Date is required")

export const entitySchema = z
    .string()
    .normalize()
    .min(3,"Must be at least 3 characters long")
    .regex(/^[a-zA-Z ]+$/, "Only letters & spaces allowed!")

export const incomeFormSchema = z.object({
    amount:amountSchema,
    source:entitySchema,
    date:dateSchema
})

export const expenseFormSchema = z.object({
    amount:amountSchema,
    entity:entitySchema,
    date:dateSchema,
    category:entitySchema
})