import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Banknote, AlertCircle } from "lucide-react";
import db from "@/lib/db";
import { RequestStatusBadge } from "@/components/admin/status-badge";
import { RequestTimeline } from "@/components/client/request-timeline";
import { AssignPartnerModal } from "@/components/admin/assign-partner-modal";
import { PartnerCard } from "@/components/client/partner-card";
import { AdminStatusActions } from "@/components/admin/admin-status-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, BUDGET_LABELS, URGENCY_LABELS } from "@/lib/utils";

export const metadata: Metadata = { title: "Détail de la demande" };

export default async function AdminDemandeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const request = await db.conciergeRequest.findUnique({
    where: { id: params.id },
    include: {
      client: { include: { user: true } },
      category: true,
      assignedPartner: { include: { category: true } },
      updates: { orderBy: { createdAt: "asc" } },
      recommendations: {
        include: { partner: { include: { category: true } } },
        orderBy: { rank: "asc" },
      },
    },
  });

  if (!request) notFound();

  const availablePartners = await db.partnerProfile.findMany({
    where: {
      categoryId: request.categoryId,
      status: "VERIFIED",
    },
    include: { category: true },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
          <Link href="/admin/demandes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Toutes les demandes
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <RequestStatusBadge status={request.status} />
              <span className="text-xs text-muted-foreground">
                {request.category.name}
              </span>
            </div>
            <h1 className="text-xl font-semibold">{request.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Client : {request.client.user.name} ({request.client.user.email})
            </p>
          </div>
          <div className="flex gap-2">
            {!request.assignedPartnerId &&
              request.status !== "COMPLETED" &&
              request.status !== "CANCELLED" && (
                <AssignPartnerModal
                  requestId={request.id}
                  partners={availablePartners}
                />
              )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {request.description}
              </p>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4 text-sm">
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
              {request.adminNotes && (
                <>
                  <Separator className="my-4" />
                  <p className="text-xs font-medium text-muted-foreground">Notes internes</p>
                  <p className="mt-1 text-sm">{request.adminNotes}</p>
                </>
              )}
            </CardContent>
          </Card>

          {request.assignedPartner && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Partenaire assigné
              </h2>
              <PartnerCard partner={request.assignedPartner} />
            </div>
          )}

          {request.recommendations.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Recommandations ({request.recommendations.length})
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

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Changer le statut</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminStatusActions
                requestId={request.id}
                currentStatus={request.status}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <RequestTimeline updates={request.updates} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
