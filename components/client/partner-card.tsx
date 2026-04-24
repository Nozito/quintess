import Image from "next/image";
import { MapPin, Star, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BUDGET_LABELS } from "@/lib/utils";
import type { PartnerProfile, Category } from "@prisma/client";

type PartnerCardProps = {
  partner: PartnerProfile & { category: Category };
  score?: number;
  matchReasons?: string[];
  rank?: number;
};

export function PartnerCard({ partner, score, matchReasons, rank }: PartnerCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {rank === 1 && (
        <div className="flex items-center gap-2 bg-gold/10 px-5 py-2 text-xs font-semibold text-gold border-b border-gold/20">
          <Sparkles className="h-3.5 w-3.5" />
          Recommandation n°1 — Meilleure correspondance
        </div>
      )}
      <CardContent className="p-0">
        <div className="flex gap-5 p-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
            {partner.imageUrl ? (
              <Image
                src={partner.imageUrl}
                alt={partner.companyName}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">
                {partner.companyName[0]}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">
                {partner.companyName}
              </h3>
              {partner.status === "VERIFIED" && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {partner.shortBio}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {partner.city}
              </span>
              {partner.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-gold text-gold" />
                  {partner.rating.toFixed(1)} ({partner.reviewCount})
                </span>
              )}
              <span className="font-medium text-foreground">
                {BUDGET_LABELS[partner.budgetRange]}
              </span>
            </div>
          </div>

          {score !== undefined && (
            <div className="flex shrink-0 flex-col items-center justify-center rounded-md bg-primary/5 px-4 py-2">
              <span className="text-2xl font-bold text-primary">{score}</span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
          )}
        </div>

        {matchReasons && matchReasons.length > 0 && (
          <div className="border-t border-border px-5 py-3">
            <div className="flex flex-wrap gap-1.5">
              {matchReasons.map((reason) => (
                <Badge key={reason} variant="secondary" className="text-xs">
                  {reason}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {partner.services.length > 0 && (
          <div className="border-t border-border px-5 py-3">
            <div className="flex flex-wrap gap-1.5">
              {partner.services.slice(0, 4).map((service) => (
                <Badge key={service} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
              {partner.services.length > 4 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{partner.services.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
