import { prisma } from "@/lib/prisma";

export async function getLeaderboard(city?: string, category?: string) {
  const profiles = await prisma.stewardProfile.findMany({
    where: { city: city || undefined, category: category || undefined },
    include: { ratings: true },
    orderBy: [{ republicScore: "desc" }, { totalMealsDonated: "desc" }],
  });
  return profiles.map((p, i) => ({ ...p, rank: i + 1 }));
}

export async function getFeedProfiles() {
  const profiles = await prisma.stewardProfile.findMany({
    include: { photos: true, ratings: true },
  });
  const shuffled = [...profiles].sort(() => Math.random() - 0.5);
  return shuffled.sort((a, b) => b.republicScore * 0.8 + Math.random() * 20 - (a.republicScore * 0.8 + Math.random() * 20));
}

export async function getStewardBySlug(slug: string) {
  return prisma.stewardProfile.findUnique({
    where: { slug },
    include: {
      user: true,
      menuItems: true,
      photos: true,
      donations: { orderBy: { createdAt: "desc" } },
      comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
      ratings: true,
    },
  });
}

export async function getHiddenGems() {
  return prisma.luckyExposureStat.findMany({
    include: { profile: true },
    orderBy: [{ popularityGained: "desc" }, { ratingGrowth: "desc" }],
    take: 10,
  });
}
