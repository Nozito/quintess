import type { Metadata } from "next";
import Link from "next/link";
import { Users, Briefcase, ClipboardList, Clock, ArrowRight } from "lucide-react";
import db from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/client/dashboard-stats";
import { RequestStatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, BUDGET_LABELS } from "@/lib/utils";

export const metadata: Metadata = { title: "Administration" };

export default async function AdminPage() {
  const [totalClients, totalPartners, requests] = await Promise.all([
    db.user.count({ where: { role: "CLIENT" } }),
    db.partnerProfile.count(),
    db.conciergeRequest.findMany({
      include: {
        client: { include: { user: true } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const pending = await db.conciergeRequest.count({
    where: { status: { in: ["PENDING", "REVIEWING"] } },
  });
  const inProgress = await db.conciergeRequest.count({
    where: { status: "IN_PROGRESS" },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de la plateforme Quintess"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Clients" value={totalClients} icon={Users} color="bg-blue-100 text-blue-600" />
        <StatCard label="Partenaires" value={totalPartners} icon={Briefcase} color="bg-purple-100 text-purple-600" />
        <StatCard label="En attente" value={pending} icon={Clock} color="bg-amber-100 text-amber-600" />
        <StatCard label="En cours" value={inProgress} icon={ClipboardList} color="bg-emerald-100 text-emerald-600" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base">Dernières demandes</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/demandes">
              Voir tout
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {requests.map((req) => (
              <Link
                key={req.id}
                href={`/admin/demandes/${req.id}`}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{req.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {req.client.user.name} · {req.category.name} · {req.city}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-xs text-muted-foreground md:block">
                    {formatDate(req.createdAt)}
                  </span>
                  <RequestStatusBadge status={req.status} />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
