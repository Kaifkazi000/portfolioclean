"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { FiX, FiSend, FiUser, FiMail, FiMessageSquare, FiCheck } from "react-icons/fi"
// Using Formspree for simple contact form

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
  isDark: boolean
}

export default function ContactFormModal({ isOpen, onClose, isDark }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send form data to Formspree
      const response = await fetch('https://formspree.io/f/mldpglbo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || "New Contact Form Submission",
          message: formData.message,
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setTimeout(() => {
          onClose()
          setFormData({ name: "", email: "", subject: "", message: "" })
          setSubmitStatus("idle")
        }, 3000)
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl backdrop-blur-xl ${
              isDark ? "bg-gray-900/90 border border-gray-700/50" : "bg-white/95 border border-gray-200/50"
            }`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
              <h3 className={`text-xl font-semibold  ${isDark ? "text-white" : "text-gray-900"}`}>Send me a message</h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? "hover:bg-gray-800/50 text-gray-300 hover:text-white" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Success/Error Message */}
            {submitStatus !== "idle" && (
              <motion.div
                className={`mx-6 mt-4 p-4 rounded-full ${
                  submitStatus === "success"
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-red-500/20 border border-red-500/30 text-red-400"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  {submitStatus === "success" ? (
                    <>
                      <FiCheck className="w-4 h-4" />
                      <span className="text-sm font-medium">Message sent successfully!</span>
                    </>
                  ) : (
                    <>
                      <FiX className="w-4 h-4" />
                      <span className="text-sm font-medium">Failed to send message. Please try again.</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Name *
                </label>
                <div className="relative">
                  <FiUser
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-3 rounded-full border transition-colors ${
                      isDark
                        ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-800/70"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Your name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Email *
                </label>
                <div className="relative">
                  <FiMail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-3 rounded-full border transition-colors ${
                      isDark
                        ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-800/70"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-full border transition-colors ${
                    isDark
                      ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-800/70"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="What's this about?"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Message *
                </label>
                <div className="relative">
                  <FiMessageSquare
                    className={`absolute left-3 top-3 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    rows={4}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors resize-none ${
                      isDark
                        ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-800/70"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Tell me about your project or idea..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || submitStatus === "success"}
                className={`w-full py-3 px-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  submitStatus === "success"
                    ? "bg-green-500 text-white"
                    : submitStatus === "error"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gradient-to-r from-black-500 to-black-600 hover:from-#5227FF hover:to-#5227FF text-white shadow-lg"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: submitStatus === "success" ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Message Sent!
                  </>
                ) : submitStatus === "error" ? (
                  <>
                    <FiX className="w-4 h-4" />
                    Try Again
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
