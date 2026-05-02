import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useGame } from './useGame';
import type { GeneratedPuzzle } from '../engine/generator';
import type { Board } from '../engine/types';

// Minimal 4×4 puzzle: placing red at (0,0) achieves the target.
// Red reach = 1 cell only, so one placement on an empty board
// produces exactly this target.
function makeTestPuzzle(): GeneratedPuzzle {
  const target: Board = [
    ['red', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
  ];
  return {
    target,
    solution: [{ color: 'red', row: 0, col: 0 }],
    gridSize: 4,
    seed: 'test',
  };
}

describe('useGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts in idle phase with moveCount 0 and elapsedMs 0', () => {
    const { result } = renderHook(() => useGame(makeTestPuzzle()));
    expect(result.current.phase).toBe('idle');
    expect(result.current.moveCount).toBe(0);
    expect(result.current.elapsedMs).toBe(0);
    expect(result.current.patternVisible).toBe(false);
    expect(result.current.activeColor).toBeNull();
  });

  it('first revealPattern transitions to pattern-revealed, does not increment moves, starts timer', () => {
    const { result } = renderHook(() => useGame(makeTestPuzzle()));

    act(() => {
      result.current.revealPattern();
    });

    expect(result.current.phase).toBe('pattern-revealed');
    expect(result.current.patternVisible).toBe(true);
    expect(result.current.moveCount).toBe(0);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(100);
  });

  it('second revealPattern (after hidePattern) increments moves', () => {
    const { result } = renderHook(() => useGame(makeTestPuzzle()));

    act(() => { result.current.revealPattern(); });
    act(() => { result.current.hidePattern(); });
    act(() => { result.current.revealPattern(); });

    expect(result.current.phase).toBe('pattern-revealed');
    expect(result.current.moveCount).toBe(1);
  });

  it('placeAt while idle is a no-op', () => {
    const { result } = renderHook(() => useGame(makeTestPuzzle()));

    act(() => {
      result.current.selectColor('red');
      result.current.placeAt(0, 0);
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.moveCount).toBe(0);
    expect(result.current.current[0][0]).toBe('empty');
  });

  it('placeAt while pattern-revealed is a no-op', () => {
    const { result } = renderHook(() => useGame(makeTestPuzzle()));

    act(() => { result.current.revealPattern(); });
    act(() => {
      result.current.selectColor('red');
      result.current.placeAt(0, 0);
    });

    expect(result.current.phase).toBe('pattern-revealed');
    expect(result.current.moveCount).toBe(0);
    expect(result.current.current[0][0]).toBe('empty');
  });

  it('placeAt after selectColor and hidePattern updates the board and increments moves', () => {
    const { result } = renderHook(() => useGame(makeTestPuzzle()));

    act(() => { result.current.revealPattern(); });
    act(() => { result.current.hidePattern(); });
    act(() => { result.current.selectColor('red'); });
    act(() => { result.current.placeAt(1, 1); });

    expect(result.current.phase).toBe('playing');
    expect(result.current.moveCount).toBe(1);
    expect(result.current.current[1][1]).toBe('red');
  });

  it('when placement makes board match target, phase becomes complete', () => {
    const { result } = renderHook(() => useGame(makeTestPuzzle()));

    act(() => { result.current.revealPattern(); });
    act(() => { result.current.hidePattern(); });
    act(() => { result.current.selectColor('red'); });

    // Place red at (0,0) — matches the one-cell target
    act(() => { result.current.placeAt(0, 0); });

    expect(result.current.phase).toBe('complete');
  });

  it('timer stops and elapsedMs is preserved after completion', () => {
    const { result } = renderHook(() => useGame(makeTestPuzzle()));

    act(() => { result.current.revealPattern(); });
    act(() => { result.current.hidePattern(); });
    act(() => { result.current.selectColor('red'); });

    act(() => { vi.advanceTimersByTime(300); });
    const elapsedAtCompletion = result.current.elapsedMs;

    act(() => { result.current.placeAt(0, 0); });
    const elapsedAfterComplete = result.current.elapsedMs;

    act(() => { vi.advanceTimersByTime(500); });

    expect(result.current.phase).toBe('complete');
    expect(result.current.elapsedMs).toBe(elapsedAfterComplete);
    expect(elapsedAfterComplete).toBeGreaterThan(0);
    expect(result.current.elapsedMs).toBeLessThanOrEqual(elapsedAtCompletion + 100);
  });

  it('reset returns to idle with cleared counters and empty board', () => {
    const { result } = renderHook(() => useGame(makeTestPuzzle()));

    act(() => { result.current.revealPattern(); });
    act(() => { result.current.hidePattern(); });
    act(() => { result.current.selectColor('red'); });
    act(() => { result.current.placeAt(1, 1); });
    expect(result.current.moveCount).toBe(1);

    act(() => { result.current.reset(); });

    expect(result.current.phase).toBe('idle');
    expect(result.current.moveCount).toBe(0);
    expect(result.current.elapsedMs).toBe(0);
    expect(result.current.current[1][1]).toBe('empty');
    expect(result.current.activeColor).toBeNull();
  });
});
