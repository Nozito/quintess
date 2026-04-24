"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { assignPartner } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { BUDGET_LABELS } from "@/lib/utils";
import type { PartnerProfile, Category } from "@prisma/client";

type AssignPartnerModalProps = {
  requestId: string;
  partners: (PartnerProfile & { category: Category })[];
};

export function AssignPartnerModal({ requestId, partners }: AssignPartnerModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAssign = () => {
    if (!selectedId) return;
    startTransition(async () => {
      const result = await assignPartner(requestId, selectedId);
      if (result && "error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Partenaire assigné avec succès.");
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Assigner un partenaire</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assigner un partenaire</DialogTitle>
          <DialogDescription>
            Sélectionnez le partenaire le plus adapté à cette demande.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {partners.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`w-full rounded-lg border p-4 text-left transition-all ${
                selectedId === p.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{p.companyName}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.city} · {p.category.name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{BUDGET_LABELS[p.budgetRange]}</p>
                  {p.status === "VERIFIED" && (
                    <p className="text-xs text-emerald-600">Certifié Quintess</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedId || isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmer l'assignation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
