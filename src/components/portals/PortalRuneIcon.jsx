/** Subtle SVG marks for hub social row — one distinct symbol per portal. */

export function PerthroMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 3 V21 M7 3 H14 C17.5 3 19.5 5.2 19.5 8.2 C19.5 11.2 17.5 13.5 14 13.5 H7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

export function AnsuzMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 21 V3 M7 5 L17 10 M7 11 L17 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

/** Seshat emblem: crescent over seven-pointed star */
export function SeshatStarMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5.5 8 C7.5 5.2 9.6 4 12 4 C14.4 4 16.5 5.2 18.5 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <polygon
        points="12,9 12.85,11.4 15.5,11.4 13.35,12.9 14.2,15.3 12,13.7 9.8,15.3 10.65,12.9 8.5,11.4 11.15,11.4"
        fill="currentColor"
      />
    </svg>
  )
}

export function RaidhoMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 3 V21 M7 3 H14.5 C17.2 3 18.8 5 18.8 7.4 C18.8 9.5 17.4 11.2 15 11.6 L19 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

export function DagazMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4.5 4 L12 12 L4.5 20 M19.5 4 L12 12 L19.5 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

/** Orca dorsal fin */
export function OrcaFinMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5 19 C8 17 10 12 11.2 7.5 C12.2 4.2 14.5 3.2 17.5 4.5 C14.8 7.2 13.2 11.5 12.4 15.5 C11.8 18.2 10.2 19.5 7.5 20.2 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function PsiMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 3 V21 M12 8 C8.5 8 6.5 10.2 6.5 13.5 V16.5 M12 8 C15.5 8 17.5 10.2 17.5 13.5 V16.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MARKS = {
  perthro: PerthroMark,
  ansuz: AnsuzMark,
  'seshat-star': SeshatStarMark,
  raidho: RaidhoMark,
  dagaz: DagazMark,
  orca: OrcaFinMark,
  psi: PsiMark,
}

export default function PortalRuneIcon({ rune }) {
  const Comp = MARKS[rune] || PerthroMark
  return <Comp />
}
