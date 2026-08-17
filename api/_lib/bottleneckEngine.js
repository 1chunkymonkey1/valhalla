/**
 * Bottleneck engine: detect → automate → tool → founder queue.
 * Nothing here sends email, publishes, or asserts a quarantined claim.
 */

import { getHallKnowledge } from './hallKnowledge.js'
import { listAdminThreads } from './siteChat.js'
import { listDispatchItems } from './dispatchStore.js'
import { getCredentialFlags, isAiConfigured } from './aiSettings.js'
import {
  APOLLO_MUSIC,
  CLAIMS_QUARANTINE,
  HALL_SYSTEM,
  MERIDIAN_APPAREL,
  MOSAIC_HALLS,
  NEVER_AUTO,
  SESSION_ID,
  SEAT,
  STANDING_AUTOMATIONS,
  STANDING_FOUNDER_ITEMS,
  UNIFYING_BOTTLENECK,
  bottleneckKey,
  classifyInboxReason,
} from './bottleneckCatalogs.js'
import {
  getFindingByKey,
  getQueueByBottleneck,
  lastSweep,
  listFindings,
  listQueue,
  recordSweep,
  storageLabel,
  updateQueueItem,
  upsertFinding,
  upsertQueueItem,
} from './bottleneckStore.js'

const CLOSED = new Set(['resolved', 'done'])

function snoozed(finding, now = Date.now()) {
  if (!finding?.snoozeUntil) return false
  const t = Date.parse(finding.snoozeUntil)
  return !Number.isNaN(t) && t > now
}

async function merchCatalog() {
  try {
    const merch = await import('../../src/data/meridianMerch.js')
    const missing = MOSAIC_HALLS.filter((id) => (merch.merchItemsForCompany(id) || []).length < 2)
    const carbon = merch.merchItemsForCompany('meridian') || []
    const posture = String(merch.MERCH_POSTURE || '')
    return {
      ok: missing.length === 0 && carbon.length === 3 && /not a cart/i.test(posture),
      merchMissing: missing,
      carbonCount: carbon.length,
      posture,
    }
  } catch {
    return { ok: false, merchMissing: [...MOSAIC_HALLS], carbonCount: 0, posture: '' }
  }
}

async function musicCatalog() {
  try {
    const music = await import('../../src/data/apolloMusic.js')
    let publicSurface = APOLLO_MUSIC.publicSurface
    try {
      const marks = await import('../../src/data/oneCivilizationMarks.js')
      if (typeof marks.APOLLO_MUSIC_PUBLIC === 'boolean') publicSurface = marks.APOLLO_MUSIC_PUBLIC
    } catch {
      /* interior default */
    }
    const missing = MOSAIC_HALLS.filter((id) => {
      const items = music.musicItemsForCompany?.(id) || []
      return items.length < 1 && !music.hallMusic?.[id]
    })
    return {
      ok: Boolean(music.MUSIC_POSTURE) && publicSurface === false,
      musicMissing: missing,
      publicSurface,
      posture: music.MUSIC_POSTURE || '',
    }
  } catch {
    return {
      ok: true,
      musicMissing: [],
      publicSurface: false,
      posture: 'No public Apollo Music surface (correct interior default)',
    }
  }
}

async function haystack(hallId) {
  const k = getHallKnowledge(hallId)
  let extra = ''
  try {
    const mod = await import('../../src/data/companyProducts.js')
    const p = mod.companyProducts?.[hallId]
    extra = [p?.headline, p?.support, p?.body].filter(Boolean).join('\n')
  } catch {
    /* api-only bundle */
  }
  return { knowledge: k, text: `${k.hero}\n${k.body}\n${(k.bullets || []).join('\n')}\n${extra}` }
}

function claimHits(text, rule) {
  if (!rule.assert.test(text)) return { hit: false, asserted: false }
  const disclaimed = rule.allowed ? rule.allowed.test(text) : false
  return { hit: true, asserted: !disclaimed }
}

