import { z } from "zod";
import { BudgetRange } from "@prisma/client";

export const createPartnerSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
  companyName: z.string().min(2, "Nom de société requis"),
  shortBio: z
    .string()
    .min(10, "Bio courte requise")
    .max(200, "Maximum 200 caractères"),
  description: z
    .string()
    .min(50, "Description requise (min. 50 caractères)")
    .max(2000, "Maximum 2000 caractères"),
  city: z.string().min(2, "Ville requise"),
  zone: z.string().optional(),
  categoryId: z.string().min(1, "Catégorie requise"),
  budgetRange: z.nativeEnum(BudgetRange),
  services: z
    .string()
    .min(2, "Au moins un service requis")
    .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),
  availability: z.string().optional(),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  tags: z
    .string()
    .optional()
    .transform((v) =>
      v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []
    ),
});

export const updatePartnerSchema = createPartnerSchema
  .omit({ name: true, email: true, password: true })
  .partial();

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;
