import { Link, Navigate } from 'react-router-dom'
import {
  getCompanyBySlug,
  getNextCompany,
  isSiteLive,
  getSiteLiveTime,
} from '../data/schedule'
import { useNow } from '../hooks/useNow'
import SimpleCountdown from '../components/SimpleCountdown'
import { formatPDT } from '../utils/time'

export default function CompanySitePage({ slug }) {
  const now = useNow()
  const company = getCompanyBySlug(slug)

  if (!company) return <Navigate to="/" replace />

  const live = isSiteLive(company, now)
  const next = getNextCompany(company)
  const nextLive = next ? isSiteLive(next, now) : false
  const nextLaunch = next ? getSiteLiveTime(next) : null

  if (!live) {
    return (
      <div className="min-h-svh bg-white text-black flex flex-col items-center justify-center px-6">
        <p className="text-sm text-black/40 mb-6">{company.name}</p>
        <SimpleCountdown
          targetDate={getSiteLiveTime(company)}
          now={now}
          label={`Opens ${formatPDT(getSiteLiveTime(company))}`}
        />
        <Link to="/" className="mt-12 text-sm text-black/30 hover:text-black/60">
          ← back
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-white text-black">
      <div className="max-w-lg mx-auto px-6 py-16">
        <p className="font-mono text-xs text-black/30 mb-4">
          {String(company.id).padStart(2, '0')} / 12
        </p>

        <h1 className="text-3xl font-medium mb-3">{company.name}</h1>
        <p className="text-black/60 leading-relaxed mb-2">{company.concept}</p>
        <p className="font-mono text-xs text-black/30 mb-12">{company.tag}</p>

        {/* Site content placeholder — build out each company's real page here */}
        <div className="border border-black/10 rounded p-8 mb-16 text-center text-sm text-black/40">
          Your site content goes here.
        </div>

        {/* Chain to next */}
        <div className="border-t border-black/10 pt-8">
          {next ? (
            nextLive ? (
              <Link
                to={`/${next.slug}`}
                className="block text-center font-mono text-sm hover:underline underline-offset-4"
              >
                Continue to {next.name} →
              </Link>
            ) : (
              <SimpleCountdown
                targetDate={nextLaunch}
                now={now}
                label={`Next door opens · ${next.name}`}
              />
            )
          ) : (
            <p className="text-center text-sm text-black/40">
              You&apos;ve reached the end.{' '}
              <Link to="/" className="underline underline-offset-2 hover:text-black">
                View the mosaic
              </Link>
            </p>
          )}
        </div>

        <Link to="/" className="block text-center mt-12 text-sm text-black/30 hover:text-black/60">
          ← hub
        </Link>
      </div>
    </div>
  )
}
