import { Link, useLocation } from 'react-router-dom'

const DOCS = {
  privacy: {
    title: 'Privacy',
    body: [
      'Aphrodite is an 18+ competition dating product in the Valhalla ecosystem. This page is the privacy notice for App Store and web.',
      'We collect the account you create (email or social login), profile fields you enter (name, bio, birth date, competition handles), swipes, matches, messages, blocks, reports, and membership status.',
      'Payments: web membership is billed by Stripe. The iOS App Store binary bills through Apple. We store subscription status and processor identifiers, not full card numbers.',
      'Auth and data sit on Supabase. We do not sell member lists. We keep safety reports to review abuse. You can deactivate your account in Settings, which hides you from the deck.',
      'Contact for this notice: use the in-app Report flow or the Valhalla contact page. We do not invent a staffed safety inbox that is not live.',
    ],
  },
  terms: {
    title: 'Terms',
    body: [
      'Aphrodite is membership dating for competitors 18 and older. Price is $20 per month. Web checkout is Stripe. iOS App Store checkout is Apple In-App Purchase (product aphrodite_monthly).',
      'You must be 18. You must not impersonate, harass, spam, or solicit minors. We may deactivate accounts that break these rules.',
      'A match is not a promise. Aphrodite does not run background checks in this version. Meet in public. Block and report when something is wrong.',
      'Membership is not a hall of Valhalla and is not an investment. No revenue, user counts, or App Store ranking claims are made here.',
    ],
  },
  safety: {
    title: 'Safety',
    body: [
      'Aphrodite is 18+. Birth date is required before the deck opens. Underage reports are reviewed.',
      'Every card and every thread has Block and Report. Block removes the pair from deck, matches, and messages. Report reasons: harassment, fake profile, under 18, spam, other.',
      'Do not share financial details or off-platform payment requests from people you just matched. Meet in public if you meet at all.',
      'If someone is in immediate danger, contact local emergency services. The in-app report is not a 911 substitute.',
    ],
  },
}

export default function AphroditeLegalPage() {
  const { pathname } = useLocation()
  const key = pathname.split('/').pop()
  const doc = DOCS[key] || DOCS.safety

  return (
    <article className="aph-legal">
      <p className="aph-hero__eyebrow">Aphrodite · 18+</p>
      <h1>{doc.title}</h1>
      {doc.body.map((p) => (
        <p key={p.slice(0, 48)}>{p}</p>
      ))}
      <p className="aph-fine">
        <Link to="/aphrodite/privacy">Privacy</Link>
        {' · '}
        <Link to="/aphrodite/terms">Terms</Link>
        {' · '}
        <Link to="/aphrodite/safety">Safety</Link>
        {' · '}
        <Link to="/aphrodite">Home</Link>
      </p>
    </article>
  )
}
