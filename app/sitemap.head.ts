// app/sitemap.head.ts
// Purpose: Ensure the /sitemap.xml route responds to HEAD requests to satisfy GSC pre-check.
export default function Head() {
  // returning null is enough; presence of a Head export causes Next.js to properly
  // handle HEAD requests for the route.
  return null;
}
