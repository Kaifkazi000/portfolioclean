"use client"

import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"
import { useCallback, useState, useEffect } from "react"

export default function ScrollToTop() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const scrollToTop = useCallback(() => {
    const lenis = (window as any).lenis
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [])

  return (
    <div className="w-full flex justify-center py-8">
      <motion.button
        onClick={scrollToTop}
        className={`flex flex-col items-center gap-4 cursor-pointer ${
          isDark ? "text-white" : "text-white"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ y: [-4, 0, -4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className={`w-8 h-8 border-t-4 border-l-4 rotate-45 transform -translate-y-1 ${
            isDark ? "border-white/80" : "border-white/80"
          }`} />
        </motion.div>
      </motion.button>
    </div>
  );
}
