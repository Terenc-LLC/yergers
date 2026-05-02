import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GameScreen } from './GameScreen';
import type { GeneratedPuzzle } from '../engine/generator';
import type { Board } from '../engine/types';

// Minimal 4×4 puzzle: placing red at (0,0) achieves the target in one move.
function makeTestPuzzle(): GeneratedPuzzle {
  const target: Board = [
    ['red', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
  ];
  return { target, solution: [{ color: 'red', row: 0, col: 0 }], gridSize: 4, seed: 'test' };
}

describe('GameScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initial render shows board (not pattern), timer 00:00, score 0', () => {
    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={vi.fn()} />);

    expect(screen.getByText('Reveal Pattern')).toBeInTheDocument();
    expect(screen.getByTestId('timer-value')).toHaveTextContent('00:00');
    expect(screen.getByTestId('score-value')).toHaveTextContent('0');
    // Board cells are disabled in idle state (not interactive)
    screen.getAllByRole('button', { name: /cell at row/i }).forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });

  it('first reveal hides the board and shows the pattern', () => {
    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={vi.fn()} />);

    fireEvent.click(screen.getByText('Reveal Pattern'));

    // Toggle button now says "Hide / Start Solving"
    expect(screen.getByText('Hide / Start Solving')).toBeInTheDocument();
    // Pattern cell (red at row 1, col 1) is now visible
    expect(screen.getByLabelText('Red cell at row 1, column 1')).toBeInTheDocument();
    // Score is still 0 (first reveal is free)
    expect(screen.getByTestId('score-value')).toHaveTextContent('0');
  });

  it('after hide → select color → tap cell, the board updates', () => {
    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={vi.fn()} />);

    fireEvent.click(screen.getByText('Reveal Pattern'));
    fireEvent.click(screen.getByText('Hide / Start Solving'));

    // Now in playing state — select red and tap (row 2, col 2) to avoid completing the puzzle
    fireEvent.click(screen.getByLabelText('Select red'));
    fireEvent.click(screen.getByLabelText('Empty cell at row 2, column 2'));

    expect(screen.getByLabelText('Red cell at row 2, column 2')).toBeInTheDocument();
  });

  it('when the board matches the target, the summary screen renders', () => {
    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={vi.fn()} />);

    fireEvent.click(screen.getByText('Reveal Pattern'));
    fireEvent.click(screen.getByText('Hide / Start Solving'));
    fireEvent.click(screen.getByLabelText('Select red'));
    // Tap (row 1, col 1) = index (0,0) — matches target and completes the puzzle
    fireEvent.click(screen.getByLabelText('Empty cell at row 1, column 1'));

    expect(screen.getByText('Puzzle Complete! 🎉')).toBeInTheDocument();
  });
});
