import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LevelButton } from './LevelButton';

describe('LevelButton', () => {
  it('renders with completedToday undefined (default state) without errors', () => {
    expect(() =>
      render(<LevelButton size={4} label="Easy" onSelect={vi.fn()} />)
    ).not.toThrow();
  });

  it('renders the label and grid size for Normal (5×5)', () => {
    render(<LevelButton size={5} label="Normal" onSelect={vi.fn()} />);
    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('5×5 grid')).toBeInTheDocument();
  });

  it('renders the label and grid size for Hard (6×6)', () => {
    render(<LevelButton size={6} label="Hard" onSelect={vi.fn()} />);
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('6×6 grid')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<LevelButton size={8} label="Extreme" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
