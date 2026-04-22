"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  title: string;
  value: string;
};

type Props = {
  items: Item[];
  intervalMs?: number;
};

export function LiveSpotlight({ items, intervalMs = 2800 }: Props) {
  const safeItems = useMemo(() => (items.length ? items : [{ title: "Live", value: "Ready" }]), [items]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeItems.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [safeItems.length, intervalMs]);

  return (
    <div className="panel live-sheen fade-in-up p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-amber-700">Live pulse</p>
      <p className="mt-2 text-xl">{safeItems[index].title}</p>
      <p className="mt-1 text-sm text-[#5b4033]">{safeItems[index].value}</p>
    </div>
  );
}
