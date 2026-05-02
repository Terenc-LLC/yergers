export type Color = 'red' | 'yellow' | 'green';
export type CellState = 'empty' | Color;
export type Board = CellState[][]; // [row][col]
export type Move = { color: Color; row: number; col: number };
