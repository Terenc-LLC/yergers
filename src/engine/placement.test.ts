import { describe, it, expect } from 'vitest';
import { applyMove } from './placement';
import { generatePuzzle } from './generator';
import type { Board } from './types';

function emptyBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, () => Array<'empty'>(cols).fill('empty'));
}

// ---------------------------------------------------------------------------
// Red
// ---------------------------------------------------------------------------

describe('red — reach and overwrite', () => {
  it('fills only the target cell on an empty board', () => {
    const result = applyMove(emptyBoard(3, 3), 'red', 1, 1);
    expect(result[1][1]).toBe('red');
    expect(result.flat().filter(c => c !== 'empty')).toHaveLength(1);
  });

  it('overwrites green', () => {
    const board = emptyBoard(3, 3);
    board[1][1] = 'green';
    expect(applyMove(board, 'red', 1, 1)[1][1]).toBe('red');
  });

  it('overwrites yellow', () => {
    const board = emptyBoard(3, 3);
    board[1][1] = 'yellow';
    expect(applyMove(board, 'red', 1, 1)[1][1]).toBe('red');
  });

  it('overwrites red (stays red)', () => {
    const board = emptyBoard(3, 3);
    board[1][1] = 'red';
    expect(applyMove(board, 'red', 1, 1)[1][1]).toBe('red');
  });
});

// ---------------------------------------------------------------------------
// Yellow — reach (clipping)
// ---------------------------------------------------------------------------

describe('yellow — reach', () => {
  it('fills 3 cells at corner (0, 0)', () => {
    const result = applyMove(emptyBoard(3, 3), 'yellow', 0, 0);
    expect(result.flat().filter(c => c !== 'empty')).toHaveLength(3);
    expect(result[0][0]).toBe('yellow');
    expect(result[1][0]).toBe('yellow');
    expect(result[0][1]).toBe('yellow');
  });

  it('fills 4 cells at edge (0, 1)', () => {
    const result = applyMove(emptyBoard(3, 3), 'yellow', 0, 1);
    expect(result.flat().filter(c => c !== 'empty')).toHaveLength(4);
  });

  it('fills 5 cells at interior (1, 1)', () => {
    const result = applyMove(emptyBoard(3, 3), 'yellow', 1, 1);
    expect(result.flat().filter(c => c !== 'empty')).toHaveLength(5);
  });

  it('does not affect cells outside the plus shape on a large grid', () => {
    const result = applyMove(emptyBoard(10, 10), 'yellow', 5, 5);
    const filled: [number, number][] = [];
    for (let r = 0; r < 10; r++)
      for (let c = 0; c < 10; c++)
        if (result[r][c] !== 'empty') filled.push([r, c]);
    expect(filled).toHaveLength(5);
    expect(filled).toContainEqual([5, 5]);
    expect(filled).toContainEqual([4, 5]);
    expect(filled).toContainEqual([6, 5]);
    expect(filled).toContainEqual([5, 4]);
    expect(filled).toContainEqual([5, 6]);
  });
});

// ---------------------------------------------------------------------------
// Yellow — overwrite hierarchy
// ---------------------------------------------------------------------------

describe('yellow — overwrite hierarchy', () => {
  it('does not overwrite red', () => {
    const board = emptyBoard(3, 3);
    board[0][1] = 'red'; // neighbour of (0, 0)
    expect(applyMove(board, 'yellow', 0, 0)[0][1]).toBe('red');
  });

  it('does not overwrite yellow', () => {
    const board = emptyBoard(3, 3);
    board[0][1] = 'yellow'; // neighbour of (0, 0)
    expect(applyMove(board, 'yellow', 0, 0)[0][1]).toBe('yellow');
  });

  it('overwrites green', () => {
    const board = emptyBoard(3, 3);
    board[0][1] = 'green'; // neighbour of (0, 0)
    expect(applyMove(board, 'yellow', 0, 0)[0][1]).toBe('yellow');
  });
});

// ---------------------------------------------------------------------------
// Green — reach on empty boards
//
// These tests use empty boards, so blocking has no effect and the results are
// identical to the old full-row+full-column behavior. No changes needed.
// ---------------------------------------------------------------------------

