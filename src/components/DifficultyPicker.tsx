import type { JSX } from 'react';
import { LevelButton } from './LevelButton';

interface DifficultyPickerProps {
  onSelect: (size: 4 | 6 | 8) => void;
  onShowStats?: () => void;
}

const LEVELS: { size: 4 | 6 | 8; label: string }[] = [
  { size: 4, label: 'Easy' },
  { size: 6, label: 'Medium' },
  { size: 8, label: 'Hard' },
];

export function DifficultyPicker({ onSelect, onShowStats }: DifficultyPickerProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between w-full">
        <div className="w-10" />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Yergers</h1>
        </div>
        {/* Stats slot reserved for TER-143 */}
        <button
          onClick={() => onShowStats?.()}
          aria-label="Show stats"
          className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
        </button>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-center">
        Recreate the pattern. Use your memory.
      </p>
      <div className="flex flex-col gap-3 w-full">
        {LEVELS.map(({ size, label }) => (
          <LevelButton
            key={size}
            size={size}
            label={label}
            onSelect={() => onSelect(size)}
          />
        ))}
      </div>
    </div>
  );
}
