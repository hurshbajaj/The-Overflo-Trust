export default function AboutPage() {
  const items = [
    "Artisan Bread Trays",
    "Fresh Produce Crates",
    "Cooked Meal Packs",
    "Dairy Baskets",
    "Fruit Boxes",
    "Prepared Soups",
  ];

  return (
    <section className="space-y-6">
      <div className="panel fade-in-up space-y-6 p-10">
        <h1 className="text-4xl">Why The Overflo&apos; Trust exists</h1>
        <p className="text-[#4f372c]">
          We turn edible surplus into coordinated civic infrastructure. The platform pairs establishments and community responders, then
          rewards consistent stewardship through Republic Score and public credibility.
        </p>
        <p className="text-[#4f372c]">
          The trust model is transparent: score inputs are weighted by measurable outcomes such as meal quantity, freshness quality,
          pickup reliability, and community feedback. Ranking is earned through sustained execution.
        </p>
        <p className="text-[#4f372c]">
          Every donation event strengthens local resilience, reduces landfill burden, and builds a visible culture of honorable abundance.
        </p>
      </div>

      <div className="panel live-sheen fade-in-up p-6" style={{ animationDelay: "100ms" }}>
        <h2 className="text-2xl">From Surplus to Service</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="soft-pulse rounded-xl border border-amber-900/15 bg-white/75 p-4 text-sm">1. Surplus identified</div>
          <div className="soft-pulse rounded-xl border border-amber-900/15 bg-white/75 p-4 text-sm">2. Steward logs donation</div>
          <div className="soft-pulse rounded-xl border border-amber-900/15 bg-white/75 p-4 text-sm">3. Pickup coordination</div>
          <div className="soft-pulse rounded-xl border border-amber-900/15 bg-white/75 p-4 text-sm">4. Community served</div>
        </div>
      </div>

      <div className="panel fade-in-up space-y-3 p-6" style={{ animationDelay: "180ms" }}>
        <h2 className="text-2xl">Today&apos;s Moving Pantry</h2>
        <p className="text-sm text-[#5a4033]">A live-style carousel of typical redistributable food categories across the network.</p>
        <div className="marquee rounded-xl border border-amber-900/10 bg-white/70 p-3">
          <div className="marquee-track">
            {[...items, ...items].map((item, index) => (
              <span key={`${item}-${index}`} className="rounded-full border border-amber-900/20 bg-[#f7ecde] px-3 py-1 text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
