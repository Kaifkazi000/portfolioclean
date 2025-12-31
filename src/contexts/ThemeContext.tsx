"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

type Theme = "dark" // Light mode removed

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>("dark")

  // Run once on mount
  useEffect(() => {
    // Always use dark mode
    setTheme("dark")
    document.documentElement.classList.add("dark")
    setMounted(true)
  }, [])

  // Save theme and update <html> class
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("theme", "dark")
    document.documentElement.classList.add("dark")
  }, [mounted])

  const toggleTheme = () => {
    // Theme toggle disabled (since only dark mode is allowed)
    setTheme("dark")
  }

  // Prevent mismatch flash
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
