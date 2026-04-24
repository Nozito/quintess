"use client";

import { useTransition } from "react";
import { Loader2, CheckCircle2, Ban } from "lucide-react";
import { toast } from "sonner";
import { verifyPartner, suspendPartner } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import type { PartnerStatus } from "@prisma/client";

type Props = {
  partnerId: string;
  currentStatus: PartnerStatus;
};

export function PartnerAdminActions({ partnerId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    startTransition(async () => {
      const result = await verifyPartner(partnerId);
      if (result && "error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Partenaire certifié Quintess.");
      }
    });
  };

  const handleSuspend = () => {
    startTransition(async () => {
      const result = await suspendPartner(partnerId);
      if (result && "error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Partenaire suspendu.");
      }
    });
  };

  return (
    <div className="flex gap-2">
      {currentStatus !== "VERIFIED" && (
        <Button size="sm" onClick={handleVerify} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-3 w-3" />
          )}
          Certifier
        </Button>
      )}
      {currentStatus !== "SUSPENDED" && (
        <Button
          size="sm"
          variant="destructive"
          onClick={handleSuspend}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <Ban className="mr-2 h-3 w-3" />
          )}
          Suspendre
        </Button>
      )}
    </div>
  );
}
