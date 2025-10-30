import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { recipientEmail, recipientName, wishbloomUrl, senderName, customMessage } = body

    // Validate required fields
    if (!recipientEmail || !recipientName || !wishbloomUrl || !senderName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create HTML email template
    const emailHtml = `
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

    // Send email
    const data = await resend.emails.send({
      from: 'WishBloom <onboarding@resend.dev>', // Update this when you have a verified domain
      to: recipientEmail,
      subject: `${senderName} has created a WishBloom for you! 🌸`,
      html: emailHtml,
    })

    return NextResponse.json({
      success: true,
      emailId: data.id,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
