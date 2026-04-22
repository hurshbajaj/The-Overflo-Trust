import { notFound } from "next/navigation";
import { addCommentAction, addRatingAction } from "@/lib/actions";
import { getLeaderboard, getStewardBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params;
  const profile = await getStewardBySlug(slug);
  if (!profile) return notFound();
  const leaderboard = await getLeaderboard();
  const rank = leaderboard.find((x) => x.id === profile.id)?.rank ?? "-";
  return (
    <section className="space-y-6">
      <div className="panel p-8">
        <h1 className="text-4xl">{profile.brandName}</h1>
        <p className="mt-2 text-[#563c30]">{profile.story}</p>
        <div className="mt-5 grid gap-3 text-sm md:grid-cols-4">
          <div>Rank #{rank}</div>
          <div>Republic Score {profile.republicScore.toFixed(1)}</div>
          <div>Avg rating {profile.averageRating.toFixed(1)}</div>
          <div>{profile.city}</div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="panel space-y-3 p-5 lg:col-span-2">
          <h2 className="text-2xl">Donation History</h2>
          {profile.donations.map((d) => (
            <article key={d.id} className="rounded-xl border border-amber-900/10 p-4">
              <h3 className="text-lg">{d.title}</h3>
              <p className="text-sm text-[#563c30]">{d.description}</p>
              <p className="mt-2 text-sm">{d.quantityMeals} meals • {d.pickupWindow} • {d.pickupSuccess ? "Pickup complete" : "Pending pickup"}</p>
              <p className="text-xs text-amber-800">Proof: {d.proofSource || "Awaiting third-party reference"}</p>
            </article>
          ))}
        </div>
        <div className="space-y-4">
          <form action={addRatingAction} className="panel space-y-3 p-4">
            <h3 className="text-xl">Rate this steward</h3>
            <input type="hidden" name="profileId" value={profile.id} />
            <input type="number" name="score" min={1} max={5} className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
            <button className="btn-primary">Submit rating</button>
          </form>
          <form action={addCommentAction} className="panel space-y-3 p-4">
            <h3 className="text-xl">Comment</h3>
            <input type="hidden" name="profileId" value={profile.id} />
            <textarea name="body" className="min-h-28 w-full rounded-xl border border-amber-900/20 bg-white p-2" />
            <button className="btn-secondary">Post</button>
          </form>
        </div>
      </div>
    </section>
  );
}
