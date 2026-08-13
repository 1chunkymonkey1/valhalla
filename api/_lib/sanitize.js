/** Plain-text hygiene for user-generated notes/tasks. */

export function plainText(input, maxLen = 4000) {
  let s = String(input ?? '')
  // Strip tags if someone pastes HTML
  s = s.replace(/<[^>]*>/g, '')
  // Neutralize common XSS / injection leftovers
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/gu, '')
  s = s.trim()
  if (s.length > maxLen) s = s.slice(0, maxLen)
  return s
}
