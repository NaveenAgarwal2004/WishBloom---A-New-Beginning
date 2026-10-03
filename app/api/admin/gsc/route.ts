import { NextResponse } from 'next/server'
import { requireBlogAdmin } from '@/lib/blogAdmin'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

// ─── Site URL map ────────────────────────────────────────────────────────────
// All pages we want to track indexing status for
const SITE_URL = 'https://wishblooms.in'

// ─── Static pages ────────────────────────────────────────────────────────────
const STATIC_PAGES = [
  { path: '/', label: 'Homepage' },
  { path: '/blog', label: 'Blog Index' },
  { path: '/about', label: 'About' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/contact', label: 'Contact' },
  { path: '/privacy', label: 'Privacy Policy' },
  { path: '/terms', label: 'Terms of Service' },
]

// ─── Build dynamic page list (static + published blog posts) ─────────────────
async function buildPageList() {
  try {
    await dbConnect()
    const now = new Date()
    const posts = await BlogPost.find({
      published: true,
      $or: [
        { publishedAt: { $exists: false } },
        { publishedAt: null },
        { publishedAt: { $lte: now } },
      ],
    })
      .select('slug title')
      .lean()
      .exec()

    const blogPages = (posts as { slug: string; title: string }[]).map((p) => ({
      path: `/blog/${p.slug}`,
      label: `Blog: ${p.title}`,
    }))

    return [...STATIC_PAGES, ...blogPages]
  } catch {
    // If DB fails, fall back to static pages only
    return STATIC_PAGES
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────
export interface PageIndexingStatus {
  url: string
  label: string
  path: string
  coverageState: 'INDEXED' | 'NOT_INDEXED' | 'NEUTRAL' | 'EXCLUDED' | 'ERROR' | 'LOADING'
  verdict: string
  robotsTxtState: string
  indexingState: string
  pageFetchState: string
  crawledAs: string
  lastCrawlTime: string | null
  googleCanonical: string | null
  userCanonical: string | null
  richResultsAllowed: boolean
  error?: string
}

// ─── Auth helper ─────────────────────────────────────────────────────────────
async function getAccessToken(): Promise<string> {
  const serviceAccountRaw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!serviceAccountRaw) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var is not set')
  }

  const serviceAccount = JSON.parse(serviceAccountRaw)

  // Build JWT for service account auth
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url')

  const unsignedToken = `${encode(header)}.${encode(payload)}`

  // Import RSA private key
  const privateKey = serviceAccount.private_key
  const crypto = await import('crypto')
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(unsignedToken)
  const signature = sign.sign(privateKey, 'base64url')

  const jwt = `${unsignedToken}.${signature}`

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text()
    throw new Error(`Token exchange failed: ${err}`)
  }

  const tokenData = await tokenResponse.json()
  return tokenData.access_token
}

// ─── Inspect a single URL ────────────────────────────────────────────────────
async function inspectUrl(
  accessToken: string,
  pageUrl: string,
  label: string,
  path: string
): Promise<PageIndexingStatus> {
  try {
    const response = await fetch(
      'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspectionUrl: pageUrl,
          siteUrl: SITE_URL,
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      return {
        url: pageUrl,
        label,
        path,
        coverageState: 'ERROR',
        verdict: 'ERROR',
        robotsTxtState: 'UNKNOWN',
        indexingState: 'UNKNOWN',
        pageFetchState: 'UNKNOWN',
        crawledAs: 'UNKNOWN',
        lastCrawlTime: null,
        googleCanonical: null,
        userCanonical: null,
        richResultsAllowed: false,
        error: `API error: ${response.status} — ${err}`,
      }
    }

    const data = await response.json()
    const result = data.inspectionResult
    const indexStatusResult = result?.indexStatusResult || {}

    // Map GSC coverage state to simplified state
    const rawCoverage = indexStatusResult.coverageState || 'NEUTRAL'
    let coverageState: PageIndexingStatus['coverageState'] = 'NEUTRAL'
    if (rawCoverage === 'Submitted and indexed') coverageState = 'INDEXED'
    else if (rawCoverage.toLowerCase().includes('indexed')) coverageState = 'INDEXED'
    else if (
      rawCoverage.toLowerCase().includes('excluded') ||
      rawCoverage.toLowerCase().includes('duplicate')
    )
      coverageState = 'EXCLUDED'
    else if (
      rawCoverage.toLowerCase().includes('not indexed') ||
      rawCoverage.toLowerCase().includes('crawled') ||
      rawCoverage.toLowerCase().includes('discovered')
    )
      coverageState = 'NOT_INDEXED'
    else coverageState = 'NEUTRAL'

    return {
      url: pageUrl,
      label,
      path,
      coverageState,
      verdict: indexStatusResult.verdict || 'NEUTRAL',
      robotsTxtState: indexStatusResult.robotsTxtState || 'UNKNOWN',
      indexingState: indexStatusResult.indexingState || 'UNKNOWN',
      pageFetchState: indexStatusResult.pageFetchState || 'UNKNOWN',
      crawledAs: indexStatusResult.crawledAs || 'UNKNOWN',
      lastCrawlTime: indexStatusResult.lastCrawlTime || null,
      googleCanonical: indexStatusResult.googleCanonical || null,
      userCanonical: indexStatusResult.userCanonical || null,
      richResultsAllowed: result?.richResultsResult?.detectedItems?.length > 0,
    }
  } catch (err) {
    return {
      url: pageUrl,
      label,
      path,
      coverageState: 'ERROR',
      verdict: 'ERROR',
      robotsTxtState: 'UNKNOWN',
      indexingState: 'UNKNOWN',
      pageFetchState: 'UNKNOWN',
      crawledAs: 'UNKNOWN',
      lastCrawlTime: null,
      googleCanonical: null,
      userCanonical: null,
      richResultsAllowed: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ─── GET handler ─────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  // Admin-only guard
  const session = await requireBlogAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if service account is configured
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return NextResponse.json(
      {
        error: 'NOT_CONFIGURED',
        message:
          'Google Search Console service account is not configured. Add GOOGLE_SERVICE_ACCOUNT_JSON to your environment variables.',
      },
      { status: 503 }
    )
  }

  // Allow fetching a single URL or all pages
  const { searchParams } = new URL(request.url)
  const singlePath = searchParams.get('path')

  try {
    const accessToken = await getAccessToken()
    const allPages = await buildPageList()

    const pagesToInspect = singlePath
      ? allPages.filter((p) => p.path === singlePath)
      : allPages

    if (pagesToInspect.length === 0) {
      return NextResponse.json({ error: 'Unknown path' }, { status: 404 })
    }

    // Inspect all pages in parallel (GSC has rate limits, so we add small delays)
    const results = await Promise.all(
      pagesToInspect.map((page, i) =>
        new Promise<PageIndexingStatus>((resolve) =>
          setTimeout(
            () =>
              inspectUrl(
                accessToken,
                `${SITE_URL}${page.path}`,
                page.label,
                page.path
              ).then(resolve),
            i * 300 // 300ms stagger to avoid rate limits
          )
        )
      )
    )


    return NextResponse.json({
      results,
      fetchedAt: new Date().toISOString(),
      siteUrl: SITE_URL,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
