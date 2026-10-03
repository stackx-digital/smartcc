'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, Sparkles, ExternalLink, CheckCircle2, CreditCard } from 'lucide-react'
import cardsRaw from './cards-data.json'

interface Card {
  name: string
  url: string
  description: string
  min_income_monthly: number
  annual_fee_str: string
  is_free_annual: boolean
  cashback: string
  cashback_pct: number
  interest_rate: string
  interest_free_days: number
  is_travel: boolean
  is_petrol: boolean
  is_dining: boolean
  is_grocery: boolean
  is_islamic: boolean
  is_shopping: boolean
  is_grab: boolean
  has_cashback: boolean
}

const cards = cardsRaw as Card[]

type Step = 'income' | 'fee' | 'benefit' | 'lifestyle' | 'results'

const BENEFIT_OPTIONS = [
  { key: 'cashback', label: 'Cashback', emoji: '💰', desc: 'Dapat balik duit setiap bulan' },
  { key: 'travel', label: 'Travel', emoji: '✈️', desc: 'Miles, lounge, travel insurance' },
  { key: 'dining', label: 'Makan & Minum', emoji: '🍜', desc: 'Diskaun restoran & F&B' },
  { key: 'petrol', label: 'Petrol', emoji: '⛽', desc: 'Cashback atau rebat petrol' },
  { key: 'grocery', label: 'Grocery', emoji: '🛒', desc: 'Jimat di supermarket & hypermarket' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️', desc: 'Rewards untuk retail & e-commerce' },
  { key: 'grab', label: 'Grab / e-Wallet', emoji: '📱', desc: 'Cashback untuk Grab & e-wallet' },
]

const INCOME_OPTIONS = [
  { label: 'Bawah RM2,000', value: 1500 },
  { label: 'RM2,000 – RM3,999', value: 2500 },
  { label: 'RM4,000 – RM7,999', value: 5000 },
  { label: 'RM8,000 ke atas', value: 10000 },
]

function getBankFromName(name: string): string {
  const banks = ['Maybank','CIMB','Public Bank','Hong Leong','RHB','AmBank','UOB','HSBC','Standard Chartered','Citibank','Alliance','AFFIN','BSN','AEON','Bank Islam','Bank Rakyat','OCBC','Bank Muamalat','ICBC']
  for (const b of banks) {
    if (name.toLowerCase().includes(b.toLowerCase())) return b
  }
  return name.split(' ')[0]
}

const BANK_COLORS: Record<string, string> = {
  Maybank: 'from-yellow-500 to-amber-400',
  CIMB: 'from-red-600 to-red-500',
  'Public Bank': 'from-blue-700 to-blue-500',
  'Hong Leong': 'from-green-700 to-green-500',
  RHB: 'from-orange-600 to-orange-400',
  AmBank: 'from-purple-700 to-purple-500',
  UOB: 'from-blue-900 to-blue-700',
  HSBC: 'from-red-700 to-rose-500',
  'Standard Chartered': 'from-teal-700 to-teal-500',
  Citibank: 'from-sky-600 to-sky-400',
  Alliance: 'from-cyan-700 to-cyan-500',
  AFFIN: 'from-indigo-600 to-indigo-500',
  BSN: 'from-emerald-700 to-emerald-500',
  AEON: 'from-pink-600 to-pink-400',
  'Bank Islam': 'from-green-900 to-green-700',
  'Bank Rakyat': 'from-blue-800 to-blue-600',
  OCBC: 'from-red-500 to-rose-400',
  'Bank Muamalat': 'from-teal-800 to-teal-600',
  ICBC: 'from-red-800 to-red-600',
}

function bankColor(name: string) {
  const bank = getBankFromName(name)
  return BANK_COLORS[bank] || 'from-slate-600 to-slate-500'
}

export function CompareClient() {
  const [step, setStep] = useState<Step>('income')
  const [income, setIncome] = useState<number | null>(null)
  const [wantFree, setWantFree] = useState<boolean | null>(null)
  const [wantIslamic, setWantIslamic] = useState<boolean | null>(null)
  const [benefits, setBenefits] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const results = useMemo(() => {
    if (step !== 'results') return []
    let filtered = cards.filter(c => {
      if (income !== null && c.min_income_monthly > income) return false
      if (wantFree && !c.is_free_annual) return false
      if (wantIslamic && !c.is_islamic) return false
      return true
    })

    // Score by benefit match
    filtered = filtered.map(c => {
      let score = 0
      if (benefits.has('cashback') && c.has_cashback) score += c.cashback_pct * 2
      if (benefits.has('travel') && c.is_travel) score += 15
      if (benefits.has('dining') && c.is_dining) score += 10
      if (benefits.has('petrol') && c.is_petrol) score += 10
      if (benefits.has('grocery') && c.is_grocery) score += 10
      if (benefits.has('shopping') && c.is_shopping) score += 8
      if (benefits.has('grab') && c.is_grab) score += 12
      if (c.is_free_annual) score += 5
      if (c.interest_free_days >= 50) score += 5
      return { ...c, score }
    }).sort((a: any, b: any) => b.score - a.score)

    return filtered
  }, [step, income, wantFree, wantIslamic, benefits])

  const displayed = showAll ? results : results.slice(0, 6)

  function toggleBenefit(key: string) {
    setBenefits(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function goResults() {
    setStep('results')
    setShowAll(false)
  }

  function reset() {
    setStep('income')
    setIncome(null)
    setWantFree(null)
    setWantIslamic(null)
    setBenefits(new Set())
    setShowAll(false)
  }

  const progress = { income: 25, fee: 50, benefit: 75, lifestyle: 90, results: 100 }[step]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg tracking-tight">smartcc</Link>
          {step !== 'income' && step !== 'results' && (
            <button onClick={reset} className="text-xs text-slate-400 hover:text-white transition-colors">
              Mula Semula
            </button>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress bar */}
        {step !== 'results' && (
          <div className="mb-8">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP: Income */}
        {step === 'income' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Pencari Kad Kredit
              </div>
              <h1 className="text-3xl font-bold text-white">Kad Kredit Terbaik<br />Untuk Anda</h1>
              <p className="text-slate-400">Jawab 4 soalan mudah, kami carikan kad yang paling sesuai</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white font-semibold text-lg mb-1">Berapa pendapatan bulanan anda?</p>
              <p className="text-slate-400 text-sm mb-5">Ini menentukan kad yang layak untuk anda mohon</p>
              <div className="space-y-2">
                {INCOME_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setIncome(opt.value); setStep('fee') }}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 text-white transition-all group"
                  >
                    <span className="font-medium">{opt.label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP: Annual Fee */}
        {step === 'fee' && (
          <div className="space-y-6 animate-fadeIn">
            <button onClick={() => setStep('income')} className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors">
              <ChevronLeft className="h-4 w-4" /> Kembali
            </button>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white font-semibold text-lg mb-1">Yuran tahunan</p>
              <p className="text-slate-400 text-sm mb-5">Ada kad dengan yuran tahunan percuma seumur hidup</p>
              <div className="space-y-3">
                {[
                  { label: 'Mahu percuma (tiada yuran tahunan)', sub: 'Ramai pilihan kad free-for-life di Malaysia', val: true },
                  { label: 'Tak kisah ada yuran', sub: 'Yuran berbaloi jika manfaat lebih tinggi', val: false },
                ].map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => { setWantFree(opt.val); setStep('benefit') }}
                    className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all group"
                  >
                    <p className="text-white font-medium group-hover:text-blue-300 transition-colors">{opt.label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white font-semibold mb-3">Adakah anda mahukan kad Islam (Shariah-compliant)?</p>
              <div className="flex gap-3">
                {[{ label: 'Ya', val: true }, { label: 'Tidak / Tak kisah', val: false }].map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => setWantIslamic(opt.val)}
                    className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                      wantIslamic === opt.val
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-blue-500/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP: Benefits */}
        {step === 'benefit' && (
          <div className="space-y-6 animate-fadeIn">
            <button onClick={() => setStep('fee')} className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors">
              <ChevronLeft className="h-4 w-4" /> Kembali
            </button>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white font-semibold text-lg mb-1">Apa faedah yang paling anda utamakan?</p>
              <p className="text-slate-400 text-sm mb-5">Pilih satu atau lebih</p>
              <div className="grid grid-cols-2 gap-3">
                {BENEFIT_OPTIONS.map(opt => {
                  const active = benefits.has(opt.key)
                  return (
                    <button
                      key={opt.key}
                      onClick={() => toggleBenefit(opt.key)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        active
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.emoji}</div>
                      <p className="font-medium text-sm">{opt.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-tight">{opt.desc}</p>
                      {active && <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 mt-1" />}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={goResults}
              disabled={benefits.size === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Cari Kad Sesuai
            </button>
          </div>
        )}

        {/* RESULTS */}
        {step === 'results' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {results.length} Kad Ditemui
                </h2>
                <p className="text-slate-400 text-sm">Disusun mengikut kesesuaian untuk anda</p>
              </div>
              <button
                onClick={reset}
                className="text-sm text-blue-400 hover:text-blue-300 border border-blue-500/30 px-4 py-2 rounded-xl transition-colors"
              >
                Semula
              </button>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <CreditCard className="h-12 w-12 text-slate-600 mx-auto" />
                <p className="text-slate-400">Tiada kad yang sepadan dengan kriteria anda.</p>
                <button onClick={reset} className="text-blue-400 underline text-sm">Cuba semula dengan kriteria berbeza</button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {displayed.map((card, i) => {
                    const bank = getBankFromName(card.name)
                    const initials = bank.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                    return (
                      <div key={card.name} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                        <div className="flex items-start gap-4">
                          {/* Bank logo placeholder */}
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bankColor(card.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {initials}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                {i === 0 && (
                                  <span className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 mb-1">
                                    <Sparkles className="h-2.5 w-2.5" /> Cadangan Terbaik
                                  </span>
                                )}
                                <h3 className="font-semibold text-white text-sm leading-tight">{card.name}</h3>
                              </div>
                              <a
                                href={card.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {card.has_cashback && (
                                <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5">
                                  💰 {card.cashback}
                                </span>
                              )}
                              {card.is_free_annual && (
                                <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5">
                                  ✓ Percuma
                                </span>
                              )}
                              {card.is_travel && (
                                <span className="text-xs bg-purple-500/15 text-purple-400 border border-purple-500/20 rounded-full px-2 py-0.5">
                                  ✈️ Travel
                                </span>
                              )}
                              {card.is_petrol && (
                                <span className="text-xs bg-orange-500/15 text-orange-400 border border-orange-500/20 rounded-full px-2 py-0.5">
                                  ⛽ Petrol
                                </span>
                              )}
                              {card.is_dining && (
                                <span className="text-xs bg-pink-500/15 text-pink-400 border border-pink-500/20 rounded-full px-2 py-0.5">
                                  🍜 Dining
                                </span>
                              )}
                              {card.is_islamic && (
                                <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5">
                                  ☪ Islamik
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            {card.description && (
                              <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">{card.description}</p>
                            )}

                            {/* Key info row */}
                            <div className="flex gap-4 mt-3 text-xs text-slate-400">
                              {card.min_income_monthly > 0 && (
                                <span>Min. RM{card.min_income_monthly.toLocaleString()}/bln</span>
                              )}
                              {card.interest_free_days > 0 && (
                                <span>{card.interest_free_days} hari interest-free</span>
                              )}
                              {card.interest_rate && (
                                <span>{card.interest_rate}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {results.length > 6 && !showAll && (
                  <button
                    onClick={() => setShowAll(true)}
                    className="w-full py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-sm transition-all"
                  >
                    Lihat {results.length - 6} kad lagi
                  </button>
                )}

                <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5 text-center space-y-3">
                  <p className="text-white font-semibold">Dah ada kad kredit?</p>
                  <p className="text-slate-400 text-sm">Gunakan smartcc untuk kira float terbaik dan elak bayar faedah</p>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors"
                  >
                    Cuba Percuma <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  )
}
