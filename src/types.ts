export type OrganelleId =
  | "nucleus"
  | "mitochondria"
  | "chloroplast"
  | "ribosome"
  | "golgi"
  | "er"
  | "vacuole"
  | "lysosome"
  | "membrane"
  | "wall"
  | "cytoplasm"
  | "nucleoid"
  | "flagellum";

export interface Organelle {
  id: OrganelleId;
  name: string;
  nickname: string;
  emoji: string;
  color: string;
  glow: string;
  job: string;
  analogy: string;
  size: string;
  fact: string;
}

export interface OrganellePlacement {
  id: OrganelleId;
  /** percent position inside the cell stage */
  x: number;
  y: number;
  /** relative scale of the blob */
  scale: number;
  /** how many copies to scatter (for ribosomes etc.) */
  count?: number;
}

export interface CellType {
  id: string;
  name: string;
  kidName: string;
  kind: string;
  emoji: string;
  accent: string;
  membrane: string;
  fill: string;
  blurb: string;
  hasWall: boolean;
  shape: "blob" | "rod" | "disc" | "neuron" | "long";
  organelles: OrganellePlacement[];
  whereItLives: string;
}
