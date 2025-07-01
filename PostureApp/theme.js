import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

const lightColors = {
  background: '#FFFFFF',
  text: '#000000',
  card: '#F2F2F2',
  border: '#DDDDDD',
  accent: '#FF9500',
  danger: '#FF3B30',
};

const darkColors = {
  background: '#000000',
  text: '#FFFFFF',
  card: '#1C1C1E',
  border: '#2C2C2E',
  accent: '#FF9500',
  danger: '#FF453A',
};

export function ThemeProvider({ children, initial }) {
  const [theme, setTheme] = useState(initial || 'system');
  const [colors, setColors] = useState(lightColors);

  useEffect(() => {
    const scheme = Appearance.getColorScheme();
    if (theme === 'system') {
      setColors(scheme === 'dark' ? darkColors : lightColors);
    } else {
      setColors(theme === 'dark' ? darkColors : lightColors);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ colors, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
