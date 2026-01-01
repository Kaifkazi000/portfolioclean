/**
 * TypeScript types for GitHub Contributions API
 * 
 * These types match the response structure from our API route
 * and can be used in both frontend and backend code.
 */

export interface ContributionDay {
  date: string // ISO date string (YYYY-MM-DD)
  contributionCount: number // Number of contributions on this day
}

export interface ContributionWeek {
  contributionDays: ContributionDay[]
}

export interface GitHubContributionsResponse {
  success: boolean
  data?: {
    totalContributions: number
    weeks: ContributionWeek[]
    contributionDays: ContributionDay[] // Flattened array for convenience
  }
  error?: string
  cached?: boolean
}

/**
 * Frontend-friendly contribution data structure
 * Used for rendering the calendar UI
 */
export interface ContributionCalendarData {
  totalContributions: number
  contributions: Array<{
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4 // Intensity level for color mapping
  }>
}

/**
 * Helper function to map contribution count to intensity level
 * 
 * Levels:
 * - 0: No contributions (darkest)
 * - 1: 1-2 contributions (light)
 * - 2: 3-4 contributions (medium)
 * - 3: 5-6 contributions (bright)
 * - 4: 7+ contributions (brightest)
 */
export function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 4) return 2
  if (count <= 6) return 3
  return 4
}

/**
 * Transform API response to frontend-friendly format
 * Fills in missing days to ensure calendar displays correctly
 */
export function transformContributionsData(
  response: GitHubContributionsResponse,
  year?: number
): ContributionCalendarData | null {
  if (!response.success || !response.data) {
    return null
  }

  const { contributionDays, totalContributions } = response.data

  // Create a map of existing contribution days
  // CRITICAL: STRICTLY filter to ONLY include days from the specified year
  const contributionMap = new Map<string, number>()
  let filteredOut = 0
  
  contributionDays.forEach((day) => {
    const dayYear = new Date(day.date).getFullYear()
    // STRICTLY only include days from the specified year - reject all others
    if (year && dayYear === year) {
      contributionMap.set(day.date, day.contributionCount)
    } else if (year && day.contributionCount > 0) {
      filteredOut++
      console.log(`[Transform] REMOVING ${day.date} (year ${dayYear} != ${year}) with ${day.contributionCount} contributions`)
    }
  })
  
  console.log(`[Transform] Year ${year}: Kept ${contributionMap.size} days, removed ${filteredOut} days from other years`)

  // If year is provided, fill in all days of the year
  // This ensures the calendar displays correctly
  const contributions: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> = []
  
  if (year) {
    // Generate all days of the year - use UTC date strings to avoid timezone issues
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      for (let day = 1; day <= daysInMonth; day++) {
        // Use UTC date string format directly to avoid timezone issues
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const count = contributionMap.get(dateStr) || 0
        contributions.push({
          date: dateStr,
          count,
          level: getContributionLevel(count),
        })
      }
    }
  } else {
    // Fallback: just use the days from API
    contributions.push(...contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: getContributionLevel(day.contributionCount),
    })))
  }

  // Calculate actual total from contributions (more accurate than API's totalContributions)
  const actualTotal = contributions.reduce((sum, day) => sum + day.count, 0)
  
  console.log(`[Transform] Year ${year || 'unknown'}: API total=${totalContributions}, Calculated total=${actualTotal}, Days with contributions=${contributions.filter(c => c.count > 0).length}`)

  return {
    totalContributions: actualTotal, // Use calculated total instead of API's totalContributions
    contributions,
  }
}

