"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { z } from "zod";
import { createSession, destroySession, getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { badgeFromScore, calcRepublicScore } from "@/lib/score";

const signUpSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["CONSUMER", "STEWARD"]),
  brandName: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
});

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    brandName: formData.get("brandName"),
    city: formData.get("city"),
    category: formData.get("category"),
  });
  if (!parsed.success) {
    const passwordIssue = parsed.error.issues.some((issue) => issue.path[0] === "password");
    redirect(passwordIssue ? "/signup?error=password" : "/signup?error=invalid");
  }
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) redirect("/signup?error=email");
  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: { fullName: parsed.data.fullName, email: parsed.data.email, passwordHash, role: parsed.data.role as Role },
  });
  if (parsed.data.role === "STEWARD") {
    const slugBase = (parsed.data.brandName || parsed.data.fullName).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.stewardProfile.create({
      data: {
        userId: user.id,
        brandName: parsed.data.brandName || `${parsed.data.fullName} Establishment`,
        category: parsed.data.category || "Restaurant",
        city: parsed.data.city || "Unlisted",
        slug: `${slugBase}-${user.id.slice(-6)}`,
        story: "Built on service, precision, and civic responsibility.",
        description: "This steward has started their contribution journey.",
        address: "Pending address details",
        republicScore: 16,
      },
    });
  }
  await createSession(user.id);
  redirect(parsed.data.role === "STEWARD" ? "/dashboard" : "/feed");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/login?error=invalid");
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) redirect("/login?error=invalid");
  await createSession(user.id);
  redirect(user.role === "STEWARD" ? "/dashboard" : "/feed");
}

export async function signOutAction() {
  await destroySession();
  redirect("/");
}

export async function addDonationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "STEWARD") throw new Error("Unauthorized");
  const profile = await prisma.stewardProfile.findUnique({ where: { userId: user.id } });
  if (!profile) throw new Error("Profile missing");
  await prisma.donationEntry.create({
    data: {
      profileId: profile.id,
      title: String(formData.get("title") || ""),
      quantityMeals: Number(formData.get("quantityMeals") || 0),
      description: String(formData.get("description") || ""),
      pickupWindow: String(formData.get("pickupWindow") || ""),
      freshness: (String(formData.get("freshness")) || "FRESH") as "PRIME" | "FRESH" | "STANDARD",
      imageUrl: String(formData.get("imageUrl") || "") || null,
      proofSource: String(formData.get("proofSource") || "") || null,
      pickupSuccess: String(formData.get("pickupSuccess")) === "true",
      responseMinutes: Number(formData.get("responseMinutes") || 45),
    },
  });
  await recomputeScore(profile.id);
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");
  revalidatePath("/feed");
}

export async function updateStewardProfileAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "STEWARD") throw new Error("Unauthorized");
  const profile = await prisma.stewardProfile.findUnique({ where: { userId: user.id } });
  if (!profile) throw new Error("Profile missing");
  await prisma.stewardProfile.update({
    where: { id: profile.id },
    data: {
      brandName: String(formData.get("brandName") || profile.brandName),
      description: String(formData.get("description") || profile.description),
      story: String(formData.get("story") || profile.story),
      city: String(formData.get("city") || profile.city),
      address: String(formData.get("address") || profile.address),
      openHours: String(formData.get("openHours") || profile.openHours || ""),
      contactEmail: String(formData.get("contactEmail") || profile.contactEmail || ""),
      contactPhone: String(formData.get("contactPhone") || profile.contactPhone || ""),
      category: String(formData.get("category") || profile.category),
    },
  });
  revalidatePath("/dashboard");
  revalidatePath(`/providers/${profile.slug}`);
}

export async function addRatingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Login required");
  if (user.role !== "CONSUMER") throw new Error("Consumers only");
  const profileId = String(formData.get("profileId"));
  const profileSlug = String(formData.get("profileSlug") || "");
  const score = Number(formData.get("score"));
  if (score < 1 || score > 5) throw new Error("Invalid rating");
  await prisma.rating.create({ data: { profileId, userId: user.id, score } });
  const aggregate = await prisma.rating.aggregate({ where: { profileId }, _avg: { score: true } });
  const newAverage = aggregate._avg.score || 0;
  await prisma.stewardProfile.update({ where: { id: profileId }, data: { averageRating: newAverage } });
  const lucky = await prisma.luckyExposureStat.findUnique({ where: { profileId } });
  if (lucky) {
    const baselineAgg = await prisma.rating.aggregate({
      where: { profileId, createdAt: { lte: lucky.createdAt } },
      _avg: { score: true },
    });
    const baselineAverage = baselineAgg._avg.score || 0;
    const growth = newAverage - baselineAverage;
    const popularity = lucky.luckyAppearances * 0.3 + lucky.clickThroughs * 1 + growth * 4;
    await prisma.luckyExposureStat.update({
      where: { profileId },
      data: { ratingGrowth: growth, popularityGained: popularity },
    });
  }
  await recomputeScore(profileId);
  revalidatePath("/leaderboard");
  if (profileSlug) {
    revalidatePath(`/providers/${profileSlug}`);
    redirect(`/providers/${profileSlug}?rating=submitted`);
  }
}

export async function addCommentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Login required");
  if (user.role !== "CONSUMER") throw new Error("Consumers only");
  const profileId = String(formData.get("profileId"));
  const profileSlug = String(formData.get("profileSlug") || "");
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  await prisma.comment.create({ data: { profileId, userId: user.id, body } });
  revalidatePath("/feed");
  if (profileSlug) {
    revalidatePath(`/providers/${profileSlug}`);
    redirect(`/providers/${profileSlug}?comment=posted`);
  }
}

export async function luckyJumpAction() {
  const profiles = await prisma.stewardProfile.findMany({ select: { id: true, slug: true, republicScore: true } });
  if (!profiles.length) redirect("/feed");
  const weighted = profiles.map((p) => ({ ...p, w: Math.max(1, 95 - p.republicScore) }));
  const sum = weighted.reduce((acc, item) => acc + item.w, 0);
  let target = Math.random() * sum;
  const selected = weighted.find((item) => (target -= item.w) <= 0) || weighted[0];
  await prisma.luckyExposureStat.upsert({
    where: { profileId: selected.id },
    create: { profileId: selected.id, luckyAppearances: 1, popularityGained: 0.3 },
    update: { luckyAppearances: { increment: 1 }, popularityGained: { increment: 0.3 } },
  });
  redirect(`/providers/${selected.slug}?lucky=1`);
}

export async function recomputeScore(profileId: string) {
  const profile = await prisma.stewardProfile.findUnique({ where: { id: profileId } });
  if (!profile) return;
  const donations = await prisma.donationEntry.findMany({ where: { profileId }, orderBy: { createdAt: "desc" } });
  const successfulPickups = donations.filter((d) => d.pickupSuccess).length;
  const failedPickups = donations.length - successfulPickups;
  const totalMealsDonated = donations.reduce((sum, d) => sum + d.quantityMeals, 0);
  const score = calcRepublicScore({ averageRating: profile.averageRating, successfulPickups, failedPickups }, donations);
  await prisma.stewardProfile.update({
    where: { id: profileId },
    data: {
      successfulPickups,
      failedPickups,
      totalMealsDonated,
      consistencyStreak: Math.min(donations.length, 30),
      republicScore: score,
      badge: badgeFromScore(score),
    },
  });
}
