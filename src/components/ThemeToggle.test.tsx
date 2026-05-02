import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('calls toggleTheme on click', () => {
    const toggleTheme = vi.fn();
    render(<ThemeToggle theme="dark" toggleTheme={toggleTheme} />);
    fireEvent.click(screen.getByRole('button'));
    expect(toggleTheme).toHaveBeenCalledOnce();
  });

  it('shows sun icon and aria-label "Switch to light theme" when dark', () => {
    render(<ThemeToggle theme="dark" toggleTheme={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
    expect(document.querySelector('[data-testid="shape-sun"]')).not.toBeNull();
  });

  it('shows moon icon and aria-label "Switch to dark theme" when light', () => {
    render(<ThemeToggle theme="light" toggleTheme={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
    expect(document.querySelector('[data-testid="shape-moon"]')).not.toBeNull();
  });
});
