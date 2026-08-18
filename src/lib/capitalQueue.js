/**
 * Operating sequence for the capital desk.
 * Seed copy lives in api/_lib/dispatchSeed.js. This file is order, clocks, and gates.
 * Dated 14 Aug 2026. Recheck closed windows before treating them as open.
 */

export const CAPITAL_POSTURE = {
  entity: 'Demeter Energy',
  raise: '$1.0–1.5M SAFE',
  cap: '$8M',
  min: '$25K',
  from: 'easongreene@gmail.com',
  rule: 'Applicant is Eason. Company is Demeter. Valhalla is the story in the room, not the SAFE. Do not pay for introductions.',
}

/** This week, in send order. Skip Thiel unless leaving Berkeley is a live decision. */
export const NOW_ORDER = [
  'fellowship-emergent',
  'fellowship-z',
  'demeter-climate-capital',
  'demeter-ponderosa',
  'demeter-congruent',
  'demeter-skydeck',
  'capital-berkeley-cf',
  'fellowship-ef',
  'capital-reap-loan',
  'capital-45v-memo',
]

export const DEADLINES = [
  { id: 'demeter-skydeck', date: '2026-08-21', label: 'SkyDeck' },
  { id: 'capital-berkeley-cf', date: '2026-08-24', label: 'Berkeley Crowdfunding' },
  { id: 'fellowship-ef', date: '2026-08-30', label: 'EF Bridge' },
  { id: 'capital-dawson-ppd', date: '2026-09-30', label: 'Dawson PPD REDLG' },
]

export const VIEWS = [
  { id: 'now', label: 'Now' },
  { id: 'later', label: 'Later' },
  { id: 'gated', label: 'Gated' },
  { id: 'done', label: 'Sent' },
  { id: 'all', label: 'All' },
]

const NOW_SET = new Set(NOW_ORDER)

export function daysUntil(iso, now = Date.now()) {
  if (!iso) return null
  const end = Date.parse(`${iso}T23:59:59`)
  if (Number.isNaN(end)) return null
  return Math.ceil((end - now) / 86400000)
}

export function deadlineFor(id) {
  return DEADLINES.find((d) => d.id === id) || null
}

export function nowRank(id) {
  const i = NOW_ORDER.indexOf(id)
  return i === -1 ? null : i + 1
}

export function bucketOf(item) {
  if (item.status === 'sent') return 'done'
  if (item.gated === 'no-send' || item.flags?.includes('lock')) return 'lock'
  if (item.flags?.includes('closed')) return 'watch'
  if (item.gated) return 'gated'
  if (NOW_SET.has(item.id)) return 'now'
  return 'later'
}

export function itemsForView(items, view) {
  if (view === 'all') return items
  if (view === 'now') {
    return NOW_ORDER.map((id) => items.find((i) => i.id === id)).filter(
      (i) => i && i.status !== 'sent',
    )
  }
  if (view === 'done') return items.filter((i) => i.status === 'sent')
  if (view === 'gated') {
    return items.filter((i) => bucketOf(i) === 'gated' && i.status !== 'sent')
  }
  if (view === 'later') {
    return items.filter((i) => {
      const b = bucketOf(i)
      return (b === 'later' || b === 'watch' || b === 'lock') && i.status !== 'sent'
    })
  }
  return items
}

export function nowProgress(items) {
  const total = NOW_ORDER.length
  const sent = NOW_ORDER.filter((id) => items.find((i) => i.id === id)?.status === 'sent').length
  const approved = NOW_ORDER.filter(
    (id) => items.find((i) => i.id === id)?.status === 'approved',
  ).length
  return { sent, approved, total, remaining: total - sent }
}
