"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { FiMail, FiGithub, FiLinkedin } from "react-icons/fi"
import { useTheme } from "../contexts/ThemeContext"
import ContactFormModal from "./contactform"

const socialLinks = [
  {
    name: "GitHub",
    icon: FiGithub,
    url: "https://github.com/Kaifkazi000",
    color: "hover:text-gray-300",
  },
  {
    name: "LinkedIn",
    icon: FiLinkedin,
    url: "https://www.linkedin.com/in/kaifkazi000?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    color: "hover:text-blue-400",
  },
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleEmailClick = (e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault()
      setIsModalOpen(true)
    }
    // On mobile, let the default mailto: behavior work
  }

  return (
    <section id="contact" className="py-16 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 ${isDark ? "text-white" : "text-white"}`}
          >
            Let's Work Together
          </h2>
          <motion.p
            className={`text-base sm:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto px-4 ${isDark ? "text-white/80" : "text-white/80"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            I'm always interested in new opportunities and exciting projects. Let's connect and create something amazing
            together!
          </motion.p>
          <motion.div
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.a
              href="mailto:kaifoddinkazi@gmail.com"
              onClick={handleEmailClick}
              className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMail className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">kaifoddinkazi@gmail.com</span>
              <span className="sm:hidden">Get in Touch</span>
            </motion.a>
          </motion.div>
          <motion.div
            className="flex justify-center gap-4 sm:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 sm:p-4 rounded-lg transition-all duration-300 ${
                    isDark
                      ? "bg-white/10 text-white/80 hover:bg-white/20"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  } ${social.color}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.a>
              )
            })}
          </motion.div>
          <motion.div
            className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/20"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p className={`text-xs sm:text-sm ${isDark ? "text-white/60" : "text-white/60"}`}>
              © {new Date().getFullYear()} Kaifoddin Kazi
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDark={isDark} />
    </section>
  )
}
