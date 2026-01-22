// components/GitHubActivity.tsx
"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { useTheme } from "../contexts/ThemeContext"
import ActivityCalendar from "react-activity-calendar"
import { FiGithub, FiTrendingUp, FiWifi, FiWifiOff } from "react-icons/fi"
import { transformContributionsData, type GitHubContributionsResponse } from "@/lib/types/github-contributions"

interface GitHubData {
  total: Record<number, number>
  contributions: Array<{
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
  }>
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes - shorter cache for real-time updates

export default function GitHubActivity() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const { theme } = useTheme()
  const dark = theme === "dark"

  const [selectedYear, setSelectedYear] = useState<number>(2026) // Default to 2026
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const YEAR = selectedYear // Use selected year
  const CACHE_KEY = `github_contributions_${YEAR}` // Cache key includes year

  /* ---------- helper: build empty year range (fallback) ---------- */
  const buildEmptyYearRange = (year: number): GitHubData => {
    const contributions: GitHubData["contributions"] = []
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate()
      for (let d = 1; d <= daysInMonth; d++) {
        // Use string formatting to avoid timezone issues with Date.toISOString()
        const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        contributions.push({
          date: dateStr,
          count: 0,
          level: 0,
        })
      }
    }
    return { total: { [year]: 0 }, contributions }
  }

  /* ---------- fetch from API route ---------- */
  const fetchContributions = async (year: number): Promise<GitHubData | null> => {
    try {
      const url = `/api/github-contributions?year=${year}`
      console.log(`[GitHubActivity] Fetching from: ${url}`)

      const response = await fetch(url)

      console.log(`[GitHubActivity] Response status:`, response.status, response.statusText)

      // Parse response even if status is not ok to get error message
      const result: GitHubContributionsResponse = await response.json()

      console.log(`[GitHubActivity] API Response:`, {
        success: result.success,
        totalContributions: result.data?.totalContributions,
        contributionDaysCount: result.data?.contributionDays?.length,
        error: result.error
      })

      if (!response.ok) {
        // Use the error message from API response if available
        const errorMsg = result.error || `HTTP error! status: ${response.status}`
        console.error("[GitHubActivity] API Error:", errorMsg)
        throw new Error(errorMsg)
      }

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch contributions")
      }

      // Transform API response to component format (pass year to fill missing days)
      const transformed = transformContributionsData(result, year)

      if (!transformed) {
        console.error("[GitHubActivity] Transformation failed")
        return null
      }

      // Debug logging - verify only selected year's data
      const daysWithContributions = transformed.contributions.filter(c => c.count > 0)
      const wrongYearDays = transformed.contributions.filter(c => {
        const dayYear = new Date(c.date).getFullYear()
        return dayYear !== year && c.count > 0
      })

      if (wrongYearDays.length > 0) {
        console.error(`[GitHubActivity] ERROR: Found ${wrongYearDays.length} days from wrong year:`, wrongYearDays.map(c => c.date))
      }

      console.log(`[GitHubActivity] Year ${year} - Total contributions:`, transformed.totalContributions)
      console.log(`[GitHubActivity] Year ${year} - Total days in array:`, transformed.contributions.length)
      console.log(`[GitHubActivity] Year ${year} - Days with contributions:`, daysWithContributions.length)
      console.log(`[GitHubActivity] Year ${year} - All contributions:`, daysWithContributions.map(c => `${c.date}: ${c.count}`))

      // Calculate total from actual contributions (more reliable than API's totalContributions)
      const actualTotal = transformed.contributions.reduce((sum, day) => sum + day.count, 0)

      console.log(`[GitHubActivity] Calculated total from contributions: ${actualTotal} (API said: ${transformed.totalContributions})`)

      // Convert to component's expected format
      return {
        total: { [year]: actualTotal }, // Use calculated total instead of API total
        contributions: transformed.contributions,
      }
    } catch (err) {
      console.error("[GitHubActivity] Fetch error:", err)
      setError(err instanceof Error ? err.message : "Failed to load contributions")
      return null
    }
  }

  /* ---------- load data ---------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      const cacheKey = `github_contributions_${selectedYear}`

      // Check localStorage cache first (shorter cache for real-time updates)
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { data: d, ts, isLive: cachedLive } = JSON.parse(cached)
          const cacheAge = Date.now() - ts
          const cachedTotal = d.total[selectedYear] || 0
          console.log(`[GitHubActivity] Found cache for year ${selectedYear}, age: ${Math.round(cacheAge / 1000)}s, Total: ${cachedTotal}`)

          // Use cache only if it's very fresh (less than 5 minutes)
          // This ensures new contributions show up quickly
          if (cacheAge < CACHE_TTL) {
            console.log(`[GitHubActivity] Using cached data - Total: ${cachedTotal}`)
            setData(d)
            setLive(cachedLive)
            setLoading(false)

            // Fetch fresh data in background to update cache
            fetchContributions(selectedYear).then((fresh) => {
              if (fresh) {
                const newTotal = fresh.total[selectedYear] || 0
                if (newTotal !== cachedTotal) {
                  console.log(`[GitHubActivity] Background update: Total changed from ${cachedTotal} to ${newTotal}`)
                  setData(fresh)
                  setLive(true)
                  localStorage.setItem(
                    cacheKey,
                    JSON.stringify({ data: fresh, ts: Date.now(), isLive: true })
                  )
                }
              }
            }).catch(() => {
              // Silent fail for background update
            })
            return
          } else {
            console.log(`[GitHubActivity] Cache expired (${Math.round(cacheAge / 1000)}s old), fetching fresh data`)
          }
        } catch (e) {
          // Invalid cache, continue to fetch
          console.warn("[GitHubActivity] Invalid cache, fetching fresh data", e)
        }
      } else {
        console.log(`[GitHubActivity] No cache found for year ${selectedYear}, fetching fresh data`)
      }

      // Fetch from API
      const fresh = await fetchContributions(selectedYear)

      if (fresh) {
        setData(fresh)
        setLive(true)
        // Cache the result
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data: fresh, ts: Date.now(), isLive: true })
        )
      } else {
        // Fallback to empty data
        setData(buildEmptyYearRange(selectedYear))
        setLive(false)
      }

      setLoading(false)
    }

    load()

    // Auto-refresh every 5 minutes to catch new contributions
    const refreshInterval = setInterval(() => {
      console.log(`[GitHubActivity] Auto-refreshing contributions for year ${selectedYear}`)
      const refreshCacheKey = `github_contributions_${selectedYear}`

      fetchContributions(selectedYear).then((fresh) => {
        if (fresh) {
          const newTotal = fresh.total[selectedYear] || 0
          setData((currentData) => {
            const currentTotal = currentData?.total[selectedYear] || 0
            if (newTotal !== currentTotal) {
              console.log(`[GitHubActivity] Auto-refresh: Total changed from ${currentTotal} to ${newTotal}`)
              setLive(true)
              localStorage.setItem(
                refreshCacheKey,
                JSON.stringify({ data: fresh, ts: Date.now(), isLive: true })
              )
              return fresh
            }
            return currentData
          })
        }
      }).catch(() => {
        // Silent fail for auto-refresh
      })
    }, 5 * 60 * 1000) // Every 5 minutes

    return () => clearInterval(refreshInterval)
  }, [selectedYear]) // Reload when year changes

  /* ---------- render ---------- */
  const display = data ?? buildEmptyYearRange(selectedYear)
  const total = display.total[selectedYear] || 0

  // CRITICAL: First, check what we have in display.contributions
  const wrongYearInDisplay = display.contributions.filter((c) => {
    const dayYear = new Date(c.date).getFullYear()
    return dayYear !== selectedYear && c.count > 0
  })

  if (wrongYearInDisplay.length > 0) {
    console.warn(`[GitHubActivity] Found ${wrongYearInDisplay.length} wrong-year contributions in display data:`, wrongYearInDisplay.map(c => `${c.date} (year ${new Date(c.date).getFullYear()})`))
  }

  // CRITICAL: Filter contributions to STRICTLY ONLY include the selected year
  // This ensures ActivityCalendar doesn't infer wrong year from data
  let filteredContributions = display.contributions.filter((c) => {
    const dayYear = new Date(c.date).getFullYear()
    const matches = dayYear === selectedYear
    if (!matches && c.count > 0) {
      console.warn(`[GitHubActivity] REMOVING contribution from wrong year: ${c.date} (year ${dayYear} != ${selectedYear}) with ${c.count} contributions`)
    }
    return matches
  })

  // If filteredContributions is empty or incomplete, generate all days of the year
  // ActivityCalendar requires non-empty data with all days
  const expectedDays = new Date(selectedYear, 2, 0).getDate() === 29 ? 366 : 365

  // Always regenerate to ensure we have exactly the right year and all days
  console.log(`[GitHubActivity] Regenerating year ${selectedYear} data (had ${filteredContributions.length}, need ${expectedDays} days)`)

  // Create a map of existing contributions for the selected year ONLY
  const contributionMap = new Map<string, number>()
  filteredContributions.forEach((c) => {
    const dayYear = new Date(c.date).getFullYear()
    if (dayYear === selectedYear) {
      contributionMap.set(c.date, c.count)
    }
  })

  // Generate all days of the selected year ONLY - use UTC date strings to avoid timezone issues
  const allDays: typeof filteredContributions = []
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(selectedYear, month + 1, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      // Use UTC date string format directly to avoid timezone issues
      const dateStr = `${selectedYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      // Verify the date string is actually from the selected year
      const dateYear = parseInt(dateStr.split('-')[0], 10)
      if (dateYear !== selectedYear) {
        console.error(`[GitHubActivity] ERROR: Generated date ${dateStr} has wrong year ${dateYear} (expected ${selectedYear})`)
        continue
      }
      const count = contributionMap.get(dateStr) || 0
      allDays.push({
        date: dateStr,
        count,
        level: count === 0 ? 0 : (count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4) as 0 | 1 | 2 | 3 | 4,
      })
    }
  }

  filteredContributions = allDays

  // Final verification: ensure NO wrong year data
  const wrongYearContributions = filteredContributions.filter((c) => {
    const dayYear = new Date(c.date).getFullYear()
    return dayYear !== selectedYear
  })

  if (wrongYearContributions.length > 0) {
    console.error(`[GitHubActivity] CRITICAL ERROR: Still found ${wrongYearContributions.length} contributions from wrong year after regeneration!`, wrongYearContributions.map(c => `${c.date} (year ${new Date(c.date).getFullYear()})`))
    // Remove them completely - this should never happen if regeneration worked
    filteredContributions = filteredContributions.filter((c) => {
      const dayYear = new Date(c.date).getFullYear()
      return dayYear === selectedYear
    })
  }

  // Verify we have the right number of days
  if (filteredContributions.length !== expectedDays) {
    console.warn(`[GitHubActivity] Expected ${expectedDays} days but got ${filteredContributions.length} for year ${selectedYear}`)
  }

  // Debug logging for display
  if (data) {
    console.log(`[GitHubActivity] Display - Year: ${selectedYear}, Total: ${total}`)
    console.log(`[GitHubActivity] Display - Original contributions: ${display.contributions.length}, Filtered: ${filteredContributions.length}`)
    console.log(`[GitHubActivity] Display - Contributions with count > 0:`, filteredContributions.filter(c => c.count > 0).length)
    if (filteredContributions.length > 0) {
      console.log(`[GitHubActivity] Display - Date range: ${filteredContributions[0]?.date} to ${filteredContributions[filteredContributions.length - 1]?.date}`)
    }
  }

  return (
    <section id="github-activity" className="py-16 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center mb-12 sm:mb-16">
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 ${dark ? "text-white" : "text-white"}`}
            >
              {total > 0 ? `${total} contributions in ${YEAR}` : `${YEAR} Contribution Calendar`}
            </h2>

            {/* Year Selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  console.log(`[GitHubActivity] Switching to year 2025`)
                  setSelectedYear(2025)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedYear === 2025
                  ? dark
                    ? "bg-white/20 text-white border-2 border-white/40"
                    : "bg-white/30 text-white border-2 border-white/50"
                  : dark
                    ? "bg-white/5 text-white/70 hover:bg-white/10 border border-white/20"
                    : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/30"
                  }`}
              >
                2025
              </button>
              <button
                onClick={() => {
                  console.log(`[GitHubActivity] Switching to year 2026`)
                  setSelectedYear(2026)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedYear === 2026
                  ? dark
                    ? "bg-white/20 text-white border-2 border-white/40"
                    : "bg-white/30 text-white border-2 border-white/50"
                  : dark
                    ? "bg-white/5 text-white/70 hover:bg-white/10 border border-white/20"
                    : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/30"
                  }`}
              >
                2026
              </button>
            </div>
          </div>

          <motion.div
            className={`rounded-2xl p-4 sm:p-8 mb-8 backdrop-blur-sm border transition-all duration-300 ${dark ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10"
              }`}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-center items-center gap-3 mb-4">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${live
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

              {/* Refresh Button */}
              <button
                onClick={async () => {
                  console.log(`[GitHubActivity] Manual refresh triggered for year ${selectedYear}`)
                  setLoading(true)
                  setError(null)

                  // Clear cache for this year
                  const cacheKey = `github_contributions_${selectedYear}`
                  localStorage.removeItem(cacheKey)

                  // Fetch fresh data
                  const fresh = await fetchContributions(selectedYear)
                  if (fresh) {
                    setData(fresh)
                    setLive(true)
                    localStorage.setItem(
                      cacheKey,
                      JSON.stringify({ data: fresh, ts: Date.now(), isLive: true })
                    )
                  } else {
                    setData(buildEmptyYearRange(selectedYear))
                    setLive(false)
                  }
                  setLoading(false)
                }}
                disabled={loading}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
                  } ${dark
                    ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  }`}
                title="Refresh contributions (auto-updates every 5 min)"
              >
                {loading ? "⋯" : "↻"} Refresh
              </button>
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

            {/* Error Display */}
            {error && (
              <div className={`mb-4 p-4 rounded-lg border ${dark ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>
                <p className="text-sm font-medium">Error loading contributions:</p>
                <p className="text-xs mt-1">{error}</p>
                <p className="text-xs mt-2 opacity-75">
                  Make sure GITHUB_PERSONAL_ACCESS_TOKEN is set in .env.local and the server was restarted.
                </p>
              </div>
            )}

            <div className="flex justify-center">
              {loading ? (
                <div className={`animate-pulse text-center py-8 ${dark ? "text-white/60" : "text-white/60"}`}>
                  Loading contribution data...
                </div>
              ) : error ? (
                <div className={`text-center py-8 ${dark ? "text-white/60" : "text-white/60"}`}>
                  Unable to load contribution data. Please check the error above.
                </div>
              ) : filteredContributions.length === 0 ? (
                <div className={`text-center py-8 ${dark ? "text-white/60" : "text-white/60"}`}>
                  No contribution data available for {selectedYear}.
                </div>
              ) : (
                <>
                  {/* Desktop View - Full Calendar */}
                  <div className="hidden md:block w-full">
                    <div className="overflow-x-auto">
                      <ActivityCalendar
                        data={filteredContributions}
                        theme={{
                          light: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                          dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                        }}
                        colorScheme={dark ? "dark" : "dark"}
                        blockSize={12}
                        blockMargin={3}
                        fontSize={12}
                        hideColorLegend={false}
                        hideMonthLabels={false}
                        hideTotalCount={true}
                        showWeekdayLabels
                        maxLevel={4}
                      />
                    </div>
                    {/* Custom contribution summary - shows correct year and contributions (not repositories) */}
                    <div className="text-center mt-4 text-sm text-white/70">
                      {total} contributions in {selectedYear}
                    </div>
                  </div>

                  {/* Mobile View - 4 Month Carousel */}
                  <MobileCalendarCarousel
                    contributions={filteredContributions}
                    year={selectedYear}
                    dark={dark}
                  />
                </>
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

// Mobile Calendar Carousel Component (4 months at a time)
function MobileCalendarCarousel({
  contributions,
  year,
  dark,
}: {
  contributions: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>
  year: number
  dark: boolean
}) {
  const [currentQuarter, setCurrentQuarter] = useState(0) // 0, 1, or 2 (3 quarters of 4 months each)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Create a map for quick lookup
  const contributionMap = new Map<string, { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>()
  contributions.forEach((c) => {
    contributionMap.set(c.date, c)
  })

  // Generate quarters with ALL days (not just days with contributions)
  const generateQuarter = (startMonth: number, endMonth: number) => {
    const quarterDays: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> = []
    for (let month = startMonth; month <= endMonth; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      for (let day = 1; day <= daysInMonth; day++) {
        // Use string formatting to avoid timezone issues with Date.toISOString()
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const existing = contributionMap.get(dateStr)
        quarterDays.push(
          existing || {
            date: dateStr,
            count: 0,
            level: 0,
          }
        )
      }
    }
    return quarterDays
  }

  // Split into 3 quarters (4 months each) - ensure ALL days are included
  const quarters = [
    generateQuarter(0, 3),   // Jan-Apr (months 0-3)
    generateQuarter(4, 7),   // May-Aug (months 4-7)
    generateQuarter(8, 11),  // Sep-Dec (months 8-11)
  ]

  // Auto-scroll every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuarter((prev) => (prev + 1) % 3)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Scroll to current quarter
  useEffect(() => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth
      const scrollPosition = currentQuarter * containerWidth
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }, [currentQuarter])

  const quarterLabels = [
    "Jan - Apr",
    "May - Aug",
    "Sep - Dec",
  ]

  return (
    <div className="md:hidden w-full">
      {/* Carousel Container - No visible navigation elements */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {quarters.map((quarterContributions, index) => {
            return (
              <div
                key={index}
                className="min-w-full snap-center flex-shrink-0"
              >
                <div className="px-2">
                  <div className="text-center mb-2 text-sm text-white/70">
                    {quarterLabels[index]} {year}
                  </div>
                  <ActivityCalendar
                    data={quarterContributions}
                    theme={{
                      light: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                      dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                    }}
                    colorScheme={dark ? "dark" : "dark"}
                    blockSize={10}
                    blockMargin={2}
                    fontSize={10}
                    hideColorLegend={index !== 0} // Show legend only on first quarter
                    hideMonthLabels={false}
                    hideTotalCount={true}
                    showWeekdayLabels
                    maxLevel={4}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
