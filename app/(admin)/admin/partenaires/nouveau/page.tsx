import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import db from "@/lib/db";
import { PartnerForm } from "@/components/admin/partner-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Nouveau partenaire" };

export default async function NouveauPartenairePage() {
  const categories = await db.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
          <Link href="/admin/partenaires">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux partenaires
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Ajouter un partenaire</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Créer un nouveau profil partenaire dans le réseau Quintess
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <PartnerForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
