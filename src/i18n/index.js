import en from './locales/en'
import es from './locales/es'
import fr from './locales/fr'
import de from './locales/de'
import zh from './locales/zh'
import ja from './locales/ja'
import pt from './locales/pt'

export const dictionaries = { en, es, fr, de, zh, ja, pt }

export {
  SUPPORTED_LOCALES,
  LOCALE_STORAGE_KEY,
  detectBrowserLocale,
  matchLocale,
  readStoredLocale,
  writeStoredLocale,
  resolveLocale,
  translate,
} from './resolve'
