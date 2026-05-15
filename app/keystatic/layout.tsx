import type { Metadata } from 'next'

// Keep Keystatic admin entirely out of search engine indices.
// robots.txt already disallows /keystatic, but adding meta noindex here
// covers indexed-without-recrawl cases and any sub-path under the admin.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
  return children
}
