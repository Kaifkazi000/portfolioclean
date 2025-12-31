"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiSun, FiMoon, FiMenu } from "react-icons/fi"
import { useTheme } from "../contexts/ThemeContext"
import { useEffect } from "react"

interface SideMenuProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
]

export default function SideMenu({ isOpen, setIsOpen }: SideMenuProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      if (window.lenis) {
        window.lenis.scrollTo(element, { duration: 1.2 })
      } else {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] block md:hidden"
            aria-hidden="true"
          />

          {/* Side Menu */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 h-full w-[280px] p-6 z-[999] block md:hidden ${
              isDark 
                ? "bg-gradient-to-br from-black to-gray-900 border-r border-white/10" 
                : "bg-gradient-to-br from-white to-gray-50 border-r border-gray-200"
            } shadow-2xl flex flex-col`}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <motion.div
                className={`flex items-center gap-2 text-lg font-bold ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                <FiMenu className="w-6 h-6" />
                <span>Menu</span>
              </motion.div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-full transition-colors ${
                  isDark
                    ? "hover:bg-white/10 text-white/60"
                    : "hover:bg-black/5 text-black/60"
                }`}
                aria-label="Close navigation menu"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col items-center justify-center space-y-6">
              {navItems.map(({ name, href }, index) => (
                <motion.button
                  key={name}
                  onClick={() => scrollToSection(href)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-48 text-center px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium ${
                    isDark
                      ? "text-white/80 hover:bg-white/10 hover:text-white active:scale-95"
                      : "text-black/80 hover:bg-black/5 hover:text-black active:scale-95"
                  }`}
                >
                  {name}
                </motion.button>
              ))}
            </nav>
          </motion.aside>

          {/* Theme Toggle */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 right-4 z-50 md:hidden"
          >
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                isDark 
                  ? "bg-black/95 text-white hover:bg-black/80 border border-white/10" 
                  : "bg-white/95 text-black hover:bg-white/80 border border-gray-200"
              }`}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
