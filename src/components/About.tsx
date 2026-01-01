"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
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
  DSA: ["Arrays", "Strings", "Trees", "Graphs"],
}

export default function About() {
  const sectionRef = useRef(null)
  const eduRef = useRef(null)
  const focusRef = useRef(null)

  const isInView = useInView(sectionRef, { once: true })
  const eduInView = useInView(eduRef, { margin: "-40%" })
  const focusInView = useInView(focusRef, { margin: "-40%" })

  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof techStack>("All")

  const [openMobile, setOpenMobile] = useState<null | "edu" | "focus">(null)

  /* AUTO OPEN ON SCROLL (MOBILE ONLY) */
  useEffect(() => {
    if (window.innerWidth < 768) {
      if (eduInView) setOpenMobile("edu")
      if (focusInView) setOpenMobile("focus")
    }
  }, [eduInView, focusInView])

  return (
    <section id="about" className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.h2
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-8"
        >
          About Me
        </motion.h2>

        {/* Intro */}
        <p className="text-center text-white/90 max-w-3xl mx-auto text-base md:text-lg leading-relaxed mb-16">
          I’m a Computer Engineering student and software developer who learns by
          building real-world applications. Currently working at AssureMe, I
          collaborate on backend APIs, AWS services, database handling, and
          deployment workflows while growing in DevOps and system design.
        </p>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:block">

          <div className="grid grid-cols-2 gap-24 mb-20">

            {/* Work */}
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
            <div className="relative pl-8 max-w-xl text-left">
              <div className="absolute left-0 top-0 h-full w-[2px] bg-white/30" />
              <h3 className="text-3xl font-bold text-white mb-8 text-center">
                Education
              </h3>

              <div className="mb-8">
                <p className="text-white font-semibold text-lg">
                  Diploma (Polytechnic)
                </p>
                <p className="text-white/90">
                  Government Polytechnic, Arvi
                </p>
                <p className="text-white/70 text-sm">
                  Percentage: <span className="font-semibold">83.20%</span>
                </p>
              </div>

              <div>
                <p className="text-white font-semibold text-lg">
                  B.Tech (Computer Engineering)
                </p>
                <p className="text-white/90">
                  Government College of Engineering, Chandrapur
                </p>
                <p className="text-white/70 text-sm">
                  Currently in <span className="font-semibold">6th Semester</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden space-y-12 mb-20">

          {/* Work */}
          <div className="relative pl-5">
            <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
            <h3 className="text-2xl font-bold text-white mb-4">
              What I Work On
            </h3>
            <ul className="space-y-3 text-white/90">
              <li>• Backend APIs</li>
              <li>• AWS services</li>
              <li>• Database handling</li>
              <li>• Deployment</li>
            </ul>
          </div>

          {/* Education AUTO */}
          <div ref={eduRef}>
            <button
              onClick={() => setOpenMobile(openMobile === "edu" ? null : "edu")}
              className="w-full flex justify-between items-center text-white font-semibold text-lg"
            >
              Education
              <ChevronDown
                className={`transition ${
                  openMobile === "edu" ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openMobile === "edu" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="relative pl-5 mt-4 text-white/90"
                >
                  <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
                  <p>
                    <strong>Diploma</strong> — Govt. Polytechnic, Arvi (83.20%)
                    <br />
                    <strong>B.Tech</strong> — GCOE Chandrapur (6th Sem)
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Focus AUTO */}
          <div ref={focusRef}>
            <button
              onClick={() =>
                setOpenMobile(openMobile === "focus" ? null : "focus")
              }
              className="w-full flex justify-between items-center text-white font-semibold text-lg"
            >
              What I’m Focusing On
              <ChevronDown
                className={`transition ${
                  openMobile === "focus" ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openMobile === "focus" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="relative pl-5 mt-4 text-white/90"
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
        </div>

        {/* ================= TECH STACK ================= */}
        <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">
          Tech Stack
        </h3>

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
