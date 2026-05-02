import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LevelButton } from './LevelButton';

describe('LevelButton', () => {
  it('renders with completedToday undefined (default state) without errors', () => {
    expect(() =>
      render(<LevelButton size={4} label="Easy" onSelect={vi.fn()} />)
    ).not.toThrow();
  });

  it('renders the label and grid size', () => {
    render(<LevelButton size={6} label="Medium" onSelect={vi.fn()} />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('6×6 grid')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<LevelButton size={8} label="Hard" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
