import { redirect } from "next/navigation";
import { addDonationAction, updateStewardProfileAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnimatedNumber } from "@/components/animated-number";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STEWARD") redirect("/login");
  const profile = await prisma.stewardProfile.findUnique({
    where: { userId: user.id },
    include: { donations: { orderBy: { createdAt: "desc" }, take: 6 } },
  });
  if (!profile) redirect("/signup");
  return (
    <section className="space-y-6">
      <h1 className="fade-in-up text-4xl">Steward Command Deck</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="panel fade-in-up p-4" style={{ animationDelay: "80ms" }}><p className="text-sm">Republic Score</p><p className="text-3xl"><AnimatedNumber value={profile.republicScore} decimals={1} /></p></div>
        <div className="panel fade-in-up p-4" style={{ animationDelay: "140ms" }}><p className="text-sm">Profile views</p><p className="text-3xl"><AnimatedNumber value={profile.profileViews} /></p></div>
        <div className="panel fade-in-up p-4" style={{ animationDelay: "200ms" }}><p className="text-sm">Meals donated</p><p className="text-3xl"><AnimatedNumber value={profile.totalMealsDonated} /></p></div>
        <div className="panel fade-in-up p-4" style={{ animationDelay: "260ms" }}><p className="text-sm">Consistency</p><p className="text-3xl"><AnimatedNumber value={profile.consistencyStreak} />d</p></div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2 fade-in-up" style={{ animationDelay: "320ms" }}>
        <form action={updateStewardProfileAction} className="panel space-y-2 p-5">
          <h2 className="text-2xl">Public profile settings</h2>
          <input name="brandName" defaultValue={profile.brandName} className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <textarea name="description" defaultValue={profile.description} className="min-h-24 w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <textarea name="story" defaultValue={profile.story} className="min-h-24 w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <input name="address" defaultValue={profile.address} className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <input name="city" defaultValue={profile.city} className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <input name="openHours" defaultValue={profile.openHours || ""} placeholder="Open hours" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <input name="contactEmail" defaultValue={profile.contactEmail || ""} placeholder="Contact email" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <input name="contactPhone" defaultValue={profile.contactPhone || ""} placeholder="Contact phone" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <input name="category" defaultValue={profile.category} className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <button className="btn-primary">Save profile</button>
        </form>
        <form action={addDonationAction} className="panel space-y-2 p-5">
          <h2 className="text-2xl">Log donation</h2>
          <input required name="title" placeholder="Donation title" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <input required name="quantityMeals" type="number" min={1} placeholder="Meals" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <textarea required name="description" placeholder="Description" className="min-h-24 w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <input required name="pickupWindow" placeholder="Pickup window" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <select name="freshness" className="w-full rounded-xl border border-amber-900/20 bg-white p-2"><option value="PRIME">Prime</option><option value="FRESH">Fresh</option><option value="STANDARD">Standard</option></select>
          <input name="imageUrl" placeholder="Image URL" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <input name="proofSource" placeholder="Verification source link" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <input name="responseMinutes" type="number" min={1} defaultValue={45} placeholder="Response minutes" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
          <select name="pickupSuccess" className="w-full rounded-xl border border-amber-900/20 bg-white p-2"><option value="true">Pickup successful</option><option value="false">Pickup pending/failed</option></select>
          <button className="btn-primary">Add entry</button>
        </form>
      </div>
      <div className="panel fade-in-up p-5" style={{ animationDelay: "380ms" }}>
        <h2 className="text-2xl">Recent entries</h2>
        <div className="mt-3 space-y-2">
          {profile.donations.map((d) => (
            <div key={d.id} className="rounded-xl border border-amber-900/10 p-3 text-sm">
              {d.title} • {d.quantityMeals} meals • {d.pickupSuccess ? "Success" : "Pending"} • {new Date(d.createdAt).toLocaleDateString()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
