import type { Metadata } from "next";
import Link from "next/link";
import db from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { RequestStatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, BUDGET_LABELS, URGENCY_LABELS } from "@/lib/utils";

export const metadata: Metadata = { title: "Gestion des demandes" };

export default async function AdminDemandesPage() {
  const requests = await db.conciergeRequest.findMany({
    include: {
      client: { include: { user: true } },
      category: true,
      assignedPartner: { select: { companyName: true } },
    },
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Demandes"
        description={`${requests.length} demande${requests.length > 1 ? "s" : ""} au total`}
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Demande
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Budget
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Urgence
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/demandes/${req.id}`}
                        className="block max-w-xs"
                      >
                        <p className="truncate font-medium hover:underline">
                          {req.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.category.name} · {req.city}
                        </p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{req.client.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {req.client.user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {BUDGET_LABELS[req.budgetRange]}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {URGENCY_LABELS[req.urgency]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <RequestStatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(req.createdAt)}
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
