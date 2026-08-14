import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  dictionaries,
  resolveLocale,
  translate,
  writeStoredLocale,
  SUPPORTED_LOCALES,
} from './index'

const I18nContext = createContext({
  locale: 'en',
  t: (key) => key,
  setLocale: () => {},
  locales: SUPPORTED_LOCALES,
})

function htmlLang(code) {
  if (code === 'zh') return 'zh-CN'
  if (code === 'pt') return 'pt-BR'
  return code
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => resolveLocale())

  useEffect(() => {
    document.documentElement.lang = htmlLang(locale)
  }, [locale])

  const value = useMemo(() => {
    const dict = dictionaries[locale] || dictionaries.en
    function t(key, vars) {
      const hit = translate(dict, key, vars)
      if (hit === key && locale !== 'en') {
        return translate(dictionaries.en, key, vars)
      }
      return hit
    }
    function setLocale(next) {
      const code = SUPPORTED_LOCALES.includes(next) ? next : 'en'
      writeStoredLocale(code)
      setLocaleState(code)
    }
    return { locale, t, setLocale, locales: SUPPORTED_LOCALES }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
