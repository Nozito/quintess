"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import db from "@/lib/db";
import { createPartnerSchema } from "@/lib/validations/partner";

type ActionResult = { error: string } | void;

export async function createPartner(
  rawData: Record<string, string>
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = createPartnerSchema.safeParse(rawData);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return { error: first?.message ?? "Données invalides." };
  }

  const exists = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (exists) return { error: "Un compte existe déjà avec cet email." };

  const hashed = await bcrypt.hash(parsed.data.password, 12);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
      role: "PARTNER",
      partnerProfile: {
        create: {
          companyName: parsed.data.companyName,
          shortBio: parsed.data.shortBio,
          description: parsed.data.description,
          city: parsed.data.city,
          zone: parsed.data.zone || null,
          categoryId: parsed.data.categoryId,
          budgetRange: parsed.data.budgetRange,
          services: parsed.data.services as unknown as string[],
          availability: parsed.data.availability || null,
          website: parsed.data.website || null,
          phone: parsed.data.phone || null,
          tags: parsed.data.tags as unknown as string[],
        },
      },
    },
  });

  revalidatePath("/admin/partenaires");
  redirect("/admin/partenaires");
}

export async function updatePartner(
  partnerId: string,
  rawData: Record<string, string>
): Promise<ActionResult> {
  await requireAdmin();

  const services = rawData.services
    ? rawData.services.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const tags = rawData.tags
    ? rawData.tags.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  await db.partnerProfile.update({
    where: { id: partnerId },
    data: {
      companyName: rawData.companyName,
      shortBio: rawData.shortBio,
      description: rawData.description,
      city: rawData.city,
      zone: rawData.zone || null,
      categoryId: rawData.categoryId,
      budgetRange: rawData.budgetRange as never,
      services,
      availability: rawData.availability || null,
      website: rawData.website || null,
      phone: rawData.phone || null,
      tags,
    },
  });

  revalidatePath(`/admin/partenaires/${partnerId}`);
  revalidatePath("/admin/partenaires");
}
