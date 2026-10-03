'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Globe,
  Bot,
  Calendar,
  Shield,
  ChevronDown,
  ChevronUp,
  Loader2,
  Info,
  AlertTriangle,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// ─── Types ────────────────────────────────────────────────────────────────────
interface PageIndexingStatus {
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

interface GSCResponse {
  results: PageIndexingStatus[]
  fetchedAt: string
  siteUrl: string
  error?: string
  message?: string
}

// ─── Status helpers ──────────────────────────────────────────────────────────
function StatusBadge({ state }: { state: PageIndexingStatus['coverageState'] }) {
  const config = {
    INDEXED: {
      icon: CheckCircle2,
      label: 'Indexed',
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    NOT_INDEXED: {
      icon: XCircle,
      label: 'Not Indexed',
      className: 'bg-red-100 text-red-700 border-red-200',
    },
    EXCLUDED: {
      icon: AlertCircle,
      label: 'Excluded',
      className: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    NEUTRAL: {
      icon: Clock,
      label: 'Unknown',
      className: 'bg-gray-100 text-gray-600 border-gray-200',
    },
    ERROR: {
      icon: AlertTriangle,
      label: 'Error',
      className: 'bg-red-100 text-red-700 border-red-200',
    },
    LOADING: {
      icon: Loader2,
      label: 'Loading…',
      className: 'bg-blue-100 text-blue-600 border-blue-200',
    },
  }

  const { icon: Icon, label, className } = config[state]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${className}`}
    >
      <Icon
        size={13}
        className={state === 'LOADING' ? 'animate-spin' : ''}
      />
      {label}
    </span>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | boolean }) {
  const displayValue =
    value === null || value === undefined
      ? '—'
      : value === true
        ? 'Yes'
        : value === false
          ? 'No'
          : String(value)

  return (
    <div className="flex items-start gap-2 text-xs">
      <Icon size={13} className="text-warmCream-500 mt-0.5 flex-shrink-0" />
      <span className="text-warmCream-600 min-w-[120px]">{label}:</span>
      <span className="text-sepiaInk font-medium break-all">{displayValue}</span>
    </div>
  )
}

function PageCard({
  page,
  onRefresh,
  refreshingPath,
}: {
  page: PageIndexingStatus
  onRefresh: (path: string) => void
  refreshingPath: string | null
}) {
  const [expanded, setExpanded] = useState(false)
  const isRefreshing = refreshingPath === page.path

  const formattedLastCrawl = page.lastCrawlTime
    ? new Date(page.lastCrawlTime).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-warmCream-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Main row */}
      <div className="flex items-center gap-4 p-4">
        {/* Status */}
        <StatusBadge state={isRefreshing ? 'LOADING' : page.coverageState} />

        {/* Page info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sepiaInk text-sm">{page.label}</span>
            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mossGreen hover:text-mossGreen/70 transition-colors"
              title="Open page"
            >
              <ExternalLink size={13} />
            </a>
          </div>
          <code className="text-xs text-warmCream-600 font-mono">{page.path}</code>
        </div>

        {/* Last crawl */}
        {formattedLastCrawl && (
          <div className="hidden md:flex items-center gap-1 text-xs text-warmCream-600">
            <Calendar size={12} />
            <span>{formattedLastCrawl}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRefresh(page.path)}
            disabled={isRefreshing}
            className="h-8 w-8 p-0 text-warmCream-500 hover:text-mossGreen"
            title="Refresh this URL"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0 text-warmCream-500"
            title="Toggle details"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-warmCream-100 bg-warmCream-50 p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {page.error ? (
                <div className="col-span-2 flex items-start gap-2 text-red-600 text-xs">
                  <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                  <span>{page.error}</span>
                </div>
              ) : (
                <>
                  <DetailRow icon={Globe} label="Verdict" value={page.verdict} />
                  <DetailRow icon={Bot} label="Crawled As" value={page.crawledAs} />
                  <DetailRow icon={Shield} label="Robots.txt" value={page.robotsTxtState} />
                  <DetailRow icon={Search} label="Indexing State" value={page.indexingState} />
                  <DetailRow icon={Globe} label="Page Fetch" value={page.pageFetchState} />
                  <DetailRow icon={Calendar} label="Last Crawled" value={formattedLastCrawl} />
                  <DetailRow icon={Info} label="Google Canonical" value={page.googleCanonical} />
                  <DetailRow icon={Info} label="User Canonical" value={page.userCanonical} />
                  <DetailRow icon={CheckCircle2} label="Rich Results" value={page.richResultsAllowed} />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Summary stats ────────────────────────────────────────────────────────────
function SummaryStats({ results }: { results: PageIndexingStatus[] }) {
  const indexed = results.filter((r) => r.coverageState === 'INDEXED').length
  const notIndexed = results.filter((r) => r.coverageState === 'NOT_INDEXED').length
  const excluded = results.filter((r) => r.coverageState === 'EXCLUDED').length
  const errors = results.filter((r) => r.coverageState === 'ERROR').length
  const total = results.length

  const stats = [
    { label: 'Indexed', value: indexed, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { label: 'Not Indexed', value: notIndexed, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    { label: 'Excluded', value: excluded, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
    { label: 'Errors', value: errors, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
    { label: 'Total Pages', value: total, color: 'text-sepiaInk', bg: 'bg-warmCream-100 border-warmCream-200' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border ${stat.bg}`}
        >
          <span className={`text-2xl font-bold font-heading ${stat.color}`}>{stat.value}</span>
          <span className="text-xs text-warmCream-600 mt-0.5 text-center">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Setup instructions ───────────────────────────────────────────────────────
function SetupInstructions() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4 border border-blue-200 rounded-xl bg-blue-50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-blue-100 transition-colors"
      >
        <Settings size={16} className="text-blue-600 flex-shrink-0" />
        <span className="text-sm font-semibold text-blue-700 flex-1">How to set up Google Search Console access</span>
        {open ? <ChevronUp size={16} className="text-blue-600" /> : <ChevronDown size={16} className="text-blue-600" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 text-sm text-blue-900">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Go to{' '}
                  <a
                    href="https://console.cloud.google.com/iam-admin/serviceaccounts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Google Cloud Console → Service Accounts
                  </a>
                </li>
                <li>Create a new service account (e.g., <code className="bg-blue-100 px-1 rounded">wishbloom-gsc</code>)</li>
                <li>Download its JSON key file</li>
                <li>
                  Go to{' '}
                  <a
                    href="https://search.google.com/search-console/users"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Search Console → Settings → Users &amp; permissions
                  </a>
                </li>
                <li>Add the service account email as a <strong>Owner</strong> or <strong>Full user</strong></li>
                <li>
                  Add the JSON key content as a single-line string to your{' '}
                  <code className="bg-blue-100 px-1 rounded">.env.local</code>:
                  <pre className="mt-1 p-2 bg-blue-100 rounded text-xs overflow-x-auto">
                    GOOGLE_SERVICE_ACCOUNT_JSON={"'"}{"{"}&quot;type&quot;:&quot;service_account&quot;,...{"}"}{"'"}
                  </pre>
                </li>
                <li>Also add it to Vercel environment variables for production</li>
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function IndexingDashboard() {
  const [data, setData] = useState<GSCResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshingPath, setRefreshingPath] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setNotConfigured(false)
    try {
      const res = await fetch('/api/admin/gsc')
      const json: GSCResponse = await res.json()

      if (json.error === 'NOT_CONFIGURED') {
        setNotConfigured(true)
        setData(null)
      } else {
        setData(json)
        setLastFetched(new Date())
      }
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshSingle = useCallback(async (path: string) => {
    setRefreshingPath(path)
    try {
      const res = await fetch(`/api/admin/gsc?path=${encodeURIComponent(path)}`)
      const json: GSCResponse = await res.json()

      if (json.results?.[0]) {
        setData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            results: prev.results.map((r) =>
              r.path === path ? json.results[0] : r
            ),
            fetchedAt: json.fetchedAt,
          }
        })
        setLastFetched(new Date())
      }
    } catch {
      // silently fail single refresh
    } finally {
      setRefreshingPath(null)
    }
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-12"
    >
      {/* Section header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-h4 font-heading font-bold text-sepiaInk flex items-center gap-2">
            <Search size={22} className="text-mossGreen" />
            Google Indexing Status
          </h2>
          <p className="text-body-sm font-body text-warmCream-600 mt-1">
            Live crawl &amp; index status from Google Search Console for all public pages
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastFetched && (
            <span className="text-xs text-warmCream-500">
              Updated {lastFetched.toLocaleTimeString('en-IN')}
            </span>
          )}
          <Button
            onClick={fetchAll}
            disabled={loading}
            size="sm"
            className="bg-mossGreen hover:bg-mossGreen/90 text-white font-heading gap-2"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
            {loading ? 'Fetching…' : data ? 'Refresh All' : 'Fetch Status'}
          </Button>
        </div>
      </div>

      {/* Not configured state */}
      {notConfigured && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">
                  Google Search Console is not configured yet
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  You need to add your Google service account credentials to enable this feature.
                </p>
                <SetupInstructions />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty / not yet fetched */}
      {!data && !loading && !notConfigured && (
        <Card className="border-warmCream-200">
          <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-mossGreen/10 flex items-center justify-center">
              <Search size={26} className="text-mossGreen" />
            </div>
            <p className="font-semibold text-sepiaInk">No data fetched yet</p>
            <p className="text-sm text-warmCream-600 max-w-xs">
              Click &ldquo;Fetch Status&rdquo; to pull live indexing data from Google Search Console.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading skeleton */}
      {loading && !data && (
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="border border-warmCream-200 rounded-xl bg-white p-4 flex items-center gap-4 animate-pulse"
            >
              <div className="h-6 w-20 bg-warmCream-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-warmCream-200 rounded" />
                <div className="h-3 w-20 bg-warmCream-100 rounded" />
              </div>
              <div className="h-6 w-24 bg-warmCream-100 rounded hidden md:block" />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {data?.results && (
        <>
          <SummaryStats results={data.results} />
          <div className="space-y-3">
            {data.results.map((page) => (
              <PageCard
                key={page.path}
                page={page}
                onRefresh={refreshSingle}
                refreshingPath={refreshingPath}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-warmCream-400 text-right">
            Data fetched at {new Date(data.fetchedAt).toLocaleString('en-IN')} •{' '}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-mossGreen"
            >
              Open Search Console
              <ExternalLink size={10} className="inline ml-1" />
            </a>
          </p>
        </>
      )}
    </motion.section>
  )
}
