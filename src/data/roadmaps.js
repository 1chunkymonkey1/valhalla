/**
 * Product roadmaps — oval/tile sequences that fade into mystery.
 * First item fully opaque; later items progressively lower opacity.
 * Last item is pure mystery (not clickable) where marked.
 */

export const companyRoadmaps = {
  wolf: {
    cascadeNote:
      'Product drop pattern: when Fenrir 02 ships, Hati 01 drops in the same window.',
    items: [
      {
        id: 'fenrir-01',
        name: 'Fenrir 01',
        status: 'complete',
        kind: 'product',
        summary:
          'Adventure motorcycle program — first wolf on the trail. Specs labeled planned until engineering review closes.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'fenrir-02',
        name: 'Fenrir 02',
        status: 'planned',
        kind: 'product',
        summary:
          'Second generation. When Fenrir 02 drops, Hati 01 drops with it.',
        clickable: true,
        capture: 'pay',
        cascadeWith: ['hati-01'],
      },
      {
        id: 'hati-01',
        name: 'Hati 01',
        status: 'planned',
        kind: 'product',
        summary:
          'Tri-fuel intelligent ATV — hydrogen, battery pack, and a conventional dual-infusion engine that accepts any fuel including ethanol.',
        clickable: true,
        capture: 'pay',
        cascadeFrom: 'fenrir-02',
      },
      {
        id: 'skoll-range',
        name: 'Sköll Range',
        status: 'theoretical',
        kind: 'concept',
        summary: 'Long-range pack systems and trail logistics — email capture only.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'bifrost-line',
        name: 'Bifröst Line',
        status: 'vision',
        kind: 'megaproject',
        summary:
          'Transcontinental maglev: San Francisco → New York City. Mythic bridge between coasts.',
        clickable: true,
        capture: 'email',
        detail: {
          timelineYears: 5,
          travelHours: 5.8,
          objectives: [
            'Prove a U.S. high-speed maglev corridor competitive with global peers',
            'Cut coast-to-coast travel toward 5.8 hours door-concept to door-concept',
            'Anchor Wolf mobility into national infrastructure — not only consumer vehicles',
            'Coordinate land, energy, and right-of-way partners under Valhalla governance',
            'Publish transparent milestones; no false operational claims before permits',
          ],
          whyNation:
            'The nation needs a spine that matches the century: freight and people moving at world-class speed so industry, families, and defense logistics stop paying the cost of fragmented rails and saturated skies.',
        },
      },
      {
        id: 'wolf-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  holm: {
    cascadeNote: 'Modules unlock in pairs as site partnerships clear.',
    items: [
      {
        id: 'holm-01',
        name: 'Holm 01',
        status: 'visible',
        kind: 'product',
        summary: 'Core modular dwelling — timber volumes, quiet weather seals.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'holm-02',
        name: 'Holm 02',
        status: 'planned',
        kind: 'product',
        summary: 'Linked double-module for family and studio work.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'holm-commons',
        name: 'Commons Ring',
        status: 'theoretical',
        kind: 'concept',
        summary: 'Shared courtyard / utilities ring — email capture.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'holm-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  demeter: {
    items: [
      {
        id: 'demeter-field',
        name: 'Field Lattice',
        status: 'visible',
        kind: 'product',
        summary: 'Agrivoltaic diligence pathway — soil first.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'demeter-root',
        name: 'Root Net',
        status: 'planned',
        kind: 'concept',
        summary: 'Shared soil-sensor and canopy logic across parcels.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'demeter-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  viking: {
    items: [
      {
        id: 'voyage-01',
        name: 'Voyage 01',
        status: 'visible',
        kind: 'product',
        summary: 'Story-led northern cabin itinerary.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'voyage-02',
        name: 'Voyage 02',
        status: 'planned',
        kind: 'product',
        summary: 'Extended fjord circuit — drops with partner fleet confirmation.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'viking-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  atoll: {
    cascadeNote: 'Atoll 02 unlocks when Atoll 01 reservation cohort fills.',
    items: [
      {
        id: 'atoll-01',
        name: 'Atoll 01',
        status: 'visible',
        kind: 'product',
        summary: 'Floating modular habitat concept.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'atoll-02',
        name: 'Atoll 02',
        status: 'planned',
        kind: 'product',
        summary: 'Second ring — cascades with harbor partnership.',
        clickable: true,
        capture: 'pay',
        cascadeWith: ['atoll-03'],
      },
      {
        id: 'atoll-03',
        name: 'Atoll 03',
        status: 'theoretical',
        kind: 'concept',
        summary: 'Deep-water cluster — email only.',
        clickable: true,
        capture: 'email',
        cascadeFrom: 'atoll-02',
      },
      {
        id: 'atoll-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  njord: {
    items: [
      {
        id: 'njord-brief',
        name: 'Maritime Brief',
        status: 'visible',
        kind: 'product',
        summary: 'OTEC / atmospheric water research queue.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'njord-depth',
        name: 'Depth Array',
        status: 'theoretical',
        kind: 'concept',
        summary: 'Offshore energy lattice — email capture.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'njord-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  eagle: {
    items: [
      {
        id: 'eagle-access',
        name: 'Access Queue',
        status: 'visible',
        kind: 'product',
        summary: 'Aviation access interest — not tickets.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'eagle-corridor',
        name: 'Sky Corridor',
        status: 'theoretical',
        kind: 'concept',
        summary: 'Partner route concepts — email only.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'eagle-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  olympus: {
    items: [
      {
        id: 'olympus-platform',
        name: 'Thin-Air Platform',
        status: 'visible',
        kind: 'product',
        summary: 'Upper-atmosphere habitation research.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'olympus-veil',
        name: 'Veil Lab',
        status: 'theoretical',
        kind: 'concept',
        summary: 'Longer-duration research — email capture.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'olympus-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  aeolus: {
    items: [
      {
        id: 'aeolus-gauge',
        name: 'Wind Gauge',
        status: 'visible',
        kind: 'product',
        summary: 'Climate-atmosphere research governance updates.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'aeolus-field',
        name: 'Field Choir',
        status: 'theoretical',
        kind: 'concept',
        summary: 'Multi-region sensing — email only.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'aeolus-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  phenix: {
    items: [
      {
        id: 'phenix-ascent',
        name: 'Ascent Concept',
        status: 'visible',
        kind: 'product',
        summary: 'Mission-concept workspace for payload inquiry.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'phenix-return',
        name: 'Return Path',
        status: 'planned',
        kind: 'concept',
        summary: 'Recovery architecture studies — email capture.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'phenix-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  aether: {
    items: [
      {
        id: 'aether-room',
        name: 'Quiet Room',
        status: 'visible',
        kind: 'product',
        summary: 'Space habitation concept with legal status disclosed.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'aether-ring',
        name: 'Orbital Ring Study',
        status: 'theoretical',
        kind: 'concept',
        summary: 'Partner research — email only.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'aether-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
  corvus: {
    cascadeNote:
      'Raven OS prompts escalate by phase. Prompt 21 unlocks the Twenty-First Raven badge.',
    items: [
      {
        id: 'raven-os',
        name: 'Raven OS',
        status: 'visible',
        kind: 'product',
        summary: 'Immediate product — 21 prompts with phase-priced holds.',
        clickable: true,
        capture: 'pay',
      },
      {
        id: 'odin-local',
        name: 'Odin Local',
        status: 'planned',
        kind: 'product',
        summary: 'Founder workspace that stays local — cascades after early Raven cohort.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'corvus-mesh',
        name: 'Corvus Mesh',
        status: 'theoretical',
        kind: 'concept',
        summary: 'Intelligence layer across the twelve halls — email only.',
        clickable: true,
        capture: 'email',
      },
      {
        id: 'corvus-mystery',
        name: '—',
        status: 'mystery',
        kind: 'mystery',
        summary: 'Unknown even to them.',
        clickable: false,
        capture: null,
      },
    ],
  },
}

export function getRoadmap(companyId) {
  return companyRoadmaps[companyId] || null
}

/** Opacity for roadmap oval index (0 = fully visible). */
export function roadmapOpacity(index, total) {
  if (total <= 1) return 1
  const t = index / (total - 1)
  return Math.max(0.12, 1 - t * 0.88)
}
