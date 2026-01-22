"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { FiExternalLink, FiGithub } from "react-icons/fi"
import { useTheme } from "../contexts/ThemeContext"

const projects = [
  {
    id: 1,
    title: "Personal Portfolio",
    description: "A modern, responsive portfolio website built with React, TypeScript, and Vanta.js for dynamic wave animations. Features smooth scrolling, dark/light theme toggle, contact form integration, and GitHub contribution calendar. Showcases skills, projects, and certifications with a professional, interactive design.",
    image: "portfolio.png",
    tech: ["React", "TypeScript", "Vanta.js", "Framer Motion", "Tailwind CSS", "Next.js"],
    liveUrl: "https://portfolioclean-eight.vercel.app/",
    githubUrl: "https://github.com/Kaifkazi000/portfolioclean",
  },
  {
    id: 2,
    title: "AssureMe - Business Platform",
    description: "Working as a Full Stack Developer at AssureMe, developing a comprehensive business platform from scratch. The website is fully functional and actively maintained, serving Instagram sellers and businesses with advanced features including user management, analytics, and business tools. Built with modern technologies for scalability and performance.",
    image: "/assureme.png",
    tech: ["React", "Next.js", "Supabase", "PostgreSQL", "AWS", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://assureme.in",
    githubUrl: "https://github.com/Kaifkazi000",
  },
  {
    id: 3,
    title: "Instagram Data Scraper",
    description: "A powerful business intelligence tool that scrapes Instagram profile data using Apify API. Users input Instagram IDs through a clean UI, and the system extracts comprehensive data including bio, followers, posts, engagement metrics, and related accounts. All data is stored in a structured database with proper columns for business analysis and competitor research.",
    image: "work-in-progress",
    tech: ["React", "Node.js", "Apify API", "Supabase", "PostgreSQL", "Data Analytics"],
    liveUrl: "",
    githubUrl: "https://github.com/Kaifkazi000/instagram-scrapper",
  },
  {
    id: 4,
    title: "CodeLab- virtual lab",
    description: " A structured programming lab system designed for real academic practicals. Where coding practicals are done properly, not casually. Read  READ.ME file",


    image: "/newcodelab.png",
    tech: [
      "Next.js",
      "React",
      "JavaScript",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Supabase",
      "REST APIs",
      "JWT Authentication",
      "Git",
      "GitHub",
      "Postman"
    ],
    liveUrl: "https://github.com/Kaifkazi000/virtaul-coding-labs",
    githubUrl: "https://github.com/Kaifkazi000/virtaul-coding-labs",
  },
  {
    id: 5,
    title: "More Projects Coming Soon",
    description: "Exciting new projects are in development! Stay tuned for innovative solutions combining AI, web development, and data science. Always exploring new technologies and building something amazing.",
    image: "coming-soon",
    tech: ["AI/ML", "Web Development", "Data Science", "Innovation"],
    liveUrl: "",
    githubUrl: "https://github.com/Kaifkazi000",
  },
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section id="projects" className="py-16 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 p-6 text-white">
            Featured Projects
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="backdrop-blur-sm rounded-lg overflow-hidden border bg-white/10 border-white/20 hover:border-white/40 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="aspect-video overflow-hidden">
                  {project.image === "work-in-progress" ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold mb-2">🚧</div>
                        <div className="text-lg font-semibold">Work in Progress</div>
                        <div className="text-sm opacity-80">Coming Soon</div>
                      </div>
                    </div>
                  ) : project.image === "under-maintenance" ? (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold mb-2">🔧</div>
                        <div className="text-lg font-semibold">Under Maintenance</div>
                        <div className="text-sm opacity-80">Website Temporarily Down</div>
                      </div>
                    </div>
                  ) : project.image === "contributions" ? (
                    <div className="w-full h-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold mb-2">🤝</div>
                        <div className="text-lg font-semibold">Contributions</div>
                        <div className="text-sm opacity-80">Open Source</div>
                      </div>
                    </div>
                  ) : project.image === "coming-soon" ? (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold mb-2">✨</div>
                        <div className="text-lg font-semibold">More Projects</div>
                        <div className="text-sm opacity-80">Coming Soon...</div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-sm text-white/70">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded text-xs bg-white/10 text-white/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </motion.a>
                    )}
                    <motion.a
                      href={project.githubUrl}
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiGithub className="w-4 h-4" />
                      <span>Code</span>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="w-full flex justify-center mt-8">
        <a
          href="https://github.com/Kaifkazi000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg sm:text-xl md:text-2xl font-semibold underline underline-offset-4 decoration-2 hover:decoration-4 transition-all duration-200 text-white"
        >
          View more projects
        </a>
      </div>
    </section>
  )
}
