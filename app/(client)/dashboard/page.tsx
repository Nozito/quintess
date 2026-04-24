import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Clock, CheckCircle2, PlusCircle } from "lucide-react";
import { requireSession } from "@/lib/auth";
import db from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/client/dashboard-stats";
import { RequestCard } from "@/components/client/request-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Mon tableau de bord" };

export default async function DashboardPage() {
  const session = await requireSession();

  const clientProfile = await db.clientProfile.findUnique({
    where: { userId: session.userId },
    include: {
      requests: {
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  const requests = clientProfile?.requests ?? [];

  const stats = {
    total: requests.length,
    pending: requests.filter((r) =>
      ["PENDING", "REVIEWING", "MATCHED"].includes(r.status)
    ).length,
    inProgress: requests.filter((r) => r.status === "IN_PROGRESS").length,
    completed: requests.filter((r) => r.status === "COMPLETED").length,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Bonjour, ${session.name.split(" ")[0]}`}
        description="Retrouvez toutes vos demandes de conciergerie"
      >
        <Button asChild>
          <Link href="/demande/nouvelle">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Demandes actives"
          value={stats.pending + stats.inProgress}
          icon={Clock}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="En cours"
          value={stats.inProgress}
          icon={ClipboardList}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Terminées"
          value={stats.completed}
          icon={CheckCircle2}
          color="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Mes demandes
        </h2>
        {requests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Aucune demande pour le moment"
            description="Formulez votre premier besoin et notre équipe de conciergerie vous accompagne."
          >
            <Button asChild>
              <Link href="/demande/nouvelle">
                <PlusCircle className="mr-2 h-4 w-4" />
                Faire une demande
              </Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
