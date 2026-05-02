import { describe, expect, it } from 'vitest';
import { generatePuzzle, dailySeed } from './generator';
import { applyMove } from './placement';
import type { Board } from './types';

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

const SIZES = [4, 5, 6, 8] as const;
const MOVE_RANGES: Record<number, [number, number]> = { 4: [4, 7], 5: [5, 9], 6: [6, 10], 8: [8, 14] };

describe('generatePuzzle — determinism', () => {
  it('same seed + gridSize always produces the same puzzle', () => {
    for (const size of SIZES) {
      const a = generatePuzzle('determinism-test', size);
      const b = generatePuzzle('determinism-test', size);
      expect(a.solution).toEqual(b.solution);
      expect(boardsEqual(a.target, b.target)).toBe(true);
      expect(a.seed).toBe('determinism-test');
    }
  });

  it('10 different seeds produce 10 different puzzles', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const p = generatePuzzle(`seed-${i}`, 4);
      seen.add(JSON.stringify(p.target));
    }
    expect(seen.size).toBeGreaterThanOrEqual(9);
  });
});

describe('generatePuzzle — solution correctness', () => {
  for (const size of SIZES) {
    it(`${size}×${size}: applying solution to empty board produces target`, () => {
      const { target, solution } = generatePuzzle('solution-correctness', size);
      let board = emptyBoard(size);
      for (const move of solution) {
        board = applyMove(board, move.color, move.row, move.col);
      }
      expect(boardsEqual(board, target)).toBe(true);
    });
  }
});

describe('generatePuzzle — solution length', () => {
  for (const size of SIZES) {
    it(`${size}×${size}: solution length is within [${MOVE_RANGES[size][0]}, ${MOVE_RANGES[size][1]}]`, () => {
      const { solution } = generatePuzzle('length-test', size);
      const [min, max] = MOVE_RANGES[size];
      expect(solution.length).toBeGreaterThanOrEqual(min);
      expect(solution.length).toBeLessThanOrEqual(max);
    });
  }
});

describe('generatePuzzle — 5×5 grid', () => {
  it('generates a 5×5 target board', () => {
    const { target } = generatePuzzle('5x5-test', 5);
    expect(target.length).toBe(5);
    expect(target[0].length).toBe(5);
  });

  it('5×5 solution length is within [5, 9]', () => {
    const { solution } = generatePuzzle('5x5-length', 5);
    expect(solution.length).toBeGreaterThanOrEqual(5);
    expect(solution.length).toBeLessThanOrEqual(9);
  });
});

describe('generatePuzzle — non-triviality (1000 puzzles)', () => {
  it('all 1000 generated puzzles pass non-triviality checks', () => {
    for (let i = 0; i < 1000; i++) {
      const size = SIZES[i % 4];
      const { target, solution, gridSize } = generatePuzzle(`bulk-${i}`, size);
      const total = gridSize * gridSize;
      const counts = { empty: 0, red: 0, yellow: 0, green: 0 };
      for (const row of target) for (const cell of row) counts[cell]++;

      // Not all empty
      expect(counts.empty).toBeLessThan(total);

      // Not all one color, not > 85% one color
      for (const color of ['red', 'yellow', 'green'] as const) {
        expect(counts[color]).not.toBe(total);
        expect(counts[color]).toBeLessThanOrEqual(total * 0.85);
      }

      // First move alone does not produce target
      const afterFirst = applyMove(emptyBoard(gridSize), solution[0].color, solution[0].row, solution[0].col);
      expect(boardsEqual(afterFirst, target)).toBe(false);
    }
  });
});

describe('dailySeed', () => {
  it('returns RYGO-YYYY-MM-DD format', () => {
    expect(dailySeed(new Date('2026-05-01T00:00:00Z'))).toBe('RYGO-2026-05-01');
  });

  it('is stable for any time of day on the same UTC date', () => {
    const s1 = dailySeed(new Date('2026-05-01T00:00:00Z'));
    const s2 = dailySeed(new Date('2026-05-01T12:30:00Z'));
    const s3 = dailySeed(new Date('2026-05-01T23:59:59Z'));
    expect(s1).toBe(s2);
    expect(s2).toBe(s3);
  });

  it('differs for different UTC dates', () => {
    const a = dailySeed(new Date('2026-05-01T23:00:00Z'));
    const b = dailySeed(new Date('2026-05-02T01:00:00Z'));
    expect(a).not.toBe(b);
  });

  it('pads month and day with leading zeros', () => {
    expect(dailySeed(new Date('2026-01-05T00:00:00Z'))).toBe('RYGO-2026-01-05');
  });
});
