'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Copy, Eye, ExternalLink, Plus, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { toast as sonnerToast } from 'sonner'
import Link from 'next/link'
import { APP_CONFIG } from '@/config/constants'
import DraftsSection from '@/components/dashboard/DraftsSection'
import { pdf } from '@react-pdf/renderer'
import HeirloomDocument from '@/components/pdf/HeirloomDocument'

// Proper type definitions
interface Memory {
  imageUrl: string
  caption?: string
  tags?: string[]
}

interface Message {
  type: string
  text: string
}

interface DashboardBloom {
  _id: string
  recipientName: string
  uniqueUrl: string
  createdDate: string
  viewCount: number
  memories: Memory[]
  messages: Message[]
  isArchived: boolean
}

interface DashboardClientProps {
  blooms: DashboardBloom[]
  userName: string
}

/**
 * ✅ Part 4: Dashboard Client Component
 * Displays user's created WishBlooms with actions
 */
export default function DashboardClient({ blooms, userName }: DashboardClientProps) {
  const { toast } = useToast()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  // Copy link to clipboard
  const handleCopyLink = (uniqueUrl: string, id: string) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${uniqueUrl}`
    navigator.clipboard.writeText(fullUrl)
    
    setCopiedId(id)
    toast({
      title: 'Link copied!',
      description: 'WishBloom link copied to clipboard',
    })
    
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Download WishBloom as PDF
  const handleDownloadPDF = async (uniqueUrl: string, recipientName: string) => {
    try {
      setDownloadingId(uniqueUrl)
      sonnerToast.loading('Generating your heirloom PDF...', { id: 'pdf-generation' })

      // Fetch full WishBloom data
      const response = await fetch(`/api/wishblooms/${uniqueUrl}`)
      if (!response.ok) throw new Error('Failed to fetch WishBloom data')
      
      const data = await response.json()
      if (!data.success || !data.wishbloom) throw new Error('Invalid WishBloom data')

      // Generate PDF
      const blob = await pdf(<HeirloomDocument wishbloom={data.wishbloom} />).toBlob()
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Format filename
      const cleanName = recipientName.replace(/[^a-zA-Z0-9]/g, '-')
      const date = new Date().toISOString().split('T')[0]
      link.download = `WishBloom-${cleanName}-${date}.pdf`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      sonnerToast.success('PDF downloaded successfully! 🌸', { id: 'pdf-generation' })
    } catch (error) {
      console.error('PDF generation failed:', error)
      sonnerToast.error('Failed to generate PDF. Please try again.', { id: 'pdf-generation' })
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
      {/* Header */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-h1 md:text-display font-heading font-bold text-sepiaInk mb-3">
            Welcome back, {userName}! 🌸
          </h1>
          <p className="text-body-lg font-body text-warmCream-700">
            Manage your created {APP_CONFIG.APP_NAME}s
          </p>
        </motion.div>

        {/* Create New Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6"
        >
          <Link href="/create">
            <Button
              size="lg"
              className="bg-fadedGold hover:bg-fadedGold/90 text-white font-heading font-bold gap-2"
            >
              <Plus size={20} />
              Create New WishBloom
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Drafts Section */}
      <DraftsSection />

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-h6 font-heading text-sepiaInk">Total WishBlooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-heading font-bold text-fadedGold">{blooms.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-h6 font-heading text-sepiaInk">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-heading font-bold text-mossGreen">
              {blooms.reduce((acc, bloom) => acc + (bloom.viewCount || 0), 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-h6 font-heading text-sepiaInk">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-heading font-bold text-rosePetal">
              {blooms.filter((b) => !b.isArchived).length}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* WishBlooms List */}
      {blooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="text-center py-16">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🌸</div>
                <h2 className="text-h4 font-heading font-bold text-sepiaInk mb-3">
                  No WishBlooms Yet
                </h2>
                <p className="text-body font-body text-warmCream-700 mb-6">
                  Create your first WishBloom to start preserving beautiful memories!
                </p>
                <Link href="/create">
                  <Button
                    size="lg"
                    className="bg-fadedGold hover:bg-fadedGold/90 text-white font-heading font-bold gap-2"
                  >
                    <Plus size={20} />
                    Create Your First WishBloom
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-h4 font-heading font-bold text-sepiaInk mb-4">
            Your WishBlooms
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {blooms.map((bloom, index) => (
              <motion.div
                key={bloom._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-h5 font-heading font-bold text-sepiaInk mb-2">
                          {bloom.recipientName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-body-sm font-body text-warmCream-600">
                          <Calendar size={16} />
                          Created {formatDate(bloom.createdDate)}
                        </CardDescription>
                      </div>
                      {bloom.isArchived && (
                        <span className="px-3 py-1 bg-warmCream-200 text-warmCream-700 rounded-full text-caption font-body">
                          Archived
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mb-6 text-body-sm font-body text-warmCream-700">
                      <div className="flex items-center gap-2">
                        <Eye size={16} />
                        <span>{bloom.viewCount || 0} views</span>
                      </div>
                      <div>📸 {bloom.memories?.length || 0} memories</div>
                      <div>💌 {bloom.messages?.length || 0} messages</div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/${bloom.uniqueUrl}`} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 font-heading"
                        >
                          <ExternalLink size={16} />
                          View
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(bloom.uniqueUrl, bloom._id)}
                        className="gap-2 font-heading"
                        data-testid={`copy-link-${bloom._id}`}
                      >
                        {copiedId === bloom._id ? (
                          <>
                            <Copy size={16} className="text-mossGreen" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy Link
                          </>
                        )}
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownloadPDF(bloom.uniqueUrl, bloom.recipientName)}
                        disabled={downloadingId === bloom.uniqueUrl}
                        className="gap-2 font-heading"
                        data-testid={`download-pdf-${bloom._id}`}
                      >
                        {downloadingId === bloom.uniqueUrl ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download size={16} />
                            Download PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
