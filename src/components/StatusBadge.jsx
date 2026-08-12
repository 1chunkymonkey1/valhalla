import { STATUS_LABELS } from '../data/companyCopy'

export default function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-current/60">
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" aria-hidden />
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
