import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/admin/status-badge";
import { formatDate, BUDGET_LABELS } from "@/lib/utils";
import type { ConciergeRequest, Category } from "@prisma/client";

type RequestCardProps = {
  request: ConciergeRequest & { category: Category };
};

export function RequestCard({ request }: RequestCardProps) {
  return (
    <Link href={`/demande/${request.id}`}>
      <Card className="group transition-all hover:shadow-md hover:border-border/80">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <RequestStatusBadge status={request.status} />
                <span className="text-xs text-muted-foreground">
                  {request.category.name}
                </span>
              </div>
              <h3 className="truncate font-medium text-foreground">
                {request.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {request.city}
                </span>
                {request.desiredDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(request.desiredDate)}
                  </span>
                )}
                <span>{BUDGET_LABELS[request.budgetRange]}</span>
              </div>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