describe('green — reach (empty board)', () => {
  it('fills 2N−1 cells on an empty N×N board', () => {
    const n = 5;
    const result = applyMove(emptyBoard(n, n), 'green', 2, 2);
    expect(result.flat().filter(c => c !== 'empty')).toHaveLength(2 * n - 1);
  });

  it('fills full row and full column, no double-counting', () => {
    const result = applyMove(emptyBoard(4, 4), 'green', 1, 2);
    // row 1: cols 0-3 (4 cells); col 2: rows 0, 2, 3 (3 cells) → 7 = 2*4-1
    expect(result.flat().filter(c => c !== 'empty')).toHaveLength(7);
    for (let c = 0; c < 4; c++) expect(result[1][c]).toBe('green');
    for (let r = 0; r < 4; r++) expect(result[r][2]).toBe('green');
  });
});

// ---------------------------------------------------------------------------
// Green — overwrite hierarchy
//
// These tests have non-empty cells that now also act as blockers, but the
// assertions only check that those cells remain unchanged — which is still true
// (the cells are no longer even in the reach, let alone overwritten).
// ---------------------------------------------------------------------------

describe('green — overwrite hierarchy', () => {
  it('does not overwrite red', () => {
    const board = emptyBoard(3, 3);
    board[1][0] = 'red'; // same row as placement — now also a blocker
    expect(applyMove(board, 'green', 1, 1)[1][0]).toBe('red');
  });

  it('does not overwrite yellow', () => {
    const board = emptyBoard(3, 3);
    board[0][1] = 'yellow'; // same col as placement — now also a blocker
    expect(applyMove(board, 'green', 1, 1)[0][1]).toBe('yellow');
  });

  it('does not overwrite existing green', () => {
    const board = emptyBoard(3, 3);
    board[1][0] = 'green'; // same row as placement — now also a blocker
    expect(applyMove(board, 'green', 1, 2)[1][0]).toBe('green');
  });
});

// ---------------------------------------------------------------------------
// Green — blocking semantics (new in TER-149)
// ---------------------------------------------------------------------------

describe('green — blocking semantics', () => {
  it('empty board: fills full row+column from interior (Example 1 pattern)', () => {
    // 4×4, place at (1, 0) — identical to old full-row+column on empty boards
    const result = applyMove(emptyBoard(4, 4), 'green', 1, 0);
    // row 1: all 4 cols; col 0: rows 0, 2, 3 — total 7 cells
    expect(result[0][0]).toBe('green');
    expect(result[1][0]).toBe('green');
    expect(result[1][1]).toBe('green');
    expect(result[1][2]).toBe('green');
    expect(result[1][3]).toBe('green');
    expect(result[2][0]).toBe('green');
    expect(result[3][0]).toBe('green');
    // spot-check: cells not in reach are empty
    expect(result[0][1]).toBe('empty');
    expect(result[2][1]).toBe('empty');
  });

  it('red blocker stops rightward propagation (Example 2)', () => {
    // 4×4, red at (1, 2), place green at (1, 0)
    const board = emptyBoard(4, 4);
    board[1][2] = 'red';
    const result = applyMove(board, 'green', 1, 0);
    // row 1: (1,0) and (1,1) reached; (1,2) is red blocker — not in reach
    expect(result[1][0]).toBe('green');
    expect(result[1][1]).toBe('green');
    expect(result[1][2]).toBe('red');   // blocker untouched
    expect(result[1][3]).toBe('empty'); // beyond blocker, not reached
    // col 0: (0,0), (2,0), (3,0) all reached (no blockers)
    expect(result[0][0]).toBe('green');
    expect(result[2][0]).toBe('green');
    expect(result[3][0]).toBe('green');
  });

  it('yellow blocker stops rightward propagation (Example 3)', () => {
    // 4×4, yellow at (0, 2), place green at (0, 0)
    const board = emptyBoard(4, 4);
    board[0][2] = 'yellow';
    const result = applyMove(board, 'green', 0, 0);
    // row 0: (0,0) and (0,1) reached; (0,2) is yellow blocker — not in reach
    expect(result[0][0]).toBe('green');
    expect(result[0][1]).toBe('green');
    expect(result[0][2]).toBe('yellow'); // blocker untouched
    expect(result[0][3]).toBe('empty');  // beyond blocker
    // col 0: (1,0), (2,0), (3,0) all reached (no blockers above row 0 or up direction hits edge)
    expect(result[1][0]).toBe('green');
    expect(result[2][0]).toBe('green');
    expect(result[3][0]).toBe('green');
  });

  it('placed cell is always in reach even if non-empty; reach computed on original board', () => {
    // Place green on a cell that already has yellow — yellow stays (hierarchy),
    // but reach is computed treating the original cell state as-is.
    // Board: yellow at (1,1). Place green at (1,1). canOverwrite('yellow','green') = false → stays yellow.
    // Propagation: up=(0,1) empty→included, down=(2,1) empty→included,
    //              left=(1,0) empty→included, right=(1,2) empty→included.
    const board = emptyBoard(3, 3);
    board[1][1] = 'yellow';
    const result = applyMove(board, 'green', 1, 1);
    expect(result[1][1]).toBe('yellow'); // hierarchy prevents overwrite
    expect(result[0][1]).toBe('green');
    expect(result[2][1]).toBe('green');
    expect(result[1][0]).toBe('green');
    expect(result[1][2]).toBe('green');
  });

  it('corner (0, 0): reach is rightward and downward only', () => {
    const result = applyMove(emptyBoard(4, 4), 'green', 0, 0);
    // up: edge; left: edge; down: (1,0),(2,0),(3,0); right: (0,1),(0,2),(0,3)
    for (let c = 0; c < 4; c++) expect(result[0][c]).toBe('green');
    for (let r = 0; r < 4; r++) expect(result[r][0]).toBe('green');
    // other cells untouched
    expect(result[1][1]).toBe('empty');
    expect(result[2][2]).toBe('empty');
  });

  it('blockers on all four cardinal sides: reach is only the placed cell', () => {
    // 5×5, blockers immediately adjacent to (2,2) in all four directions
    const board = emptyBoard(5, 5);
    board[1][2] = 'red';
    board[3][2] = 'red';
    board[2][1] = 'red';
    board[2][3] = 'red';
    const result = applyMove(board, 'green', 2, 2);
    expect(result[2][2]).toBe('green'); // placed cell overwritten (empty → green)
    // blockers stay; cells beyond them stay empty
    expect(result[1][2]).toBe('red');
    expect(result[0][2]).toBe('empty');
    expect(result[3][2]).toBe('red');
    expect(result[4][2]).toBe('empty');
    expect(result[2][1]).toBe('red');
    expect(result[2][0]).toBe('empty');
    expect(result[2][3]).toBe('red');
    expect(result[2][4]).toBe('empty');
  });
});

