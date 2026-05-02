import * as React from 'react'

/**
 * Custom Keystatic admin brand mark — minimalist Graver Studio monogram.
 * Renders in the top-left of the admin shell.
 */
export function GraverMark({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  const fg = colorScheme === 'dark' ? '#5eead4' : '#0d9488'
  const bg = colorScheme === 'dark' ? '#0f172a' : '#f8fafc'
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      role="img"
      aria-label="Graver Studio"
      style={{ display: 'block' }}
    >
      <rect x="0" y="0" width="28" height="28" rx="7" fill={bg} />
      <rect x="2" y="2" width="24" height="24" rx="6" fill="none" stroke={fg} strokeWidth="1.5" />
      <path
        d="M8.5 9.5 L14 9.5 M14 9.5 L19 9.5 M14 9.5 L14 19.5 M8.5 14.5 L14 14.5"
        stroke={fg}
        strokeWidth="2"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  )
}
