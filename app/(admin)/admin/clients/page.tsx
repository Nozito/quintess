import type { Metadata } from "next";
import db from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Clients" };

export default async function AdminClientsPage() {
  const clients = await db.user.findMany({
    where: { role: "CLIENT" },
    include: {
      clientProfile: {
        include: {
          _count: { select: { requests: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description={`${clients.length} client${clients.length > 1 ? "s" : ""} inscrits`}
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Client", "Ville", "Demandes", "Onboarding", "Inscrit le"].map((h) => (
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
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {client.clientProfile?.city ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">
                        {client.clientProfile?._count.requests ?? 0} demande{(client.clientProfile?._count.requests ?? 0) > 1 ? "s" : ""}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {client.clientProfile?.onboarded ? (
                        <Badge variant="success">Complété</Badge>
                      ) : (
                        <Badge variant="muted">En attente</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(client.createdAt)}
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
