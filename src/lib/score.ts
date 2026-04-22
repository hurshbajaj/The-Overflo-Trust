import { DonationEntry, StewardProfile } from "@prisma/client";

export function calcRepublicScore(
  profile: Pick<StewardProfile, "averageRating" | "successfulPickups" | "failedPickups">,
  donations: Pick<DonationEntry, "quantityMeals" | "freshness" | "responseMinutes" | "pickupSuccess">[],
) {
  const meals = donations.reduce((sum, d) => sum + d.quantityMeals, 0);
  const consistency = Math.min(donations.length / 18, 1) * 100;
  const freshness =
    donations.length === 0
      ? 0
      : (donations.filter((d) => d.freshness === "PRIME").length / donations.length) * 100;
  const response =
    donations.length === 0
      ? 0
      : 100 - Math.min(donations.reduce((sum, d) => sum + d.responseMinutes, 0) / donations.length, 180) / 1.8;
  const pickupReliability =
    profile.successfulPickups + profile.failedPickups === 0
      ? 0
      : (profile.successfulPickups / (profile.successfulPickups + profile.failedPickups)) * 100;
  const rating = (profile.averageRating / 5) * 100;
  const mealComponent = Math.min(meals / 2000, 1) * 100;
  return mealComponent * 0.24 + consistency * 0.16 + freshness * 0.17 + response * 0.15 + pickupReliability * 0.16 + rating * 0.12;
}

export function badgeFromScore(score: number) {
  if (score >= 85) return "Civic Vanguard";
  if (score >= 70) return "Trusted Steward";
  if (score >= 55) return "Reliable Partner";
  return "Rising Contributor";
}
