# MyBioLab — Cell Explorer 🔬🧫

An interactive, **kid-friendly cell architecture explorer**. Poke around inside a real cell,
click the glowing organelles to learn their superpowers, switch between 6 cell types, and
play a "find the organelle" quiz with confetti.

Built as a playful, science-y reimagining of a cell-anatomy studio — bubbly shapes, candy
colors, floating organelles, and fancy animations.

## Features

- **6 cell types** — Animal, Plant, Bacteria, Nerve, Red Blood, Muscle — each with a kid
  nickname, blurb, and its own scientifically-accurate set of organelles (e.g. bacteria has
  a flagellum + nucleoid and no nucleus).
- **Interactive cell stage** — an animated SVG cell with clickable, hoverable, jiggling
  organelle blobs. Each organelle has a unique hand-drawn glyph.
- **Organelle Card** — tap any part to see what it does, a kid-friendly analogy, its size,
  and a fun fact.
- **View modes** — Explore, X-Ray (dim the rest), Label All.
- **Controls** — Spin the cell, Isolate the selected part, Reset, and "Surprise Me".
- **Quiz Mode** — "Can you find the Mitochondria?" with score, streak, and a confetti burst
  on every correct answer.
- **Responsive** — 3-column desktop layout collapses to a stacked, swipeable mobile layout.
- **Accessible** — keyboard-focusable organelles, ARIA labels, and a `prefers-reduced-motion`
  fallback that calms the animations.

## Stack

Vite · React · TypeScript · Tailwind CSS · Framer Motion · lucide-react

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

## Structure

```
src/
├── App.tsx                  # layout, controls, view modes, quiz orchestration
├── types.ts                 # Organelle / CellType models
├── data/
│   ├── organelles.ts        # the master organelle dictionary (kid copy + facts)
│   └── cells.ts             # the 6 cells and where each organelle sits
├── components/
│   ├── CellStage.tsx        # the animated cell + organelle layout
│   ├── OrganelleBlob.tsx    # one interactive, animated organelle
│   ├── OrganelleGlyph.tsx   # the SVG art for each organelle
│   ├── CellPicker.tsx       # left-rail cell switcher
│   ├── InfoPanel.tsx        # right-rail organelle card + fun fact
│   └── Confetti.tsx         # quiz-win confetti
└── lib/utils.ts
```

All data is local/demo — no backend.