export async function detectAll() {
  const detections = []
  const halls = []
  const merch = await merchCatalog()
  const music = await musicCatalog()

  for (const hallId of MOSAIC_HALLS) {
    const spec = HALL_SYSTEM[hallId]
    const { knowledge, text } = await haystack(hallId)
    halls.push({
      hall: hallId,
      surface: spec.surface,
      claims: spec.claims,
      capture: spec.capture,
      knowledge: Boolean(knowledge?.name),
    })

    detections.push({
      key: bottleneckKey(hallId, 'surface', 'live'),
      surface: hallId,
      kind: 'surface',
      slug: 'live',
      title: `${knowledge.name || hallId} public surface`,
      body: spec.surface,
      founderRequired: !knowledge?.name,
      automation: 'catalog-refresh',
      status: knowledge?.name ? 'automated' : 'queued',
      evidence: { route: `/${hallId}` },
    })
    detections.push({
      key: bottleneckKey(hallId, 'capture', 'email-signup'),
      surface: hallId,
      kind: 'capture',
      slug: 'email-signup',
      title: `${hallId} capture is email waitlist`,
      body: spec.capture,
      founderRequired: false,
      automation: 'catalog-refresh',
      status: 'automated',
      evidence: { endpoint: '/api/signups' },
    })
    for (const rule of CLAIMS_QUARANTINE.filter((r) => r.surface === hallId)) {
      const { hit, asserted } = claimHits(text, rule)
      detections.push({
        key: bottleneckKey(rule.surface, 'claim', rule.slug),
        surface: rule.surface,
        kind: 'claim',
        slug: rule.slug,
        title: rule.title,
        body: rule.body,
        founderRequired: asserted,
        automation: 'claims-quarantine',
        status: asserted ? 'queued' : 'automated',
        evidence: { scanned: true, hit, asserted },
        reopenIfResolved: asserted,
      })
    }
  }

  const hubText = (await haystack('hub')).text
  for (const rule of CLAIMS_QUARANTINE.filter((r) => r.surface === 'hub')) {
    const { hit, asserted } = claimHits(hubText, rule)
    detections.push({
      key: bottleneckKey('hub', 'claim', rule.slug),
      surface: 'hub',
      kind: 'claim',
      slug: rule.slug,
      title: rule.title,
      body: rule.body,
      founderRequired: asserted,
      automation: 'claims-quarantine',
      status: asserted ? 'queued' : 'automated',
      evidence: { scanned: true, hit, asserted },
      reopenIfResolved: asserted,
    })
  }

  detections.push({
    key: MERIDIAN_APPAREL.key,
    surface: 'meridian',
    kind: 'catalog',
    slug: 'earth-line',
    title: 'Meridian Earth Line catalog',
    body: merch.ok
      ? MERIDIAN_APPAREL.posture
      : `Merch catalog incomplete. Missing: ${merch.merchMissing.join(', ') || 'all'}.`,
    founderRequired: false,
    automation: 'merch-catalog',
    status: 'automated',
    evidence: merch,
  })
  detections.push({
    key: APOLLO_MUSIC.key,
    surface: 'apollo-music',
    kind: 'surface',
    slug: 'public-off',
    title: 'Apollo Music stays interior',
    body: music.publicSurface
      ? 'Public music surface is on. Confirm authorization or unwind the route.'
      : APOLLO_MUSIC.posture,
    founderRequired: Boolean(music.publicSurface),
    automation: 'music-interior',
    status: music.publicSurface ? 'queued' : 'automated',
    evidence: music,
  })
  detections.push({
    key: bottleneckKey('hub', 'capture', 'interest-form-local'),
    surface: 'hub',
    kind: 'capture',
    slug: 'interest-form-local',
    title: 'InterestForm is local-only and unmounted',
    body: 'Dead localStorage capture is not a founder gate. EmailCapture posts to /api/signups.',
    founderRequired: false,
    automation: 'catalog-refresh',
    status: 'automated',
    evidence: { mounted: false },
  })

  const inbox = await listAdminThreads({ needsHumanOnly: true, limit: 120 }).catch(() => ({
    threads: [],
    needsHumanTotal: 0,
  }))
  const byClass = new Map()
  for (const thread of inbox.threads || []) {
    const slug = classifyInboxReason(thread.needsHumanReason, thread.preview)
    if (!byClass.has(slug)) byClass.set(slug, [])
    byClass.get(slug).push(thread.id)
  }
  for (const [slug, threadIds] of byClass) {
    const founder = slug === 'legal' || slug === 'payment' || slug === 'partnership' || slug === 'secrets'
    detections.push({
      key: bottleneckKey('inbox', 'inbox', slug),
      surface: 'inbox',
      kind: 'inbox',
      slug,
      title: `Inbox needs-human: ${slug}`,
      body: founder
        ? `${threadIds.length} flagged thread(s). Synced. A person still acts in /admin Inbox. Do not auto-reply.`
        : `${threadIds.length} flagged thread(s) synced. Reply in the hall inbox, not a new chat.`,
      founderRequired: founder,
      automation: 'inbox-sync',
      status: founder ? 'queued' : 'automated',
      evidence: { threadIds, needsHumanTotal: inbox.needsHumanTotal || threadIds.length },
    })
  }

  const dispatch = await listDispatchItems().catch(() => ({ items: [] }))
  const unsent = (dispatch.items || []).filter((i) => i.status !== 'sent' && i.gated !== 'no-send')
  detections.push({
    key: bottleneckKey('dispatch', 'dispatch', 'unsent'),
    surface: 'dispatch',
    kind: 'dispatch',
    slug: 'unsent',
    title: 'Capital desk has unsent items',
    body: `${unsent.length} item(s) remain on /capital. Approve then Send opens Gmail. This engine does not transmit.`,
    founderRequired: unsent.length > 0,
    automation: 'dispatch-watch',
    status: unsent.length > 0 ? 'queued' : 'automated',
    evidence: { pending: unsent.length, ids: unsent.map((i) => i.id).slice(0, 24) },
  })

  const flags = getCredentialFlags()
  detections.push({
    key: bottleneckKey('hub', 'founder', 'ai-keys'),
    surface: 'hub',
    kind: 'founder',
    slug: 'ai-keys',
    title: 'AI provider keys',
    body: isAiConfigured(flags)
      ? 'AI credentials present. Council and Ask can run.'
      : 'Set CURSOR_API_KEY, AI_GATEWAY_API_KEY, or OPENAI_API_KEY on Vercel. Keys do not belong in chat.',
    founderRequired: !isAiConfigured(flags),
    automation: isAiConfigured(flags) ? 'catalog-refresh' : 'none',
    status: isAiConfigured(flags) ? 'automated' : 'queued',
    evidence: { cursor: flags.cursor, gateway: flags.gateway, openai: flags.openai },
  })

  for (const standing of STANDING_FOUNDER_ITEMS) {
    detections.push({
      key: standing.key,
      surface: standing.surface,
      kind: standing.kind,
      slug: standing.slug,
      title: standing.title,
      body: standing.body,
      hall: standing.hall,
      founderRequired: true,
      automation: 'none',
      status: 'queued',
      evidence: { standing: true },
    })
  }

  return { detections, halls, merch, music, unsent: unsent.length }
}

