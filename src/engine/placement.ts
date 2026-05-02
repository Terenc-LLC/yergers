/*
 * Overwrite hierarchy — what a placed color can fill:
 *
 *   placing red    → overwrites empty, green, yellow, red  (always)
 *   placing yellow → overwrites empty, green               (not red or yellow)
 *   placing green  → overwrites empty only                 (not red, yellow, or green)
 *
 * Reach patterns (board indexed [row][col], orthogonal only, no diagonals):
 *
 *   red    → { (row, col) }
 *   yellow → { (row, col) } ∪ up/down/left/right neighbours, clipped to grid bounds
 *   green  → full row(row) ∪ full col(col), intersection counted once → 2N−1 cells on N×N
 */

import type { Board, CellState, Color } from './types';

function canOverwrite(existing: CellState, placing: Color): boolean {
  if (placing === 'red') return true;
  if (placing === 'yellow') return existing === 'empty' || existing === 'green';
  return existing === 'empty';
}

function targetCells(
  rows: number,
  cols: number,
  color: Color,
  row: number,
  col: number,
): [number, number][] {
  if (color === 'red') {
    return [[row, col]];
  }
  if (color === 'yellow') {
    return (
      [
        [row, col],
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ] as [number, number][]
    ).filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols);
  }
  // green: full row + full column; row×col intersection is included via the row pass
  const cells: [number, number][] = [];
  for (let c = 0; c < cols; c++) cells.push([row, c]);
  for (let r = 0; r < rows; r++) if (r !== row) cells.push([r, col]);
  return cells;
}

export function applyMove(board: Board, color: Color, row: number, col: number): Board {
  if (board.length === 0 || board[0].length === 0) {
    throw new RangeError('Board is malformed: empty dimensions');
  }
  const rows = board.length;
  const cols = board[0].length;
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    throw new RangeError(
      `(${row}, ${col}) is out of bounds for a ${rows}×${cols} board`,
    );
  }

  const next: Board = board.map(r => [...r]);
  for (const [r, c] of targetCells(rows, cols, color, row, col)) {
    if (canOverwrite(next[r][c], color)) {
      next[r][c] = color;
    }
  }
  return next;
}
