import { useState } from 'react';
import { Grid } from './components/Grid';
import type { Board } from './engine/types';

// Hand-crafted demo boards covering all four cell states (empty/red/yellow/green).
// Diagonal cycling pattern makes all states easily visible.

const BOARD_4: Board = [
  ['empty',  'red',    'yellow', 'green' ],
  ['green',  'empty',  'red',    'yellow'],
  ['yellow', 'green',  'empty',  'red'   ],
  ['red',    'yellow', 'green',  'empty' ],
];

const BOARD_6: Board = [
  ['empty',  'red',    'yellow', 'green',  'empty',  'red'   ],
  ['green',  'empty',  'red',    'yellow', 'green',  'empty' ],
  ['yellow', 'green',  'empty',  'red',    'yellow', 'green' ],
  ['red',    'yellow', 'green',  'empty',  'red',    'yellow'],
  ['empty',  'red',    'yellow', 'green',  'empty',  'red'   ],
  ['green',  'empty',  'red',    'yellow', 'green',  'empty' ],
];

const BOARD_8: Board = [
  ['empty',  'red',    'yellow', 'green',  'empty',  'red',    'yellow', 'green' ],
  ['green',  'empty',  'red',    'yellow', 'green',  'empty',  'red',    'yellow'],
  ['yellow', 'green',  'empty',  'red',    'yellow', 'green',  'empty',  'red'   ],
  ['red',    'yellow', 'green',  'empty',  'red',    'yellow', 'green',  'empty' ],
  ['empty',  'red',    'yellow', 'green',  'empty',  'red',    'yellow', 'green' ],
  ['green',  'empty',  'red',    'yellow', 'green',  'empty',  'red',    'yellow'],
  ['yellow', 'green',  'empty',  'red',    'yellow', 'green',  'empty',  'red'   ],
  ['red',    'yellow', 'green',  'empty',  'red',    'yellow', 'green',  'empty' ],
];

function DemoGrid({
  label,
  board,
  size,
}: {
  label: string;
  board: Board;
  size: 4 | 6 | 8;
}) {
  const [lastTap, setLastTap] = useState<string | null>(null);

  return (
    <section className="w-full max-w-sm mx-auto px-2">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</h2>
      <Grid board={board} size={size} onCellTap={(r, c) => setLastTap(`row ${r + 1}, col ${c + 1}`)} />
      <p className="mt-2 text-sm text-gray-400 min-h-5">
        {lastTap ? `Tapped: ${lastTap}` : 'Tap a cell'}
      </p>
    </section>
  );
}

export default function App() {
  return (
    <>
      <main className="min-h-screen bg-white dark:bg-gray-950 py-8 flex flex-col gap-10 items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Grid Demo — TER-135</h1>
        <DemoGrid label="4×4 Easy" board={BOARD_4} size={4} />
        <DemoGrid label="6×6 Medium" board={BOARD_6} size={6} />
        <DemoGrid label="8×8 Hard" board={BOARD_8} size={8} />
      </main>
      <footer className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
        Last shipped:{' '}
        <a
          href="https://linear.app/terenc/issue/TER-141"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          TER-141
        </a>{' '}
        — App footer
      </footer>
    </>
  );
}
