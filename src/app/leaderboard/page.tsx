import Link from "next/link";
import { getLeaderboard } from "@/lib/data";

type Props = {
  searchParams: Promise<{ city?: string; category?: string }>;
};

export default async function LeaderboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const rows = await getLeaderboard(params.city, params.category);
  return (
    <section className="space-y-5">
      <h1 className="text-4xl">Republic Score Leaderboard</h1>
      <form className="panel grid gap-3 p-4 md:grid-cols-3">
        <input name="city" placeholder="Filter by city" defaultValue={params.city} className="rounded-xl border border-amber-900/20 bg-white p-2" />
        <input name="category" placeholder="Filter by category" defaultValue={params.category} className="rounded-xl border border-amber-900/20 bg-white p-2" />
        <button className="btn-primary" type="submit">Apply</button>
      </form>
      <div className="panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f0dfcb]">
            <tr>
              <th className="p-3">Rank</th><th>Name</th><th>Score</th><th>Meals</th><th>Rating</th><th>Streak</th><th>Location</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-amber-900/10">
                <td className="p-3">{row.rank}</td>
                <td>{row.brandName}</td>
                <td>{row.republicScore.toFixed(1)}</td>
                <td>{row.totalMealsDonated}</td>
                <td>{row.averageRating.toFixed(1)}</td>
                <td>{row.consistencyStreak}d</td>
                <td>{row.city}</td>
                <td><Link className="underline" href={`/providers/${row.slug}`}>Profile</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
