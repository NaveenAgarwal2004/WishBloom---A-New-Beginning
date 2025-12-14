import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer'
import type { IWishBloom } from '@/models/WishBloom'

interface HeirloomDocumentProps {
  wishbloom: Omit<IWishBloom, '_id' | 'uniqueUrl' | 'contributors' | 'createdAt' | 'updatedAt'>
}

// Register fonts with all variants (using Google Fonts)
Font.register({
  family: 'Cormorant',
  fonts: [
    { 
      src: 'https://fonts.gstatic.com/s/cormorant/v21/H4c2BXOCl9bbnla_nHIq6pO49.woff2', 
      fontWeight: 400,
      fontStyle: 'normal'
    },
    { 
      src: 'https://fonts.gstatic.com/s/cormorant/v21/H4c2BXOCl9bbnla_nHIq75O49.woff2', 
      fontWeight: 700,
      fontStyle: 'normal'
    },
    // Using normal variant as fallback for italic (react-pdf limitation)
    { 
      src: 'https://fonts.gstatic.com/s/cormorant/v21/H4c2BXOCl9bbnla_nHIq75O49.woff2', 
      fontWeight: 700,
      fontStyle: 'italic'
    },
  ],
})

Font.register({
  family: 'Lora',
  fonts: [
    { 
      src: 'https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq0.woff2', 
      fontWeight: 400,
      fontStyle: 'normal'
    },
    { 
      src: 'https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuGQbT0gvTJPa787z-uxJBkq0.woff2', 
      fontWeight: 400, 
      fontStyle: 'italic' 
    },
  ],
})

// PDF Styles matching WishBloom aesthetic
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FBF7F0', // Warm Cream
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: 'Lora',
    position: 'relative',
  },
  // Watermark styles
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    opacity: 0.03,
    fontSize: 120,
    fontFamily: 'Cormorant',
    fontWeight: 700,
    color: '#7A5C47', // Sepia Ink
    zIndex: 0,
  },
  // Cover page
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  coverTitle: {
    fontSize: 56,
    fontFamily: 'Cormorant',
    fontWeight: 700,
    color: '#7A5C47', // Sepia Ink
    textAlign: 'center',
    marginBottom: 16,
  },
  coverSubtitle: {
    fontSize: 32,
    fontFamily: 'Cormorant',
    fontWeight: 400,
    color: '#C08552', // Faded Gold
    textAlign: 'center',
    marginBottom: 40,
  },
  coverFloral: {
    fontSize: 48,
    marginVertical: 20,
    textAlign: 'center',
  },
  coverFooter: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: '#A0826D',
    fontStyle: 'italic',
  },
  // Section headers
  sectionTitle: {
    fontSize: 32,
    fontFamily: 'Cormorant',
    fontWeight: 700,
    color: '#7A5C47',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  divider: {
    width: '60%',
    height: 2,
    backgroundColor: '#D4A373',
    marginVertical: 20,
    alignSelf: 'center',
    opacity: 0.3,
  },
  // Intro message
  introContainer: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 8,
    marginBottom: 30,
    border: '2px solid #E8DCC8',
  },
  introText: {
    fontSize: 14,
    lineHeight: 1.8,
    color: '#5C4A3C',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Memory cards
  memoriesGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  memoryCard: {
    width: '48%',
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    border: '2px solid #E8DCC8',
  },
  memoryImage: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    borderRadius: 6,
    marginBottom: 12,
  },
  memoryTitle: {
    fontSize: 16,
    fontFamily: 'Cormorant',
    fontWeight: 700,
    color: '#7A5C47',
    marginBottom: 6,
  },
  memoryDescription: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#5C4A3C',
    marginBottom: 8,
  },
  memoryDate: {
    fontSize: 9,
    color: '#A0826D',
    fontStyle: 'italic',
  },
  memoryContributor: {
    fontSize: 9,
    color: '#A0826D',
    marginTop: 4,
  },
  // Messages
  messageCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    border: '2px solid #E8DCC8',
  },
  messageType: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#C08552',
    letterSpacing: 1.5,
    marginBottom: 12,
    fontWeight: 700,
  },
  messageGreeting: {
    fontSize: 13,
    color: '#7A5C47',
    marginBottom: 10,
  },
  messageContent: {
    fontSize: 12,
    lineHeight: 1.7,
    color: '#5C4A3C',
    marginBottom: 12,
    textAlign: 'justify',
  },
  messageClosing: {
    fontSize: 12,
    color: '#7A5C47',
    marginTop: 10,
    marginBottom: 4,
  },
  messageSignature: {
    fontSize: 13,
    fontFamily: 'Cormorant',
    fontWeight: 700,
    color: '#7A5C47',
    fontStyle: 'italic',
  },
  messagePostscript: {
    fontSize: 10,
    color: '#A0826D',
    marginTop: 10,
    fontStyle: 'italic',
  },
  messageTitle: {
    fontSize: 14,
    fontFamily: 'Cormorant',
    fontWeight: 700,
    marginBottom: 10,
    color: '#7A5C47',
  },
  // Page numbers
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#A0826D',
    fontFamily: 'Lora',
  },
})

