/**
 * Standing OS bottlenecks. These are rules, not todos.
 * A founder-todo may be created only if it cites one of these ids.
 * Recurring chat about the same decision is a catalog miss, not a new task.
 */

export const HALL_BOTTLENECKS = [
  {
    id: 'wolf.first-product',
    hall: 'wolf',
    name: 'Wolf',
    decision: 'What is Wolf allowed to speak as live this week: Fenrir path, OEM path, or Dire Wolf story.',
    lockedRule:
      'Dire Wolf 5.8-hour SF to NYC is a program target. It is not a shipping product. Community-wrench culture does not replace a first artifact.',
  },
  {
    id: 'viking.partner-gate',
    hall: 'viking',
    name: 'Viking',
    decision: 'May public copy name a sailing window, or does Viking stay partner-gated research.',
    lockedRule:
      'Viking is partner-gated. No ticketed cruise, no sailing-tomorrow claim, no SMR-as-installed claim on the public surface.',
  },
  {
    id: 'eagle.spirit-language',
    hall: 'eagle',
    name: 'Eagle',
    decision: 'What sentence is Eagle allowed to use about Spirit 2.0 this week.',
    lockedRule:
      'Spirit partnership or acquisition is unsubstantiated. Do not speak it as closed. Open dialogue is the maximum public claim until @lex has a document.',
  },
  {
    id: 'phenix.entity-vs-myth',
    hall: 'phenix',
    name: 'Phénix',
    decision: 'Is Phénix speaking as an entity with operators, or as destination mythology.',
    lockedRule:
      'Moon, Venus, Rollo, and O’Neill are program path. Hawk Mark is research until entity, ITAR/FAA posture, and a named operator exist. Space seat OPEN is not staffed.',
  },
  {
    id: 'holm.first-artifact',
    hall: 'holm',
    name: 'Holm',
    decision: 'Which Holm artifact ships: buyer-to-builder course, terrain kit, or interlocking container.',
    lockedRule:
      'Holm does not sell finished homes on this surface. Speak one artifact. Terrain materials are research until that artifact has a next ship date.',
  },
  {
    id: 'atoll.funds-posture',
    hall: 'atoll',
    name: 'Atoll',
    decision: 'Is Atoll a conversation with a named lead, or a hold list that takes money.',
    lockedRule:
      'Public site accepts no funds. Pre-sale live is false on this surface. Brian Sheng / Aquaria is a warm lead as-of 2026-08-13, not a closed partnership.',
  },
  {
    id: 'olympus.tickets-vs-research',
    hall: 'olympus',
    name: 'Olympus',
    decision: 'Does Olympus copy stay a research queue, or drift into tourism tickets.',
    lockedRule:
      'Olympus Mons 2028 is a program target. No booking, no move-in date, no ticket.',
  },
  {
    id: 'aether.deed-posture',
    hall: 'aether',
    name: 'Aether',
    decision: 'Do Aether claims stay a registry story, or leak into deed sales.',
    lockedRule:
      'No deed sales, no claim payments, no funds against territory on this surface. Hawk Mark 02 flag path is research with Phénix.',
  },
  {
    id: 'demeter.next-send',
    hall: 'demeter',
    name: 'Demeter',
    decision: 'Which capital path is this week’s send: SAFE desk, fellowship, REAP/IRA, or farm lead.',
    lockedRule:
      'Sends live in /capital, not in chat. Do not copy dispatch rows into the founder queue. Raise-size language is inconsistent across sources ($5M vs $1.0–1.5M as-of capture); pick one sentence before any investor send. Kyle Chu stepping back is a coverage hole, not a recruiting fair.',
  },
  {
    id: 'njord.earth-first',
    hall: 'njord',
    name: 'Njord',
    decision: 'What Earth water artifact ships before galactic H2O speech.',
    lockedRule:
      'Earth scarcity first. MARAD / Argo adjacency does not pull Njord into nuclear-maritime copy before a water artifact exists.',
  },
  {
    id: 'aeolus.earth-vs-venus',
    hall: 'aeolus',
    name: 'Aeolus',
    decision: 'Is this week Earth climate work or Venus acid-shielding story.',
    lockedRule:
      'No atmospheric-rights sales. 2031 climate is a program objective. Venus shielding is path, not a SKU.',
  },
  {
    id: 'corvus.money-path',
    hall: 'corvus',
    name: 'Corvus',
    decision: 'What Corvus may take money for: waitlist, prompt ladder, or nothing yet.',
    lockedRule:
      'Raven OS is substrate. Odin is the founder consumer product. Holds are refundable when Pay Links are live. Do not sell prompts as a live storefront in chat.',
  },
]

export const EXTRA_BOTTLENECKS = [
  {
    id: 'apollo.music-lane',
    hall: 'apollo',
    name: 'Apollo Music',
    decision: 'Is this a Helios soundtrack, an Apollo public drop, or an entity Eason must form.',
    lockedRule:
      'Music is not a thirteenth hall. Sonic architecture belongs to Helios. Public voice and drops belong to Apollo. Label/LLC is a one-time founder choose. Until that entity exists, Apollo Music is a soundtrack lane.',
  },
  {
    id: 'meridian.list-not-cart',
    hall: 'meridian',
    name: 'Meridian Apparel',
    decision: 'Freeze Earth Line SKUs, sign a mill/cutter, or change the list-not-cart rule.',
    lockedRule:
      'Meridian is the cutter, not a shop. Earth Line is a list, not a cart. No merch checkout, no in-stock, no funds on this surface. September 2026 is a research target. Venus Suit is not Earth Line. Hall merch copy is automate.',
  },
  {
    id: 'hub.edna-charge',
    hall: 'hub',
    name: 'Edna Charge',
    decision: 'What containment act does Eason sign this week.',
    lockedRule:
      'C&D dated 1 Aug 2026. Access dispute is live. @lex owns legal posture. Founder queue holds only the signature, not the brief. Spell Edna Charge with a space.',
  },
  {
    id: 'hub.ai-keys',
    hall: 'hub',
    name: 'AI keys',
    decision: 'Which provider key gets set so Council and Ask stop falling back.',
    lockedRule:
      'Keys live in Vercel, not in chat. Admin → AI setup is the tool. A reminder without a provider choice is junk.',
  },
]

export const BOTTLENECKS = [...HALL_BOTTLENECKS, ...EXTRA_BOTTLENECKS]

const BY_ID = new Map(BOTTLENECKS.map((b) => [b.id, b]))

export function getBottleneck(id) {
  return BY_ID.get(String(id || '')) || null
}

export function isLockedKind(bottleneck, kind, decision) {
  if (!bottleneck?.lockedRule) return false
  if (kind === 'choose') return false
  const text = `${decision || ''}`.toLowerCase()
  if (bottleneck.id === 'eagle.spirit-language' && /acquir|partner(ship)? (is|are) (live|closed|done)/i.test(text)) {
    return true
  }
  if (bottleneck.id === 'meridian.list-not-cart' && /(checkout|cart|in stock|take funds|sell merch)/i.test(text)) {
    return true
  }
  if (bottleneck.id === 'atoll.funds-posture' && /(pre-?sale live|take funds|checkout)/i.test(text)) {
    return true
  }
  if (bottleneck.id === 'aether.deed-posture' && /(sell deed|deed sale|collect (funds|payment))/.test(text)) {
    return true
  }
  return false
}
