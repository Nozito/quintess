import { BudgetRange, PartnerStatus } from "@prisma/client";
import db from "@/lib/db";

const BUDGET_ORDER: Record<BudgetRange, number> = {
  ACCESSIBLE: 0,
  PREMIUM: 1,
  LUXE: 2,
  ULTRA_LUXE: 3,
};

function scoreBudget(
  partnerBudget: BudgetRange,
  requestBudget: BudgetRange
): { points: number; reason: string | null } {
  const diff = Math.abs(
    BUDGET_ORDER[partnerBudget] - BUDGET_ORDER[requestBudget]
  );
  if (diff === 0) return { points: 20, reason: "Budget parfaitement aligné" };
  if (diff === 1) return { points: 10, reason: "Budget compatible" };
  return { points: 0, reason: null };
}

export async function computeRecommendations(
  requestId: string
): Promise<void> {
  const request = await db.conciergeRequest.findUniqueOrThrow({
    where: { id: requestId },
  });

  const partners = await db.partnerProfile.findMany({
    where: {
      categoryId: request.categoryId,
      status: { not: PartnerStatus.SUSPENDED },
    },
  });

  const scored = partners.map((partner) => {
    let score = 0;
    const reasons: string[] = [];

    // Category match — 40 pts (guaranteed by query)
    score += 40;
    reasons.push("Expertise parfaitement adaptée");

    // Location — 20 pts
    const sameCity =
      partner.city.toLowerCase() === request.city.toLowerCase();
    const coverZone =
      partner.zone &&
      request.city.toLowerCase().includes(partner.zone.toLowerCase());
    if (sameCity) {
      score += 20;
      reasons.push("Localisation idéale");
    } else if (coverZone) {
      score += 10;
      reasons.push("Zone couverte");
    }

    // Budget — 20 pts
    const budget = scoreBudget(partner.budgetRange, request.budgetRange);
    score += budget.points;
    if (budget.reason) reasons.push(budget.reason);

    // Verified — 15 pts
    if (partner.status === PartnerStatus.VERIFIED) {
      score += 15;
      reasons.push("Partenaire certifié Quintess");
    }

    // Rating — 5 pts
    if (partner.rating > 0) {
      const ratingPts = Math.round((partner.rating / 5) * 5);
      score += ratingPts;
      if (partner.rating >= 4.5) reasons.push("Excellence reconnue");
    }

    return {
      partnerId: partner.id,
      score: Math.min(100, Math.round(score)),
      matchReasons: reasons,
    };
  });

  const top = scored.sort((a, b) => b.score - a.score).slice(0, 5);

  await db.recommendation.deleteMany({ where: { requestId } });

  if (top.length > 0) {
    await db.recommendation.createMany({
      data: top.map((r, i) => ({
        requestId,
        partnerId: r.partnerId,
        score: r.score,
        matchReasons: r.matchReasons,
        rank: i + 1,
      })),
    });
  }
}
