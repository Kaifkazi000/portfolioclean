"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { useTheme } from "../contexts/ThemeContext"

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
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [selectedCategory, setSelectedCategory] = useState("All")

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
  }

  // Get filtered tech items with unique keys
  const getFilteredTechs = () => {
    if (selectedCategory === "All") {
      return Object.entries(techStack).flatMap(([category, techs]) =>
        techs.map((tech) => ({ tech, category, key: `${category}-${tech}` })),
      )
    }
    const techs = techStack[selectedCategory as keyof typeof techStack] || []
    return techs.map((tech) => ({ tech, category: selectedCategory, key: `${selectedCategory}-${tech}` }))
  }

  const categories = ["All","AI_ML","GenAI", "Languages", "FullStack", "Databases", "Cloud"]

  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 md:mb-16 ${
              isDark ? "text-white" : "text-white"
            }`}
          >
            About Me
          </h2>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mb-12 sm:mb-16 md:mb-20"
          >
            <div className={`w-full ${isDark ? "text-white/90" : "text-white/90"}`}>
              <div className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
                  I'm an AI/ML and full-stack developer dedicated to building intelligent, scalable digital products
                  that create meaningful impact. With a strong foundation in machine learning, generative AI, and modern
                  web technologies, I enjoy tackling complex problems and transforming ideas into robust, user-friendly
                  solutions.
                </p>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
                  My work blends creativity with technical depth — from designing intelligent algorithms to crafting
                  smooth, responsive interfaces. I'm passionate about using AI to solve real-world challenges and
                  believe in writing clean, maintainable code that can scale as projects grow.
                </p>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
                  Beyond coding, I'm deeply invested in lifelong learning and staying up to date with the latest
                  advancements in artificial intelligence, data science, and emerging web frameworks. I love
                  contributing to open-source communities, collaborating with other developers, and sharing insights
                  through talks, blogs, and workshops.
                </p>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
                  When I'm not coding, you'll find me experimenting with new AI tools, mentoring aspiring developers, or
                  exploring ideas that push the boundaries of what's possible with technology. My goal is simple: build
                  things that matter, solve problems that inspire, and grow alongside a vibrant tech community.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <h3
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 ${
                isDark ? "text-white" : "text-white"
              }`}
            >
              Tech Stack
            </h3>

            {/* Filter Tabs - Scrollable on mobile */}
            <div className="mb-8 sm:mb-12">
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 sm:justify-center scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full text-sm sm:text-base whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-white/20 text-white border border-white/30 backdrop-blur-sm"
                        : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white/90"
                    }`}
                  >
                    {category === "AI_ML" ? "AI/ML" : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack Items */}
            <motion.div
              className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center"
              layout
              style={{ willChange: "transform" }}
            >
              {getFilteredTechs().map((item, index) => (
                <motion.span
                  key={item.key}
                  className={`px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 rounded-full text-xs sm:text-sm md:text-base border transition-all duration-300 ${
                    isDark
                      ? "bg-white/10 text-white/90 border-white/20 hover:bg-white/20 hover:border-white/30"
                      : "bg-white/5 text-white/90 border-white/20 hover:bg-white/15 hover:border-white/30"
                  }`}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.02,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -1,
                    transition: {
                      duration: 0.15,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
