import { json, requireTeam } from '../_lib/auth.js'
import { isSupabaseConfigured } from '../_lib/supabase.js'
import { listReservations, listSignups } from '../_lib/store.js'
import {
  hallAccessFor,
  listNotes,
  listTasks,
  ROLES,
  getUserByEmail,
} from '../_lib/empireStore.js'

const HALL_META = {
  wolf: { name: 'Wolf', domain: 'land', pillar: 'movement' },
  viking: { name: 'Viking', domain: 'water', pillar: 'movement' },
  eagle: { name: 'Eagle', domain: 'air', pillar: 'movement' },
  phenix: { name: 'Phenix', domain: 'space', pillar: 'movement' },
  holm: { name: 'Holm', domain: 'land', pillar: 'habitation' },
  atoll: { name: 'Atoll', domain: 'water', pillar: 'habitation' },
  olympus: { name: 'Olympus', domain: 'air', pillar: 'habitation' },
  aether: { name: 'Aether', domain: 'space', pillar: 'habitation' },
  demeter: { name: 'Demeter', domain: 'land', pillar: 'energy' },
  njord: { name: 'Njord', domain: 'water', pillar: 'energy' },
  aeolus: { name: 'Aeolus', domain: 'air', pillar: 'energy' },
  corvus: { name: 'Corvus', domain: 'space', pillar: 'energy' },
}

export default async function handler(req, res) {
  const session = requireTeam(req, res)
  if (!session) return
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  try {
    const user = await getUserByEmail(session.email)
    if (!user) return json(res, 401, { ok: false, error: 'Unauthorized' })

    const halls = hallAccessFor(user)
    const [tasks, reservations, signups] = await Promise.all([
      listTasks({ email: user.email, halls, role: user.role }),
      listReservations(),
      listSignups(),
    ])

    const notesNested = await Promise.all(halls.map((h) => listNotes(h)))
    const notes = notesNested.flat().slice(0, 40)

    const scopedReservations = reservations.filter(
      (r) => !r.companyId || halls.includes(r.companyId),
    )

    return json(res, 200, {
      ok: true,
      storage: isSupabaseConfigured() ? 'supabase' : 'memory',
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        roleLabel: ROLES[user.role]?.label,
        roleBlurb: ROLES[user.role]?.blurb,
        halls,
      },
      halls: halls.map((id) => ({
        id,
        ...HALL_META[id],
        openTasks: tasks.filter((t) => t.hall === id && t.status !== 'done').length,
        reservations: scopedReservations.filter((r) => r.companyId === id).length,
        notes: notes.filter((n) => n.hall === id).length,
      })),
      tasks: tasks.slice(0, 80),
      notes: notes.slice(0, 40),
      reservations: scopedReservations.slice(0, 80),
      signups: signups.slice(0, 80),
      guides: [
        {
          title: 'How team login works',
          body: 'You receive an invite link from the founder. Set your password once, then sign in at /team with email + password. No authenticator required for team seats.',
        },
        {
          title: 'Your halls',
          body: 'Each company is a hall. Open a hall to manage notes, tasks, and the refundable interest flowing into that company.',
        },
        {
          title: 'Founder control tower',
          body: 'Only info@valhallaco.org uses /admin with password + 2FA. That view watches people, ledgers, and activity across the empire.',
        },
      ],
    })
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message || 'Workspace error' })
  }
}
