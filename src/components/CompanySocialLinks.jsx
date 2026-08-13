const LABELS = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  x: 'X',
  discord: 'Discord',
}

export default function CompanySocialLinks({ social, className = '' }) {
  if (!social) return null
  const links = ['linkedin', 'instagram', 'x', 'discord']
    .map((key) => ({ key, href: social[key], label: LABELS[key] }))
    .filter((l) => l.href)

  if (!links.length) return null

  return (
    <ul className={`vh-socials ${className}`.trim()}>
      {links.map((l) => (
        <li key={l.key}>
          <a href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
