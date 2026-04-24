import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import db from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilPage() {
  const session = await requireSession();

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { clientProfile: { include: { _count: { select: { requests: true } } } } },
  });

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="Mon profil" />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary">Client Quintess</Badge>
                {user.clientProfile?.onboarded && (
                  <Badge variant="success">Profil complété</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Ville</p>
            <p className="mt-1 font-medium">{user.clientProfile?.city ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Téléphone</p>
            <p className="mt-1 font-medium">{user.clientProfile?.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Demandes effectuées</p>
            <p className="mt-1 font-medium">
              {user.clientProfile?._count.requests ?? 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Membre depuis</p>
            <p className="mt-1 font-medium">{formatDate(user.createdAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
