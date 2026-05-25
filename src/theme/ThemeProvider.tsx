import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { themes, type ThemeColors, type ThemeName } from './colors';

type ThemeContextValue = {
  name: ThemeName;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = {
  children: ReactNode;
  override?: ThemeName;
};

export function ThemeProvider({ children, override }: Props) {
  const scheme = useColorScheme();
  const value = useMemo<ThemeContextValue>(() => {
    const name = override ?? (scheme === 'dark' ? 'dark' : 'light');
    return { name, colors: themes[name] };
  }, [override, scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside a <ThemeProvider />');
  }
  return ctx;
}

export function useThemeColors(): ThemeColors {
  return useTheme().colors;
}
