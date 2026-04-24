import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import db from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { PartnerStatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BUDGET_LABELS, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Gestion des partenaires" };

export default async function AdminPartenairesPage() {
  const partners = await db.partnerProfile.findMany({
    include: { category: true, user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partenaires"
        description={`${partners.length} partenaire${partners.length > 1 ? "s" : ""} dans le réseau`}
      >
        <Button asChild>
          <Link href="/admin/partenaires/nouveau">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un partenaire
          </Link>
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Partenaire", "Catégorie", "Ville", "Budget", "Note", "Statut", "Ajouté le"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {partners.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/partenaires/${p.id}`}
                        className="block"
                      >
                        <p className="font-medium hover:underline">{p.companyName}</p>
                        <p className="text-xs text-muted-foreground">{p.user.email}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {p.category.name}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.city}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {BUDGET_LABELS[p.budgetRange]}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.rating > 0 ? `${p.rating.toFixed(1)}/5` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <PartnerStatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(p.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
