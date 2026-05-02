import type { JSX } from 'react';
import type { Color } from '../engine/types';
import { Square, Triangle, Circle } from './Shapes';

interface ColorPickerProps {
  activeColor: Color | null;
  onSelectColor: (c: Color) => void;
}

const COLORS: {
  color: Color;
  bg: string;
  label: string;
  Shape: (props: { className?: string }) => JSX.Element;
  shapeCls: string;
}[] = [
  { color: 'red', bg: 'bg-rygo-red', label: 'Select red', Shape: Square, shapeCls: 'text-paper' },
  { color: 'yellow', bg: 'bg-rygo-yellow', label: 'Select yellow', Shape: Triangle, shapeCls: 'text-ink' },
  { color: 'green', bg: 'bg-rygo-green', label: 'Select green', Shape: Circle, shapeCls: 'text-paper' },
];

export function ColorPicker({ activeColor, onSelectColor }: ColorPickerProps): JSX.Element {
  return (
    <div className="flex justify-center gap-4">
      {COLORS.map(({ color, bg, label, Shape, shapeCls }) => {
        const isActive = activeColor === color;
        return (
          <button
            key={color}
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => onSelectColor(color)}
            className={[
              'w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-100',
              bg,
              isActive
                ? 'ring-4 ring-blue-500 ring-offset-2 ring-offset-paper dark:ring-offset-ink'
                : '',
            ].join(' ')}
          >
            <Shape className={`w-8 h-8 ${shapeCls}`} />
          </button>
        );
      })}
    </div>
  );
}
