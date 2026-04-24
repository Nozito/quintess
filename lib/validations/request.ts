import { z } from "zod";
import { BudgetRange, UrgencyLevel } from "@prisma/client";

export const createRequestSchema = z.object({
  categoryId: z.string().min(1, "Veuillez sélectionner une catégorie"),
  title: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(120, "Le titre ne peut pas dépasser 120 caractères"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(2000, "La description ne peut pas dépasser 2000 caractères"),
  city: z.string().min(2, "La ville est requise"),
  desiredDate: z.string().optional(),
  budgetRange: z.nativeEnum(BudgetRange, {
    errorMap: () => ({ message: "Veuillez sélectionner une gamme de budget" }),
  }),
  urgency: z.nativeEnum(UrgencyLevel, {
    errorMap: () => ({ message: "Veuillez sélectionner un niveau d'urgence" }),
  }),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
