"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"

declare global {
  interface Window {
    lenis?: any
  }
}

interface NavbarProps {
  setIsSideMenuOpen: (isOpen: boolean) => void
}

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
]

export default function Navbar({ setIsSideMenuOpen }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("hero")
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 },
    )

    navItems.forEach(({ href }) => {
      const element = document.querySelector(href)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      if (window.lenis) {
        window.lenis.scrollTo(element, { duration: 1.2 })
      } else {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 sm:top-8 inset-x-0 mx-auto z-50 flex justify-center"
    >
      {/* Navbar Glass Container */}
      <div
        className={`rounded-full px-6 sm:px-10 py-4 sm:py-5 backdrop-blur-xl border transition-all duration-300 mx-4 ${
          isDark ? "bg-black/20 border-white/10 shadow-2xl" : "bg-black/20 border-white/10 shadow-2xl"
        }`}
      >
        <div className="flex items-center justify-center gap-10">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(({ name, href }) => (
              <button
                key={name}
                onClick={() => scrollToSection(href)}
                className={`px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-base sm:text-lg font-medium transition-all duration-200 ${
                  activeSection === href.slice(1)
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-1 p-0 m-0">
            <a
              onClick={() => scrollToSection("#hero")}
              className="p-2 sm:p-3 bg-white/10 hover:bg-black/20 rounded-full"
              aria-label="Scroll to Hero"
            >
              <h6 className="text-sm sm:text-xl font-semibold text-white">Home</h6>
            </a>
            <button
              onClick={() => scrollToSection("#about")}
              className="p-2 sm:p-3 bg-white/10 hover:bg-black/20 rounded-full"
              aria-label="Scroll to About"
            >
              <h6 className="text-sm sm:text-xl font-semibold text-white">About</h6>
            </button>
            <button
              onClick={() => scrollToSection("#projects")}
              className="p-2 sm:p-3 bg-white/10 hover:bg-black/20 rounded-full"
              aria-label="Scroll to Projects"
            >
              <h6 className="text-sm sm:text-xl font-semibold text-white">Projects</h6>
            </button>
            <button
              onClick={() => scrollToSection("#contact")}
              className="p-2 sm:p-3 bg-white/10 hover:bg-black/20 rounded-full"
              aria-label="Scroll to Contact"
            >
              <h6 className="text-sm sm:text-xl font-semibold text-white">Contact</h6>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
