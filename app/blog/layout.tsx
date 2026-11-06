import MonetagScript from '@/components/MonetagScript'

/**
 * Blog segment layout — /blog and /blog/[slug]
 *
 * MonetagScript is mounted HERE (not in root layout) so the ad injection
 * code is only bundled and executed for blog routes. All other segments
 * (/, /create, /[id], /dashboard, /auth, etc.) never receive this component.
 *
 * This follows Next.js App Router segment isolation — the correct architectural
 * boundary rather than a client-side pathname guard in a globally-mounted component.
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <MonetagScript />
    </>
  )
}

