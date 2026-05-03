import { useState, useRef, useEffect } from 'react';
import type { JSX } from 'react';
import type { GeneratedPuzzle } from '../engine/generator';
import { useGame } from '../hooks/useGame';
import { Grid } from './Grid';
import { ColorPicker } from './ColorPicker';
import { Summary } from './Summary';

interface GameScreenProps {
  puzzle: GeneratedPuzzle;
  mode?: 'daily' | 'practice';
  onPickDifficulty: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const PHASE_LABEL: Record<string, string> = {
  idle: 'Tap to reveal',
  'pattern-revealed': 'Memorize the pattern',
  playing: 'Place colors to match',
  complete: '',
};

export function GameScreen({ puzzle, onPickDifficulty }: GameScreenProps): JSX.Element {
  const game = useGame(puzzle);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (game.phase === 'complete') {
    return (
      <Summary
        gridSize={game.gridSize}
        moveCount={game.moveCount}
        elapsedMs={game.elapsedMs}
        onPlayAgain={game.reset}
        onPickDifficulty={onPickDifficulty}
      />
    );
  }

  const clearTransitionTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTransition = (action: () => void) => {
    clearTransitionTimer();
    setTransitioning(true);
    action();
    timerRef.current = window.setTimeout(() => {
      setTransitioning(false);
      timerRef.current = null;
    }, 1000);
  };

  const handleRevealToggle = () => {
    if (game.phase === 'idle' || game.phase === 'playing') {
      startTransition(game.revealPattern);
    } else if (game.phase === 'pattern-revealed') {
      startTransition(game.hidePattern);
    }
  };

  const handleRestart = () => {
    clearTransitionTimer();
    setTransitioning(false);
    game.reset();
  };

  const handleQuit = () => {
    clearTransitionTimer();
    onPickDifficulty();
  };

  const isPlaying = game.phase === 'playing';

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-4 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between w-full px-1 py-2">
        <div className="text-center min-w-16">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Score</p>
          <p className="text-2xl font-bold text-ink dark:text-paper" data-testid="score-value">
            {game.moveCount}
          </p>
        </div>
        <div className="text-center flex-1 px-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">{PHASE_LABEL[game.phase]}</p>
        </div>
        <div className="text-center min-w-16">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Time</p>
          <p className="text-2xl font-bold text-ink dark:text-paper" data-testid="timer-value">
            {formatTime(game.elapsedMs)}
          </p>
        </div>
      </div>

      <div className="w-full">
        {transitioning ? (
          <div className="flex items-center justify-center h-48">
            <p
              className="text-lg text-gray-500 dark:text-gray-400"
              data-testid="transition-blank"
            >
              Get ready...
            </p>
          </div>
        ) : game.patternVisible ? (
          <Grid board={game.target} size={game.gridSize} />
        ) : (
          <Grid
            board={game.current}
            size={game.gridSize}
            onCellTap={isPlaying ? (r, c) => game.placeAt(r, c) : undefined}
          />
        )}
      </div>

      <button
        onClick={handleRevealToggle}
        className="w-full py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-ink dark:text-paper font-semibold active:scale-95 transition-transform duration-100"
      >
        {game.patternVisible ? 'Hide / Start Solving' : 'Reveal Pattern'}
      </button>

      {!game.patternVisible && (
        <ColorPicker activeColor={game.activeColor} onSelectColor={game.selectColor} />
      )}

      <div className="flex gap-3 mt-1">
        <button
          onClick={handleRestart}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-ink dark:text-paper text-sm font-medium active:scale-95 transition-transform duration-100"
        >
          Restart
        </button>
        <button
          onClick={handleQuit}
          className="text-sm text-gray-400 dark:text-gray-500 underline"
        >
          Quit
        </button>
      </div>
    </div>
  );
}
