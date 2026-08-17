export default function PrometheusMark({ size = 56, uid = 'a' }) {
  const s = `pm-${uid}`
  const height = Math.round(size * 1.18)

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 100 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${s}-sh`} x1="50" y1="2" x2="50" y2="116" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E1C16" />
          <stop offset="100%" stopColor="#0A0A08" />
        </linearGradient>
        <linearGradient id={`${s}-bd`} x1="0" y1="0" x2="100" y2="118" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5C842" />
          <stop offset="55%" stopColor="#C89B0A" />
          <stop offset="100%" stopColor="#7A6008" />
        </linearGradient>
        <linearGradient id={`${s}-fo`} x1="50" y1="28" x2="50" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE54C" />
          <stop offset="45%" stopColor="#FF6B1A" />
          <stop offset="100%" stopColor="#BB2808" />
        </linearGradient>
        <linearGradient id={`${s}-fi`} x1="50" y1="42" x2="50" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#FFE54C" />
          <stop offset="100%" stopColor="#FF8B1A" />
        </linearGradient>
      </defs>
      <path
        d="M50 4 L92 22 L92 64 C92 88 72 106 50 114 C28 106 8 88 8 64 L8 22 Z"
        fill={`url(#${s}-sh)`}
        stroke={`url(#${s}-bd)`}
        strokeWidth="1.5"
      />
      <path
        d="M50 28 C50 28 40 40 38 52 C36 64 43 70 43 70 C43 70 39 61 45 54 C45 54 41 65 50 74 C59 65 55 54 55 54 C61 61 57 70 57 70 C57 70 64 64 62 52 C60 40 50 28 50 28Z"
        fill={`url(#${s}-fo)`}
      />
      <path
        d="M50 44 C50 44 46 51 46 58 C46 64 48 68 50 70 C52 68 54 64 54 58 C54 51 50 44 50 44Z"
        fill={`url(#${s}-fi)`}
      />
    </svg>
  )
}
