'use client'
import { useLang } from './LanguageProvider'

export function LanguageToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'bm' ? 'en' : 'bm')}
      className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150"
    >
      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 text-xs font-bold">
        {lang === 'bm' ? 'EN' : 'BM'}
      </span>
      {lang === 'bm' ? 'English' : 'Bahasa Melayu'}
    </button>
  )
}
