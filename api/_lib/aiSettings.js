/**
 * Durable AI provider prefs for Council + hall Ask.
 * Supabase when configured; otherwise process memory (same-instance only).
 */

import { getSupabase, isSupabaseConfigured } from './supabase.js'

export const AI_PROVIDERS = ['auto', 'cursor', 'gateway', 'openai']

const DEFAULTS = {
  provider: 'auto',
  cursorModel: process.env.VH_CURSOR_MODEL || 'composer-2.5',
  chatModel: process.env.VH_CHAT_MODEL || 'openai/gpt-5.4-mini',
}

let memory = { ...DEFAULTS, updatedAt: null, updatedBy: '', storage: 'memory' }

function normalizeProvider(value) {
  const p = String(value || 'auto').trim().toLowerCase()
  return AI_PROVIDERS.includes(p) ? p : 'auto'
}

function normalizeModel(value, fallback) {
  const m = String(value || '').trim()
  return m || fallback
}

function rowToSettings(row) {
  return {
    provider: normalizeProvider(row?.provider ?? row?.Provider),
    cursorModel: normalizeModel(row?.cursor_model ?? row?.cursorModel, DEFAULTS.cursorModel),
    chatModel: normalizeModel(row?.chat_model ?? row?.chatModel, DEFAULTS.chatModel),
    updatedAt: row?.updated_at || row?.updatedAt || null,
    updatedBy: row?.updated_by || row?.updatedBy || '',
  }
}

export async function getAiSettings() {
  if (!isSupabaseConfigured()) {
    return { ...memory, storage: 'memory' }
  }
  const sb = getSupabase()
  const { data, error } = await sb.from('ai_settings').select('*').eq('id', 'default').maybeSingle()
  if (error) {
    return { ...memory, storage: 'memory', note: error.message }
  }
  if (!data) {
    return { ...DEFAULTS, updatedAt: null, updatedBy: '', storage: 'supabase' }
  }
  return { ...rowToSettings(data), storage: 'supabase' }
}

export async function setAiSettings(patch = {}, actor = '') {
  const current = await getAiSettings()
  const next = {
    provider: normalizeProvider(patch.provider ?? current.provider),
    cursorModel: normalizeModel(patch.cursorModel ?? patch.cursor_model, current.cursorModel),
    chatModel: normalizeModel(patch.chatModel ?? patch.chat_model, current.chatModel),
    updatedAt: new Date().toISOString(),
    updatedBy: String(actor || '').slice(0, 200),
  }

  if (!isSupabaseConfigured()) {
    memory = { ...next, storage: 'memory' }
    return memory
  }

  const sb = getSupabase()
  const payload = {
    id: 'default',
    provider: next.provider,
    cursor_model: next.cursorModel,
    chat_model: next.chatModel,
    updated_at: next.updatedAt,
    updated_by: next.updatedBy,
  }
  const { data, error } = await sb.from('ai_settings').upsert(payload, { onConflict: 'id' }).select('*').maybeSingle()
  if (error) {
    throw new Error(error.message || 'Failed to save AI settings')
  }
  return { ...rowToSettings(data || payload), storage: 'supabase' }
}

export function getCredentialFlags() {
  return {
    cursor: Boolean(process.env.CURSOR_API_KEY),
    gateway: Boolean(
      process.env.AI_GATEWAY_API_KEY || (process.env.VERCEL && process.env.VERCEL_OIDC_TOKEN),
    ),
    openai: Boolean(process.env.OPENAI_API_KEY),
    supabase: isSupabaseConfigured(),
  }
}

/**
 * Resolve which provider to call for a generation.
 * Order when provider=auto: Cursor (key + model) → Gateway → OpenAI.
 */
export function resolveActiveProvider(settings, flags = getCredentialFlags()) {
  const preference = normalizeProvider(settings?.provider)
  const cursorModel = normalizeModel(settings?.cursorModel, DEFAULTS.cursorModel)
  const chatModel = normalizeModel(settings?.chatModel, DEFAULTS.chatModel)

  const tryCursor = () => {
    if (flags.cursor && cursorModel) {
      return { provider: 'cursor', model: cursorModel, label: `cursor:${cursorModel}` }
    }
    return null
  }
  const tryGateway = () => {
    if (flags.gateway) {
      return { provider: 'gateway', model: chatModel, label: chatModel }
    }
    return null
  }
  const tryOpenai = () => {
    if (flags.openai) {
      const bare = chatModel.includes('/') ? chatModel.split('/').slice(1).join('/') : chatModel
      return { provider: 'openai', model: bare, label: `openai:${bare}`, chatModel }
    }
    return null
  }

  if (preference === 'cursor') {
    return tryCursor() || { provider: null, model: '', label: '', reason: 'CURSOR_API_KEY missing' }
  }
  if (preference === 'gateway') {
    return tryGateway() || { provider: null, model: '', label: '', reason: 'AI Gateway / OIDC missing' }
  }
  if (preference === 'openai') {
    return tryOpenai() || { provider: null, model: '', label: '', reason: 'OPENAI_API_KEY missing' }
  }

  return (
    tryCursor() ||
    tryGateway() ||
    tryOpenai() || { provider: null, model: '', label: '', reason: 'No AI credentials configured' }
  )
}

export function isAiConfigured(flags = getCredentialFlags()) {
  return Boolean(flags.cursor || flags.gateway || flags.openai)
}

/** Ordered providers to try for this settings preference (for fallbacks). */
export function resolveProviderChain(settings, flags = getCredentialFlags()) {
  const preference = normalizeProvider(settings?.provider)
  const primary = resolveActiveProvider(settings, flags)
  if (preference !== 'auto' || !primary.provider) {
    return primary.provider ? [primary] : []
  }

  const chain = [primary]
  const seen = new Set([primary.provider])
  for (const nextPreference of ['gateway', 'openai']) {
    const next = resolveActiveProvider({ ...settings, provider: nextPreference }, flags)
    if (next.provider && !seen.has(next.provider)) {
      seen.add(next.provider)
      chain.push(next)
    }
  }
  return chain
}
