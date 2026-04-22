import Link from "next/link";
import { getFeedProfiles } from "@/lib/data";
import { LiveSpotlight } from "@/components/live-spotlight";

export default async function FeedPage() {
  const profiles = await getFeedProfiles();
  return (
    <section className="space-y-6">
      <h1 className="fade-in-up text-4xl">Discover Stewards</h1>
      <p className="fade-in-up text-[#4f372c]" style={{ animationDelay: "90ms" }}>
        Feed weighting favors high Republic Score while rotating rising operators for fair exposure.
      </p>
      <LiveSpotlight
        items={profiles.slice(0, 5).map((profile) => ({
          title: profile.brandName,
          value: `${profile.city} • Republic Score ${profile.republicScore.toFixed(1)}`,
        }))}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {profiles.map((profile, index) => (
          <Link
            href={`/providers/${profile.slug}`}
            key={profile.id}
            className="panel fade-in-up group p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(54,28,14,0.16)]"
            style={{ animationDelay: `${Math.min(index * 40, 260)}ms` }}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-amber-700">{profile.category}</p>
            <h2 className="mt-2 text-2xl">{profile.brandName}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-[#563c30]">{profile.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="soft-pulse rounded-full px-2 py-1 text-xs">Republic Score {profile.republicScore.toFixed(1)}</span>
              <span>{profile.city}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
