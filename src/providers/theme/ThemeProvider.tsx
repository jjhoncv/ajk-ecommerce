'use client'
import React, { useEffect, useState } from 'react'
import { ThemeContext } from './Theme.context'
import { Theme } from './Theme.types'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Cargar el tema desde localStorage al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // Aplicar el tema cuando cambia
  useEffect(() => {
    localStorage.setItem('theme', theme)

    // Determinar si se debe usar el modo oscuro
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      setIsDarkMode(systemTheme === 'dark')
    } else {
      root.classList.add(theme)
      setIsDarkMode(theme === 'dark')
    }
  }, [theme])

  // Escuchar cambios en el tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(systemTheme)
        setIsDarkMode(systemTheme === 'dark')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const value = {
    theme,
    setTheme,
    isDarkMode
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
