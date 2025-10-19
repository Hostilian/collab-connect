'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load theme from localStorage
    const stored = localStorage.getItem('theme') as Theme;
    if (stored === 'light') {
      setThemeState('light');
    } else if (stored === 'dark') {
      // Force legacy dark preference back to light so the UI stays consistent
      localStorage.setItem('theme', 'light');
      setThemeState('light');
    } else if (stored === 'system') {
      setThemeState('light');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    const resolved: 'light' | 'dark' = theme === 'dark' ? 'dark' : 'light';

    root.classList.add(resolved);
    setResolvedTheme(resolved);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      // Lock the experience to light for now to avoid dark-theme regressions
      localStorage.setItem('theme', 'light');
      setThemeState('light');
      return;
    }

    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
