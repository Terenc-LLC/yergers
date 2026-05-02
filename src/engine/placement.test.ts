import { describe, it, expect } from 'vitest';
import { applyMove } from './placement';
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
// Green — reach
// ---------------------------------------------------------------------------

describe('green — reach', () => {
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
// ---------------------------------------------------------------------------

describe('green — overwrite hierarchy', () => {
  it('does not overwrite red', () => {
    const board = emptyBoard(3, 3);
    board[1][0] = 'red'; // same row as placement
    expect(applyMove(board, 'green', 1, 1)[1][0]).toBe('red');
  });

  it('does not overwrite yellow', () => {
    const board = emptyBoard(3, 3);
    board[0][1] = 'yellow'; // same col as placement
    expect(applyMove(board, 'green', 1, 1)[0][1]).toBe('yellow');
  });

  it('does not overwrite existing green', () => {
    const board = emptyBoard(3, 3);
    board[1][0] = 'green'; // same row as placement
    expect(applyMove(board, 'green', 1, 2)[1][0]).toBe('green');
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
