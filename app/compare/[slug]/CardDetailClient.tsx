'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, CheckCircle2, AlertCircle, Percent, Calendar, CreditCard } from 'lucide-react'

interface Card {
  name: string; slug: string; url: string; description: string
  min_income_monthly: number; annual_fee_str: string; is_free_annual: boolean
  cashback: string; cashback_pct: number; interest_rate: string; interest_free_days: number
  is_travel: boolean; is_petrol: boolean; is_dining: boolean; is_grocery: boolean
  is_islamic: boolean; is_shopping: boolean; has_cashback: boolean; image: string | null
  benefits: string[]; features: string[]; fees: string; requirements: string; review: string
}

function getBank(name: string): string {
  const banks = ['Maybank','CIMB','Public Bank','Hong Leong','RHB','AmBank','UOB','HSBC','Standard Chartered','Alliance','AFFIN','BSN','AEON','Bank Islam','Bank Rakyat','OCBC','Bank Muamalat','ICBC']
  for (const b of banks) if (name.toLowerCase().includes(b.toLowerCase())) return b
  return name.split(' ')[0]
}

const BANK_LOGO_SLUG: Record<string, string> = {
  Maybank:'maybank', CIMB:'cimb', 'Public Bank':'public-bank', 'Hong Leong':'hong-leong',
  RHB:'rhb', AmBank:'ambank', UOB:'uob', HSBC:'hsbc', 'Standard Chartered':'standard-chartered',
  Alliance:'alliance', AFFIN:'affin', BSN:'bsn', AEON:'aeon', 'Bank Islam':'bank-islam',
  'Bank Rakyat':'bank-rakyat', OCBC:'ocbc', 'Bank Muamalat':'bank-muamalat', ICBC:'icbc',
}

function cleanText(s: string): string {
  return s.replace(/\n+/g, '\n').trim()
}

function parseFees(fees: string) {
  if (!fees) return []
  const lines = fees.split('\n').map(l => l.trim()).filter(Boolean)
  const items: { label: string; value: string }[] = []
  let currentLabel = ''
  for (const line of lines) {
    if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•')) {
      if (currentLabel) items.push({ label: currentLabel, value: line.replace(/^[-*•]\s*/, '') })
    } else if (!line.includes(':') && line.length < 60 && !line.startsWith('|')) {
      currentLabel = line
    } else if (line.includes(':')) {
      const [k, ...v] = line.split(':')
      items.push({ label: k.replace(/[*_]/g, '').trim(), value: v.join(':').trim() })
      currentLabel = ''
    }
  }
  return items.slice(0, 10)
}

export function CardDetailClient({ card }: { card: Card }) {
  const bank = getBank(card.name)
  const bankLogo = BANK_LOGO_SLUG[bank]

  const tags = [
    card.has_cashback && { label: `💰 Cashback ${card.cashback}`, color: 'bg-green-500/15 text-green-400 border-green-500/20' },
    card.is_free_annual && { label: '✓ Yuran Percuma', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
    card.is_travel && { label: '✈️ Travel', color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
    card.is_petrol && { label: '⛽ Petrol', color: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
    card.is_dining && { label: '🍜 Dining', color: 'bg-pink-500/15 text-pink-400 border-pink-500/20' },
    card.is_grocery && { label: '🛒 Grocery', color: 'bg-lime-500/15 text-lime-400 border-lime-500/20' },
    card.is_islamic && { label: '☪ Islamik', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  ].filter(Boolean) as { label: string; color: string }[]

  const feeItems = parseFees(card.fees)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/compare" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> Semua Kad
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-slate-400 text-sm truncate">{card.name}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero section */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Card image */}
          <div className="bg-slate-800/50 rounded-2xl p-8 flex items-center justify-center min-h-[220px] border border-white/5">
            {card.image ? (
              <Image src={card.image} alt={card.name} width={320} height={200} className="object-contain max-h-44 w-full drop-shadow-xl" />
            ) : (
              <CreditCard className="h-24 w-24 text-slate-600" />
            )}
          </div>

          {/* Card info */}
          <div className="space-y-4">
            {/* Bank logo + name */}
            <div className="flex items-center gap-3">
              {bankLogo && (
                <Image src={`/banks/${bankLogo}.svg`} alt={bank} width={32} height={32} className="rounded-lg" />
              )}
              <span className="text-slate-400 text-sm">{bank}</span>
            </div>

            <h1 className="text-2xl font-bold leading-tight">{card.name}</h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag.label} className={`text-xs border rounded-full px-3 py-1 ${tag.color}`}>
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {card.min_income_monthly > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-slate-500 mb-1">Pendapatan Min.</p>
                  <p className="text-white font-semibold text-sm">RM{card.min_income_monthly.toLocaleString()}/bln</p>
                </div>
              )}
              {card.interest_rate && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-slate-500 mb-1">Kadar Faedah</p>
                  <p className="text-white font-semibold text-sm">{card.interest_rate}</p>
                </div>
              )}
              {card.interest_free_days > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-slate-500 mb-1">Tempoh Bebas Faedah</p>
                  <p className="text-white font-semibold text-sm">{card.interest_free_days} hari</p>
                </div>
              )}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-xs text-slate-500 mb-1">Yuran Tahunan</p>
                <p className={`font-semibold text-sm ${card.is_free_annual ? 'text-green-400' : 'text-white'}`}>
                  {card.is_free_annual ? 'Percuma' : card.annual_fee_str || 'Tertakluk syarat'}
                </p>
              </div>
            </div>

            {/* Apply CTA */}
            <a
              href="https://invl.me/clo21n7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition-all"
            >
              Mohon Sekarang <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Review / description */}
        {(card.review || card.description) && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-3">Tentang Kad Ini</h2>
            <p className="text-slate-300 leading-relaxed text-sm">{card.review || card.description}</p>
          </section>
        )}

        {/* Benefits */}
        {card.benefits.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" /> Faedah & Keistimewaan
            </h2>
            <div className="space-y-3">
              {card.benefits.map((b, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{cleanText(b)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        {card.features.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Percent className="h-5 w-5 text-blue-400" /> Pelan & Kemudahan
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {card.features.filter(f => f.length > 10).map((f, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-slate-300 text-sm leading-relaxed">{cleanText(f)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fees */}
        {feeItems.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" /> Yuran & Caj
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {feeItems.map((item, i) => (
                <div key={i} className={`flex justify-between items-start gap-4 px-5 py-3.5 text-sm ${i !== 0 ? 'border-t border-white/5' : ''}`}>
                  <span className="text-slate-400 flex-shrink-0">{item.label}</span>
                  <span className="text-white text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Requirements */}
        {card.requirements && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-400" /> Kelayakan
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{cleanText(card.requirements)}</p>
            </div>
          </section>
        )}

        {/* Apply bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-2xl p-6 text-center space-y-3">
          <h3 className="font-semibold text-white">Berminat dengan {card.name}?</h3>
          <p className="text-slate-400 text-sm">Mohon sekarang dan nikmati faedah kad ini</p>
          <a
            href="https://invl.me/clo21n7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            Mohon Sekarang <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Back link */}
        <div className="text-center pb-4">
          <Link href="/compare" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Lihat semua kad kredit
          </Link>
        </div>
      </div>
    </div>
  )
}
