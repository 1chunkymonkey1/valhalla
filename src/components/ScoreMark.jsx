/** Quiet staff mark for music cards. Decorative only. Not a player. */
export default function ScoreMark() {
  return (
    <svg className="cs-garment" viewBox="0 0 64 64" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        d="M12 22h40M12 30h40M12 38h40M12 46h40"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        d="M40 18v28a6 6 0 1 1-2-4.5"
      />
    </svg>
  )
}
