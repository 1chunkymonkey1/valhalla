/**
 * Renders a published layout from /api/hub/page when enabled + has blocks.
 * Used by company sites and optional hub band.
 */

export default function PublishedBlocks({ layout, className = '' }) {
  if (!layout?.enabled || !layout.blocks?.length) return null

  const height = Math.max(120, Number(layout.canvasHeight) || 720)
  const sorted = [...layout.blocks].sort((a, b) => a.y - b.y || a.x - b.x)

  return (
    <div
      className={`vh-pub ${className}`.trim()}
      style={{ minHeight: height }}
      data-page-layout="published"
    >
      {sorted.map((block) => (
        <PublishedBlock key={block.id} block={block} />
      ))}
    </div>
  )
}

function PublishedBlock({ block }) {
  const style = {
    left: block.x,
    top: block.y,
    width: block.w,
    minHeight: block.h,
    fontFamily: block.style?.fontFamily,
    fontSize: block.style?.fontSize,
    color: block.style?.color,
    textAlign: block.style?.align || 'left',
    fontWeight: block.style?.fontWeight || '500',
  }

  if (block.type === 'spacer') {
    return <div className="vh-pub__block vh-pub__spacer" style={style} aria-hidden />
  }

  if (block.type === 'image') {
    if (!block.src) return null
    return (
      <figure className="vh-pub__block vh-pub__image" style={style}>
        <img src={block.src} alt={block.alt || ''} loading="lazy" />
      </figure>
    )
  }

  if (block.type === 'cta') {
    const href = block.href || '#'
    return (
      <a className="vh-pub__block vh-pub__cta" href={href} style={style}>
        {block.content || 'Continue'}
      </a>
    )
  }

  const Tag = block.type === 'hero' ? 'h1' : 'p'
  return (
    <Tag
      className={`vh-pub__block vh-pub__${block.type === 'hero' ? 'hero' : 'text'}`}
      style={style}
    >
      {block.content}
    </Tag>
  )
}

/** Fetch published layout; returns null when none / disabled. */
export async function fetchPublishedLayout(pageId) {
  try {
    const res = await fetch(`/api/hub/page?id=${encodeURIComponent(pageId)}`)
    if (!res.ok) return null
    const data = await res.json()
    return data?.page?.layout || null
  } catch {
    return null
  }
}
