'use client'
import { useState, useMemo } from 'react'
import { ExternalLink, BadgeCheck, Tag, Wallet, TrendingUp } from 'lucide-react'
import { CARD_OFFERS, ALL_TAGS, CardOffer } from '@/lib/card-offers'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'cashback', label: 'Highest Cashback' },
  { value: 'income', label: 'Lowest Income Req.' },
  { value: 'fee', label: 'No Annual Fee First' },
]

function CardOfferCard({ offer }: { offer: CardOffer }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Header strip */}
      <div
        className="h-2 w-full"
        style={{ background: offer.color }}
      />

      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Bank + name */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{offer.bank}</p>
            <p className="text-sm font-bold text-slate-800 leading-snug mt-0.5">{offer.name}</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500 shrink-0">
            {offer.cardType}
          </span>
        </div>

        {/* Key stat */}
        <div className="flex items-center gap-2">
          {offer.cashbackRate !== null ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-green-50 text-green-700">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-sm font-bold">Up to {offer.cashbackRate}% cashback</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700">
              <Tag className="h-3.5 w-3.5" />
              <span className="text-sm font-bold">{offer.rewardsPoints}</span>
            </div>
          )}
        </div>

        {/* Highlights */}
        <ul className="space-y-1">
          {offer.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <BadgeCheck className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {offer.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
              {tag.replace(/-/g, ' ')}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Wallet className="h-3 w-3" />
            {offer.annualFee === 0
              ? 'No annual fee'
              : offer.annualFeeWaived
              ? `RM${offer.annualFee}/yr (waivable)`
              : `RM${offer.annualFee}/yr`}
          </div>
          <div className="text-xs text-slate-400">
            Income: RM{(offer.minAnnualIncome / 1000).toFixed(0)}k/yr
          </div>
        </div>
      </div>

      {/* CTA */}
      <a
        href={offer.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex items-center justify-center gap-2 mx-4 mb-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
        style={{ background: offer.color }}
      >
        {offer.applyLabel}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}

export function HubClient() {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState('cashback')
  const [feeFilter, setFeeFilter] = useState<'all' | 'free'>('all')

  function toggleTag(tag: string) {
    setSelectedTags(prev => {
      const next = new Set(prev)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      return next
    })
  }

  const filtered = useMemo(() => {
    let list = [...CARD_OFFERS]

    if (selectedTags.size > 0) {
      list = list.filter(c => [...selectedTags].every(t => c.tags.includes(t)))
    }

    if (feeFilter === 'free') {
      list = list.filter(c => c.annualFee === 0)
    }

    list.sort((a, b) => {
      if (sort === 'cashback') return (b.cashbackRate ?? 0) - (a.cashbackRate ?? 0)
      if (sort === 'income') return a.minAnnualIncome - b.minAnnualIncome
      if (sort === 'fee') return a.annualFee - b.annualFee
      return 0
    })

    return list
  }, [selectedTags, sort, feeFilter])

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Credit Card Hub</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Compare top Malaysian credit cards and find the right one for you.
        </p>
      </div>

      {/* Affiliate disclaimer */}
      <div className="text-[11px] text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
        ℹ️ Links below are affiliate links via RinggitPlus. We may earn a small commission at no extra cost to you.
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Tag filter */}
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map(tag => (
            <button
              key={tag.value}
              onClick={() => toggleTag(tag.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                selectedTags.has(tag.value)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              )}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Sort + fee toggle */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                  sort === opt.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFeeFilter(f => f === 'all' ? 'free' : 'all')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
              feeFilter === 'free'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-white text-slate-500 border-slate-200 hover:border-green-300'
            )}
          >
            {feeFilter === 'free' ? '✓ No Annual Fee Only' : 'No Annual Fee Only'}
          </button>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-400">{filtered.length} card{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          No cards match your filters. Try removing some.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(offer => (
            <CardOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  )
}