/**
 * 🌸 WishBloom Heirloom PDF Document
 * A printable keepsake of birthday memories
 */
export default function HeirloomDocument({ wishbloom }: HeirloomDocumentProps) {
  const { recipientName, age, creativeAgeDescription, introMessage, memories, messages, createdBy, createdDate } = wishbloom

  // Format date
  const formattedDate = new Date(createdDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Display age
  const ageDisplay = creativeAgeDescription || (age ? `${age} Years Young` : '')

  return (
    <Document
      title={`WishBloom - ${recipientName}`}
      author={createdBy.name}
      subject={`Birthday memories for ${recipientName}`}
      creator="WishBloom"
      producer="WishBloom - Digital Birthday Memory Keeper"
    >
      {/* ===== COVER PAGE ===== */}
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark} fixed>WishBloom</Text>

        <View style={styles.coverPage}>
          <Text style={styles.coverFloral}>✿</Text>
          
          <Text style={styles.coverTitle}>Happy Birthday</Text>
          
          <Text style={styles.coverSubtitle}>{recipientName}</Text>
          
          {ageDisplay && (
            <Text style={{ fontSize: 18, color: '#D4A373', marginBottom: 20, fontFamily: 'Cormorant' }}>
              {ageDisplay}
            </Text>
          )}
          
          <Text style={styles.coverFloral}>✿ ✿ ✿</Text>
          
          <Text style={styles.coverFooter}>
            Created with love by {createdBy.name} • {formattedDate}
            {'\n'}A WishBloom Heirloom
          </Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* ===== INTRO MESSAGE PAGE ===== */}
      {introMessage && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.watermark} fixed>WishBloom</Text>
          
          <Text style={styles.sectionTitle}>A Message for You</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.introContainer}>
            <Text style={styles.introText}>{introMessage}</Text>
          </View>

          <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
        </Page>
      )}

      {/* ===== MEMORIES SECTION ===== */}
      {memories && memories.length > 0 && (
        <>
          <Page size="A4" style={styles.page}>
            <Text style={styles.watermark} fixed>WishBloom</Text>
            
            <Text style={styles.sectionTitle}>Cherished Memories</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.memoriesGrid}>
              {memories.slice(0, 4).map((memory) => (
                <View key={memory.id} style={styles.memoryCard}>
                  {memory.imageUrl && (
                    <Image
                      src={memory.imageUrl}
                      style={styles.memoryImage}
                      alt={memory.title || 'Memory photo'}
                    />
                  )}
                  <Text style={styles.memoryTitle}>{memory.title}</Text>
                  <Text style={styles.memoryDescription}>{memory.description}</Text>
                  <Text style={styles.memoryDate}>{memory.date}</Text>
                  <Text style={styles.memoryContributor}>— {memory.contributor.name}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
          </Page>

          {/* Additional memory pages if more than 4 memories */}
          {memories.length > 4 && (
            Array.from({ length: Math.ceil((memories.length - 4) / 4) }).map((_, pageIdx) => {
              const startIndex = 4 + pageIdx * 4
              const pageMemories = memories.slice(startIndex, startIndex + 4)
              
              return (
                <Page key={`memory-page-${pageIdx}`} size="A4" style={styles.page}>
                  <Text style={styles.watermark} fixed>WishBloom</Text>
                  
                  <View style={styles.memoriesGrid}>
                    {pageMemories.map((memory) => (
                      <View key={memory.id} style={styles.memoryCard}>
                        {memory.imageUrl && (
                          <Image
                            src={memory.imageUrl}
                            style={styles.memoryImage}
                            alt={memory.title || 'Memory photo'}
                          />
                        )}
                        <Text style={styles.memoryTitle}>{memory.title}</Text>
                        <Text style={styles.memoryDescription}>{memory.description}</Text>
                        <Text style={styles.memoryDate}>{memory.date}</Text>
                        <Text style={styles.memoryContributor}>— {memory.contributor.name}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
                </Page>
              )
            })
          )}
        </>
      )}

      {/* ===== MESSAGES SECTION ===== */}
      {messages && messages.length > 0 && (
        <>
          <Page size="A4" style={styles.page}>
            <Text style={styles.watermark} fixed>WishBloom</Text>
            
            <Text style={styles.sectionTitle}>Heartfelt Wishes</Text>
            
            <View style={styles.divider} />
            
            {messages.slice(0, 2).map((message) => (
              <View key={message.id} style={styles.messageCard}>
                <Text style={styles.messageType}>{message.type}</Text>
                
                {message.greeting && (
                  <Text style={styles.messageGreeting}>{message.greeting}</Text>
                )}
                
                {message.title && (
                  <Text style={styles.messageTitle}>
                    {message.title}
                  </Text>
                )}
                
                <Text style={styles.messageContent}>{message.content}</Text>
                
                {message.closing && (
                  <Text style={styles.messageClosing}>{message.closing}</Text>
                )}
                
                <Text style={styles.messageSignature}>{message.signature}</Text>
                
                {message.postscript && (
                  <Text style={styles.messagePostscript}>P.S. {message.postscript}</Text>
                )}
              </View>
            ))}

            <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
          </Page>

          {/* Additional message pages if more than 2 messages */}
          {messages.length > 2 && (
            Array.from({ length: Math.ceil((messages.length - 2) / 3) }).map((_, msgPageIdx) => {
              const startIndex = 2 + msgPageIdx * 3
              const pageMessages = messages.slice(startIndex, startIndex + 3)
              
              return (
                <Page key={`message-page-${msgPageIdx}`} size="A4" style={styles.page}>
                  <Text style={styles.watermark} fixed>WishBloom</Text>
                  
                  {pageMessages.map((message) => (
                    <View key={message.id} style={styles.messageCard}>
                      <Text style={styles.messageType}>{message.type}</Text>
                      
                      {message.greeting && (
                        <Text style={styles.messageGreeting}>{message.greeting}</Text>
                      )}
                      
                      {message.title && (
                        <Text style={styles.messageTitle}>
                          {message.title}
                        </Text>
                      )}
                      
                      <Text style={styles.messageContent}>{message.content}</Text>
                      
                      {message.closing && (
                        <Text style={styles.messageClosing}>{message.closing}</Text>
                      )}
                      
                      <Text style={styles.messageSignature}>{message.signature}</Text>
                      
                      {message.postscript && (
                        <Text style={styles.messagePostscript}>P.S. {message.postscript}</Text>
                      )}
                    </View>
                  ))}

                  <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
                </Page>
              )
            })
          )}
        </>
      )}

      {/* ===== BACK COVER / CLOSING PAGE ===== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark} fixed>WishBloom</Text>
        
        <View style={[styles.coverPage, { justifyContent: 'center' }]}>
          <Text style={styles.coverFloral}>✿ ✿ ✿</Text>
          
          <Text style={[styles.coverSubtitle, { fontSize: 24, marginTop: 30 }]}>
            May these memories bring you joy
          </Text>
          
          <Text style={[styles.coverSubtitle, { fontSize: 18, color: '#A0826D', marginTop: 10 }]}>
            for years to come
          </Text>
          
          <Text style={[styles.coverFloral, { marginTop: 40, fontSize: 36 }]}>✿</Text>
          
          <Text style={[styles.coverFooter, { fontSize: 10, marginTop: 60 }]}>
            Created with WishBloom
            {'\n'}
            A Digital Heirloom of Love & Memories
          </Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>
    </Document>
  )
}
