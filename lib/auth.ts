import { cookies } from "next/headers";
import { cache } from "react";
import { verifySession } from "./session";
import type { SessionPayload } from "@/types";

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const token = cookies().get("quintess-session")?.value;
  if (!token) return null;
  try {
    return await verifySession(token);
  } catch {
    return null;
  }
});

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("Non authentifié");
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== "ADMIN") throw new Error("Accès refusé");
  return session;
}
