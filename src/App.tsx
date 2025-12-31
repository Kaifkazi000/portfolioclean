"use client"
import { useState } from "react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Projects from "./components/Projects"
import GitHubActivity from "./components/GitHubActivity"
import Contact from "./components/Contact"
import ScrollToTop from "./components/ScrollToTop"
import { ThemeProvider } from "./contexts/ThemeContext"
import BackgroundWrapper from "./components/BackgroundWrapper"
import SideMenu from "./components/SideMenu" // Import the new SideMenu
import LoadingWrapper from "./components/LoadingWrapper"
import Certifications from "./components/Certifications"

function App() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

  return (
    <LoadingWrapper>
    <ThemeProvider>
      <BackgroundWrapper>
        <Navbar setIsSideMenuOpen={setIsSideMenuOpen} /> {/* Pass state setter to Navbar */}
        <main className={isSideMenuOpen ? "overflow-hidden h-screen" : ""}>
          {" "}
          {/* Prevent scrolling when menu is open */}
          <Hero />
          <About />
          <Projects />
          <GitHubActivity />
          <Certifications />
          <Contact />
        </main>
        <div className="relative">
          <ScrollToTop />
        </div>
        <SideMenu isOpen={isSideMenuOpen} setIsOpen={setIsSideMenuOpen} /> {/* Render SideMenu */}
      </BackgroundWrapper>
    </ThemeProvider>
    </LoadingWrapper>
  )
}

export default App
