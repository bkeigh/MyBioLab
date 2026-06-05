import { motion } from "framer-motion";
import { CELLS } from "../data/cells";
import type { CellType } from "../types";
import { cn } from "../lib/utils";

export function CellPicker({
  active,
  onPick,
}: {
  active: string;
  onPick: (cell: CellType) => void;
}) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
      {CELLS.map((cell) => {
        const isActive = cell.id === active;
        return (
          <motion.button
            key={cell.id}
            type="button"
            onClick={() => onPick(cell)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "group relative flex w-[200px] shrink-0 items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors lg:w-auto",
              isActive
                ? "border-transparent text-lab-bg"
                : "border-lab-line bg-lab-card/60 text-lab-ink hover:border-white/20"
            )}
            style={isActive ? { background: cell.accent } : undefined}
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl shadow-inner"
              style={{
                background: isActive ? "rgba(255,255,255,0.35)" : `${cell.accent}22`,
                boxShadow: `inset 0 0 0 2px ${cell.accent}55`,
              }}
            >
              {cell.emoji}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-[15px] font-bold leading-tight">
                {cell.name}
              </span>
              <span
                className={cn(
                  "block truncate text-xs font-semibold",
                  isActive ? "text-lab-bg/70" : "text-lab-mute"
                )}
              >
                {cell.kidName}
              </span>
            </span>
            {isActive && (
              <motion.span
                layoutId="cell-dot"
                className="ml-auto h-2.5 w-2.5 rounded-full bg-lab-bg"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
