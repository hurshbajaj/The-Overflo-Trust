import Link from "next/link";
import { getFeedProfiles } from "@/lib/data";

export default async function FeedPage() {
  const profiles = await getFeedProfiles();
  return (
    <section className="space-y-6">
      <h1 className="text-4xl">Discover Stewards</h1>
      <p className="text-[#4f372c]">Feed weighting favors high Republic Score while rotating rising operators for fair exposure.</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {profiles.map((profile) => (
          <Link href={`/providers/${profile.slug}`} key={profile.id} className="panel group p-5 transition hover:-translate-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-700">{profile.category}</p>
            <h2 className="mt-2 text-2xl">{profile.brandName}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-[#563c30]">{profile.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Republic Score {profile.republicScore.toFixed(1)}</span>
              <span>{profile.city}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
