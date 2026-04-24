"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import db from "@/lib/db";
import { createRequestSchema } from "@/lib/validations/request";
import { computeRecommendations } from "@/lib/matching/engine";
import type { CreateRequestInput } from "@/lib/validations/request";

type ActionResult = { error: string } | void;

export async function createRequest(
  data: CreateRequestInput
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = createRequestSchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return { error: first?.message ?? "Données invalides." };
  }

  const clientProfile = await db.clientProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!clientProfile) return { error: "Profil client introuvable." };

  const request = await db.conciergeRequest.create({
    data: {
      clientId: clientProfile.id,
      categoryId: parsed.data.categoryId,
      title: parsed.data.title,
      description: parsed.data.description,
      city: parsed.data.city,
      desiredDate: parsed.data.desiredDate
        ? new Date(parsed.data.desiredDate)
        : null,
      budgetRange: parsed.data.budgetRange,
      urgency: parsed.data.urgency,
    },
  });

  await db.requestUpdate.create({
    data: {
      requestId: request.id,
      status: "PENDING",
      note: "Votre demande a été reçue. Notre équipe de conciergerie l'analyse avec soin.",
    },
  });

  await computeRecommendations(request.id);

  redirect(`/demande/resultats?requestId=${request.id}`);
}

export async function cancelRequest(requestId: string): Promise<ActionResult> {
  const session = await requireSession();

  const clientProfile = await db.clientProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!clientProfile) return { error: "Profil client introuvable." };

  const request = await db.conciergeRequest.findFirst({
    where: { id: requestId, clientId: clientProfile.id },
  });
  if (!request) return { error: "Demande introuvable." };
  if (request.status === "COMPLETED" || request.status === "CANCELLED") {
    return { error: "Cette demande ne peut pas être annulée." };
  }

  await db.conciergeRequest.update({
    where: { id: requestId },
    data: { status: "CANCELLED" },
  });

  await db.requestUpdate.create({
    data: {
      requestId,
      status: "CANCELLED",
      note: "La demande a été annulée à la demande du client.",
    },
  });
}
