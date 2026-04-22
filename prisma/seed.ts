import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { calcRepublicScore, badgeFromScore } from "../src/lib/score";

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.donationEntry.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.luckyExposureStat.deleteMany();
  await prisma.leaderboardStat.deleteMany();
  await prisma.stewardProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const hashed = await bcrypt.hash("password123", 10);
  const cities = ["Accra", "Lagos", "Nairobi", "Kigali", "Cape Town", "Abuja"];
  const categories = ["Restaurant", "Bakery", "Grocery", "Hostel", "NGO Kitchen", "Community Kitchen"];

  for (let i = 0; i < 16; i++) {
    const user = await prisma.user.create({
      data: {
        email: `steward${i + 1}@overflo.trust`,
        fullName: `Steward ${i + 1}`,
        passwordHash: hashed,
        role: "STEWARD",
      },
    });
    const profile = await prisma.stewardProfile.create({
      data: {
        userId: user.id,
        slug: `steward-${i + 1}`,
        brandName: `Orbital Table ${i + 1}`,
        category: categories[i % categories.length],
        story: "Built with analog-era precision and civic resolve.",
        description: "Redistributing high-quality surplus to community pickup networks.",
        address: `${20 + i} Meridian Avenue`,
        city: cities[i % cities.length],
        openHours: "08:00 - 22:00",
      },
    });
    const donationCount = 4 + (i % 6);
    const donations = [];
    for (let j = 0; j < donationCount; j++) {
      const entry = await prisma.donationEntry.create({
        data: {
          profileId: profile.id,
          title: `Batch ${j + 1}`,
          quantityMeals: 35 + j * 8 + i,
          description: "Prepared surplus meals packed for same-day pickup.",
          pickupWindow: "17:30 - 20:00",
          freshness: j % 3 === 0 ? "PRIME" : j % 2 === 0 ? "FRESH" : "STANDARD",
          pickupSuccess: j % 5 !== 0,
          responseMinutes: 20 + j * 9,
          proofSource: "https://partner-ledger.example/verified",
        },
      });
      donations.push(entry);
    }
    for (let r = 0; r < 5; r++) {
      const consumer = await prisma.user.upsert({
        where: { email: `consumer${r + 1}@overflo.trust` },
        update: {},
        create: { email: `consumer${r + 1}@overflo.trust`, fullName: `Consumer ${r + 1}`, passwordHash: hashed, role: "CONSUMER" },
      });
      await prisma.rating.create({ data: { profileId: profile.id, userId: consumer.id, score: 3 + ((i + r) % 3) } });
      await prisma.comment.create({ data: { profileId: profile.id, userId: consumer.id, body: "Consistent quality and respectful coordination." } });
    }
    const avg = await prisma.rating.aggregate({ where: { profileId: profile.id }, _avg: { score: true } });
    const successful = donations.filter((d) => d.pickupSuccess).length;
    const failed = donations.length - successful;
    const score = calcRepublicScore({ averageRating: avg._avg.score || 0, successfulPickups: successful, failedPickups: failed }, donations);
    await prisma.stewardProfile.update({
      where: { id: profile.id },
      data: {
        averageRating: avg._avg.score || 0,
        successfulPickups: successful,
        failedPickups: failed,
        consistencyStreak: donations.length,
        totalMealsDonated: donations.reduce((s, d) => s + d.quantityMeals, 0),
        republicScore: score,
        badge: badgeFromScore(score),
      },
    });
    await prisma.luckyExposureStat.create({
      data: {
        profileId: profile.id,
        luckyAppearances: 4 + i,
        clickThroughs: 2 + i,
        ratingGrowth: Math.max(0.1, (i % 5) * 0.25),
        popularityGained: 8 + i * 1.4,
      },
    });
  }
}

main().finally(async () => prisma.$disconnect());
