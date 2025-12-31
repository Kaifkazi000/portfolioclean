// components/GitHubActivity.tsx
"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { useTheme } from "../contexts/ThemeContext"
import ActivityCalendar from "react-activity-calendar"
import { FiGithub, FiTrendingUp, FiWifi, FiWifiOff } from "react-icons/fi"

interface GitHubData {
  total: Record<number, number>
  contributions: Array<{
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
  }>
}

const CACHE_KEY = "github_contributions_2025"
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 h
const USER = "Kaifkazi000"

export default function GitHubActivity() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const { theme } = useTheme()
  const dark = theme === "dark"

  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)

  const YEAR = new Date().getFullYear() // Show current year (2025)

  /* ---------- helper: build Jan 1 → Dec 31 ---------- */
  const buildYearRange = (eventMap: Map<string, number>) => {
    const contributions: GitHubData["contributions"] = []
    let total = 0
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(YEAR, m + 1, 0).getDate()
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(YEAR, m, d)
        const dateStr = date.toISOString().split("T")[0]
        const cnt = eventMap.get(dateStr) ?? 0
        total += cnt
        contributions.push({
          date: dateStr,
          count: cnt,
          level: cnt === 0 ? 0 : cnt <= 2 ? 1 : cnt <= 4 ? 2 : cnt <= 6 ? 3 : 4,
        })
      }
    }
    return { total: { [YEAR]: total }, contributions }
  }

  /* ---------- GraphQL fetch ---------- */
  const fetchGraphQL = async (token: string) => {
    const query = `
      query($login:String!){
        user(login:$login){
          contributionsCollection{
            contributionCalendar{
              totalContributions
              weeks{
                contributionDays{
                  date contributionCount
                }
              }
            }
          }
        }
      }`
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { login: USER } }),
    })
    if (!res.ok) throw new Error("GraphQL error")
    const body = await res.json()
    if (body.errors) throw new Error(body.errors[0]?.message)

    const days = body.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
      (w: any) => w.contributionDays,
    )

    const map = new Map<string, number>()
    days.forEach((d: any) => map.set(d.date, d.contributionCount))
    return buildYearRange(map)
  }

  /* ---------- REST fallback ---------- */
  const fetchREST = async (token: string) => {
    const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("REST error")

    const events = await res.json()
    const map = new Map<string, number>()
    events.forEach((ev: any) => {
      const key = new Date(ev.created_at).toISOString().split("T")[0]
      map.set(key, (map.get(key) || 0) + 1)
    })
    return buildYearRange(map)
  }

  /* ---------- load ---------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data: d, ts, isLive } = JSON.parse(cached)
        if (Date.now() - ts < CACHE_TTL) {
          setData(d)
          setLive(isLive)
          setLoading(false)
          return
        }
      }
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
      console.log("Token available:", !!token, "Token value:", token ? "Present" : "Missing", "Year:", YEAR)
      
      // If no token, try to use a fallback or show demo data
      if (!token) {
        console.log("No GitHub token found, using demo data")
        setData(buildYearRange(new Map()))
        setLive(false)
        setLoading(false)
        return
      }
      
      try {
        const fresh = await fetchGraphQL(token).catch((error) => {
          console.log("GraphQL failed, trying REST:", error)
          return fetchREST(token)
        })
        if (fresh) {
          setData(fresh)
          setLive(true)
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: fresh, ts: Date.now(), isLive: true }))
        } else {
          setData(buildYearRange(new Map())) // demo
        }
      } catch {
        setData(buildYearRange(new Map()))
      }
      setLoading(false)
    }
    load()
  }, [])

  /* ---------- render ---------- */
  const display = data ?? buildYearRange(new Map())
  const total = display.total[YEAR] || 0

  return (
    <section id="github-activity" className="py-16 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 ${dark ? "text-white" : "text-white"}`}
          >
            {YEAR} Contribution Calendar
          </h2>

          <motion.div
            className={`rounded-2xl p-4 sm:p-8 mb-8 backdrop-blur-sm border transition-all duration-300 ${
              dark ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10"
            }`}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-center mb-4">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  live
                    ? dark
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : dark
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                }`}
              >
                {live ? <FiWifi className="w-3 h-3" /> : <FiWifiOff className="w-3 h-3" />}
                {live ? "Live GitHub Data" : "Demo Data"}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 sm:p-3 rounded-full ${dark ? "bg-white/10" : "bg-white/5"}`}>
                  <FiGithub className={`w-5 h-5 sm:w-6 sm:h-6 ${dark ? "text-white" : "text-white"}`} />
                </div>
                <div className="text-center sm:text-left">
                  <div className={`text-2xl sm:text-4xl font-bold ${dark ? "text-white" : "text-white"}`}>
                    {loading ? "⋯" : total.toLocaleString()}
                  </div>
                  <div className={`text-xs sm:text-sm ${dark ? "text-white/70" : "text-white/70"}`}>
                    Total Contributions
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FiTrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 ${dark ? "text-green-400" : "text-emerald-600"}`} />
                <span className={`text-xs sm:text-sm font-medium ${dark ? "text-green-400" : "text-emerald-600"}`}>
                  Active Developer
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              {loading ? (
                <div className={`animate-pulse text-center py-8 ${dark ? "text-white/60" : "text-white/60"}`}>
                  Loading contribution data...
                </div>
              ) : (
                <div className="w-full">
                  <div className="overflow-x-auto">
                    <ActivityCalendar
                      data={display.contributions}
                      theme={{
                        light: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                        dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                      }}
                      colorScheme={dark ? "dark" : "dark"}
                      blockSize={window.innerWidth < 640 ? 10 : 12}
                      blockMargin={window.innerWidth < 640 ? 2 : 3}
                      fontSize={window.innerWidth < 640 ? 10 : 12}
                      hideColorLegend={false}
                      hideMonthLabels={false}
                      hideTotalCount
                      showWeekdayLabels
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.p
            className={`text-center text-base sm:text-lg ${dark ? "text-white/80" : "text-white/80"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Want to dive deeper? Scroll to Contact and let&apos;s chat.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
