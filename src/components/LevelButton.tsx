import type { JSX } from 'react';

interface LevelButtonProps {
  size: 4 | 6 | 8;
  label: string;
  onSelect: () => void;
  completedToday?: { moves: number; elapsedMs: number };
}

const SIZE_LABEL: Record<4 | 6 | 8, string> = {
  4: '4×4',
  6: '6×6',
  8: '8×8',
};

export function LevelButton({ size, label, onSelect }: LevelButtonProps): JSX.Element {
  return (
    <button
      onClick={onSelect}
      className="w-full py-5 px-6 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-between active:scale-95 transition-transform duration-100"
    >
      <div className="text-left">
        <p className="text-xl font-bold">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{SIZE_LABEL[size]} grid</p>
      </div>
      <span className="text-gray-400 dark:text-gray-500 text-2xl" aria-hidden="true">›</span>
    </button>
  );
}
