import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Banknote, AlertCircle, CheckCircle2 } from "lucide-react";
import { requireSession } from "@/lib/auth";
import db from "@/lib/db";
import { RequestStatusBadge } from "@/components/admin/status-badge";
import { RequestTimeline } from "@/components/client/request-timeline";
import { PartnerCard } from "@/components/client/partner-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, BUDGET_LABELS, URGENCY_LABELS } from "@/lib/utils";

export const metadata: Metadata = { title: "Détail de la demande" };

export default async function DemandeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireSession();

  const clientProfile = await db.clientProfile.findUnique({
    where: { userId: session.userId },
  });

  const request = await db.conciergeRequest.findFirst({
    where: { id: params.id, clientId: clientProfile?.id },
    include: {
      category: true,
      assignedPartner: { include: { category: true } },
      updates: { orderBy: { createdAt: "asc" } },
      recommendations: {
        include: { partner: { include: { category: true } } },
        orderBy: { rank: "asc" },
        take: 3,
      },
    },
  });

  if (!request) notFound();

  const publicUpdates = request.updates.filter((u) => !u.isInternal);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tableau de bord
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <RequestStatusBadge status={request.status} />
              <span className="text-xs text-muted-foreground">
                {request.category.name}
              </span>
            </div>
            <h1 className="text-xl font-semibold">{request.title}</h1>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {request.description}
          </p>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Ville</p>
              <div className="mt-1 flex items-center gap-1 font-medium">
                <MapPin className="h-3 w-3" />
                {request.city}
              </div>
            </div>
            {request.desiredDate && (
              <div>
                <p className="text-xs text-muted-foreground">Date souhaitée</p>
                <div className="mt-1 flex items-center gap-1 font-medium">
                  <Calendar className="h-3 w-3" />
                  {formatDate(request.desiredDate)}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <div className="mt-1 flex items-center gap-1 font-medium">
                <Banknote className="h-3 w-3" />
                {BUDGET_LABELS[request.budgetRange]}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Urgence</p>
              <div className="mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="h-3 w-3" />
                {URGENCY_LABELS[request.urgency]}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Demande créée le {formatDate(request.createdAt)}
          </p>
        </CardContent>
      </Card>

      {request.status === "COMPLETED" && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="font-medium text-emerald-800">Prestation terminée</p>
            <p className="text-sm text-emerald-700">
              Terminée le {formatDate(request.completedAt)}
            </p>
          </div>
        </div>
      )}

      {request.assignedPartner && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Partenaire assigné
          </h2>
          <PartnerCard partner={request.assignedPartner} />
        </div>
      )}

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Suivi de la demande
        </h2>
        <Card>
          <CardContent className="p-5">
            {publicUpdates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune mise à jour pour le moment.
              </p>
            ) : (
              <RequestTimeline updates={publicUpdates} />
            )}
          </CardContent>
        </Card>
      </div>

      {request.recommendations.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Partenaires recommandés
          </h2>
          <div className="space-y-3">
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
        </div>
      )}
    </div>
  );
}
