/**
 * Visual Utility Service
 * Handles UI theming based on locale/culture
 */

export type Locale = 'cs' | 'en' | 'uk' | 'vi' | 'tr'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

// Cultural theme colors as mentioned in copilot-instructions
const themesByLocale: Record<Locale, ThemeColors> = {
  cs: {
    primary: '#1e40af', // Czech blue
    secondary: '#ffffff',
    accent: '#3b82f6',
    background: '#f8fafc',
    text: '#1e293b',
  },
  en: {
    primary: '#2563eb',
    secondary: '#ffffff',
    accent: '#3b82f6',
    background: '#f8fafc',
    text: '#1e293b',
  },
  uk: {
    primary: '#fbbf24', // Ukrainian yellow
    secondary: '#2563eb', // Ukrainian blue
    accent: '#60a5fa',
    background: '#f8fafc',
    text: '#1e293b',
  },
  vi: {
    primary: '#dc2626', // Vietnamese red
    secondary: '#fbbf24',
    accent: '#ef4444',
    background: '#fffbeb',
    text: '#1e293b',
  },
  tr: {
    primary: '#dc2626', // Turkish red
    secondary: '#ffffff',
    accent: '#ef4444',
    background: '#fef2f2',
    text: '#1e293b',
  },
}

/**
 * Get theme colors for a locale
 */
export function getThemeColors(locale: Locale): ThemeColors {
  return themesByLocale[locale] || themesByLocale.en
}

/**
 * Get CSS variables for a theme
 */
export function getThemeCSSVariables(locale: Locale): Record<string, string> {
  const colors = getThemeColors(locale)
  return {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-text': colors.text,
  }
}

/**
 * Get currency for locale
 */
export function getCurrencyForLocale(locale: Locale): string {
  const currencies: Record<Locale, string> = {
    cs: 'CZK',
    en: 'EUR',
    uk: 'UAH',
    vi: 'VND',
    tr: 'TRY',
  }
  return currencies[locale] || 'EUR'
}
