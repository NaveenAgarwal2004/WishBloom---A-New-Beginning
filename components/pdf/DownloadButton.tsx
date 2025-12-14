'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { pdf } from '@react-pdf/renderer'
import HeirloomDocument from './HeirloomDocument'
import type { IWishBloom } from '@/models/WishBloom'

interface DownloadButtonProps {
  wishbloom: Omit<IWishBloom, '_id' | 'uniqueUrl' | 'contributors' | 'createdAt' | 'updatedAt'>
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  label?: string
  showIcon?: boolean
}

/**
 * 🌸 Download WishBloom as PDF
 * Client-side PDF generation with loading states
 */
export default function DownloadButton({
  wishbloom,
  variant = 'outline',
  size = 'default',
  className = '',
  label = 'Download PDF',
  showIcon = true,
}: DownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    try {
      setIsGenerating(true)
      
      // Show loading toast
      toast.loading('Generating your heirloom PDF...', { id: 'pdf-generation' })

      // Generate PDF blob
      const blob = await pdf(<HeirloomDocument wishbloom={wishbloom} />).toBlob()
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Format filename: WishBloom-RecipientName-Date.pdf
      const recipientName = wishbloom.recipientName.replace(/[^a-zA-Z0-9]/g, '-')
      const date = new Date(wishbloom.createdDate).toISOString().split('T')[0]
      link.download = `WishBloom-${recipientName}-${date}.pdf`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      // Success notification
      toast.success('PDF downloaded successfully! 🌸', { id: 'pdf-generation' })
    } catch (error) {
      console.error('PDF generation failed:', error)
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-generation' })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={className}
      data-testid="download-pdf-button"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Generating...
        </>
      ) : (
        <>
          {showIcon && <Download className="h-4 w-4 mr-2" />}
          {label}
        </>
      )}
    </Button>
  )
}
