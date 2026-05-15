/**
 * Centralized tracking utilities for Graver.uz
 * Meta Pixel + GA4 event tracking.
 *
 * Events:
 *  - PageView   (initial + SPA route changes, fired by PixelRouteTracker)
 *  - Contact    (Telegram CTA clicks, phone clicks)
 *  - Lead       (form submissions, catalog downloads)
 *  - ViewContent (blog articles)
 *  - ViewCategory (commercial / product category pages)
 *
 * Deduplication contract (CAPI ↔ Pixel):
 *   Every event passes `event_id` BOTH inside the params payload AND in the
 *   4th `options` object. This is required because Meta's Conversions API
 *   for Browser / CAPI Gateway zero-code server forwarding reads
 *   `event_id` from the payload params, while the in-browser SDK reads it
 *   from `options.eventID`. Sending it in only one place causes
 *   Meta to report "Серверное событие <Event> не дедуплицируется"
 *   and double-counts the event.
 *   Ref: https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events
 */

// ─── Type declarations ──────────────────────────────────────────────────────

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    dataLayer?: Record<string, unknown>[]
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function hasFbq(): boolean {
  return typeof window !== 'undefined' && typeof window.fbq === 'function'
}

function hasGtag(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

function makeEventID(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Wrapper that ALWAYS passes event_id in both places so server-side
 * (CAPI Gateway / Conversion API for Browser) and client-side (Pixel)
 * agree on the same ID and Meta dedupes correctly.
 */
function fireMetaEvent(
  kind: 'track' | 'trackCustom',
  eventName: string,
  params: Record<string, unknown>,
  eventID: string
): void {
  if (!hasFbq()) return
  window.fbq!(
    kind,
    eventName,
    { ...params, event_id: eventID },
    { eventID }
  )
}

// ─── Contact: Telegram CTA clicks ──────────────────────────────────────────

export function trackTelegramContact(placement: string): void {
  const eventID = makeEventID('contact_tg_' + placement)
  fireMetaEvent('track', 'Contact', {
    source: 'telegram',
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    placement,
  }, eventID)

  if (hasGtag()) {
    window.gtag!('event', 'telegram_click', {
      event_category: 'contact',
      event_label: placement,
    })
  }
}

/**
 * Click handler for all Telegram CTA <a> tags.
 * Usage: onClick={(e) => openTelegramWithTracking(e, 'placement-name')}
 * Does NOT call preventDefault — browser must follow the href.
 */
export function openTelegramWithTracking(
  _e: React.MouseEvent,
  placement: string
): void {
  trackTelegramContact(placement)
}

// ─── Contact: Phone clicks ──────────────────────────────────────────────────

export function trackPhoneClick(placement: string): void {
  const eventID = makeEventID('contact_phone_' + placement)
  fireMetaEvent('track', 'Contact', {
    source: 'phone',
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    placement,
  }, eventID)

  if (hasGtag()) {
    window.gtag!('event', 'phone_click', {
      event_category: 'contact',
      event_label: placement,
    })
  }
}

// ─── Lead: Form submissions & catalog downloads ─────────────────────────────

export function trackFormSubmit(placement: string): void {
  const eventID = makeEventID('lead_form_' + placement)
  fireMetaEvent('track', 'Lead', {
    content_name: 'contact_form',
    placement,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  }, eventID)

  if (hasGtag()) {
    window.gtag!('event', 'generate_lead', {
      event_category: 'form',
      event_label: placement,
    })
  }
}

export function trackCatalogDownload(placement: string): void {
  const eventID = makeEventID('lead_catalog_' + placement)
  fireMetaEvent('track', 'Lead', {
    content_name: 'catalog_pdf',
    placement,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  }, eventID)

  if (hasGtag()) {
    window.gtag!('event', 'catalog_download', {
      event_category: 'engagement',
      event_label: placement,
    })
  }
}

// ─── ViewContent: Blog articles ─────────────────────────────────────────────

export function trackViewContent(
  contentId: string,
  contentName: string,
  contentCategory?: string
): void {
  const eventID = makeEventID('viewcontent_' + contentId)
  fireMetaEvent('track', 'ViewContent', {
    content_ids: [contentId],
    content_name: contentName,
    content_category: contentCategory || 'blog',
    content_type: 'article',
  }, eventID)

  if (hasGtag()) {
    window.gtag!('event', 'view_item', {
      content_type: 'article',
      content_id: contentId,
      content_name: contentName,
    })
  }
}

// ─── ViewCategory: Product category pages ───────────────────────────────────

export function trackViewCategory(
  categoryId: string,
  categoryName: string
): void {
  const eventID = makeEventID('viewcat_' + categoryId)
  fireMetaEvent('trackCustom', 'ViewCategory', {
    category_id: categoryId,
    category_name: categoryName,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  }, eventID)

  if (hasGtag()) {
    window.gtag!('event', 'view_item_list', {
      item_list_id: categoryId,
      item_list_name: categoryName,
    })
  }
}
