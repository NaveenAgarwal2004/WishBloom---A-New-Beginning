interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[]
}

/**
 * Server/Client helper component to safely inject JSON-LD structured data into page HTML.
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
