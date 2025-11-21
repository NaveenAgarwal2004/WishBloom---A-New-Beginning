import { env } from '@/lib/env'

interface BrevoEmailParams {
  to: string
  toName: string
  subject: string
  htmlContent: string
  textContent?: string
}

interface BrevoResponse {
  messageId: string
}

class BrevoEmailService {
  private apiKey: string
  private baseUrl = 'https://api.brevo.com/v3'
  private senderEmail: string
  private senderName: string

  constructor() {
    this.apiKey = env.BREVO_API_KEY
    this.senderEmail = env.BREVO_SENDER_EMAIL
    this.senderName = env.BREVO_SENDER_NAME
  }

  /**
   * ✅ Part 8: Sanitize email headers to prevent injection attacks
   * Remove newlines and limit length to prevent header injection
   */
  private sanitizeEmailHeader(input: string, maxLength: number = 70): string {
    return input
      .replace(/[\r\n]/g, '') // Remove newlines
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim()
      .slice(0, maxLength)
  }

  async sendEmail(params: BrevoEmailParams): Promise<BrevoResponse> {
    try {
      // ✅ Sanitize all user-provided inputs
      const sanitizedParams = {
        to: this.sanitizeEmailHeader(params.to, 254), // RFC 5321 max email length
        toName: this.sanitizeEmailHeader(params.toName, 100),
        subject: this.sanitizeEmailHeader(params.subject, 150),
      }

      const response = await fetch(`${this.baseUrl}/smtp/email`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          sender: {
            email: this.senderEmail,
            name: this.senderName,
          },
          to: [
            {
              email: sanitizedParams.to,
              name: sanitizedParams.toName,
            },
          ],
          subject: sanitizedParams.subject,
          htmlContent: params.htmlContent,
          textContent: params.textContent || this.htmlToText(params.htmlContent),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Brevo API error: ${response.status} - ${JSON.stringify(errorData)}`
        )
      }

      const data = await response.json()
      return {
        messageId: data.messageId || data['message-id'] || 'unknown',
      }
    } catch (error) {
      console.error('❌ Brevo email send failed:', error)
      throw error
    }
  }

  // Simple HTML to text conversion for fallback
  private htmlToText(html: string): string {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s\s+/g, ' ')
      .trim()
  }

  // Template for WishBloom notification email
  async sendWishBloomNotification({
    recipientEmail,
    recipientName,
    wishbloomUrl,
    senderName,
    customMessage,
  }: {
    recipientEmail: string
    recipientName: string
    wishbloomUrl: string
    senderName: string
    customMessage?: string
  }): Promise<BrevoResponse> {
    // ✅ Sanitize sender name for subject line
    const sanitizedSenderName = this.sanitizeEmailHeader(senderName, 50)
    
    const htmlContent = this.generateWishBloomEmailHTML({
      recipientName,
      wishbloomUrl,
      senderName,
      customMessage,
    })

    return this.sendEmail({
      to: recipientEmail,
      toName: recipientName,
      subject: `${sanitizedSenderName} has created a WishBloom for you! 🌸`,
      htmlContent,
    })
  }

  private generateWishBloomEmailHTML({
    recipientName,
    wishbloomUrl,
    senderName,
    customMessage,
  }: {
    recipientName: string
    wishbloomUrl: string
    senderName: string
    customMessage?: string
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You have a WishBloom!</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Georgia, serif;
              background-color: #FBF7F0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              text-align: center;
              padding: 30px;
              background: linear-gradient(to bottom, #FBF7F0, rgba(212, 133, 157, 0.1));
              border-radius: 20px 20px 0 0;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #7A5C47;
              margin-bottom: 10px;
            }
            .flower {
              font-size: 48px;
              margin-bottom: 20px;
            }
            .content {
              background: white;
              padding: 40px 30px;
              border-left: 4px solid #D4859D;
              box-shadow: 0 4px 12px rgba(43, 37, 32, 0.12);
            }
            .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #7A5C47;
              margin-bottom: 20px;
            }
            .message {
              font-size: 18px;
              line-height: 1.8;
              color: #6B5D52;
              margin-bottom: 20px;
            }
            .custom-message {
              font-style: italic;
              padding: 20px;
              background: #F4EDE4;
              border-radius: 10px;
              margin: 20px 0;
            }
            .cta {
              text-align: center;
              margin: 40px 0;
            }
            .button {
              display: inline-block;
              padding: 18px 40px;
              background: linear-gradient(to right, #A0522D, #D4A373);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-size: 20px;
              font-weight: 600;
              box-shadow: 0 8px 24px rgba(212, 163, 115, 0.3);
            }
            .signature {
              font-style: italic;
              color: #D4A373;
              text-align: right;
              margin-top: 30px;
              font-size: 18px;
            }
            .footer {
              text-align: center;
              padding: 30px;
              color: #9B8B7E;
              font-size: 14px;
              background: #F4EDE4;
              border-radius: 0 0 20px 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="flower">🌸</div>
              <div class="logo">WishBloom</div>
            </div>
            
            <div class="content">
              <div class="greeting">Dear ${recipientName},</div>
              
              <div class="message">
                Someone special has created a beautiful collection of memories just for you! 
                ${senderName} has gathered heartfelt moments, messages, and wishes to celebrate you.
              </div>
              
              ${customMessage ? `
                <div class="custom-message">
                  "${customMessage}"
                </div>
              ` : ''}
              
              <div class="message">
                This isn't just a gift—it's a garden of memories where every moment blooms with love. 
                Each photo, each word, each wish has been carefully pressed and preserved, just for you.
              </div>
              
              <div class="cta">
                <a href="${wishbloomUrl}" class="button">🌸 Open Your WishBloom</a>
              </div>
              
              <div class="signature">
                — With love, ${senderName}
              </div>
            </div>
            
            <div class="footer">
              <p>Made with 💛 by WishBloom</p>
              <p style="font-size: 12px; margin-top: 10px;">
                Preserving memories, one bloom at a time
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

// Export singleton instance
export const brevoEmailService = new BrevoEmailService()