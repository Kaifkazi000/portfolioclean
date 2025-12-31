"use client"

import { motion } from "framer-motion"
import { FiDownload, FiArrowDown } from "react-icons/fi"
import { useEffect, useCallback } from "react"

export default function Hero() {
  const scrollToProjects = useCallback(() => {
    const element = document.querySelector("#projects")
    if (!element) return
    
    const lenis = (window as any).lenis
    if (lenis) {
      lenis.scrollTo(element, { duration: 1.2 })
    } else {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Hey, I'm{" "}
            <motion.span
              className="text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Kaifoddin
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-2 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="font-semibold text-white">Blending AI and Full-Stack to Create Intelligent, Scalable Web Apps</span>{" "}
            <span className="font-semibold text-white">Turning data and code into real-world impact.</span>
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 justify-center items-center max-w-sm mx-auto sm:max-w-none sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={scrollToProjects}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <FiArrowDown className="w-4 h-4" />
            </motion.button>

            <motion.a
              href="/KAIF 1ST resume.pdf"
              download
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm text-sm sm:text-base border-white/30 text-white hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resume
              <FiDownload className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
