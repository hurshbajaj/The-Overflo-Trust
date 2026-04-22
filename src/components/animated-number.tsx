"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  value: number;
  durationMs?: number;
  decimals?: number;
};

export function AnimatedNumber({ value, durationMs = 1200, decimals = 0 }: Props) {
  const [display, setDisplay] = useState(0);
  const target = useMemo(() => Number(value) || 0, [value]);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.max(30, Math.round(durationMs / 16));
    const step = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, durationMs]);

  return <>{display.toFixed(decimals)}</>;
}
