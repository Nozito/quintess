"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createPartner } from "@/actions/partners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUDGET_LABELS } from "@/lib/utils";
import { BudgetRange } from "@prisma/client";

type Category = { id: string; name: string };

export function PartnerForm({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => { data[key] = value.toString(); });
    data.categoryId = selectedCategory;
    data.budgetRange = selectedBudget;

    startTransition(async () => {
      const result = await createPartner(data);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-md bg-muted/50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Compte utilisateur
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du contact *</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Nom de la société *</Label>
        <Input id="companyName" name="companyName" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Catégorie *</Label>
          <Select onValueChange={setSelectedCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gamme de prix *</Label>
          <Select onValueChange={setSelectedBudget} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BUDGET_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">Ville *</Label>
          <Input id="city" name="city" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zone">Zone couverte</Label>
          <Input id="zone" name="zone" placeholder="Ex : Île-de-France" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortBio">Accroche courte *</Label>
        <Input id="shortBio" name="shortBio" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description complète *</Label>
        <Textarea id="description" name="description" rows={4} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="services">Services (séparés par des virgules) *</Label>
        <Input id="services" name="services" placeholder="Dîners privés, Chef à domicile, Ateliers..." required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
        <Input id="tags" name="tags" placeholder="Paris, Luxe, VIP..." />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input id="website" name="website" placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability">Disponibilité</Label>
        <Input id="availability" name="availability" placeholder="Ex : Sur réservation, 48h minimum" />
      </div>

      <Button type="submit" className="w-full" disabled={isPending || !selectedCategory || !selectedBudget}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Créer le partenaire
      </Button>
    </form>
  );
}
