/**
 * Cursor Agent API provider for Council + hall Ask.
 *
 * Uses @cursor/sdk cloud no-repo agents (works on Vercel serverless; local
 * runtime needs a machine cwd and is not used here). Falls back to Cloud
 * Agents REST if the SDK import/run fails.
 *
 * Auth: CURSOR_API_KEY (user or service-account key from cursor.com dashboard).
 */

const CURSOR_API = 'https://api.cursor.com/v1'
const FALLBACK_MODELS = [
  { id: 'composer-2.5', displayName: 'Composer 2.5' },
  { id: 'auto', displayName: 'Auto' },
]

function apiKey() {
  return String(process.env.CURSOR_API_KEY || '').trim()
}

export function isCursorConfigured() {
  return Boolean(apiKey())
}

function authHeaders() {
  const key = apiKey()
  const basic = Buffer.from(`${key}:`).toString('base64')
  return {
    Authorization: `Basic ${basic}`,
    'Content-Type': 'application/json',
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * One-shot text generation via Cursor cloud agent (no repo).
 * @returns {{ text: string, model: string, runtime: string, agentId?: string, runId?: string }}
 */
export async function generateCursorText({ system = '', prompt = '', modelId = 'composer-2.5' }) {
  const key = apiKey()
  if (!key) {
    throw new Error('CURSOR_API_KEY is not set')
  }

  const message = [
    system ? `System instructions:\n${system}` : '',
    'You are answering in a chat product. Reply in plain text only. No tools, no file edits, no repo work.',
    prompt ? `User / task:\n${prompt}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  const model = { id: String(modelId || 'composer-2.5').trim() || 'composer-2.5' }

  try {
    return await generateViaSdk({ message, model, apiKey: key })
  } catch (sdkErr) {
    try {
      return await generateViaRest({ message, model, apiKey: key })
    } catch (restErr) {
      const msg = [
        sdkErr?.message ? `SDK: ${sdkErr.message}` : '',
        restErr?.message ? `REST: ${restErr.message}` : '',
      ]
        .filter(Boolean)
        .join(' · ')
      throw new Error(msg || 'Cursor generation failed')
    }
  }
}

async function generateViaSdk({ message, model, apiKey }) {
  const { Agent } = await import('@cursor/sdk')
  const result = await Agent.prompt(message, {
    apiKey,
    model,
    // Explicit cloud + empty repos: required on serverless (no local cwd/executor).
    cloud: { repos: [] },
  })

  if (result?.status === 'error') {
    throw new Error(`Cursor run error (${result.id || 'unknown'})`)
  }

  const text = String(result?.result || '').trim()
  if (!text) {
    throw new Error('Cursor returned empty result')
  }

  return {
    text,
    model: `cursor:${model.id}`,
    runtime: 'sdk-cloud',
    agentId: result?.agentId || '',
    runId: result?.id || '',
  }
}

async function generateViaRest({ message, model }) {
  const createRes = await fetch(`${CURSOR_API}/agents`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      prompt: { text: message },
      model,
      // Omit repos → no-repo cloud agent
    }),
  })
  const createBody = await createRes.json().catch(() => ({}))
  if (!createRes.ok) {
    throw new Error(createBody?.message || createBody?.error || `create ${createRes.status}`)
  }

  const agentId = createBody?.agent?.id || createBody?.id
  const runId = createBody?.run?.id || createBody?.agent?.latestRunId
  if (!agentId || !runId) {
    throw new Error('Cursor create response missing agent/run id')
  }

  const deadline = Date.now() + 55_000
  let lastStatus = createBody?.run?.status || 'CREATING'

  while (Date.now() < deadline) {
    await sleep(1500)
    const runRes = await fetch(`${CURSOR_API}/agents/${encodeURIComponent(agentId)}/runs/${encodeURIComponent(runId)}`, {
      headers: authHeaders(),
    })
    const run = await runRes.json().catch(() => ({}))
    if (!runRes.ok) {
      throw new Error(run?.message || run?.error || `poll ${runRes.status}`)
    }
    lastStatus = run.status || lastStatus
    if (lastStatus === 'FINISHED') {
      const text = String(run.result || '').trim()
      if (!text) throw new Error('Cursor REST finished with empty result')
      return {
        text,
        model: `cursor:${model.id}`,
        runtime: 'rest-cloud',
        agentId,
        runId,
      }
    }
    if (lastStatus === 'FAILED' || lastStatus === 'CANCELLED' || lastStatus === 'ERROR') {
      throw new Error(`Cursor run ${lastStatus}`)
    }
  }

  throw new Error(`Cursor run timed out (last status ${lastStatus})`)
}

/**
 * List models available to this CURSOR_API_KEY.
 */
export async function listCursorModels() {
  const key = apiKey()
  if (!key) {
    return { models: FALLBACK_MODELS, source: 'fallback', error: 'CURSOR_API_KEY missing' }
  }

  try {
    const { Cursor } = await import('@cursor/sdk')
    const listed = await Cursor.models.list({ apiKey: key })
    const models = normalizeModelList(listed)
    if (models.length) return { models, source: 'sdk' }
  } catch {
    // fall through to REST
  }

  try {
    const res = await fetch(`${CURSOR_API}/models`, { headers: authHeaders() })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        models: FALLBACK_MODELS,
        source: 'fallback',
        error: body?.message || body?.error || `models ${res.status}`,
      }
    }
    const models = normalizeModelList(body?.items || body?.models || body)
    return { models: models.length ? models : FALLBACK_MODELS, source: 'rest' }
  } catch (err) {
    return {
      models: FALLBACK_MODELS,
      source: 'fallback',
      error: err?.message || 'model list failed',
    }
  }
}

function normalizeModelList(raw) {
  const arr = Array.isArray(raw) ? raw : []
  return arr
    .map((m) => {
      if (typeof m === 'string') return { id: m, displayName: m }
      const id = m?.id || m?.modelId || m?.name
      if (!id) return null
      return {
        id: String(id),
        displayName: String(m.displayName || m.name || id),
      }
    })
    .filter(Boolean)
}
