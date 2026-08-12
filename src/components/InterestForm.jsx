import { useState } from 'react'

export default function InterestForm({ title, hint, fields, interestOptions, accent }) {
  const [submitted, setSubmitted] = useState(false)
  const [values, setValues] = useState({})

  function update(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Client-side ledger only until CRM/backend gates pass
    const payload = {
      ...values,
      submittedAt: new Date().toISOString(),
      claim_status: 'proposed',
    }
    try {
      const key = 'valhalla_interest_ledger'
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      existing.push(payload)
      localStorage.setItem(key, JSON.stringify(existing))
    } catch {
      // ignore storage failures
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="border border-current/15 p-6 text-sm">
        <p className="font-medium mb-1">Received.</p>
        <p className="opacity-60">
          Interest recorded locally for this browser. CRM sync ships after privacy and consent gates.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border border-current/15 p-6 space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        {hint && <p className="text-sm opacity-55">{hint}</p>}
      </div>

      {fields.includes('name') && (
        <label className="block text-sm">
          <span className="opacity-55">Name</span>
          <input
            required
            className="mt-1 w-full bg-transparent border-b border-current/20 py-2 outline-none focus:border-current/50"
            value={values.name || ''}
            onChange={(e) => update('name', e.target.value)}
          />
        </label>
      )}

      {fields.includes('email') && (
        <label className="block text-sm">
          <span className="opacity-55">Email</span>
          <input
            required
            type="email"
            className="mt-1 w-full bg-transparent border-b border-current/20 py-2 outline-none focus:border-current/50"
            value={values.email || ''}
            onChange={(e) => update('email', e.target.value)}
          />
        </label>
      )}

      {fields.includes('organization') && (
        <label className="block text-sm">
          <span className="opacity-55">Organization</span>
          <input
            className="mt-1 w-full bg-transparent border-b border-current/20 py-2 outline-none focus:border-current/50"
            value={values.organization || ''}
            onChange={(e) => update('organization', e.target.value)}
          />
        </label>
      )}

      {fields.includes('location') && (
        <label className="block text-sm">
          <span className="opacity-55">Site location (city / region)</span>
          <input
            className="mt-1 w-full bg-transparent border-b border-current/20 py-2 outline-none focus:border-current/50"
            value={values.location || ''}
            onChange={(e) => update('location', e.target.value)}
          />
        </label>
      )}

      {fields.includes('interest') && interestOptions && (
        <label className="block text-sm">
          <span className="opacity-55">Interest</span>
          <select
            required
            className="mt-1 w-full bg-transparent border-b border-current/20 py-2 outline-none focus:border-current/50"
            value={values.interest || ''}
            onChange={(e) => update('interest', e.target.value)}
          >
            <option value="" disabled>
              Select…
            </option>
            {interestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      )}

      <button
        type="submit"
        className="mt-2 w-full py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-90"
        style={{ backgroundColor: accent, color: '#fff' }}
      >
        Submit interest
      </button>

      <p className="text-[11px] opacity-40 leading-relaxed">
        No payment. No operational claim. Consent-scoped contact only.
      </p>
    </form>
  )
}
