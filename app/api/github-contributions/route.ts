/**
 * GitHub Contributions API Route
 * 
 * This serverless API route fetches GitHub contribution calendar data
 * using the official GitHub GraphQL API.
 * 
 * Architecture:
 * - Server-side only (token never exposed to client)
 * - Built-in caching with revalidation
 * - Rate limit handling
 * - Error handling with fallbacks
 */

import { NextRequest, NextResponse } from 'next/server'

// ============================================================================
// TYPES
// ============================================================================

interface ContributionDay {
  date: string
  contributionCount: number
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

interface ContributionCalendar {
  totalContributions: number
  weeks: ContributionWeek[]
}

interface GitHubGraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: ContributionCalendar
      }
    }
  }
  errors?: Array<{ message: string; type?: string }>
}

interface APIResponse {
  success: boolean
  data?: {
    totalContributions: number
    weeks: ContributionWeek[]
    contributionDays: ContributionDay[]
  }
  error?: string
  cached?: boolean
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const GITHUB_API_URL = 'https://api.github.com/graphql'
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Kaifkazi000'
const CACHE_DURATION = 5 * 60 // 5 minutes in seconds - shorter cache for real-time updates

// ============================================================================
// GRAPHQL QUERY
// ============================================================================

/**
 * GraphQL query to fetch contribution calendar data
 * 
 * This query fetches:
 * - Total contributions for the current year
 * - All weeks with their contribution days
 * - Date and contribution count for each day
 * 
 * The query automatically filters to the current year based on GitHub's
 * contributionsCollection which defaults to the last year of activity.
 */
const CONTRIBUTIONS_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get date range for a specific year (Jan 1 to Dec 31)
 * IMPORTANT: Include the full day of Dec 31
 */
function getYearRange(year: number) {
  // Start: January 1, 00:00:00 UTC
  const from = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0))
  
  // End: December 31, 23:59:59 UTC (full day)
  const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999))
  
  const fromISO = from.toISOString()
  const toISO = to.toISOString()
  
  console.log(`[getYearRange] Year ${year}: ${fromISO} to ${toISO}`)
  
  return {
    from: fromISO,
    to: toISO,
  }
}

/**
 * Flatten weeks array into a single array of contribution days
 */
function flattenContributionDays(weeks: ContributionWeek[]): ContributionDay[] {
  return weeks.flatMap((week) => week.contributionDays)
}

/**
 * Check if we're hitting GitHub rate limits
 */
function isRateLimitError(error: any): boolean {
  return (
    error?.message?.includes('rate limit') ||
    error?.message?.includes('API rate limit') ||
    error?.type === 'RATE_LIMITED'
  )
}

/**
 * Check if token is invalid or missing
 */
function isAuthError(error: any): boolean {
  return (
    error?.message?.includes('Bad credentials') ||
    error?.message?.includes('token') ||
    error?.message?.includes('authentication')
  )
}

