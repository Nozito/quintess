import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn, formatDateTime, STATUS_LABELS } from "@/lib/utils";
import type { RequestUpdate, RequestStatus } from "@prisma/client";

const STATUS_ICONS: Partial<Record<RequestStatus, React.ElementType>> = {
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

const STATUS_COLORS: Partial<Record<RequestStatus, string>> = {
  COMPLETED: "text-emerald-600",
  CANCELLED: "text-destructive",
  IN_PROGRESS: "text-amber-600",
  MATCHED: "text-gold",
};

type RequestTimelineProps = {
  updates: RequestUpdate[];
};

export function RequestTimeline({ updates }: RequestTimelineProps) {
  const sorted = [...updates].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="relative space-y-0">
      {sorted.map((update, index) => {
        const Icon =
          (update.status && STATUS_ICONS[update.status]) ?? Clock;
        const colorClass =
          (update.status && STATUS_COLORS[update.status]) ?? "text-muted-foreground";
        const isLast = index === sorted.length - 1;

        return (
          <div key={update.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  isLast
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    isLast ? "text-primary-foreground" : colorClass
                  )}
                />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border" />}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <div className="flex items-center gap-2">
                {update.status && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {STATUS_LABELS[update.status]}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(update.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm text-foreground">{update.note}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
