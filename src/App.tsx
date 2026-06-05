import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Microscope,
  RotateCw,
  Eye,
  Tags,
  Focus,
  Shuffle,
  RefreshCw,
  Trophy,
  PartyPopper,
  X,
  Search,
} from "lucide-react";
import { CELLS } from "./data/cells";
import { ORGANELLES } from "./data/organelles";
import type { CellType, OrganelleId } from "./types";
import { CellStage, type ViewMode } from "./components/CellStage";
import { CellPicker } from "./components/CellPicker";
import { InfoPanel } from "./components/InfoPanel";
import { Confetti } from "./components/Confetti";
import { cn, pick } from "./lib/utils";

const MODES: { id: ViewMode; label: string; icon: typeof Eye }[] = [
  { id: "explore", label: "Explore", icon: Eye },
  { id: "xray", label: "X-Ray", icon: Focus },
  { id: "labels", label: "Label All", icon: Tags },
];

export default function App() {
  const [cell, setCell] = useState<CellType>(CELLS[0]);
  const [selected, setSelected] = useState<OrganelleId | null>(null);
  const [mode, setMode] = useState<ViewMode>("explore");
  const [spin, setSpin] = useState(false);
  const [isolate, setIsolate] = useState(false);

  const [funFact, setFunFact] = useState(ORGANELLES.nucleus.fact);
  const [confettiRun, setConfettiRun] = useState(0);

  // Quiz state
  const [quizOn, setQuizOn] = useState(false);
  const [target, setTarget] = useState<OrganelleId | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [flash, setFlash] = useState<"right" | "wrong" | null>(null);

  const presentIds = useMemo(
    () => Array.from(new Set(cell.organelles.map((o) => o.id))),
    [cell]
  );

  const selectedOrg = selected ? ORGANELLES[selected] : null;

  // Rotate fun facts when not showing a selected organelle
  useEffect(() => {
    if (selectedOrg) {
      setFunFact(selectedOrg.fact);
      return;
    }
    const facts = presentIds.map((id) => ORGANELLES[id].fact);
    setFunFact((f) => (facts.includes(f) ? f : facts[0]));
    const t = setInterval(() => setFunFact((f) => pick(facts, f)), 6000);
    return () => clearInterval(t);
  }, [selectedOrg, presentIds]);

  const newQuestion = useCallback(() => {
    setTarget(pick(presentIds));
    setSelected(null);
  }, [presentIds]);

  const startQuiz = () => {
    setQuizOn(true);
    setMode("explore");
    setIsolate(false);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setTarget(pick(presentIds));
  };

  const stopQuiz = () => {
    setQuizOn(false);
    setTarget(null);
    setFlash(null);
  };

  const handleSelect = (id: OrganelleId | null) => {
    if (quizOn && id) {
      if (id === target) {
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
        setFlash("right");
        setConfettiRun((r) => r + 1);
        setSelected(id);
        setTimeout(() => {
          setFlash(null);
          newQuestion();
        }, 1100);
      } else {
        setStreak(0);
        setFlash("wrong");
        setTimeout(() => setFlash(null), 600);
      }
      return;
    }
    setSelected(id);
  };

  const switchCell = (c: CellType) => {
    setCell(c);
    setSelected(null);
    setIsolate(false);
    if (quizOn) {
      setTimeout(() => setTarget(pick(c.organelles.map((o) => o.id))), 0);
    }
  };

  const surprise = () => {
    const c = pick(CELLS, cell);
    switchCell(c);
    setTimeout(() => setSelected(pick(c.organelles.map((o) => o.id))), 350);
  };

  return (
    <div className="min-h-screen px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      <Confetti run={confettiRun} />

      {/* Header */}
      <header className="mx-auto mb-6 flex max-w-7xl flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -12, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-candy-grape to-candy-sky text-2xl shadow-glow"
          >
            🔬
          </motion.div>
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-none sm:text-3xl">
              MyBioLab
            </h1>
            <p className="text-xs font-bold text-lab-mute sm:text-sm">
              Cell Explorer — poke around inside a real cell! 🧫
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={surprise}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-candy-pink to-candy-coral px-4 py-2 text-sm font-extrabold text-lab-bg shadow-bubble transition-transform hover:scale-105 active:scale-95"
          >
            <Shuffle className="h-4 w-4" /> Surprise Me
          </button>
          <button
            onClick={quizOn ? stopQuiz : startQuiz}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold shadow-bubble transition-transform hover:scale-105 active:scale-95",
              quizOn
                ? "bg-white/15 text-lab-ink"
                : "bg-gradient-to-r from-candy-sun to-candy-lime text-lab-bg"
            )}
          >
            <Trophy className="h-4 w-4" /> {quizOn ? "Exit Quiz" : "Quiz Me!"}
          </button>
        </div>
      </header>

      {/* Main grid */}
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-lab">
        {/* Left rail */}
        <aside className="order-1">
          <div className="rounded-3xl border border-lab-line bg-lab-card/50 p-3 shadow-bubble">
            <div className="mb-2 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-lab-mute">
              <Microscope className="h-4 w-4 text-candy-grape" /> Pick a Cell
            </div>
            <CellPicker active={cell.id} onPick={switchCell} />
          </div>
        </aside>

        {/* Center stage */}
        <main className="order-3 lg:order-2">
          <div className="relative overflow-hidden rounded-[2rem] border border-lab-line bg-gradient-to-b from-lab-bg2/80 to-lab-bg/60 p-4 shadow-bubble sm:p-6">
            {/* Title row */}
            <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
              <div>
                <motion.h2
                  key={cell.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-display text-3xl font-extrabold sm:text-4xl"
                  style={{ color: cell.accent }}
                >
                  {cell.emoji} {cell.name}
                </motion.h2>
                <p className="max-w-md text-sm font-semibold text-lab-mute">{cell.blurb}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-lab-ink">
                {cell.kind}
              </span>
            </div>

            {/* Quiz banner */}
            <AnimatePresence>
              {quizOn && target && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-2"
                >
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border-2 px-4 py-2.5 font-bold transition-colors",
                      flash === "right"
                        ? "border-candy-lime bg-candy-lime/20 text-candy-lime"
                        : flash === "wrong"
                        ? "border-candy-pink bg-candy-pink/20 text-candy-pink"
                        : "border-candy-sun/60 bg-candy-sun/10 text-lab-ink"
                    )}
                  >
                    <motion.span
                      animate={flash === "wrong" ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className="flex items-center gap-2"
                    >
                      {flash === "right" ? (
                        <>
                          <PartyPopper className="h-5 w-5" /> Woohoo! You found it! 🎉
                        </>
                      ) : flash === "wrong" ? (
                        <>Oops, not that one — try again! 🙈</>
                      ) : (
                        <>
                          <Search className="h-5 w-5" /> Can you find the{" "}
                          <span className="underline decoration-wavy underline-offset-2">
                            {ORGANELLES[target].name}
                          </span>
                          ?
                        </>
                      )}
                    </motion.span>
                    <span className="ml-auto flex items-center gap-3 text-sm">
                      <span className="rounded-full bg-white/15 px-2.5 py-0.5">⭐ {score}</span>
                      <span className="rounded-full bg-white/15 px-2.5 py-0.5">🔥 {streak}</span>
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage */}
            <div className="relative py-2">
              <CellStage
                cell={cell}
                selected={selected}
                onSelect={handleSelect}
                mode={mode}
                spin={spin}
                isolate={isolate}
              />
            </div>

            {/* View modes */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <div className="flex rounded-full bg-lab-bg/70 p-1">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const on = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={cn(
                        "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                        on ? "text-lab-bg" : "text-lab-mute hover:text-lab-ink"
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="mode-pill"
                          className="absolute inset-0 rounded-full"
                          style={{ background: cell.accent }}
                        />
                      )}
                      <Icon className="relative h-3.5 w-3.5" />
                      <span className="relative">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <Chip active={spin} onClick={() => setSpin((s) => !s)} icon={RotateCw}>
                Spin
              </Chip>
              <Chip
                active={isolate}
                onClick={() => setIsolate((s) => !s)}
                icon={Focus}
                disabled={!selected}
              >
                Isolate
              </Chip>
              <Chip
                active={false}
                onClick={() => {
                  setSelected(null);
                  setIsolate(false);
                  setSpin(false);
                  setMode("explore");
                }}
                icon={RefreshCw}
              >
                Reset
              </Chip>
            </div>
          </div>

          {/* Organelle legend strip */}
          <div className="mt-4 rounded-3xl border border-lab-line bg-lab-card/50 p-3 shadow-bubble">
            <div className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-lab-mute">
              Parts in this cell — tap to zoom in
            </div>
            <div className="flex flex-wrap gap-2">
              {presentIds.map((id) => {
                const o = ORGANELLES[id];
                const on = selected === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleSelect(on ? null : id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all",
                      on ? "scale-105 text-lab-bg" : "border-lab-line text-lab-ink hover:border-white/25"
                    )}
                    style={on ? { background: o.color, borderColor: o.color } : undefined}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: o.color }}
                    />
                    {o.emoji} {o.name}
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right rail */}
        <aside className="order-2 lg:order-3">
          <InfoPanel cell={cell} organelle={selectedOrg} funFact={funFact} />
        </aside>
      </div>

      <footer className="mx-auto mt-10 max-w-7xl text-center text-xs font-bold text-lab-mute">
        Made for curious kids 🧠✨ — every cell is a tiny universe. Keep exploring!
      </footer>

      {/* mobile floating exit-quiz */}
      <AnimatePresence>
        {quizOn && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={stopQuiz}
            className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-candy-pink text-lab-bg shadow-glow lg:hidden"
            aria-label="Exit quiz"
          >
            <X className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function Chip({
  children,
  icon: Icon,
  active,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  icon: typeof Eye;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all",
        disabled && "cursor-not-allowed opacity-35",
        active
          ? "border-transparent bg-candy-grape text-lab-bg"
          : "border-lab-line text-lab-ink hover:border-white/25"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
