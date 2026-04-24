import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, PARTNER_STATUS_LABELS } from "@/lib/utils";
import type { RequestStatus, PartnerStatus } from "@prisma/client";

const REQUEST_STATUS_VARIANTS: Record<
  RequestStatus,
  "muted" | "info" | "warning" | "gold" | "success" | "destructive"
> = {
  PENDING: "muted",
  REVIEWING: "info",
  MATCHED: "gold",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

const PARTNER_STATUS_VARIANTS: Record<
  PartnerStatus,
  "muted" | "success" | "destructive"
> = {
  PENDING: "muted",
  VERIFIED: "success",
  SUSPENDED: "destructive",
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge variant={REQUEST_STATUS_VARIANTS[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function PartnerStatusBadge({ status }: { status: PartnerStatus }) {
  return (
    <Badge variant={PARTNER_STATUS_VARIANTS[status]}>
      {PARTNER_STATUS_LABELS[status]}
    </Badge>
  );
}
