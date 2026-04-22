import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [stewards, donations] = await Promise.all([
    prisma.stewardProfile.count(),
    prisma.donationEntry.aggregate({ _sum: { quantityMeals: true } }),
  ]);
  return (
    <section className="space-y-10">
      <div className="panel p-10">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-amber-800">Mission Control for surplus food</p>
        <h1 className="max-w-3xl text-5xl leading-tight">
          The Overflo&apos; Trust transforms excess into civic prestige and verified nourishment.
        </h1>
        <p className="mt-6 max-w-2xl text-[#4f372c]">
          Restaurants, bakeries, groceries, hostels, and community institutions become ranked civic stewards.
          Republic Score drives discoverability, trust, and measurable impact.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="btn-primary">Become a Steward</Link>
          <Link href="/feed" className="btn-secondary">Explore the Feed</Link>
          <Link href="/leaderboard" className="btn-secondary">View Rankings</Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-6">
          <p className="text-sm text-amber-800">Active stewards</p>
          <p className="mt-2 text-4xl">{stewards}</p>
        </div>
        <div className="panel p-6">
          <p className="text-sm text-amber-800">Meals redirected</p>
          <p className="mt-2 text-4xl">{donations._sum.quantityMeals || 0}</p>
        </div>
        <div className="panel p-6">
          <p className="text-sm text-amber-800">Trust engine</p>
          <p className="mt-2 text-xl">Weighted score from freshness, reliability, speed, and community ratings.</p>
        </div>
      </div>
    </section>
  );
}
