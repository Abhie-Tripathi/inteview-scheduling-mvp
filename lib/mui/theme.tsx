'use client'

import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: mode } = useTheme()

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode === 'dark' ? 'dark' : 'light',
          primary: {
            main: '#006BFF',
            light: '#4D94FF',
            dark: '#0052CC',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#F5F5F5',
            light: '#FAFAFA',
            dark: '#E0E0E0',
            contrastText: '#000000',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#FFFFFF',
            paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#FFFFFF' : '#000000',
            secondary: mode === 'dark' ? '#B0B0B0' : '#666666',
          },
        },
        typography: {
          fontFamily: 'var(--font-sans)',
          h1: {
            fontSize: '2rem',
            fontWeight: 700,
          },
          h2: {
            fontSize: '1.5rem',
            fontWeight: 600,
          },
          h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
          },
          body1: {
            fontSize: '0.875rem',
          },
          body2: {
            fontSize: '0.8125rem',
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '8px',
                padding: '8px 16px',
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRight: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
              },
            },
          },
        },
      }),
    [mode]
  )

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
