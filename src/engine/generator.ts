import type { Board, Color, Move } from './types';
import { applyMove } from './placement';

export interface GeneratedPuzzle {
  target: Board;
  solution: Move[];
  gridSize: 4 | 5 | 6 | 8;
  seed: string;
}

// mulberry32 — zero-dependency deterministic PRNG (seed: uint32 → () => float in [0,1))
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let z = s;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

// djb2-style hash: string → uint32
function hashSeed(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0;
  }
  return h;
}

// Color weights: red 0.45, yellow 0.40, green 0.15.
// Green is downweighted because it cascades widely (full row + column),
// making all-one-color boards much more likely when green dominates.
// These are starting values to be tuned by playtesting.
const RED_THRESHOLD = 0.45;
const YELLOW_THRESHOLD = 0.85; // red + yellow = 0.45 + 0.40

function sampleColor(rng: () => number): Color {
  const r = rng();
  if (r < RED_THRESHOLD) return 'red';
  if (r < YELLOW_THRESHOLD) return 'yellow';
  return 'green';
}

function emptyBoard(size: number): Board {
  return Array.from({ length: size }, () => Array<'empty'>(size).fill('empty'));
}

function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < a.length; r++) {
    for (let c = 0; c < a[0].length; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

// Trivial-puzzle rejection criteria:
//   1. All cells are empty.
//   2. All cells are the same non-empty color.
//   3. More than 85% of cells are a single color.
//   4. The first move alone produces the target (effectively a 1-move puzzle).
function isTrivial(target: Board, solution: Move[], size: number): boolean {
  const total = size * size;
  const counts = { empty: 0, red: 0, yellow: 0, green: 0 };
  for (const row of target) for (const cell of row) counts[cell]++;

  if (counts.empty === total) return true;

  const threshold = total * 0.85;
  for (const color of ['red', 'yellow', 'green'] as const) {
    if (counts[color] === total) return true;
    if (counts[color] > threshold) return true;
  }

  const afterFirst = applyMove(emptyBoard(size), solution[0].color, solution[0].row, solution[0].col);
  if (boardsEqual(afterFirst, target)) return true;

  return false;
}

const MOVE_RANGE: Record<4 | 5 | 6 | 8, [number, number]> = {
  4: [4, 7],
  5: [5, 9],
  6: [6, 10],
  8: [8, 14],
};

function tryGenerate(seed: string, gridSize: 4 | 5 | 6 | 8, attempt: number): GeneratedPuzzle | null {
  // Each attempt uses a distinct internal RNG seed so retries explore different boards.
  const rng = mulberry32(hashSeed(`${seed}/${attempt}`));
  const [minMoves, maxMoves] = MOVE_RANGE[gridSize];
  const numMoves = minMoves + Math.floor(rng() * (maxMoves - minMoves + 1));

  const solution: Move[] = [];
  for (let i = 0; i < numMoves; i++) {
    solution.push({
      color: sampleColor(rng),
      row: Math.floor(rng() * gridSize),
      col: Math.floor(rng() * gridSize),
    });
  }

  let target = emptyBoard(gridSize);
  for (const move of solution) {
    target = applyMove(target, move.color, move.row, move.col);
  }

  if (isTrivial(target, solution, gridSize)) return null;

  return { target, solution, gridSize, seed };
}

export function generatePuzzle(seed: string, gridSize: 4 | 5 | 6 | 8): GeneratedPuzzle {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const result = tryGenerate(seed, gridSize, attempt);
    if (result !== null) return result;
  }
  throw new Error(`generatePuzzle: could not produce a non-trivial puzzle for seed "${seed}" after 1000 attempts`);
}

export function dailySeed(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `RYGO-${y}-${m}-${d}`;
}
