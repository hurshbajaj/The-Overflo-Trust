"use client";

import type { CSSProperties } from "react";

const LINES = [
  { side: "left", y: 10, w: 150, delay: 60, driftDelay: 0 },
  { side: "left", y: 18, w: 110, delay: 200, driftDelay: 350 },
  { side: "left", y: 28, w: 190, delay: 120, driftDelay: 800 },
  { side: "left", y: 39, w: 130, delay: 300, driftDelay: 500 },
  { side: "left", y: 50, w: 170, delay: 180, driftDelay: 1050 },
  { side: "left", y: 61, w: 118, delay: 340, driftDelay: 260 },
  { side: "left", y: 72, w: 154, delay: 230, driftDelay: 620 },
  { side: "left", y: 84, w: 126, delay: 410, driftDelay: 900 },
  { side: "right", y: 12, w: 145, delay: 90, driftDelay: 120 },
  { side: "right", y: 22, w: 186, delay: 240, driftDelay: 680 },
  { side: "right", y: 33, w: 120, delay: 140, driftDelay: 420 },
  { side: "right", y: 45, w: 176, delay: 320, driftDelay: 980 },
  { side: "right", y: 58, w: 134, delay: 220, driftDelay: 300 },
  { side: "right", y: 69, w: 164, delay: 380, driftDelay: 840 },
  { side: "right", y: 79, w: 112, delay: 290, driftDelay: 540 },
  { side: "right", y: 88, w: 152, delay: 440, driftDelay: 1120 },
];

export function SideLines() {
  return (
    <div className="side-lines-layer" aria-hidden>
      {LINES.map((line, index) => (
        <span
          key={`${line.side}-${line.y}-${index}`}
          className={`side-line side-line-${line.side}`}
          style={
            {
              top: `${line.y}%`,
              width: `${line.w}px`,
              animationDelay: `${line.delay}ms, ${line.driftDelay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