async function persistDetection(detection, stats) {
  const existing = await getFindingByKey(detection.key)
  const queueRow = await getQueueByBottleneck(detection.key)
  const queueDone = queueRow && queueRow.status === 'done'
  const closed =
    (existing && CLOSED.has(existing.status)) || queueDone
  if (snoozed(existing) || (closed && !detection.reopenIfResolved)) {
    stats.deduped += 1
    await upsertFinding({
      ...(existing || detection),
      key: detection.key,
      bump: true,
      evidence: detection.evidence,
      status: queueDone || (existing && CLOSED.has(existing.status)) ? 'resolved' : existing?.status,
    })
    return
  }

  const finding = await upsertFinding({
    ...detection,
    status: detection.founderRequired ? 'queued' : 'automated',
  })
  stats.findings += 1
  if (existing) stats.deduped += 1

  if (detection.founderRequired) {
    const { deduped } = await upsertQueueItem({
      bottleneckId: detection.key,
      hall: detection.hall || detection.surface,
      title: detection.title,
      body: detection.body,
      status: 'needs_eason',
      automatable: false,
      source: 'sweep',
    })
    if (deduped) stats.deduped += 1
    else stats.queued += 1
    return finding
  }
  stats.automated += 1
  return finding
}

export async function runSweep({ actor = 'sweep' } = {}) {
  const detected = await detectAll()
  const stats = { findings: 0, queued: 0, automated: 0, deduped: 0 }
  for (const detection of detected.detections) {
    await persistDetection(detection, stats)
  }
  const queue = await listQueue({ status: 'all' })
  const findings = await listFindings()
  const needsEason = queue.filter((i) => i.status === 'needs_eason' || i.status === 'open')
  const report = {
    seat: SEAT,
    session: SESSION_ID,
    unifying: UNIFYING_BOTTLENECK,
    halls: detected.halls,
    apolloMusic: { ...APOLLO_MUSIC, completeness: detected.music },
    meridianApparel: { ...MERIDIAN_APPAREL, completeness: detected.merch },
    completeness: {
      merchMissing: detected.merch.merchMissing,
      musicMissing: detected.music.musicMissing,
      meridianOk: detected.merch.ok,
      apolloOk: detected.music.ok,
    },
    automations: STANDING_AUTOMATIONS,
    neverAuto: NEVER_AUTO,
    dedupe: { format: '{surface}:{kind}:{slug}', stats },
  }
  const sweep = await recordSweep({ actor, ...stats, report })
  return {
    ok: true,
    storage: storageLabel(),
    unifying: { id: UNIFYING_BOTTLENECK.id, statement: UNIFYING_BOTTLENECK.statement },
    completeness: report.completeness,
    items: queue,
    findings,
    counts: {
      needsEason: needsEason.length,
      automated: stats.automated,
      total: queue.length,
      findings: findings.length,
      deduped: stats.deduped,
    },
    sweep,
    report,
    neverAuto: NEVER_AUTO,
  }
}

