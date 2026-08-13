/** Client-side page editor constants (mirrors api/_lib/pageLayouts.js). */

export const PAGE_IDS = [
  'hub',
  'wolf',
  'viking',
  'eagle',
  'phenix',
  'holm',
  'atoll',
  'olympus',
  'aether',
  'demeter',
  'njord',
  'aeolus',
  'corvus',
]

export const PAGE_LABELS = {
  hub: 'Hub',
  wolf: 'Wolf',
  viking: 'Viking',
  eagle: 'Eagle',
  phenix: 'Phenix',
  holm: 'Holm',
  atoll: 'Atoll',
  olympus: 'Olympus',
  aether: 'Aether',
  demeter: 'Demeter',
  njord: 'Njord',
  aeolus: 'Aeolus',
  corvus: 'Corvus',
}

export const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero text' },
  { type: 'text', label: 'Body text' },
  { type: 'image', label: 'Image' },
  { type: 'spacer', label: 'Spacer' },
  { type: 'cta', label: 'CTA button' },
]

export const FONT_FAMILIES = [
  'Fraunces, Georgia, serif',
  'Sora, system-ui, sans-serif',
  'Literata, Georgia, serif',
  'Syne, system-ui, sans-serif',
  'IBM Plex Mono, ui-monospace, monospace',
]

export const SNAP = 8

export function snap(n, grid = SNAP) {
  const v = Number(n)
  if (!Number.isFinite(v)) return 0
  return Math.round(v / grid) * grid
}

export function emptyLayout() {
  return {
    version: 1,
    enabled: false,
    grid: SNAP,
    canvasHeight: 720,
    blocks: [],
  }
}

export function newBlock(type, index = 0) {
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `b_${Date.now()}_${index}`
  const base = {
    id,
    type,
    x: 24,
    y: snap(48 + index * 96),
    w: type === 'cta' ? 200 : 640,
    h: type === 'spacer' ? 40 : type === 'hero' ? 120 : type === 'image' ? 280 : 80,
    content:
      type === 'hero'
        ? 'Headline'
        : type === 'text'
          ? 'Body copy'
          : type === 'cta'
            ? 'Learn more'
            : '',
    href: type === 'cta' ? '/' : '',
    src: '',
    alt: '',
    style: {
      fontFamily: FONT_FAMILIES[type === 'hero' ? 0 : 1],
      fontSize: type === 'hero' ? 48 : type === 'cta' ? 16 : 18,
      color: '#1a1a1a',
      align: type === 'hero' || type === 'cta' ? 'center' : 'left',
      fontWeight: type === 'hero' ? '600' : '500',
    },
  }
  return base
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}
