import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, MapPin, Globe, Phone } from "lucide-react";
import db from "@/lib/db";
import { PartnerStatusBadge } from "@/components/admin/status-badge";
import { PartnerAdminActions } from "@/components/admin/partner-admin-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BUDGET_LABELS, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Fiche partenaire" };

export default async function AdminPartenaireDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const partner = await db.partnerProfile.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      category: true,
      assignedRequests: {
        include: { client: { include: { user: true } }, category: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!partner) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
          <Link href="/admin/partenaires">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux partenaires
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <PartnerStatusBadge status={partner.status} />
              <Badge variant="secondary">{partner.category.name}</Badge>
            </div>
            <h1 className="text-2xl font-semibold">{partner.companyName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{partner.shortBio}</p>
          </div>
          <PartnerAdminActions
            partnerId={partner.id}
            currentStatus={partner.status}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {partner.description}
              </p>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Ville</p>
                  <div className="mt-1 flex items-center gap-1 font-medium">
                    <MapPin className="h-3 w-3" />
                    {partner.city}
                    {partner.zone && ` · ${partner.zone}`}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="mt-1 font-medium">{BUDGET_LABELS[partner.budgetRange]}</p>
                </div>
                {partner.rating > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Note</p>
                    <div className="mt-1 flex items-center gap-1 font-medium">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      {partner.rating.toFixed(1)} / 5 ({partner.reviewCount} avis)
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Inscrit le</p>
                  <p className="mt-1 font-medium">{formatDate(partner.createdAt)}</p>
                </div>
                {partner.website && (
                  <div>
                    <p className="text-xs text-muted-foreground">Site web</p>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 text-sm text-gold hover:underline"
                    >
                      <Globe className="h-3 w-3" />
                      Voir le site
                    </a>
                  </div>
                )}
                {partner.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <div className="mt-1 flex items-center gap-1 font-medium">
                      <Phone className="h-3 w-3" />
                      {partner.phone}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Services proposés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {partner.services.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
              {partner.tags.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <p className="mb-2 text-xs text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {partner.tags.map((t) => (
                      <Badge key={t} variant="outline">{t}</Badge>
                    ))}
                  </div>
                </>
              )}
              {partner.availability && (
                <>
                  <Separator className="my-4" />
                  <p className="text-xs text-muted-foreground">Disponibilité</p>
                  <p className="mt-1 text-sm">{partner.availability}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Compte</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Nom</p>
                <p className="font-medium">{partner.user.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{partner.user.email}</p>
              </div>
              {partner.verifiedAt && (
                <div>
                  <p className="text-xs text-muted-foreground">Certifié le</p>
                  <p className="font-medium">{formatDate(partner.verifiedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {partner.assignedRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Demandes assignées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {partner.assignedRequests.map((req) => (
                  <Link
                    key={req.id}
                    href={`/admin/demandes/${req.id}`}
                    className="block rounded-md border border-border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-sm font-medium truncate">{req.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {req.client.user.name} · {formatDate(req.createdAt)}
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
