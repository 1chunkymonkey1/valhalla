/**
 * Built-in block layouts derived from current company / hub site content.
 * Used when the editor opens a page with no stored layout (empty canvas).
 * enabled: false, live site keeps React defaults until a founder publishes.
 */

import { companyProducts } from '../data/companyProducts'
import { companyPayLinks, formatUsd } from '../data/payLinks'
import { DISCORD_INVITE, pressRelease } from '../data/pressRelease'
import { companies, getCompany } from './companies'
import { PAGE_IDS, SNAP, emptyLayout, snap } from './pageEditor'

const FONTS = {
  display: 'Source Serif 4, Literata, Georgia, serif',
  body: 'Sora, system-ui, sans-serif',
  mono: 'IBM Plex Mono, ui-monospace, monospace',
}

const TONE = {
  land: {
    ink: '#14201a',
    muted: 'rgba(20, 32, 26, 0.72)',
    accent: '#2f5c45',
  },
  water: {
    ink: '#0b1a2a',
    muted: 'rgba(11, 26, 42, 0.72)',
    accent: '#1a4a6e',
  },
  air: {
    ink: '#1c2833',
    muted: 'rgba(28, 40, 51, 0.7)',
    accent: '#4a7fa0',
  },
  space: {
    ink: '#1a1410',
    muted: 'rgba(26, 20, 16, 0.72)',
    accent: '#c45a20',
  },
}

function bid(pageId, key) {
  return `def_${pageId}_${key}`
}

function style(partial = {}) {
  return {
    fontFamily: partial.fontFamily || FONTS.body,
    fontSize: snap(partial.fontSize ?? 18),
    color: partial.color || '#1a1a1a',
    align: partial.align || 'left',
    fontWeight: String(partial.fontWeight || '500'),
  }
}

function block(pageId, key, type, geom, fields = {}) {
  return {
    id: bid(pageId, key),
    type,
    x: snap(geom.x ?? 24),
    y: snap(geom.y ?? 0),
    w: snap(geom.w ?? 640),
    h: snap(geom.h ?? 80),
    content: fields.content ?? '',
    href: fields.href ?? '',
    src: fields.src ?? '',
    alt: fields.alt ?? '',
    style: style(fields.style || {}),
  }
}