// ============================================================================
// MAIN API HANDLER
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // ========================================================================
    // 1. VALIDATE ENVIRONMENT
    // ========================================================================
    
    const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN
    
    // Debug logging to help identify issues
    console.log('[GitHub API] Token exists:', !!token)
    console.log('[GitHub API] Token length:', token?.length || 0)
    console.log('[GitHub API] Username:', GITHUB_USERNAME)
    
    if (!token) {
      console.error('[GitHub API] Missing GITHUB_PERSONAL_ACCESS_TOKEN')
      console.error('[GitHub API] Available env vars:', Object.keys(process.env).filter(k => k.includes('GITHUB')))
      return NextResponse.json(
        {
          success: false,
          error: 'GitHub token not configured. Please set GITHUB_PERSONAL_ACCESS_TOKEN in environment variables.',
        } as APIResponse,
        { status: 500 }
      )
    }

    // ========================================================================
    // 2. GET YEAR PARAMETER (default to 2025)
    // ========================================================================
    
    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get('year')
    const year = yearParam ? parseInt(yearParam, 10) : 2025
    
    // Validate year (must be reasonable, allow 2025 and 2026)
    if (isNaN(year) || year < 2020 || year > 2030) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid year parameter. Must be between 2020 and 2030.',
        } as APIResponse,
        { status: 400 }
      )
    }
    
    // ========================================================================
    // 3. PREPARE GRAPHQL REQUEST
    // ========================================================================
    
    const { from, to } = getYearRange(year)
    
    // Debug logging
    console.log(`[GitHub API] Fetching contributions for year: ${year}`)
    console.log(`[GitHub API] Date range: ${from} to ${to}`)
    
    const variables = {
      login: GITHUB_USERNAME,
      from,
      to,
    }
    
    console.log(`[GitHub API] GraphQL variables:`, JSON.stringify(variables, null, 2))

    // ========================================================================
    // 4. FETCH FROM GITHUB GRAPHQL API
    // ========================================================================
    
    const response = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Website', // GitHub requires User-Agent
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables,
      }),
    })

    // ========================================================================
    // 5. HANDLE HTTP ERRORS
    // ========================================================================
    
    if (!response.ok) {
      const status = response.status
      
      if (status === 401) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid GitHub token. Please check your GITHUB_PERSONAL_ACCESS_TOKEN.',
          } as APIResponse,
          { status: 401 }
        )
      }
      
      if (status === 403) {
        return NextResponse.json(
          {
            success: false,
            error: 'GitHub API rate limit exceeded. Please try again later.',
          } as APIResponse,
          { status: 429 }
        )
      }
      
      return NextResponse.json(
        {
          success: false,
          error: `GitHub API error: ${response.statusText}`,
        } as APIResponse,
        { status: response.status }
      )
    }

    // ========================================================================
    // 6. PARSE GRAPHQL RESPONSE
    // ========================================================================
    
    const result: GitHubGraphQLResponse = await response.json()

    // ========================================================================
    // 7. HANDLE GRAPHQL ERRORS
    // ========================================================================
    
    if (result.errors && result.errors.length > 0) {
      const error = result.errors[0]
      
      if (isRateLimitError(error)) {
        return NextResponse.json(
          {
            success: false,
            error: 'GitHub API rate limit exceeded. Please try again later.',
          } as APIResponse,
          { status: 429 }
        )
      }
      
      if (isAuthError(error)) {
        return NextResponse.json(
          {
            success: false,
            error: 'GitHub authentication failed. Please check your token.',
          } as APIResponse,
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        {
          success: false,
          error: `GraphQL error: ${error.message}`,
        } as APIResponse,
        { status: 400 }
      )
    }

    // ========================================================================
    // 8. VALIDATE AND TRANSFORM DATA
    // ========================================================================
    
    const calendar = result.data?.user?.contributionsCollection?.contributionCalendar
    
    if (!calendar) {
      return NextResponse.json(
        {
          success: false,
          error: 'No contribution data found for user.',
        } as APIResponse,
        { status: 404 }
      )
    }

    // Flatten weeks for easier frontend consumption
    const contributionDays = flattenContributionDays(calendar.weeks)

    // CRITICAL: Filter contribution days to STRICTLY ONLY include the requested year
    // This ensures 2025 shows ONLY 2025 contributions, 2026 shows ONLY 2026 contributions
    const filteredDays = contributionDays.filter((day) => {
      const dayYear = new Date(day.date).getFullYear()
      const matches = dayYear === year
      if (!matches && day.contributionCount > 0) {
        console.log(`[GitHub API] REMOVING ${day.date} (year ${dayYear} != requested ${year}) with ${day.contributionCount} contributions`)
      }
      return matches
    })
    
    console.log(`[GitHub API] Year ${year}: Filtered from ${contributionDays.length} total days to ${filteredDays.length} days for year ${year}`)

    // Calculate actual total from filtered days
    const actualTotal = filteredDays.reduce((sum, day) => sum + day.contributionCount, 0)

    // Debug logging - check for Dec 31 specifically
    const dec31Day = filteredDays.find(d => d.date === `${year}-12-31`)
    const daysWithContributions = filteredDays.filter(d => d.contributionCount > 0)
    
    console.log(`[GitHub API] Year ${year} - API total:`, calendar.totalContributions)
    console.log(`[GitHub API] Year ${year} - All days count:`, contributionDays.length)
    console.log(`[GitHub API] Year ${year} - Filtered days count:`, filteredDays.length)
    console.log(`[GitHub API] Year ${year} - Calculated total from filtered days:`, actualTotal)
    console.log(`[GitHub API] Year ${year} - Days with contributions:`, daysWithContributions.length)
    console.log(`[GitHub API] Year ${year} - Dec 31 data:`, dec31Day)
    console.log(`[GitHub API] Year ${year} - All days with contributions:`, daysWithContributions.map(d => `${d.date}: ${d.contributionCount}`))

    // ========================================================================
    // 9. RETURN SUCCESS RESPONSE
    // ========================================================================
    
    const apiResponse: APIResponse = {
      success: true,
      data: {
        totalContributions: actualTotal, // Use calculated total from filtered days
        weeks: calendar.weeks,
        contributionDays: filteredDays, // Use filtered days (only requested year)
      },
    }

    // Set cache headers for Vercel Edge/ISR
    return NextResponse.json(apiResponse, {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    // ========================================================================
    // 10. HANDLE UNEXPECTED ERRORS
    // ========================================================================
    
    console.error('[GitHub API] Unexpected error:', error)
    
    // Log full error details for debugging
    if (error instanceof Error) {
      console.error('[GitHub API] Error message:', error.message)
      console.error('[GitHub API] Error stack:', error.stack)
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error 
          ? `Server error: ${error.message}` 
          : 'An unexpected error occurred. Check server logs for details.',
      } as APIResponse,
      { status: 500 }
    )
  }
}

// ============================================================================
// OPTIONAL: POST HANDLER FOR CUSTOM USERNAME
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const username = body?.username || GITHUB_USERNAME
    
    // Reuse the same logic but with custom username
    // (Implementation similar to GET, but with dynamic username)
    // For now, redirect to GET with query param or use GET handler logic
    
    return NextResponse.json(
      { success: false, error: 'POST method not implemented. Use GET with query parameters.' },
      { status: 501 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body',
      } as APIResponse,
      { status: 400 }
    )
  }
}

