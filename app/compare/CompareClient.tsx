'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, SlidersHorizontal, X, ChevronDown, ChevronUp, Search } from 'lucide-react'
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
  image: string | null
}

const cards = cardsRaw as Card[]

const BANKS = [
  'Semua Bank',
  'Maybank', 'CIMB', 'Public Bank', 'Hong Leong', 'RHB', 'AmBank',
  'UOB', 'HSBC', 'Standard Chartered', 'Alliance', 'AFFIN',
  'BSN', 'AEON', 'Bank Islam', 'Bank Rakyat', 'OCBC', 'ICBC',
]

function getBank(name: string): string {
  const banks = ['Maybank','CIMB','Public Bank','Hong Leong','RHB','AmBank','UOB','HSBC','Standard Chartered','Alliance','AFFIN','BSN','AEON','Bank Islam','Bank Rakyat','OCBC','Bank Muamalat','ICBC']
  for (const b of banks) {
    if (name.toLowerCase().includes(b.toLowerCase())) return b
  }
  return 'Lain-lain'
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

const BANK_LOGO_SLUG: Record<string, string> = {
  Maybank: 'maybank',
  CIMB: 'cimb',
  'Public Bank': 'public-bank',
  'Hong Leong': 'hong-leong',
  RHB: 'rhb',
  AmBank: 'ambank',
  UOB: 'uob',
  HSBC: 'hsbc',
  'Standard Chartered': 'standard-chartered',
  Alliance: 'alliance',
  AFFIN: 'affin',
  BSN: 'bsn',
  AEON: 'aeon',
  'Bank Islam': 'bank-islam',
  'Bank Rakyat': 'bank-rakyat',
  OCBC: 'ocbc',
  'Bank Muamalat': 'bank-muamalat',
  ICBC: 'icbc',
}

const INCOME_FILTERS = [
  { label: 'Semua', value: 0 },
  { label: '< RM2k', value: 2000 },
  { label: 'RM2k–4k', value: 4000 },
  { label: 'RM4k–8k', value: 8000 },
  { label: '> RM8k', value: 99999 },
]

type BenefitFilter = 'cashback' | 'travel' | 'petrol' | 'dining' | 'grocery' | 'shopping'

const BENEFIT_CHIPS: { key: BenefitFilter; label: string; emoji: string }[] = [
  { key: 'cashback', label: 'Cashback', emoji: '💰' },
  { key: 'travel', label: 'Travel', emoji: '✈️' },
  { key: 'petrol', label: 'Petrol', emoji: '⛽' },
  { key: 'dining', label: 'Dining', emoji: '🍜' },
  { key: 'grocery', label: 'Grocery', emoji: '🛒' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️' },
]

// Group cards by bank, sorted by card count
function groupByBank(list: Card[]): { bank: string; cards: Card[] }[] {
  const map = new Map<string, Card[]>()
  for (const c of list) {
    const b = getBank(c.name)
    if (!map.has(b)) map.set(b, [])
    map.get(b)!.push(c)
  }
  return Array.from(map.entries())
    .map(([bank, cards]) => ({ bank, cards }))
    .sort((a, b) => {
      // Known banks first, alphabetical
      const order = ['Maybank','CIMB','Public Bank','Hong Leong','RHB','AmBank','UOB','HSBC','Standard Chartered','Alliance','AFFIN','BSN','AEON','Bank Islam','Bank Rakyat','OCBC','Bank Muamalat','ICBC']
      const ai = order.indexOf(a.bank)
      const bi = order.indexOf(b.bank)
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return a.bank.localeCompare(b.bank)
    })
}

export function CompareClient() {
  const [selectedBank, setSelectedBank] = useState('Semua Bank')
  const [freeOnly, setFreeOnly] = useState(false)
  const [incomeFilter, setIncomeFilter] = useState(0)
  const [benefits, setBenefits] = useState<Set<BenefitFilter>>(new Set())
  const [search, setSearch] = useState('')
  const [cardType, setCardType] = useState<'all' | 'conventional' | 'islamic'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [collapsedBanks, setCollapsedBanks] = useState<Set<string>>(new Set())

  function toggleBenefit(k: BenefitFilter) {
    setBenefits(prev => {
      const n = new Set(prev)
      n.has(k) ? n.delete(k) : n.add(k)
      return n
    })
  }

  function toggleBank(bank: string) {
    setCollapsedBanks(prev => {
      const n = new Set(prev)
      n.has(bank) ? n.delete(bank) : n.add(bank)
      return n
    })
  }

  const filtered = useMemo(() => {
    return cards.filter(c => {
      if (selectedBank !== 'Semua Bank' && getBank(c.name) !== selectedBank) return false
      if (freeOnly && !c.is_free_annual) return false
      if (incomeFilter > 0) {
        if (incomeFilter === 2000 && c.min_income_monthly >= 2000) return false
        if (incomeFilter === 4000 && (c.min_income_monthly < 2000 || c.min_income_monthly >= 4000)) return false
        if (incomeFilter === 8000 && (c.min_income_monthly < 4000 || c.min_income_monthly >= 8000)) return false
        if (incomeFilter === 99999 && c.min_income_monthly < 8000) return false
      }
      if (benefits.has('cashback') && !c.has_cashback) return false
      if (benefits.has('travel') && !c.is_travel) return false
      if (benefits.has('petrol') && !c.is_petrol) return false
      if (benefits.has('dining') && !c.is_dining) return false
      if (benefits.has('grocery') && !c.is_grocery) return false
      if (benefits.has('shopping') && !c.is_shopping) return false
      if (cardType === 'islamic' && !c.is_islamic) return false
      if (cardType === 'conventional' && c.is_islamic) return false
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [selectedBank, freeOnly, incomeFilter, benefits, search])

  const grouped = useMemo(() => groupByBank(filtered), [filtered])

  const activeFilterCount = (freeOnly ? 1 : 0) + (incomeFilter > 0 ? 1 : 0) + benefits.size + (cardType !== 'all' ? 1 : 0)

  function clearFilters() {
    setFreeOnly(false)
    setIncomeFilter(0)
    setBenefits(new Set())
    setSelectedBank('Semua Bank')
    setSearch('')
    setCardType('all')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">smartcc</Link>
          <span className="text-slate-400 text-sm hidden sm:block">Direktori Kad Kredit Malaysia</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Title */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold">Kad Kredit Malaysia</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} kad daripada {grouped.length} bank</p>
        </div>

        {/* Islamic / Conventional toggle */}
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-5">
          {([
            { key: 'all', label: 'Semua' },
            { key: 'conventional', label: '🏦 Konvensional' },
            { key: 'islamic', label: '☪ Islamik' },
          ] as const).map(opt => (
            <button
              key={opt.key}
              onClick={() => setCardType(opt.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                cardType === opt.key
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search + Filter bar */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama kad..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-slate-400 hover:text-white px-3 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
              <X className="h-3.5 w-3.5" /> Reset
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5 space-y-5">
            {/* Benefit chips */}
            <div>
              <p className="text-xs text-slate-400 font-medium mb-2.5 uppercase tracking-wide">Faedah</p>
              <div className="flex flex-wrap gap-2">
                {BENEFIT_CHIPS.map(b => (
                  <button
                    key={b.key}
                    onClick={() => toggleBenefit(b.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                      benefits.has(b.key)
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {b.emoji} {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Income filter */}
            <div>
              <p className="text-xs text-slate-400 font-medium mb-2.5 uppercase tracking-wide">Pendapatan Bulanan</p>
              <div className="flex flex-wrap gap-2">
                {INCOME_FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setIncomeFilter(f.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      incomeFilter === f.value
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Free annual fee */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer w-fit">
                <div
                  onClick={() => setFreeOnly(!freeOnly)}
                  className={`w-10 h-6 rounded-full transition-all relative ${freeOnly ? 'bg-blue-600' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${freeOnly ? 'left-5' : 'left-1'}`} />
                </div>
                <span className="text-sm text-slate-300">Yuran tahunan percuma sahaja</span>
              </label>
            </div>
          </div>
        )}

        {/* Bank tabs (horizontal scroll) */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {BANKS.map(bank => (
            <button
              key={bank}
              onClick={() => setSelectedBank(bank)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedBank === bank
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {bank}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">Tiada kad dijumpai</p>
            <button onClick={clearFilters} className="mt-3 text-blue-400 underline text-sm">Reset filter</button>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(({ bank, cards: bankCards }) => {
              const collapsed = collapsedBanks.has(bank)
              const initials = bank.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              const color = BANK_COLORS[bank] || 'from-slate-600 to-slate-500'
              return (
                <div key={bank}>
                  {/* Bank header */}
                  <button
                    onClick={() => toggleBank(bank)}
                    className="w-full flex items-center justify-between mb-4 group"
                  >
                    <div className="flex items-center gap-3">
                      {BANK_LOGO_SLUG[bank] ? (
                        <Image
                          src={`/banks/${BANK_LOGO_SLUG[bank]}.svg`}
                          alt={bank}
                          width={36}
                          height={36}
                          className="rounded-xl"
                        />
                      ) : (
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                          {initials}
                        </div>
                      )}
                      <div className="text-left">
                        <h2 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{bank}</h2>
                        <p className="text-xs text-slate-500">{bankCards.length} kad</p>
                      </div>
                    </div>
                    {collapsed
                      ? <ChevronDown className="h-4 w-4 text-slate-500" />
                      : <ChevronUp className="h-4 w-4 text-slate-500" />
                    }
                  </button>

                  {/* Cards grid */}
                  {!collapsed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {bankCards.map(card => (
                        <div key={card.name} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group flex flex-col">
                          {/* Card image */}
                          <div className="bg-slate-800 h-36 flex items-center justify-center p-4">
                            {card.image ? (
                              <Image
                                src={card.image}
                                alt={card.name}
                                width={220}
                                height={140}
                                className="object-contain max-h-28 w-full"
                              />
                            ) : (
                              <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-xl`}>
                                {initials}
                              </div>
                            )}
                          </div>

                          {/* Card info */}
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-semibold text-sm text-white leading-tight mb-2">{card.name}</h3>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {card.has_cashback && (
                                <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5">
                                  💰 {card.cashback}
                                </span>
                              )}
                              {card.is_free_annual && (
                                <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5">
                                  Percuma
                                </span>
                              )}
                              {card.is_travel && (
                                <span className="text-xs bg-purple-500/15 text-purple-400 border border-purple-500/20 rounded-full px-2 py-0.5">
                                  ✈️
                                </span>
                              )}
                              {card.is_petrol && (
                                <span className="text-xs bg-orange-500/15 text-orange-400 border border-orange-500/20 rounded-full px-2 py-0.5">
                                  ⛽
                                </span>
                              )}
                              {card.is_islamic && (
                                <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5">
                                  ☪
                                </span>
                              )}
                            </div>

                            {/* Income & interest */}
                            <div className="text-xs text-slate-500 space-y-0.5 mb-4 flex-1">
                              {card.min_income_monthly > 0 && (
                                <p>Min. RM{card.min_income_monthly.toLocaleString()}/bln</p>
                              )}
                              {card.interest_rate && <p>{card.interest_rate}</p>}
                              {card.interest_free_days > 0 && <p>{card.interest_free_days} hari interest-free</p>}
                            </div>

                            {/* Apply button */}
                            <a
                              href="https://invl.me/clo21n7"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
                            >
                              Mohon Sekarang <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* CTA footer */}
        <div className="mt-16 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Dah ada kad kredit?</h3>
          <p className="text-slate-400 text-sm mb-4">Gunakan smartcc untuk kira float terbaik — elak bayar faedah, maksimumkan 50 hari percuma</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Cuba Percuma →
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
