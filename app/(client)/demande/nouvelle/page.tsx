import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { RequestForm } from "@/components/client/request-form";
import { Card, CardContent } from "@/components/ui/card";
import db from "@/lib/db";

export const metadata: Metadata = { title: "Nouvelle demande" };

export default async function NouvelleDemandePage() {
  const categories = await db.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, icon: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Exprimer un besoin"
        description="Décrivez votre demande avec précision. Plus vous êtes détaillé, plus notre recommandation sera pertinente."
      />

      <div className="rounded-lg border border-gold/20 bg-gold/5 px-5 py-4 text-sm text-foreground">
        <p className="font-medium">Comment ça fonctionne ?</p>
        <p className="mt-1 text-muted-foreground">
          Notre algorithme analyse votre demande et identifie les meilleurs
          partenaires de notre réseau certifié. Vous obtenez une sélection
          sur-mesure en quelques secondes.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <RequestForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
