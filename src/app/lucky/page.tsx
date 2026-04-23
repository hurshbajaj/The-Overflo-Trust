import { luckyJumpAction } from "@/lib/actions";
import { getHiddenGems } from "@/lib/data";
import { AnimatedNumber } from "@/components/animated-number";
import Link from "next/link";

export default async function LuckyPage() {
  const gems = await getHiddenGems();
  return (
    <section className="space-y-7">
      <div className="panel live-sheen fade-in-up flex flex-col items-center gap-4 p-10 text-center">
        <h1 className="text-4xl">I&apos;m Feeling Lucky</h1>
        <p className="max-w-xl text-[#563c30]">A controlled-random discovery pulse designed to elevate deserving stewards beyond legacy visibility bias.</p>
        <form action={luckyJumpAction}>
          <button className="btn-primary soft-pulse px-8 py-3 text-base">Launch Random Steward</button>
        </form>
      </div>
      <div className="panel fade-in-up p-6" style={{ animationDelay: "100ms" }}>
        <h2 className="text-2xl">Hidden Gems</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {gems.map((g, index) => (
            <Link
              key={g.id}
              href={`/providers/${g.profile.slug}?lucky=1`}
              className="fade-in-up rounded-xl border border-amber-900/10 p-4 transition hover:-translate-y-0.5"
              style={{ animationDelay: `${Math.min(index * 45, 300)}ms` }}
            >
              <p className="text-lg">{g.profile.brandName}</p>
              <p className="text-sm text-[#563c30]">
                Appearances <AnimatedNumber value={g.luckyAppearances} /> • Click-throughs <AnimatedNumber value={g.clickThroughs} /> • Rating growth <AnimatedNumber value={g.ratingGrowth} decimals={2} /> • Popularity <AnimatedNumber value={g.popularityGained} decimals={1} />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
