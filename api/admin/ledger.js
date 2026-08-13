import { json, readBody, requireAdmin } from '../_lib/auth.js'
import { isSupabaseConfigured } from '../_lib/supabase.js'
import {
  importReservations,
  listReservations,
  listSignups,
} from '../_lib/store.js'

const COMPANY_SUMMARY = [
  { id: 'wolf', name: 'Wolf', domain: 'land', pillar: 'movement', wave: 1 },
  { id: 'viking', name: 'Viking', domain: 'water', pillar: 'movement', wave: 1 },
  { id: 'eagle', name: 'Eagle', domain: 'air', pillar: 'movement', wave: 2 },
  { id: 'phenix', name: 'Phenix', domain: 'space', pillar: 'movement', wave: 2 },
  { id: 'holm', name: 'Holm', domain: 'land', pillar: 'habitation', wave: 1 },
  { id: 'atoll', name: 'Atoll', domain: 'water', pillar: 'habitation', wave: 1 },
  { id: 'olympus', name: 'Olympus', domain: 'air', pillar: 'habitation', wave: 2 },
  { id: 'aether', name: 'Aether', domain: 'space', pillar: 'habitation', wave: 2 },
  { id: 'demeter', name: 'Demeter', domain: 'land', pillar: 'energy', wave: 1 },
  { id: 'njord', name: 'Njord', domain: 'water', pillar: 'energy', wave: 1 },
  { id: 'aeolus', name: 'Aeolus', domain: 'air', pillar: 'energy', wave: 2 },
  { id: 'corvus', name: 'Corvus', domain: 'space', pillar: 'energy', wave: 2 },
]

export default async function handler(req, res) {
  const session = requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    try {
      const [signups, reservations] = await Promise.all([listSignups(), listReservations()])
      const supabase = isSupabaseConfigured()
      return json(res, 200, {
        ok: true,
        email: session.email,
        signups,
        reservations,
        companies: COMPANY_SUMMARY,
        storage: supabase ? 'supabase' : 'memory',
        note: supabase
          ? 'Durable storage via Supabase.'
          : 'Memory fallback — set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY for durable empire data.',
      })
    } catch (err) {
      return json(res, 500, { ok: false, error: err.message || 'Storage error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req)
      const rows = body.reservations || body.ledger || []
      const imported = await importReservations(rows)
      return json(res, 200, { ok: true, imported })
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message || 'Bad request' })
    }
  }

  return json(res, 405, { ok: false, error: 'Method not allowed' })
}