function buildCompanyLayout(pageId) {
  const company = getCompany(pageId)
  const product = companyProducts[pageId]
  if (!company || !product) return emptyLayout()

  const tone = TONE[product.tone] || TONE.land
  const gallery = product.gallery || []
  const heroImg = gallery[0] || {
    src: company.imageSrc || company.placeholderSrc,
    alt: company.name,
  }
  const strip = gallery.slice(1)
  const pay = companyPayLinks[pageId]
  const blocks = []
  let y = 0

  blocks.push(
    block(pageId, 'hero_img', 'image', { x: 0, y, w: 960, h: 400 }, {
      src: heroImg.src,
      alt: heroImg.alt || company.name,
    }),
  )
  y += 416

  blocks.push(
    block(pageId, 'meta', 'text', { x: 40, y, w: 880, h: 32 }, {
      content: `${company.domain} · ${company.pillar}`,
      style: {
        fontFamily: FONTS.mono,
        fontSize: 14,
        color: tone.muted,
        fontWeight: '500',
      },
    }),
  )
  y += 40

  blocks.push(
    block(pageId, 'brand', 'hero', { x: 40, y, w: 880, h: 80 }, {
      content: company.name,
      style: {
        fontFamily: FONTS.display,
        fontSize: 56,
        color: tone.ink,
        align: 'left',
        fontWeight: '600',
      },
    }),
  )
  y += 88

  blocks.push(
    block(pageId, 'headline', 'text', { x: 40, y, w: 880, h: 56 }, {
      content: product.headline,
      style: {
        fontFamily: FONTS.display,
        fontSize: 28,
        color: tone.ink,
        fontWeight: '500',
      },
    }),
  )
  y += 64

  blocks.push(
    block(pageId, 'support', 'text', { x: 40, y, w: 720, h: 72 }, {
      content: product.support,
      style: {
        fontFamily: FONTS.body,
        fontSize: 18,
        color: tone.muted,
      },
    }),
  )
  y += 88

  blocks.push(
    block(pageId, 'cta_reserve', 'cta', { x: 40, y, w: 220, h: 48 }, {
      content: 'Hold a reservation',
      href: '#reserve',
      style: {
        fontFamily: FONTS.body,
        fontSize: 16,
        color: tone.accent,
        align: 'center',
        fontWeight: '600',
      },
    }),
  )
  blocks.push(
    block(pageId, 'cta_discord', 'cta', { x: 280, y, w: 160, h: 48 }, {
      content: 'Discord',
      href: DISCORD_INVITE,
      style: {
        fontFamily: FONTS.body,
        fontSize: 16,
        color: tone.ink,
        align: 'center',
        fontWeight: '500',
      },
    }),
  )
  y += 72

  blocks.push(block(pageId, 'sp1', 'spacer', { x: 40, y, w: 880, h: 24 }))
  y += 40

  blocks.push(
    block(pageId, 'kicker', 'text', { x: 40, y, w: 880, h: 28 }, {
      content: product.product,
      style: {
        fontFamily: FONTS.mono,
        fontSize: 13,
        color: tone.muted,
        fontWeight: '500',
      },
    }),
  )
  y += 36

  blocks.push(
    block(pageId, 'about_title', 'text', { x: 40, y, w: 880, h: 48 }, {
      content: 'What this is',
      style: {
        fontFamily: FONTS.display,
        fontSize: 32,
        color: tone.ink,
        fontWeight: '600',
      },
    }),
  )
  y += 56

  blocks.push(
    block(pageId, 'about_body', 'text', { x: 40, y, w: 720, h: 96 }, {
      content: product.body,
      style: {
        fontFamily: FONTS.body,
        fontSize: 18,
        color: tone.ink,
      },
    }),
  )
  y += 112

  blocks.push(
    block(pageId, 'refund_note', 'text', { x: 40, y, w: 720, h: 32 }, {
      content: 'Fully refundable reservations',
      style: {
        fontFamily: FONTS.body,
        fontSize: 15,
        color: tone.muted,
        fontWeight: '500',
      },
    }),
  )
  y += 48

  if (pay) {
    blocks.push(block(pageId, 'sp_pay', 'spacer', { x: 40, y, w: 880, h: 16 }))
    y += 32

    blocks.push(
      block(pageId, 'pay_kicker', 'text', { x: 40, y, w: 880, h: 28 }, {
        content: 'Squarespace pay hold',
        style: {
          fontFamily: FONTS.mono,
          fontSize: 13,
          color: tone.muted,
        },
      }),
    )
    y += 36

    blocks.push(
      block(pageId, 'pay_title', 'text', { x: 40, y, w: 880, h: 48 }, {
        content: `${formatUsd(pay.estimateUsd)} estimated hold`,
        style: {
          fontFamily: FONTS.display,
          fontSize: 28,
          color: tone.ink,
          fontWeight: '600',
        },
      }),
    )
    y += 56

    blocks.push(
      block(pageId, 'pay_notes', 'text', { x: 40, y, w: 720, h: 56 }, {
        content: pay.notes,
        style: {
          fontFamily: FONTS.body,
          fontSize: 17,
          color: tone.ink,
        },
      }),
    )
    y += 72

    if (pay.payUrl) {
      blocks.push(
        block(pageId, 'pay_cta', 'cta', { x: 40, y, w: 220, h: 48 }, {
          content: 'Continue to Pay Link',
          href: pay.payUrl,
          style: {
            fontFamily: FONTS.body,
            fontSize: 16,
            color: tone.accent,
            align: 'center',
            fontWeight: '600',
          },
        }),
      )
      y += 64
    } else {
      blocks.push(
        block(pageId, 'pay_pending', 'text', { x: 40, y, w: 720, h: 32 }, {
          content: 'Pay Link URL pending in config',
          style: {
            fontFamily: FONTS.body,
            fontSize: 15,
            color: tone.muted,
          },
        }),
      )
      y += 48
    }
  }

  if (strip.length > 0) {
    blocks.push(block(pageId, 'sp_gal', 'spacer', { x: 40, y, w: 880, h: 16 }))
    y += 32

    const lead = strip[0]
    blocks.push(
      block(pageId, 'gal_0', 'image', { x: 40, y, w: 880, h: 320 }, {
        src: lead.src,
        alt: lead.alt || `${company.name} atmosphere`,
      }),
    )
    y += 336

    const rest = strip.slice(1)
    if (rest.length === 1) {
      blocks.push(
        block(pageId, 'gal_1', 'image', { x: 40, y, w: 880, h: 280 }, {
          src: rest[0].src,
          alt: rest[0].alt || '',
        }),
      )
      y += 296
    } else if (rest.length >= 2) {
      blocks.push(
        block(pageId, 'gal_1', 'image', { x: 40, y, w: 424, h: 240 }, {
          src: rest[0].src,
          alt: rest[0].alt || '',
        }),
      )
      blocks.push(
        block(pageId, 'gal_2', 'image', { x: 496, y, w: 424, h: 240 }, {
          src: rest[1].src,
          alt: rest[1].alt || '',
        }),
      )
      y += 256
      if (rest[2]) {
        blocks.push(
          block(pageId, 'gal_3', 'image', { x: 40, y, w: 880, h: 260 }, {
            src: rest[2].src,
            alt: rest[2].alt || '',
          }),
        )
        y += 276
      }
    }
  }

  blocks.push(
    block(pageId, 'foot_hint', 'text', { x: 40, y, w: 880, h: 48 }, {
      content:
        'Reservation form and NextDoor stay below this band on the live hall. Product roadmap is part of the default React page, re-add copy here if you publish a custom layout.',
      style: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: tone.muted,
      },
    }),
  )
  y += 64

  return {
    version: 1,
    enabled: false,
    grid: SNAP,
    canvasHeight: Math.max(720, snap(y + 48)),
    blocks,
  }
}

