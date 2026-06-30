import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type ThemeName = 'black-style' | 'imperial-gold' | 'og-white';

const THEME_STORAGE_KEY = 'sd-theme';
const THEMES: ThemeName[] = ['black-style', 'imperial-gold', 'og-white'];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
  themes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getStoredTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && THEMES.includes(stored as ThemeName)) {
      return stored as ThemeName;
    }
  } catch {
    // localStorage unavailable (private browsing, etc.)
  }
  return 'black-style';
}

function applyThemeToDOM(theme: ThemeName): void {
  document.documentElement.setAttribute('data-sd-theme', theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(getStoredTheme);

  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // silent fail
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => {
      const idx = THEMES.indexOf(prev);
      return THEMES[(idx + 1) % THEMES.length];
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

export { THEMES };