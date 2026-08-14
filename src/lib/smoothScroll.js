/** Shared Lenis handle for non-React callers (menu stop/start, etc.). */
let lenisInstance = null

export function getLenis() {
  return lenisInstance
}

export function setLenis(instance) {
  lenisInstance = instance
}

/**
 * Nested / interactive surfaces that should keep native scroll or pointer control.
 * Root page scroll still uses Lenis; this only opts out specific targets.
 */
export function shouldPreventLenis(node) {
  if (!node || typeof node.closest !== 'function') return false
  if (node.hasAttribute?.('data-lenis-prevent')) return true
  return Boolean(
    node.closest(
      [
        '[data-lenis-prevent]',
        '.vh-web__stage',
        '.wolf-matrix__scroll',
        '.product-matrix__scroll',
        '.vh-ask__msgs',
        '.vh-editor__canvas',
        '.vh-editor__stage',
        'textarea',
        '[contenteditable="true"]',
      ].join(', '),
    ),
  )
}

/** Match Edna Charge: soft lerp + smooth wheel; leave touch native (syncTouch off). */
export const LENIS_OPTIONS = {
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: false,
  touchMultiplier: 1,
  wheelMultiplier: 1,
  autoRaf: true,
  anchors: false,
  allowNestedScroll: true,
}