// ---------------------------------------------------------------------------
// Immutability
// ---------------------------------------------------------------------------

describe('immutability — input board is never mutated', () => {
  it('red placement', () => {
    const board = emptyBoard(3, 3);
    const snapshot = board.map(r => [...r]);
    applyMove(board, 'red', 1, 1);
    expect(board).toEqual(snapshot);
  });

  it('yellow placement', () => {
    const board = emptyBoard(3, 3);
    const snapshot = board.map(r => [...r]);
    applyMove(board, 'yellow', 1, 1);
    expect(board).toEqual(snapshot);
  });

  it('green placement', () => {
    const board = emptyBoard(3, 3);
    const snapshot = board.map(r => [...r]);
    applyMove(board, 'green', 1, 1);
    expect(board).toEqual(snapshot);
  });
});

// ---------------------------------------------------------------------------
// Out-of-bounds
// ---------------------------------------------------------------------------

describe('out-of-bounds — throws RangeError', () => {
  it('negative row', () => {
    expect(() => applyMove(emptyBoard(3, 3), 'red', -1, 0)).toThrow(RangeError);
  });

  it('row >= rows', () => {
    expect(() => applyMove(emptyBoard(3, 3), 'red', 3, 0)).toThrow(RangeError);
  });

  it('negative col', () => {
    expect(() => applyMove(emptyBoard(3, 3), 'red', 0, -1)).toThrow(RangeError);
  });

  it('col >= cols', () => {
    expect(() => applyMove(emptyBoard(3, 3), 'red', 0, 3)).toThrow(RangeError);
  });
});

// ---------------------------------------------------------------------------
// Bulk regression — 1000 seeded puzzles remain solvable after engine change
// ---------------------------------------------------------------------------

describe('bulk regression — 1000 puzzles solvable with new applyMove', () => {
  it('replaying each solution on an empty board reproduces the target', () => {
    const sizes = [4, 5, 6, 8] as const;
    for (let i = 0; i < 1000; i++) {
      const size = sizes[i % 4];
      const { target, solution, gridSize } = generatePuzzle(`regression-${i}`, size);
      let board: Board = Array.from({ length: gridSize }, () =>
        Array<'empty'>(gridSize).fill('empty'),
      );
      for (const move of solution) {
        board = applyMove(board, move.color, move.row, move.col);
      }
      // Verify every cell matches
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          expect(board[r][c]).toBe(target[r][c]);
        }
      }
    }
  });
});
