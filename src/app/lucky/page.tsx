import { luckyJumpAction } from "@/lib/actions";
import { getHiddenGems } from "@/lib/data";

export default async function LuckyPage() {
  const gems = await getHiddenGems();
  return (
    <section className="space-y-7">
      <div className="panel flex flex-col items-center gap-4 p-10 text-center">
        <h1 className="text-4xl">I&apos;m Feeling Lucky</h1>
        <p className="max-w-xl text-[#563c30]">A controlled-random discovery pulse designed to elevate deserving stewards beyond legacy visibility bias.</p>
        <form action={luckyJumpAction}>
          <button className="btn-primary px-8 py-3 text-base">Launch Random Steward</button>
        </form>
      </div>
      <div className="panel p-6">
        <h2 className="text-2xl">Hidden Gems</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {gems.map((g) => (
            <div key={g.id} className="rounded-xl border border-amber-900/10 p-4">
              <p className="text-lg">{g.profile.brandName}</p>
              <p className="text-sm text-[#563c30]">
                Appearances {g.luckyAppearances} • Click-throughs {g.clickThroughs} • Rating growth {g.ratingGrowth.toFixed(2)} • Popularity {g.popularityGained.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