export async function getBottleneckState() {
  const queue = await listQueue({ status: 'all' })
  const findings = await listFindings()
  const sweep = await lastSweep()
  const needsEason = queue.filter((i) => i.status === 'needs_eason' || i.status === 'open')
  return {
    ok: true,
    storage: storageLabel(),
    unifying: { id: UNIFYING_BOTTLENECK.id, statement: UNIFYING_BOTTLENECK.statement },
    completeness: sweep?.report?.completeness || {
      merchMissing: [],
      musicMissing: [],
      meridianOk: false,
      apolloOk: false,
    },
    items: queue,
    findings,
    counts: {
      needsEason: needsEason.length,
      automated: queue.filter((i) => i.status === 'automated').length,
      total: queue.length,
      findings: findings.length,
    },
    sweep,
    neverAuto: NEVER_AUTO,
    report: sweep?.report || null,
  }
}

export async function resolveQueueItem(id, actor, resolution = '') {
  const items = await listQueue({ status: 'all' })
  const row = items.find((i) => i.id === id)
  const updated = await updateQueueItem(id, { status: 'done', resolution: resolution || 'founder marked done' }, actor)
  if (row?.bottleneckId) {
    const finding = await getFindingByKey(row.bottleneckId)
    if (finding) {
      await upsertFinding({
        ...finding,
        key: finding.key,
        status: 'resolved',
        founderRequired: false,
        resolvedAt: new Date().toISOString(),
        resolvedBy: actor || '',
        bump: false,
      })
    }
  }
  return updated
}

export async function createManualQueueItem({ title, body, hall, actor }) {
  const slug =
    String(title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'manual'
  const surface = String(hall || 'hub').trim() || 'hub'
  const key = bottleneckKey(surface, 'founder', slug)
  const existing = await getFindingByKey(key)
  if (existing && !CLOSED.has(existing.status)) {
    const queued = await upsertQueueItem({
      bottleneckId: key,
      hall: surface,
      title,
      body,
      status: 'needs_eason',
      source: 'manual',
    })
    return { ...queued, deduped: true }
  }
  await upsertFinding({
    key,
    surface,
    kind: 'founder',
    slug,
    title,
    body,
    status: 'queued',
    founderRequired: true,
    automation: 'none',
    evidence: { actor: actor || '', manual: true },
  })
  return upsertQueueItem({
    bottleneckId: key,
    hall: surface,
    title,
    body,
    status: 'needs_eason',
    source: 'manual',
  })
}
