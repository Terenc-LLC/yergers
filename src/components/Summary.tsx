import type { JSX } from 'react';

interface SummaryProps {
  gridSize: 4 | 5 | 6 | 8;
  moveCount: number;
  elapsedMs: number;
  onPlayAgain: () => void;
  onPickDifficulty: () => void;
}

const GRID_LABEL: Record<4 | 5 | 6 | 8, string> = {
  4: 'Easy (4×4)',
  5: 'Normal (5×5)',
  6: 'Hard (6×6)',
  8: 'Extreme (8×8)',
};

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function Summary({ gridSize, moveCount, elapsedMs, onPlayAgain, onPickDifficulty }: SummaryProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Puzzle Complete! 🎉</h2>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 w-full flex flex-col gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Difficulty</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{GRID_LABEL[gridSize]}</p>
        </div>
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Score</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">{moveCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">moves</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Time</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">{formatTime(elapsedMs)}</p>
          </div>
        </div>
      </div>
      {/* Share button slot reserved for TER-144 */}
      <div className="flex gap-3 w-full">
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3 px-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold"
        >
          Play again
        </button>
        <button
          onClick={onPickDifficulty}
          className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold"
        >
          Change difficulty
        </button>
      </div>
    </div>
  );
}
