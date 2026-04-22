import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AnimatedNumber } from "@/components/animated-number";
import { LiveSpotlight } from "@/components/live-spotlight";

export default async function Home() {
  const [stewards, donations] = await Promise.all([
    prisma.stewardProfile.count(),
    prisma.donationEntry.aggregate({ _sum: { quantityMeals: true } }),
  ]);
  return (
    <section className="space-y-10">
      <div className="panel fade-in-up p-10">
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
      <LiveSpotlight
        items={[
          { title: "Leaderboard influence", value: "Higher Republic Score improves feed visibility in real-time cycles." },
          { title: "Pickup confidence", value: "Verified completions strengthen civic trust and ranking durability." },
          { title: "Community gravity", value: "Ratings and consistency compound discoverability for reliable stewards." },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel fade-in-up p-6" style={{ animationDelay: "80ms" }}>
          <p className="text-sm text-amber-800">Active stewards</p>
          <p className="mt-2 text-4xl"><AnimatedNumber value={stewards} /></p>
        </div>
        <div className="panel fade-in-up p-6" style={{ animationDelay: "140ms" }}>
          <p className="text-sm text-amber-800">Meals redirected</p>
          <p className="mt-2 text-4xl"><AnimatedNumber value={donations._sum.quantityMeals || 0} /></p>
        </div>
        <div className="panel fade-in-up p-6" style={{ animationDelay: "200ms" }}>
          <p className="text-sm text-amber-800">Trust engine</p>
          <p className="mt-2 text-xl">Weighted score from freshness, reliability, speed, and community ratings.</p>
        </div>
      </div>
      <section className="panel fade-in-up space-y-6 p-7" style={{ animationDelay: "260ms" }}>
        <h2 className="text-3xl">How The Overflo&apos; Trust works</h2>
        <p className="max-w-4xl text-[#4f372c]">
          The platform connects stewards who have quality surplus meals with people and organizations who can put those meals to immediate use.
          Every action is tracked so trust is earned through consistent delivery, not just claims.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-amber-900/15 bg-white/65 p-4">
            <h3 className="text-xl">1) Steward setup</h3>
            <p className="mt-2 text-sm text-[#563c30]">
              Sign up as a steward, complete your public profile, and publish key details such as category, city, hours, and contact channels.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-900/15 bg-white/65 p-4">
            <h3 className="text-xl">2) Donation entries</h3>
            <p className="mt-2 text-sm text-[#563c30]">
              Log each donation with meal count, pickup window, freshness level, and outcome. These records power rankings and visibility.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-900/15 bg-white/65 p-4">
            <h3 className="text-xl">3) Republic Score</h3>
            <p className="mt-2 text-sm text-[#563c30]">
              Scores reflect reliability, pickup success, freshness, and community feedback. Strong long-term performance improves feed priority.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-900/15 bg-white/65 p-4">
          <h3 className="text-xl">How to use the app</h3>
          <p className="mt-2 text-sm text-[#563c30]">
            Start with <strong>Become a Steward</strong>, then use the Command Deck to keep your profile current and log donations regularly.
            Explore <strong>Discover Stewards</strong> to compare profiles, and check <strong>Rankings</strong> to monitor progress over time.
          </p>
        </div>
      </section>
    </section>
  );
}
