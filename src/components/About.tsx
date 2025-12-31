"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

const techStack = {
  All: [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "JavaScript",
    "TypeScript",
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "AWS",
    "Docker",
    "CI/CD",
    "Linux",
    "DSA",
  ],
  FullStack: ["React", "Next.js", "Node.js", "Express", "HTML", "CSS"],
  Languages: ["Java", "JavaScript", "TypeScript", "Python"],
  Databases: ["PostgreSQL", "MongoDB", "MySQL"],
  DevOps: ["AWS", "Docker", "CI/CD", "Linux", "EC2"],
  DSA: ["Arrays", "Strings", "Recursion", "Trees", "Graphs"],
}

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const [selectedCategory, setSelectedCategory] = useState<keyof typeof techStack>("All")
  const [openMobile, setOpenMobile] = useState<null | "edu" | "focus">(null)

  return (
    <section id="about" className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-8"
        >
          About Me
        </motion.h2>

        {/* Short About */}
        <p className="text-center text-white/90 max-w-3xl mx-auto text-base md:text-lg leading-relaxed mb-16">
          I’m a Computer Engineering student and software developer who learns by building real-world
          applications. Currently working at AssureMe, I collaborate on backend APIs, AWS services,
          database handling, and deployment workflows while growing in DevOps and system design.
        </p>

        {/* ================= DESKTOP VIEW ================= */}
        <div className="hidden md:block">

          <div className="grid grid-cols-2 gap-24 mb-20">

            {/* What I Work On */}
            <div className="relative pl-6">
              <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
              <h3 className="text-3xl font-bold text-white mb-6">
                What I Work On
              </h3>
              <ul className="space-y-4 text-white/90 text-lg">
                <li>• Backend APIs & business logic</li>
                <li>• AWS services (S3, SES)</li>
                <li>• Database handling & data cloning</li>
                <li>• Deployment & environment setup</li>
                <li>• Team collaboration & delivery</li>
              </ul>
            </div>

            {/* Focus */}
            <div className="relative pl-10">
              <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
              <h3 className="text-3xl font-bold text-white mb-6">
                What I’m Focusing On
              </h3>
              <ul className="space-y-4 text-white/90 text-lg">
                <li>• Backend system design</li>
                <li>• DevOps & CI/CD workflows</li>
                <li>• AWS EC2 & infrastructure</li>
                <li>• Writing scalable code</li>
                <li>• Improving DSA skills</li>
              </ul>
            </div>
          </div>

          {/* Education */}
          <div className="flex justify-center mb-24">
            <div className="relative pl-6 text-center max-w-xl">
              <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
              <h3 className="text-3xl font-bold text-white mb-6">Education</h3>

              <p className="text-white/90 text-lg mb-4">
                <strong>Diploma (Polytechnic)</strong><br />
                Government Polytechnic, Arvi<br />
                Percentage: <strong>83.20%</strong>
              </p>

              <p className="text-white/90 text-lg">
                <strong>B.Tech (Computer Engineering)</strong><br />
                Government College of Engineering, Chandrapur<br />
                Currently in <strong>6th Semester</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="md:hidden space-y-10 mb-20">

          {/* Work On */}
          <div className="relative pl-5">
            <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
            <h3 className="text-2xl font-bold text-white mb-4">
              What I Work On
            </h3>
            <ul className="space-y-3 text-white/90">
              <li>• Backend APIs & logic</li>
              <li>• AWS services</li>
              <li>• Database handling</li>
              <li>• Deployment</li>
            </ul>
          </div>

          {/* Education Toggle */}
          <button
            onClick={() => setOpenMobile(openMobile === "edu" ? null : "edu")}
            className="w-full flex justify-between items-center text-white font-semibold text-lg"
          >
            Education
            <ChevronDown className={`transition ${openMobile === "edu" ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {openMobile === "edu" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative pl-5 text-white/90"
              >
                <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
                <p>
                  <strong>Diploma</strong> — Govt. Polytechnic, Arvi (83.20%)<br />
                  <strong>B.Tech</strong> — GCOE Chandrapur (6th Sem)
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Focus Toggle */}
          <button
            onClick={() => setOpenMobile(openMobile === "focus" ? null : "focus")}
            className="w-full flex justify-between items-center text-white font-semibold text-lg"
          >
            What I’m Focusing On
            <ChevronDown className={`transition ${openMobile === "focus" ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {openMobile === "focus" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative pl-5 text-white/90"
              >
                <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
                <ul className="space-y-2">
                  <li>• DevOps & CI/CD</li>
                  <li>• AWS EC2</li>
                  <li>• Backend design</li>
                  <li>• DSA practice</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= TECH STACK ================= */}
        <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">
          Tech Stack
        </h3>

        {/* Category Buttons (NO SCROLLBAR) */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {Object.keys(techStack).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as keyof typeof techStack)}
              className={`px-5 py-2 rounded-full text-sm transition ${
                selectedCategory === cat
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tech Pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {techStack[selectedCategory].map((tech) => (
            <span
              key={tech}
              className="px-5 py-2 rounded-full text-sm border bg-white/10 text-white/90 border-white/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
