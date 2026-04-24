"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createRequest } from "@/actions/requests";
import { createRequestSchema, type CreateRequestInput } from "@/lib/validations/request";
import { BUDGET_LABELS, URGENCY_LABELS } from "@/lib/utils";
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
import { BudgetRange, UrgencyLevel } from "@prisma/client";

type Category = { id: string; name: string; icon: string };

type RequestFormProps = {
  categories: Category[];
};

export function RequestForm({ categories }: RequestFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequestInput>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      urgency: UrgencyLevel.STANDARD,
    },
  });

  const onSubmit = async (data: CreateRequestInput) => {
    setServerError(null);
    const result = await createRequest(data);
    if (result?.error) setServerError(result.error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label>Catégorie de service *</Label>
        <Select onValueChange={(v) => setValue("categoryId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-xs text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titre de la demande *</Label>
        <Input
          id="title"
          placeholder="Ex : Dîner privé pour 10 personnes à Paris"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Décrivez votre besoin *</Label>
        <Textarea
          id="description"
          placeholder="Précisez vos attentes, vos exigences, le contexte... Plus vous êtes précis, mieux nous pouvons vous accompagner."
          rows={5}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">Ville *</Label>
          <Input
            id="city"
            placeholder="Paris, Lyon, Cannes..."
            {...register("city")}
          />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="desiredDate">Date souhaitée</Label>
          <Input
            id="desiredDate"
            type="date"
            {...register("desiredDate")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Budget estimatif *</Label>
          <Select onValueChange={(v) => setValue("budgetRange", v as BudgetRange)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une gamme" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BUDGET_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budgetRange && (
            <p className="text-xs text-destructive">{errors.budgetRange.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Niveau d'urgence</Label>
          <Select
            defaultValue={UrgencyLevel.STANDARD}
            onValueChange={(v) => setValue("urgency", v as UrgencyLevel)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(URGENCY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Soumettre ma demande
      </Button>
    </form>
  );
}
