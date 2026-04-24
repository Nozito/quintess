import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Bienvenue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connectez-vous à votre espace Quintess
        </p>
      </div>
      <LoginForm />
    </>
  );
}
