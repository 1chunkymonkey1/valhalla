/** Quiet garment silhouette for merch cards. Decorative only. */
export default function GarmentMark({ piece = 'shirt' }) {
  if (piece === 'jacket') {
    return (
      <svg className="cs-garment" viewBox="0 0 64 64" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          d="M18 14 8 22v30h14V36h20v16h14V22L46 14 32 20 18 14z"
        />
      </svg>
    )
  }
  if (piece === 'pants') {
    return (
      <svg className="cs-garment" viewBox="0 0 64 64" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          d="M20 10h24l2 8-8 36h-5l-5-28-5 28h-5L18 18z"
        />
      </svg>
    )
  }
  return (
    <svg className="cs-garment" viewBox="0 0 64 64" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        d="M22 16 12 22v8h8v24h24V30h8v-8L42 16 32 20 22 16z"
      />
    </svg>
  )
}
