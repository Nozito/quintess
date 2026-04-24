import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { requireSession } from "@/lib/auth";
import db from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { PartnerCard } from "@/components/client/partner-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Résultats de recommandation" };

export default async function ResultatsPage({
  searchParams,
}: {
  searchParams: { requestId?: string };
}) {
  const session = await requireSession();
  const { requestId } = searchParams;

  if (!requestId) notFound();

  const clientProfile = await db.clientProfile.findUnique({
    where: { userId: session.userId },
  });

  const request = await db.conciergeRequest.findFirst({
    where: { id: requestId, clientId: clientProfile?.id },
    include: {
      category: true,
      recommendations: {
        include: {
          partner: { include: { category: true } },
        },
        orderBy: { rank: "asc" },
      },
    },
  });

  if (!request) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </Button>
        <PageHeader
          title="Recommandations personnalisées"
          description={`Pour votre demande : "${request.title}"`}
        />
      </div>

      {request.recommendations.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Aucun partenaire disponible pour le moment"
          description="Notre équipe va analyser votre demande manuellement et revenir vers vous dans les meilleurs délais."
        >
          <Button asChild>
            <Link href="/dashboard">Voir mes demandes</Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/5 px-5 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-gold" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">
                {request.recommendations.length} partenaire
                {request.recommendations.length > 1 ? "s" : ""} identifié
                {request.recommendations.length > 1 ? "s" : ""}
              </span>{" "}
              — sélectionnés par notre algorithme de recommandation sur{" "}
              {request.category.name.toLowerCase()}.
            </p>
          </div>

          <div className="space-y-4">
            {request.recommendations.map((rec) => (
              <PartnerCard
                key={rec.id}
                partner={rec.partner}
                score={rec.score}
                matchReasons={rec.matchReasons}
                rank={rec.rank}
              />
            ))}
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-5 text-center">
            <p className="font-medium">Votre demande est en bonne voie.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Notre équipe de conciergerie va prendre contact avec vous
              sous 24h pour valider les détails et orchestrer la prestation.
            </p>
            <Button asChild className="mt-4">
              <Link href={`/demande/${request.id}`}>Suivre ma demande</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