function buildHubLayout() {
  const pageId = 'hub'
  const blocks = []
  let y = 24
  const ink = '#1a1a1a'
  const muted = 'rgba(26, 26, 26, 0.68)'
  const accent = '#2a4a3a'

  blocks.push(
    block(pageId, 'brand', 'hero', { x: 40, y, w: 880, h: 72 }, {
      content: 'Valhalla',
      style: {
        fontFamily: FONTS.display,
        fontSize: 52,
        color: ink,
        align: 'center',
        fontWeight: '600',
      },
    }),
  )
  y += 88

  blocks.push(
    block(pageId, 'headline', 'text', { x: 80, y, w: 800, h: 96 }, {
      content: pressRelease.headline,
      style: {
        fontFamily: FONTS.display,
        fontSize: 26,
        color: ink,
        align: 'center',
        fontWeight: '500',
      },
    }),
  )
  y += 112

  const mission =
    'Twelve companies across land, water, air, and space, building the infrastructure layers that support civilization: movement, habitation, and substrate.'
  blocks.push(
    block(pageId, 'mission', 'text', { x: 80, y, w: 800, h: 88 }, {
      content: mission,
      style: {
        fontFamily: FONTS.body,
        fontSize: 18,
        color: muted,
        align: 'center',
      },
    }),
  )
  y += 104

  blocks.push(block(pageId, 'sp1', 'spacer', { x: 40, y, w: 880, h: 16 }))
  y += 32

  for (const domain of pressRelease.domains) {
    blocks.push(
      block(pageId, `dom_${domain.name}`, 'text', { x: 80, y, w: 800, h: 48 }, {
        content: `${domain.name}, ${domain.text}`,
        style: {
          fontFamily: FONTS.body,
          fontSize: 16,
          color: ink,
          align: 'center',
        },
      }),
    )
    y += 56
  }

  blocks.push(block(pageId, 'sp2', 'spacer', { x: 40, y, w: 880, h: 24 }))
  y += 40

  blocks.push(
    block(pageId, 'quote', 'text', { x: 80, y, w: 800, h: 140 }, {
      content: `"${pressRelease.quote.text}"`,
      style: {
        fontFamily: FONTS.display,
        fontSize: 18,
        color: ink,
        align: 'center',
        fontWeight: '500',
      },
    }),
  )
  y += 148

  blocks.push(
    block(pageId, 'attr', 'text', { x: 80, y, w: 800, h: 32 }, {
      content: `- ${pressRelease.quote.attribution}`,
      style: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: muted,
        align: 'center',
      },
    }),
  )
  y += 56

  blocks.push(
    block(pageId, 'cta_press', 'cta', { x: 280, y, w: 160, h: 48 }, {
      content: 'Press',
      href: '/press',
      style: {
        fontFamily: FONTS.body,
        fontSize: 16,
        color: accent,
        align: 'center',
        fontWeight: '600',
      },
    }),
  )
  blocks.push(
    block(pageId, 'cta_contact', 'cta', { x: 460, y, w: 160, h: 48 }, {
      content: 'Contact',
      href: '/contact',
      style: {
        fontFamily: FONTS.body,
        fontSize: 16,
        color: ink,
        align: 'center',
        fontWeight: '500',
      },
    }),
  )
  y += 72

  blocks.push(
    block(pageId, 'note', 'text', { x: 80, y, w: 800, h: 64 }, {
      content:
        'Shown under the Living Mosaic after event start. Countdown and email capture stay outside this band.',
      style: {
        fontFamily: FONTS.body,
        fontSize: 13,
        color: muted,
        align: 'center',
      },
    }),
  )
  y += 80

  return {
    version: 1,
    enabled: false,
    grid: SNAP,
    canvasHeight: Math.max(720, snap(y + 48)),
    blocks,
  }
}

const cache = Object.create(null)

/** Default layout for a page id (cloned). */
export function getDefaultPageLayout(pageId) {
  if (!PAGE_IDS.includes(pageId)) return emptyLayout()
  if (!cache[pageId]) {
    cache[pageId] =
      pageId === 'hub' ? buildHubLayout() : buildCompanyLayout(pageId)
  }
  return structuredClone(cache[pageId])
}

/** True when a stored layout has no editable blocks yet. */
export function isEmptyLayout(layout) {
  return !layout || !Array.isArray(layout.blocks) || layout.blocks.length === 0
}

/** All company slugs that have product-derived defaults. */
export function defaultLayoutPageIds() {
  return PAGE_IDS.filter((id) => id === 'hub' || companies.some((c) => c.id === id))
}
