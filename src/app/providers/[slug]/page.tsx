import { notFound } from "next/navigation";
import { addCommentAction, addRatingAction } from "@/lib/actions";
import { getLeaderboard, getStewardBySlug } from "@/lib/data";
import { AnimatedNumber } from "@/components/animated-number";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ rating?: string; comment?: string }>;
};

export default async function ProviderPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const ratingSubmitted = query.rating === "submitted";
  const commentPosted = query.comment === "posted";
  const profile = await getStewardBySlug(slug);
  if (!profile) return notFound();
  const leaderboard = await getLeaderboard();
  const rank = leaderboard.find((x) => x.id === profile.id)?.rank ?? "-";
  const totalMeals = profile.donations.reduce((sum, entry) => sum + entry.quantityMeals, 0);
  return (
    <section className="space-y-6">
      <div className="panel fade-in-up p-8">
        <h1 className="text-4xl">{profile.brandName}</h1>
        <p className="mt-2 text-[#563c30]">{profile.story}</p>
        <div className="mt-5 grid gap-3 text-sm md:grid-cols-5">
          <div className="fade-in-up rounded-xl border border-amber-900/10 bg-white/65 p-3" style={{ animationDelay: "70ms" }}>
            Rank #{rank}
          </div>
          <div className="fade-in-up rounded-xl border border-amber-900/10 bg-white/65 p-3" style={{ animationDelay: "120ms" }}>
            Republic Score <AnimatedNumber value={profile.republicScore} decimals={1} />
          </div>
          <div className="fade-in-up rounded-xl border border-amber-900/10 bg-white/65 p-3" style={{ animationDelay: "170ms" }}>
            Avg rating <AnimatedNumber value={profile.averageRating} decimals={1} />
          </div>
          <div className="fade-in-up rounded-xl border border-amber-900/10 bg-white/65 p-3" style={{ animationDelay: "220ms" }}>
            Meals <AnimatedNumber value={totalMeals} />
          </div>
          <div className="fade-in-up rounded-xl border border-amber-900/10 bg-white/65 p-3" style={{ animationDelay: "270ms" }}>
            {profile.city}
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="panel fade-in-up space-y-3 p-5 lg:col-span-2" style={{ animationDelay: "120ms" }}>
          <h2 className="text-2xl">Donation History</h2>
          {profile.donations.length ? (
            profile.donations.map((d, index) => (
              <article key={d.id} className="fade-in-up rounded-xl border border-amber-900/10 p-4 transition hover:-translate-y-0.5" style={{ animationDelay: `${Math.min(index * 45, 320)}ms` }}>
                <h3 className="text-lg">{d.title}</h3>
                <p className="text-sm text-[#563c30]">{d.description}</p>
                <p className="mt-2 text-sm"><AnimatedNumber value={d.quantityMeals} /> meals • {d.pickupWindow} • {d.pickupSuccess ? "Pickup complete" : "Pending pickup"}</p>
                <p className="text-xs text-amber-800">Proof: {d.proofSource || "Awaiting third-party reference"}</p>
              </article>
            ))
          ) : (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <article key={item} className="rounded-xl border border-amber-900/10 p-4">
                  <div className="skeleton-pulse h-6 w-2/5 rounded bg-amber-900/12" />
                  <div className="skeleton-pulse mt-3 h-4 w-full rounded bg-amber-900/12" />
                  <div className="skeleton-pulse mt-2 h-4 w-4/5 rounded bg-amber-900/12" />
                  <div className="skeleton-pulse mt-3 h-4 w-3/5 rounded bg-amber-900/12" />
                  <div className="skeleton-pulse mt-2 h-3 w-1/2 rounded bg-amber-900/12" />
                </article>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <form action={addRatingAction} className="panel fade-in-up space-y-3 p-4" style={{ animationDelay: "160ms" }}>
            <h3 className="text-xl">Rate this steward</h3>
            <input type="hidden" name="profileId" value={profile.id} />
            <input type="hidden" name="profileSlug" value={profile.slug} />
            <input
              type="number"
              name="score"
              min={1}
              max={5}
              placeholder={ratingSubmitted ? "Rating submitted" : "Rate 1 to 5"}
              className={`w-full rounded-xl border bg-white p-2 ${ratingSubmitted ? "border-emerald-500 ring-1 ring-emerald-200" : "border-amber-900/20"}`}
            />
            <button className="btn-primary">Submit rating</button>
          </form>
          <form action={addCommentAction} className="panel fade-in-up space-y-3 p-4" style={{ animationDelay: "220ms" }}>
            <h3 className="text-xl">Comment</h3>
            <input type="hidden" name="profileId" value={profile.id} />
            <input type="hidden" name="profileSlug" value={profile.slug} />
            <textarea
              name="body"
              placeholder={commentPosted ? "Comment posted" : "Write your comment"}
              className={`min-h-28 w-full rounded-xl border bg-white p-2 ${commentPosted ? "border-emerald-500 ring-1 ring-emerald-200" : "border-amber-900/20"}`}
            />
            <button className="btn-secondary">Post</button>
          </form>
          <div className="panel fade-in-up space-y-3 p-4" style={{ animationDelay: "260ms" }}>
            <h3 className="text-xl">Comments</h3>
            {profile.comments.length ? (
              <div className="space-y-3">
                {profile.comments.map((comment) => (
                  <article key={comment.id} className="rounded-xl border border-amber-900/10 bg-white/65 p-3">
                    <p className="text-sm text-[#563c30]">{comment.body}</p>
                    <p className="mt-2 text-xs text-amber-800">
                      {comment.user.fullName} • {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#563c30]">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
