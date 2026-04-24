"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { createSession } from "@/lib/session";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

type ActionResult = { error: string } | void;

export async function login(data: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return { error: "Données invalides." };

  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) return { error: "Email ou mot de passe incorrect." };

  const valid = await bcrypt.compare(parsed.data.password, user.password);
  if (!valid) return { error: "Email ou mot de passe incorrect." };

  const token = await createSession({
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  cookies().set("quintess-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  if (user.role === "ADMIN") redirect("/admin");
  redirect("/dashboard");
}

export async function register(data: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return { error: first?.message ?? "Données invalides." };
  }

  const exists = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (exists) return { error: "Un compte existe déjà avec cet email." };

  const hashed = await bcrypt.hash(parsed.data.password, 12);

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
      role: "CLIENT",
      clientProfile: { create: {} },
    },
  });

  const token = await createSession({
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  cookies().set("quintess-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  cookies().delete("quintess-session");
  redirect("/");
}
