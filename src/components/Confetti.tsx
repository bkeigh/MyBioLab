import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#ff7eb3", "#a78bfa", "#5ec8ff", "#5eead4", "#ffd166", "#b6f36b", "#ff9e6d"];

export function Confetti({ run }: { run: number }) {
  // `run` changes each time we want a fresh burst
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: `${run}-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1.6 + Math.random() * 1.4,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        drift: (Math.random() - 0.5) * 160,
      })),
    [run]
  );

  if (!run) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="confetti-piece"
          style={{ left: `${p.left}%`, background: p.color }}
          initial={{ y: -30, opacity: 1, rotate: p.rotate }}
          animate={{ y: "100vh", x: p.drift, opacity: [1, 1, 0], rotate: p.rotate + 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
