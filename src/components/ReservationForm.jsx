import { useState } from 'react'
import { formatUsd } from '../data/payLinks'

const empty = {
  name: '',
  email: '',
  phone: '',
  zip: '',
  interestGroup: '',
  product: '',
  refundableAck: false,
}

export default function ReservationForm({
  companyId,
  companyName,
  productName,
  interestGroups,
  accent = '#1a1a1a',
  estimateUsd = null,
  payUrl = '',
}) {
  const [values, setValues] = useState({ ...empty, product: productName })
  const [submitted, setSubmitted] = useState(null)

  function update(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      companyId,
      companyName,
      product: productName,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      zip: values.zip.trim(),
      interestGroup: values.interestGroup,
      reservationType: 'fully_refundable',
      refundable: true,
      paymentCaptured: false,
      amountEstimateUsd: estimateUsd,
      payLinkId: payUrl || null,
      submittedAt: new Date().toISOString(),
      status: 'held_refundable',
    }

    try {
      const key = 'valhalla_reservation_ledger'
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      existing.push(payload)
      localStorage.setItem(key, JSON.stringify(existing))
    } catch {
      // storage may be unavailable
    }

    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // offline / local-only still ok
    }

    setSubmitted(payload)
  }

  if (submitted) {
    return (
      <div className="vh-reserve vh-reserve--done">
        <p className="vh-reserve__eyebrow">Reservation held</p>
        <h3 className="vh-reserve__title">Fully refundable hold confirmed</h3>
        <p className="vh-reserve__body">
          {submitted.product} · {submitted.interestGroup}
          {estimateUsd != null ? ` · est. ${formatUsd(estimateUsd)}` : ''}
        </p>
        <dl className="vh-reserve__receipt">
          <div>
            <dt>Email</dt>
            <dd>{submitted.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{submitted.phone}</dd>
          </div>
          <div>
            <dt>ZIP</dt>
            <dd>{submitted.zip}</dd>
          </div>
        </dl>
        {payUrl ? (
          <p className="vh-reserve__body">
            Optional money hold:{' '}
            <a href={payUrl} target="_blank" rel="noreferrer">
              Squarespace Pay Link
            </a>{' '}
            (fully refundable).
          </p>
        ) : null}
        <p className="vh-reserve__fine">
          This is a fully refundable reservation hold stored for follow-up. You can cancel anytime by
          contacting the hall with this email.
        </p>
      </div>
    )
  }

  return (
    <form className="vh-reserve" onSubmit={handleSubmit}>
      <p className="vh-reserve__eyebrow">Fully refundable reservation</p>
      <h3 className="vh-reserve__title">{productName}</h3>
      <p className="vh-reserve__body">
        Leave phone, ZIP, and email. Choose your interest group. We hold a fully refundable
        reservation
        {estimateUsd != null ? ` (estimated hold ${formatUsd(estimateUsd)})` : ''} — no
        non-refundable deposit on this page.
      </p>

      <div className="vh-reserve__grid">
        <label className="vh-field">
          <span>Full name</span>
          <input
            required
            autoComplete="name"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </label>

        <label className="vh-field">
          <span>Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </label>

        <label className="vh-field">
          <span>Phone</span>
          <input
            required
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="(555) 555-5555"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </label>

        <label className="vh-field">
          <span>ZIP / postal code</span>
          <input
            required
            autoComplete="postal-code"
            inputMode="numeric"
            value={values.zip}
            onChange={(e) => update('zip', e.target.value)}
          />
        </label>

        <label className="vh-field vh-field--full">
          <span>Interest group</span>
          <select
            required
            value={values.interestGroup}
            onChange={(e) => update('interestGroup', e.target.value)}
          >
            <option value="" disabled>
              Select your group…
            </option>
            {interestGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="vh-check">
        <input
          required
          type="checkbox"
          checked={values.refundableAck}
          onChange={(e) => update('refundableAck', e.target.checked)}
        />
        <span>
          I understand this is a <strong>fully refundable</strong> reservation hold. Terms may
          require entity and payment gates before any future deposit.
        </span>
      </label>

      <button type="submit" className="vh-reserve__submit" style={{ backgroundColor: accent }}>
        Hold refundable reservation
      </button>
    </form>
  )
}
