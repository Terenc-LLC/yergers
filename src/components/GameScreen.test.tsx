import { render, screen, fireEvent, act } from '@testing-library/react';
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

  it('first reveal shows "Get ready..." then displays the pattern after 1 second', () => {
    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={vi.fn()} />);

    fireEvent.click(screen.getByText('Reveal Pattern'));

    // During transition: blank screen visible, pattern not yet shown
    expect(screen.getByTestId('transition-blank')).toBeInTheDocument();
    expect(screen.queryByLabelText('Red cell at row 1, column 1')).toBeNull();

    // After 1 second: pattern is visible
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByTestId('transition-blank')).toBeNull();
    expect(screen.getByText('Hide / Start Solving')).toBeInTheDocument();
    expect(screen.getByLabelText('Red cell at row 1, column 1')).toBeInTheDocument();
    // First reveal is free
    expect(screen.getByTestId('score-value')).toHaveTextContent('0');
  });

  it('Hide / Start Solving shows "Get ready..." then displays the board after 1 second', () => {
    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={vi.fn()} />);

    fireEvent.click(screen.getByText('Reveal Pattern'));
    act(() => vi.advanceTimersByTime(1000));

    fireEvent.click(screen.getByText('Hide / Start Solving'));

    // During transition: blank screen visible
    expect(screen.getByTestId('transition-blank')).toBeInTheDocument();

    // After 1 second: board is visible
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByTestId('transition-blank')).toBeNull();
    // Board cells visible
    expect(screen.getAllByRole('button', { name: /cell at row/i }).length).toBeGreaterThan(0);
  });

  it('after hide → select color → tap cell, the board updates', () => {
    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={vi.fn()} />);

    fireEvent.click(screen.getByText('Reveal Pattern'));
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.click(screen.getByText('Hide / Start Solving'));
    act(() => vi.advanceTimersByTime(1000));

    // Now in playing state — select red and tap (row 2, col 2) to avoid completing the puzzle
    fireEvent.click(screen.getByLabelText('Select red'));
    fireEvent.click(screen.getByLabelText('Empty cell at row 2, column 2'));

    expect(screen.getByLabelText('Red cell at row 2, column 2')).toBeInTheDocument();
  });

  it('when the board matches the target, the summary screen renders', () => {
    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={vi.fn()} />);

    fireEvent.click(screen.getByText('Reveal Pattern'));
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.click(screen.getByText('Hide / Start Solving'));
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.click(screen.getByLabelText('Select red'));
    // Tap (row 1, col 1) = index (0,0) — matches target and completes the puzzle
    fireEvent.click(screen.getByLabelText('Empty cell at row 1, column 1'));

    expect(screen.getByText('Puzzle Complete! 🎉')).toBeInTheDocument();
  });

  it('Restart resets score and timer to zero and stays on the game screen', () => {
    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={vi.fn()} />);

    // Get into playing state and make a move
    fireEvent.click(screen.getByText('Reveal Pattern'));
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.click(screen.getByText('Hide / Start Solving'));
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.click(screen.getByLabelText('Select red'));
    fireEvent.click(screen.getByLabelText('Empty cell at row 2, column 2'));

    // At least one move was made
    expect(Number(screen.getByTestId('score-value').textContent)).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('Restart'));

    // Game is reset
    expect(screen.getByTestId('score-value')).toHaveTextContent('0');
    expect(screen.getByTestId('timer-value')).toHaveTextContent('00:00');
    // Still on game screen
    expect(screen.getByText('Reveal Pattern')).toBeInTheDocument();
  });

  it('Quit calls onPickDifficulty immediately without window.confirm', () => {
    const onPickDifficulty = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={onPickDifficulty} />);
    fireEvent.click(screen.getByText('Quit'));

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(onPickDifficulty).toHaveBeenCalledOnce();

    confirmSpy.mockRestore();
  });

  it('Restarting during a transition clears it immediately with no stale update after the timer', () => {
    render(<GameScreen puzzle={makeTestPuzzle()} onPickDifficulty={vi.fn()} />);

    fireEvent.click(screen.getByText('Reveal Pattern'));
    // In transition
    expect(screen.getByTestId('transition-blank')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Restart'));

    // Transition cleared immediately
    expect(screen.queryByTestId('transition-blank')).toBeNull();
    expect(screen.getByTestId('score-value')).toHaveTextContent('0');

    // Advancing past the original timer should produce no stale state
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByTestId('transition-blank')).toBeNull();
  });
});
