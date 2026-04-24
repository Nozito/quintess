import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BudgetRange, RequestStatus, UrgencyLevel, PartnerStatus } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  ACCESSIBLE: "< 1 000 €",
  PREMIUM: "1 000 – 5 000 €",
  LUXE: "5 000 – 20 000 €",
  ULTRA_LUXE: "> 20 000 €",
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: "En attente",
  REVIEWING: "En analyse",
  MATCHED: "Partenaire identifié",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  STANDARD: "Standard",
  PRIORITAIRE: "Prioritaire",
  URGENT: "Urgent",
  IMMEDIAT: "Immédiat",
};

export const PARTNER_STATUS_LABELS: Record<PartnerStatus, string> = {
  PENDING: "En attente",
  VERIFIED: "Vérifié",
  SUSPENDED: "Suspendu",
};

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
