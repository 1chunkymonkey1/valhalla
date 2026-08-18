import { useEffect, useState } from 'react'

const EXTS = ['png', 'jpg', 'jpeg', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP', 'svg']

/**
 * Loads an original CASURF asset by stem (no extension).
 * Does not crop, filter, or rewrite the file — browsers display the bytes as-is.
 */
export default function CasurfPhoto({
  stem,
  alt,
  className,
  comingSoon = false,
  comingSoonLabel = 'Photo coming soon!',
  preferSvg = false,
}) {
  const exts = preferSvg ? ['svg', ...EXTS.filter((x) => x !== 'svg')] : EXTS
  const [extIndex, setExtIndex] = useState(0)

  useEffect(() => {
    setExtIndex(0)
  }, [stem])

  if (comingSoon || !stem) {
    return (
      <div className={`cs-photo cs-photo--soon ${className || ''}`} role="img" aria-label={comingSoonLabel}>
        <span>{comingSoonLabel}</span>
      </div>
    )
  }

  if (extIndex >= exts.length) {
    return (
      <div className={`cs-photo cs-photo--missing ${className || ''}`} role="img" aria-label={alt}>
        <span>{alt}</span>
      </div>
    )
  }

  return (
    <img
      className={`cs-photo ${className || ''}`}
      src={`${stem}.${exts[extIndex]}`}
      alt={alt}
      onError={() => setExtIndex((i) => i + 1)}
    />
  )
}
