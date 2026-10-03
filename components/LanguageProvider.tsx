'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lang, translations, TranslationKey } from '@/lib/i18n'

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: (k: TranslationKey) => string }
const Ctx = createContext<LangCtx>({ lang: 'bm', setLang: () => {}, t: (k) => k })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('bm')
  useEffect(() => {
    try { const s = localStorage.getItem('lang') as Lang; if (s === 'bm' || s === 'en') setLangState(s) } catch {}
  }, [])
  function setLang(l: Lang) { setLangState(l); try { localStorage.setItem('lang', l) } catch {} }
  const t = (k: TranslationKey) => translations[lang][k] ?? k
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
