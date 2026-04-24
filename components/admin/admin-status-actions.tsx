"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateRequestStatus } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS } from "@/lib/utils";
import type { RequestStatus } from "@prisma/client";

const STATUS_TRANSITIONS: Partial<Record<RequestStatus, RequestStatus[]>> = {
  PENDING: ["REVIEWING", "CANCELLED"],
  REVIEWING: ["MATCHED", "CANCELLED"],
  MATCHED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
};

const BUTTON_VARIANTS: Partial<
  Record<RequestStatus, "default" | "outline" | "destructive">
> = {
  COMPLETED: "default",
  CANCELLED: "destructive",
  IN_PROGRESS: "default",
  MATCHED: "outline",
  REVIEWING: "outline",
};

type Props = {
  requestId: string;
  currentStatus: RequestStatus;
};

export function AdminStatusActions({ requestId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const nextStatuses = STATUS_TRANSITIONS[currentStatus] ?? [];

  if (nextStatuses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune action disponible pour ce statut.
      </p>
    );
  }

  const handleUpdate = (status: RequestStatus) => {
    startTransition(async () => {
      const result = await updateRequestStatus(requestId, status);
      if (result && "error" in result) {
        toast.error(result.error);
      } else {
        toast.success(`Statut mis à jour : ${STATUS_LABELS[status]}`);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {nextStatuses.map((status) => (
        <Button
          key={status}
          size="sm"
          variant={BUTTON_VARIANTS[status] ?? "outline"}
          disabled={isPending}
          onClick={() => handleUpdate(status)}
          className="w-full justify-start"
        >
          {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          {STATUS_LABELS[status]}
        </Button>
      ))}
    </div>
  );
}
