import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'rygo:theme';

function migrateLegacyKeys() {
  const legacy = localStorage.getItem('yergers:theme');
  if (legacy !== null && localStorage.getItem('rygo:theme') === null) {
    localStorage.setItem('rygo:theme', legacy);
    localStorage.removeItem('yergers:theme');
  }
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function useTheme(): {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
} {
  const [theme, setThemeState] = useState<Theme>(() => {
    migrateLegacyKeys();
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme, setTheme };
}
