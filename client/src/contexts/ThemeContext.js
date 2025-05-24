import React, { createContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import baseTheme from '../theme'; // senin theme.js dosyan

const ThemeContext = createContext();

const getCustomTheme = (mode) =>
  createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      mode,
      background: {
        default: mode === 'dark' ? '#111827' : baseTheme.palette.background.default,
        paper: mode === 'dark' ? '#1F2937' : baseTheme.palette.background.paper,
      },
      text: {
        primary: mode === 'dark' ? '#F3F4F6' : baseTheme.palette.text.primary,
        secondary: mode === 'dark' ? '#9CA3AF' : baseTheme.palette.text.secondary,
      },
    },
  });

export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('themeMode');
    if (stored) setMode(stored);
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const theme = getCustomTheme(mode);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
