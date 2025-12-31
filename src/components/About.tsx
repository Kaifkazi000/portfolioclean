"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

const techStack = {
  AI_ML: [
    "Python",
    "Scikit-learn",
    "TensorFlow",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Pydantic",
    "OpenCV",
  ],
  GenAI: [
    "LangChain",
    "Langgraph",
    "LLM Orchestration",
    "n8n",
    "Hugging Face Transformers",
    "Vector Databases",
    "FastAPI",
  ],
  Languages: ["Java", "JavaScript", "TypeScript", "Python"],
  FullStack: ["React", "Node.js", "Next.js", "Express.js", "HTML/CSS"],
  Databases: ["PostgreSQL", "MongoDB", "MySQL"],
  Cloud: ["AWS", "Docker", "Salesforce"],
}

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const [openMobile, setOpenMobile] = useState<null | "work" | "focus" | "edu">(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "AI_ML", "GenAI", "Languages", "FullStack", "Databases", "Cloud"]

  const getFilteredTechs = () => {
    if (selectedCategory === "All") {
      return Object.entries(techStack).flatMap(([category, techs]) =>
        techs.map((tech) => ({ tech, key: `${category}-${tech}` }))
      )
    }
    return techStack[selectedCategory as keyof typeof techStack].map((tech) => ({
      tech,
      key: `${selectedCategory}-${tech}`,
    }))
  }

  const SectionToggle = ({
    title,
    value,
    children,
  }: {
    title: string
    value: "work" | "focus" | "edu"
    children: React.ReactNode
  }) => (
    <div className="border border-white/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpenMobile(openMobile === value ? null : value)}
        className="w-full flex items-center justify-between px-5 py-4 text-white font-semibold text-lg"
      >
        {title}
        <ChevronDown
          className={`transition-transform ${
            openMobile === value ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {openMobile === value && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-5 text-white/90"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const [openSection, setOpenSection] = useState<null | "edu" | "focus">(null)

  return (
    <section id="about" className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-8"
        >
          About Me
        </motion.h2>

        {/* Short About */}
        <p className="text-center text-white/90 max-w-3xl mx-auto text-base md:text-lg leading-relaxed mb-16">
          I’m a Computer Engineering student and software developer who learns by building
          real-world applications. Currently working at AssureMe, I collaborate on backend APIs,
          cloud integrations, database handling, and deployment workflows while steadily improving
          my development and DevOps skills.
        </p>

        {/* ================= DESKTOP VIEW ================= */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-24 mb-20">

            {/* Work On */}
            <div className="relative pl-6">
              <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
              <h3 className="text-3xl font-bold text-white mb-6">What I Work On</h3>
              <ul className="space-y-4 text-white/90 text-lg">
                <li>• Backend APIs & business logic</li>
                <li>• AWS services (S3, SES)</li>
                <li>• Database handling & data cloning</li>
                <li>• Deployment & environment setup</li>
                <li>• Team collaboration & delivery</li>
              </ul>
            </div>

            {/* Focus On */}
            <div className="relative pl-10">
              <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
              <h3 className="text-3xl font-bold text-white mb-6">What I’m Focusing On</h3>
              <ul className="space-y-4 text-white/90 text-lg">
                <li>• Backend system design</li>
                <li>• DevOps & CI/CD workflows</li>
                <li>• AWS EC2 & infrastructure</li>
                <li>• Writing scalable code</li>
                <li>• Improving DSA skills</li>
              </ul>
            </div>
          </div>

          {/* Education Centered */}
          <div className="flex justify-center mb-24">
            <div className="relative pl-6 text-center max-w-xl">
              <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
              <h3 className="text-3xl font-bold text-white mb-6">Education</h3>
              <p className="text-white/90 text-lg mb-4">
                <strong>Diploma (Polytechnic)</strong> — Government Polytechnic, Arvi<br />
                Percentage: <strong>83.20%</strong>
              </p>
              <p className="text-white/90 text-lg">
                <strong>B.Tech (Computer Engineering)</strong> — Government College of Engineering, Chandrapur<br />
                Currently in <strong>6th Semester</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="md:hidden space-y-10 mb-20">

          {/* Work On Always Visible */}
          <div className="relative pl-5">
            <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
            <h3 className="text-2xl font-bold text-white mb-4">What I Work On</h3>
            <ul className="space-y-3 text-white/90">
              <li>• Backend APIs & business logic</li>
              <li>• AWS services (S3, SES)</li>
              <li>• Database handling & data cloning</li>
              <li>• Deployment & setup</li>
            </ul>
          </div>

          {/* Accordion: Education */}
          <button
            onClick={() => setOpenSection(openSection === "edu" ? null : "edu")}
            className="w-full text-left text-white font-semibold text-lg"
          >
            Education {openSection === "edu" ? "▲" : "▼"}
          </button>

          {openSection === "edu" && (
            <div className="relative pl-5">
              <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
              <p className="text-white/90">
                <strong>Diploma</strong> — Govt. Polytechnic, Arvi (83.20%)<br />
                <strong>B.Tech</strong> — GCOE Chandrapur (6th Sem)
              </p>
            </div>
          )}

          {/* Accordion: Focus */}
          <button
            onClick={() => setOpenSection(openSection === "focus" ? null : "focus")}
            className="w-full text-left text-white font-semibold text-lg"
          >
            What I’m Focusing On {openSection === "focus" ? "▲" : "▼"}
          </button>

          {openSection === "focus" && (
            <div className="relative pl-5">
              <div className="absolute left-0 top-2 h-full w-[2px] bg-white/30" />
              <ul className="space-y-3 text-white/90">
                <li>• DevOps & CI/CD</li>
                <li>• AWS EC2 & infra</li>
                <li>• Backend design</li>
                <li>• DSA practice</li>
              </ul>
            </div>
          )}
        </div>

        {/* ================= TECH STACK ================= */}
        <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">
          Tech Stack
        </h3>

        <div className="flex gap-3 overflow-x-auto justify-center mb-10 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm transition ${
                selectedCategory === cat
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {cat === "AI_ML" ? "AI/ML" : cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {getFilteredTechs().map((item) => (
            <span
              key={item.key}
              className="px-5 py-2 rounded-full text-sm border bg-white/10 text-white/90 border-white/20"
            >
              {item.tech}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
