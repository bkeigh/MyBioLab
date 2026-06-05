import { motion } from "framer-motion";
import { Ruler, Sparkles, MapPin, Lightbulb } from "lucide-react";
import type { CellType, Organelle } from "../types";
import { OrganelleGlyph } from "./OrganelleGlyph";

export function InfoPanel({
  cell,
  organelle,
  funFact,
}: {
  cell: CellType;
  organelle: Organelle | null;
  funFact: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-lab-line bg-lab-card/70 p-4 shadow-bubble backdrop-blur">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lab-mute">
          <Sparkles className="h-4 w-4" style={{ color: cell.accent }} />
          Organelle Card
        </div>

        <div>
          {organelle ? (
            <motion.div
              key={organelle.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl p-2"
                  style={{ background: `${organelle.color}22`, boxShadow: `inset 0 0 0 2px ${organelle.color}55` }}
                >
                  <OrganelleGlyph id={organelle.id} color={organelle.color} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold leading-tight">
                    {organelle.name}
                  </h3>
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{ background: organelle.color, color: "#10142e" }}
                  >
                    {organelle.emoji} {organelle.nickname}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm font-semibold leading-relaxed text-lab-ink">
                {organelle.job}
              </p>

              <div className="mt-3 rounded-2xl bg-lab-bg2/70 p-3">
                <div className="flex items-start gap-2 text-sm">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-candy-sun" />
                  <p className="font-semibold text-lab-mute">
                    <span className="text-lab-ink">Think of it like… </span>
                    {organelle.analogy}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-lab-mute">
                <Ruler className="h-4 w-4" />
                {organelle.size}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="py-6 text-center"
            >
              <div className="mb-2 text-4xl">👆</div>
              <p className="text-sm font-bold text-lab-ink">Tap a glowing part!</p>
              <p className="text-xs font-semibold text-lab-mute">
                Click any blob inside the cell to learn its superpower.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fun fact bubble */}
      <div
        className="relative overflow-hidden rounded-3xl border p-4 shadow-bubble"
        style={{ borderColor: `${cell.accent}55`, background: `${cell.accent}14` }}
      >
        <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: cell.accent }}>
          <Sparkles className="h-4 w-4" /> Fun Fact
        </div>
        <motion.p
          key={funFact}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-bold leading-relaxed text-lab-ink"
        >
          {funFact}
        </motion.p>
      </div>

      {/* Where it lives */}
      <div className="rounded-3xl border border-lab-line bg-lab-card/70 p-4 shadow-bubble">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lab-mute">
          <MapPin className="h-4 w-4 text-candy-mint" /> Where it lives
        </div>
        <p className="text-sm font-bold leading-relaxed text-lab-ink">{cell.whereItLives}</p>
      </div>
    </div>
  );
}
