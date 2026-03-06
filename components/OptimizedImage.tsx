import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
}

/**
 * Wrapper around next/image that:
 * - Defaults to WebP/AVIF format (handled by Next.js automatically)
 * - Provides sensible defaults for sizes
 * - Falls back to a plain <img> for external URLs that aren't in remotePatterns
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
}: OptimizedImageProps) {
  // If it's a relative path (starts with /), use next/image
  if (src.startsWith('/') || src.startsWith('https://graver-studio.uz')) {
    if (fill) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={className}
          sizes={sizes}
          quality={quality}
        />
      )
    }

    return (
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        priority={priority}
        className={className}
        sizes={sizes}
        quality={quality}
      />
    )
  }

  // External image — use plain img with lazy loading
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
    />
  )
}
