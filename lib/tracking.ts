/**
 * Centralized tracking utilities for Graver.uz
 * Ported from CRA pixel.js — Meta Pixel + GTM/GA4 event tracking
 *
 * Events:
 *  - Contact  (Telegram CTA clicks, phone clicks)
 *  - Lead     (form submissions, catalog downloads)
 *  - ViewContent (blog articles)
 *  - ViewCategory (product category pages)
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

// ─── Contact: Telegram CTA clicks ──────────────────────────────────────────

/**
 * Fires fbq('track', 'Contact') + gtag event for Telegram CTA clicks.
 * Called synchronously inside onClick so the user gesture is preserved.
 */
export function trackTelegramContact(placement: string): void {
  if (hasFbq()) {
    const eventID = makeEventID('contact_' + placement)
    window.fbq!('track', 'Contact', {
      source: 'telegram',
      page: window.location.pathname,
      placement,
    }, { eventID })
  }
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

/**
 * Fires Contact event when a visitor clicks a phone number link.
 */
export function trackPhoneClick(placement: string): void {
  if (hasFbq()) {
    const eventID = makeEventID('phone_' + placement)
    window.fbq!('track', 'Contact', {
      source: 'phone',
      page: window.location.pathname,
      placement,
    }, { eventID })
  }
  if (hasGtag()) {
    window.gtag!('event', 'phone_click', {
      event_category: 'contact',
      event_label: placement,
    })
  }
}

// ─── Lead: Form submissions & catalog downloads ─────────────────────────────

/**
 * Fires Lead event when a visitor submits a contact form.
 */
export function trackFormSubmit(placement: string): void {
  if (hasFbq()) {
    const eventID = makeEventID('lead_form_' + placement)
    window.fbq!('track', 'Lead', {
      content_name: 'contact_form',
      placement,
      page: window.location.pathname,
    }, { eventID })
  }
  if (hasGtag()) {
    window.gtag!('event', 'generate_lead', {
      event_category: 'form',
      event_label: placement,
    })
  }
}

/**
 * Fires Lead event when a visitor downloads the PDF catalogue.
 */
export function trackCatalogDownload(placement: string): void {
  if (hasFbq()) {
    const eventID = makeEventID('lead_catalog_' + placement)
    window.fbq!('track', 'Lead', {
      content_name: 'catalog_pdf',
      placement,
      page: window.location.pathname,
    }, { eventID })
  }
  if (hasGtag()) {
    window.gtag!('event', 'catalog_download', {
      event_category: 'engagement',
      event_label: placement,
    })
  }
}

// ─── ViewContent: Blog articles ─────────────────────────────────────────────

/**
 * Fires ViewContent event when a blog article page mounts.
 */
export function trackViewContent(
  contentId: string,
  contentName: string,
  contentCategory?: string
): void {
  if (hasFbq()) {
    const eventID = makeEventID('viewcontent_' + contentId)
    window.fbq!('track', 'ViewContent', {
      content_ids: [contentId],
      content_name: contentName,
      content_category: contentCategory || 'blog',
      content_type: 'article',
    }, { eventID })
  }
  if (hasGtag()) {
    window.gtag!('event', 'view_item', {
      content_type: 'article',
      content_id: contentId,
      content_name: contentName,
    })
  }
}

// ─── ViewCategory: Product category pages ───────────────────────────────────

/**
 * Fires ViewCategory event when a product category page mounts.
 */
export function trackViewCategory(
  categoryId: string,
  categoryName: string
): void {
  if (hasFbq()) {
    const eventID = makeEventID('viewcat_' + categoryId)
    window.fbq!('trackCustom', 'ViewCategory', {
      category_id: categoryId,
      category_name: categoryName,
      page: window.location.pathname,
    }, { eventID })
  }
  if (hasGtag()) {
    window.gtag!('event', 'view_item_list', {
      item_list_id: categoryId,
      item_list_name: categoryName,
    })
  }
}
