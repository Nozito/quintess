"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import db from "@/lib/db";
import type { RequestStatus } from "@prisma/client";

type ActionResult = { error: string } | { success: true } | void;

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
  note?: string
): Promise<ActionResult> {
  await requireAdmin();

  const data: { status: RequestStatus; completedAt?: Date } = { status };
  if (status === "COMPLETED") data.completedAt = new Date();

  await db.conciergeRequest.update({ where: { id: requestId }, data });

  await db.requestUpdate.create({
    data: {
      requestId,
      status,
      note: note ?? `Statut mis à jour : ${status}`,
      isInternal: false,
    },
  });

  revalidatePath(`/admin/demandes/${requestId}`);
  revalidatePath("/admin/demandes");
  revalidatePath("/admin");
}

export async function assignPartner(
  requestId: string,
  partnerId: string
): Promise<ActionResult> {
  await requireAdmin();

  await db.conciergeRequest.update({
    where: { id: requestId },
    data: { assignedPartnerId: partnerId, status: "MATCHED" },
  });

  const partner = await db.partnerProfile.findUnique({
    where: { id: partnerId },
    select: { companyName: true },
  });

  await db.requestUpdate.create({
    data: {
      requestId,
      status: "MATCHED",
      note: `${partner?.companyName ?? "Un partenaire"} a été sélectionné pour répondre à votre demande. Une prise de contact aura lieu dans les 24h.`,
      isInternal: false,
    },
  });

  revalidatePath(`/admin/demandes/${requestId}`);
  revalidatePath("/admin/demandes");
}

export async function addAdminNote(
  requestId: string,
  note: string,
  isInternal: boolean
): Promise<ActionResult> {
  await requireAdmin();

  if (!note.trim()) return { error: "La note ne peut pas être vide." };

  await db.requestUpdate.create({
    data: { requestId, note, isInternal },
  });

  revalidatePath(`/admin/demandes/${requestId}`);
}

export async function verifyPartner(partnerId: string): Promise<ActionResult> {
  await requireAdmin();

  await db.partnerProfile.update({
    where: { id: partnerId },
    data: { status: "VERIFIED", verifiedAt: new Date() },
  });

  revalidatePath(`/admin/partenaires/${partnerId}`);
  revalidatePath("/admin/partenaires");
}

export async function suspendPartner(
  partnerId: string
): Promise<ActionResult> {
  await requireAdmin();

  await db.partnerProfile.update({
    where: { id: partnerId },
    data: { status: "SUSPENDED" },
  });

  revalidatePath(`/admin/partenaires/${partnerId}`);
  revalidatePath("/admin/partenaires");
}

export async function deletePartner(
  partnerId: string
): Promise<ActionResult> {
  await requireAdmin();

  const partner = await db.partnerProfile.findUnique({
    where: { id: partnerId },
    select: { userId: true },
  });
  if (!partner) return { error: "Partenaire introuvable." };

  await db.user.delete({ where: { id: partner.userId } });

  revalidatePath("/admin/partenaires");
}
