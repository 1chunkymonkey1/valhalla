/**
 * Admin-facing AI status payload (credentials present, active provider, models).
 */

import {
  getAiSettings,
  getCredentialFlags,
  isAiConfigured,
  resolveActiveProvider,
} from './aiSettings.js'
import { listCursorModels } from './cursorAi.js'

const GATEWAY_MODELS = [
  { id: 'openai/gpt-5.4-mini', displayName: 'GPT-5.4 Mini (Gateway)' },
  { id: 'openai/gpt-5.4', displayName: 'GPT-5.4 (Gateway)' },
  { id: 'anthropic/claude-sonnet-4.5', displayName: 'Claude Sonnet 4.5 (Gateway)' },
]

export async function buildAiStatus() {
  const flags = getCredentialFlags()
  const settings = await getAiSettings()
  const active = resolveActiveProvider(settings, flags)

  let cursorModels = { models: [], source: 'none' }
  if (flags.cursor) {
    cursorModels = await listCursorModels()
  }

  const ready = Boolean(active.provider)
  let message = 'AI ready'
  if (!isAiConfigured(flags)) {
    message =
      'AI not configured — set CURSOR_API_KEY, AI_GATEWAY_API_KEY, or OPENAI_API_KEY on Vercel (Production + Preview), then redeploy.'
  } else if (!ready) {
    message = active.reason || 'Selected provider is missing credentials'
  } else if (active.provider === 'cursor') {
    message =
      'Cursor cloud agent ready (no-repo). Replies can take longer than Gateway/OpenAI; raise function maxDuration on Pro if needed.'
  }

  return {
    ok: true,
    configured: isAiConfigured(flags),
    ready,
    message,
    credentials: {
      cursor: flags.cursor ? 'set' : 'missing',
      gateway: flags.gateway ? 'set' : 'missing',
      openai: flags.openai ? 'set' : 'missing',
      supabase: flags.supabase ? 'set' : 'missing',
    },
    settings: {
      provider: settings.provider,
      cursorModel: settings.cursorModel,
      chatModel: settings.chatModel,
      storage: settings.storage,
      updatedAt: settings.updatedAt,
      updatedBy: settings.updatedBy,
    },
    active: {
      provider: active.provider,
      model: active.model,
      label: active.label,
      reason: active.reason || '',
    },
    models: {
      cursor: cursorModels.models,
      cursorSource: cursorModels.source,
      cursorError: cursorModels.error || '',
      gateway: GATEWAY_MODELS,
    },
    envHints: {
      CURSOR_API_KEY: 'cursor.com → Dashboard → API Keys (or team service account)',
      AI_GATEWAY_API_KEY: 'Vercel → AI Gateway',
      OPENAI_API_KEY: 'OpenAI platform key (fallback)',
      VH_CURSOR_MODEL: 'Optional default Cursor model id',
      VH_CHAT_MODEL: 'Optional default Gateway/OpenAI model id',
      SUPABASE_URL: 'Required for durable threads + AI settings',
      SUPABASE_SERVICE_ROLE_KEY: 'Required with SUPABASE_URL',
    },
  }
}
