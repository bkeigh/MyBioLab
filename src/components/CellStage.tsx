import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CellType, OrganelleId } from "../types";
import { ORGANELLES } from "../data/organelles";
import { OrganelleBlob } from "./OrganelleBlob";

export type ViewMode = "explore" | "xray" | "labels";

interface Props {
  cell: CellType;
  selected: OrganelleId | null;
  onSelect: (id: OrganelleId | null) => void;
  mode: ViewMode;
  spin: boolean;
  isolate: boolean;
}

interface Rendered {
  key: string;
  id: OrganelleId;
  x: number;
  y: number;
  scale: number;
  delay: number;
}

function expand(cell: CellType): Rendered[] {
  const out: Rendered[] = [];
  cell.organelles.forEach((p, pi) => {
    const count = p.count ?? 1;
    for (let i = 0; i < count; i++) {
      let x = p.x;
      let y = p.y;
      if (count > 1) {
        const ang = (i / count) * Math.PI * 2 + pi;
        const rad = 9 + ((i * 5) % 11);
        x += Math.cos(ang) * rad;
        y += Math.sin(ang) * rad * 0.8;
      }
      out.push({ key: `${p.id}-${pi}-${i}`, id: p.id, x, y, scale: p.scale, delay: 0.05 * out.length });
    }
  });
  return out;
}

function shapeStyle(cell: CellType): React.CSSProperties {
  const grad = `radial-gradient(120% 120% at 32% 26%, ${cell.fill}ee, ${cell.fill}99 55%, ${cell.fill}cc)`;
  const common: React.CSSProperties = {
    background: grad,
    border: `4px solid ${cell.membrane}`,
    boxShadow: `inset 0 0 60px ${cell.membrane}55, 0 0 50px -10px ${cell.accent}88`,
  };
  switch (cell.shape) {
    case "rod":
      return { ...common, width: "90%", height: "46%", borderRadius: "999px" };
    case "disc":
      return {
        ...common,
        width: "82%",
        height: "82%",
        borderRadius: "50%",
        background: `radial-gradient(circle at 50% 50%, ${cell.fill}55 18%, ${cell.fill}ee 36%, ${cell.fill}cc 100%)`,
      };
    case "long":
      return { ...common, width: "60%", height: "92%", borderRadius: "90px" };
    case "neuron":
      return { ...common, width: "70%", height: "70%", borderRadius: "48% 52% 46% 54% / 52% 46% 54% 48%" };
    default:
      return { ...common, width: "84%", height: "84%", borderRadius: "47% 53% 44% 56% / 55% 48% 52% 45%" };
  }
}

export function CellStage({ cell, selected, onSelect, mode, spin, isolate }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(520);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const items = expand(cell);
  const base = w * 0.13;

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-square w-full max-w-[560px] select-none"
      onClick={() => onSelect(null)}
    >
      {/* dotted petri ring */}
      <div className="pointer-events-none absolute inset-1 rounded-full border border-dashed border-white/10" />

      <motion.div
        className="absolute inset-0 grid place-items-center"
        animate={{ rotate: spin ? 360 : 0 }}
        transition={{ duration: 26, repeat: spin ? Infinity : 0, ease: "linear" }}
      >
        {/* neuron dendrites */}
        {cell.shape === "neuron" && (
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
            {[15, 75, 135, 195, 255, 315].map((deg) => {
              const r = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={50 + Math.cos(r) * 18}
                  y1={50 + Math.sin(r) * 18}
                  x2={50 + Math.cos(r) * 48}
                  y2={50 + Math.sin(r) * 48}
                  stroke={cell.membrane}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        )}

        {/* cell wall */}
        {cell.hasWall && (
          <div
            className="absolute"
            style={{
              width: cell.shape === "rod" ? "97%" : "92%",
              height: cell.shape === "rod" ? "54%" : "92%",
              borderRadius: cell.shape === "rod" ? "999px" : "44% 56% 48% 52% / 52% 44% 56% 48%",
              border: `9px solid ${cell.id === "plant" ? "#7ec64f" : "#e6b84a"}`,
              boxShadow: "inset 0 0 24px rgba(0,0,0,0.25)",
            }}
          />
        )}

        {/* membrane body */}
        <motion.div
          className="absolute overflow-visible"
          style={shapeStyle(cell)}
          animate={
            cell.shape === "blob"
              ? { borderRadius: [
                  "47% 53% 44% 56% / 55% 48% 52% 45%",
                  "53% 47% 56% 44% / 47% 55% 45% 52%",
                  "47% 53% 44% 56% / 55% 48% 52% 45%",
                ] }
              : {}
          }
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          {mode !== "xray" && (
            <span
              aria-hidden
              className="absolute left-[18%] top-[14%] h-[22%] w-[22%] rounded-full bg-white/25 blur-md"
            />
          )}
        </motion.div>

        {/* organelles */}
        {items.map((it) => {
          const org = ORGANELLES[it.id];
          const isSel = selected === it.id;
          const dimmed = (isolate && selected !== null && !isSel) || (mode === "xray" && !isSel && selected !== null);
          return (
            <OrganelleBlob
              key={it.key}
              org={org}
              x={it.x}
              y={it.y}
              size={base * it.scale}
              delay={it.delay}
              selected={isSel}
              dimmed={dimmed}
              showLabel={mode === "labels"}
              onSelect={() => onSelect(it.id)}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
