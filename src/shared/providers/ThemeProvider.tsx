'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [preferredTheme, setPreferredTheme] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load theme from localStorage
    const stored = localStorage.getItem('theme') as Theme;
    if (stored === 'light') {
      setPreferredTheme('light');
    } else if (stored === 'dark') {
      // Force legacy dark preference back to light so the UI stays consistent
      localStorage.setItem('theme', 'light');
      setPreferredTheme('light');
    } else if (stored === 'system') {
      setPreferredTheme('light');
    }
  }, []);

  useEffect(() => {
    const root = globalThis.document?.documentElement;
    if (!root) {
      return;
    }
    root.classList.remove('light', 'dark');

    const resolved: 'light' | 'dark' = preferredTheme === 'dark' ? 'dark' : 'light';

    root.classList.add(resolved);
    setResolvedTheme(resolved);
  }, [preferredTheme]);

  const setTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      // Lock the experience to light for now to avoid dark-theme regressions
      localStorage.setItem('theme', 'light');
      setPreferredTheme('light');
      return;
    }

    localStorage.setItem('theme', newTheme);
    setPreferredTheme(newTheme);
  };

  const contextValue = useMemo(
    () => ({
      theme: preferredTheme,
      setTheme,
      resolvedTheme,
    }),
    [preferredTheme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
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
