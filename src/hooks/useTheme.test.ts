import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('initial theme is dark when localStorage is empty', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persisted theme overrides the default', () => {
    localStorage.setItem('rygo:theme', 'light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggleTheme adds/removes the dark class on the html element and writes to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('rygo:theme')).toBe('light');

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('rygo:theme')).toBe('dark');
  });

  it('migrates yergers:theme to rygo:theme on first load', () => {
    localStorage.setItem('yergers:theme', 'light');
    renderHook(() => useTheme());
    expect(localStorage.getItem('rygo:theme')).toBe('light');
    expect(localStorage.getItem('yergers:theme')).toBeNull();
  });

  it('does not overwrite existing rygo:theme during migration', () => {
    localStorage.setItem('yergers:theme', 'light');
    localStorage.setItem('rygo:theme', 'dark');
    renderHook(() => useTheme());
    expect(localStorage.getItem('rygo:theme')).toBe('dark');
    expect(localStorage.getItem('yergers:theme')).toBe('light');
  });
});
