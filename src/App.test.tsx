import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('starts on the difficulty picker', () => {
    render(<App />);
    expect(screen.getByText('Yergers')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Extreme')).toBeInTheDocument();
  });

  it('selecting a difficulty mounts the game screen', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Easy'));
    expect(screen.getByText('Reveal Pattern')).toBeInTheDocument();
    expect(screen.getByTestId('score-value')).toBeInTheDocument();
    expect(screen.getByTestId('timer-value')).toBeInTheDocument();
  });

  it('selecting Normal starts a 5×5 game (25 grid cells)', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Normal'));
    // Reveal the pattern so cells are in the DOM
    fireEvent.click(screen.getByText('Reveal Pattern'));
    const cells = screen.getAllByRole('button', { name: /cell at row/i });
    expect(cells).toHaveLength(25);
  });
});
