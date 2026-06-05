import { motion } from "framer-motion";
import type { Organelle } from "../types";
import { OrganelleGlyph } from "./OrganelleGlyph";
import { cn } from "../lib/utils";

interface Props {
  org: Organelle;
  x: number;
  y: number;
  size: number;
  delay: number;
  selected: boolean;
  dimmed: boolean;
  showLabel: boolean;
  onSelect: () => void;
}

export function OrganelleBlob({
  org,
  x,
  y,
  size,
  delay,
  selected,
  dimmed,
  showLabel,
  onSelect,
}: Props) {
  return (
    // Static wrapper owns POSITION + centering (margins, not transform, so Framer
    // Motion's animated transform on the inner button can't knock it off-center).
    <div
      className={cn("absolute hover:z-30", selected ? "z-20" : "z-10")}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
    >
      <motion.button
        type="button"
        aria-label={`${org.name} — ${org.nickname}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: dimmed ? 0.18 : 1,
          y: [0, -5, 0, 4, 0],
        }}
        transition={{
          scale: { type: "spring", stiffness: 260, damping: 18, delay },
          opacity: { duration: 0.4, delay },
          y: { duration: 5 + (delay % 1) * 4, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.16 }}
        whileTap={{ scale: 0.94 }}
        className="group relative block h-full w-full cursor-pointer outline-none focus-visible:scale-110"
      >
        {/* glow */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full blur-xl transition-opacity duration-300",
            selected ? "opacity-90" : "opacity-0 group-hover:opacity-70"
          )}
          style={{ background: org.glow }}
        />
        {/* selection ring */}
        {selected && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-[40%] border-[3px] border-dashed"
            style={{ borderColor: org.color }}
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />
        )}
        <span className="pointer-events-none relative block h-full w-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]">
          <OrganelleGlyph id={org.id} color={org.color} />
        </span>

        {/* hover/selected label */}
        <span
          className={cn(
            "pointer-events-none absolute left-1/2 top-full z-30 mt-1 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold shadow-bubble transition-all duration-200",
            showLabel || selected
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          )}
          style={{ background: org.color, color: "#10142e" }}
        >
          {org.emoji} {org.name}
        </span>
      </motion.button>
    </div>
  );
}
