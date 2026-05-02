import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('renders the correct shape for each color button', () => {
    render(<ColorPicker activeColor={null} onSelectColor={vi.fn()} />);
    const redBtn = screen.getByLabelText('Select red');
    const yellowBtn = screen.getByLabelText('Select yellow');
    const greenBtn = screen.getByLabelText('Select green');

    expect(redBtn.querySelector('[data-testid="shape-square"]')).not.toBeNull();
    expect(yellowBtn.querySelector('[data-testid="shape-triangle"]')).not.toBeNull();
    expect(greenBtn.querySelector('[data-testid="shape-circle"]')).not.toBeNull();
  });

  it('aria-pressed reflects the active color', () => {
    render(<ColorPicker activeColor="red" onSelectColor={vi.fn()} />);
    expect(screen.getByLabelText('Select red')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Select yellow')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Select green')).toHaveAttribute('aria-pressed', 'false');
  });

  it('no color is aria-pressed when activeColor is null', () => {
    render(<ColorPicker activeColor={null} onSelectColor={vi.fn()} />);
    expect(screen.getByLabelText('Select red')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Select yellow')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Select green')).toHaveAttribute('aria-pressed', 'false');
  });
});
