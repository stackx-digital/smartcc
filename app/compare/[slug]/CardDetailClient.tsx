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
  Maybank:'maybank.png', CIMB:'cimb.png', 'Public Bank':'public-bank.png', 'Hong Leong':'hong-leong.png',
  RHB:'rhb.png', AmBank:'ambank.png', UOB:'uob.png', HSBC:'hsbc.png', 'Standard Chartered':'standard-chartered.png',
  Alliance:'alliance.png', AFFIN:'affin.png', BSN:'bsn.png', AEON:'aeon.png', 'Bank Islam':'bank-islam.png',
  'Bank Rakyat':'bank-rakyat.png', OCBC:'ocbc.png', 'Bank Muamalat':'bank-muamalat.svg', ICBC:'icbc.png',
}

function cleanText(s: string): string {
  return s
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Parse markdown table rows into array of string arrays
function parseMarkdownTable(text: string): { headers: string[]; rows: string[][] } | null {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const tableLines = lines.filter(l => l.startsWith('|'))
  if (tableLines.length < 3) return null
  const parseRow = (line: string) =>
    line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1)
  const separatorIdx = tableLines.findIndex(l => /^\|[\s\-|]+\|$/.test(l))
  if (separatorIdx < 1) return null
  const headers = parseRow(tableLines[0])
  const rows = tableLines.slice(separatorIdx + 1).map(parseRow)
  return { headers, rows }
}

// Render a block of text — markdown tables become <table>, rest stays as <p>
function RichText({ text }: { text: string }) {
  const lines = text.split('\n')
  const segments: { type: 'table' | 'text'; content: string }[] = []
  let buffer: string[] = []

  for (const line of lines) {
    if (line.trim().startsWith('|')) {
      if (buffer.length) { segments.push({ type: 'text', content: buffer.join('\n') }); buffer = [] }
      // collect into last table segment or start new
      if (segments.length && segments[segments.length - 1].type === 'table') {
        segments[segments.length - 1].content += '\n' + line
      } else {
        segments.push({ type: 'table', content: line })
      }
    } else {
      buffer.push(line)
    }
  }
  if (buffer.length) segments.push({ type: 'text', content: buffer.join('\n') })

  return (
    <div className="space-y-3">
      {segments.map((seg, i) => {
        if (seg.type === 'table') {
          const parsed = parseMarkdownTable(seg.content)
          if (parsed) {
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {parsed.headers.map((h, j) => (
                        <th key={j} className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b border-gray-200">{cleanText(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        {row.map((cell, k) => (
                          <td key={k} className="px-3 py-2 text-gray-700 border-b border-gray-100 last:border-b-0">{cleanText(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        }
        const trimmed = cleanText(seg.content)
        if (!trimmed) return null
        return <p key={i} className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{trimmed}</p>
      })}
    </div>
  )
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
    card.has_cashback && { label: `💰 Pulangan Tunai ${card.cashback}`, color: 'bg-green-50 text-green-700 border-green-200' },
    card.is_free_annual && { label: '✓ Yuran Percuma', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    card.is_travel && { label: '✈️ Travel', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    card.is_petrol && { label: '⛽ Petrol', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    card.is_dining && { label: '🍜 Dining', color: 'bg-pink-50 text-pink-700 border-pink-200' },
    card.is_grocery && { label: '🛒 Grocery', color: 'bg-lime-50 text-lime-700 border-lime-200' },
    card.is_islamic && { label: '☪ Islamik', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ].filter(Boolean) as { label: string; color: string }[]

  const feeItems = parseFees(card.fees)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/compare" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> Semua Kad
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500 text-sm truncate">{card.name}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero section */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Card image */}
          <div className="flex items-center justify-center min-h-[220px]">
            {card.image ? (
              <Image src={card.image} alt={card.name} width={320} height={200} className="object-contain max-h-44 w-full drop-shadow-md" />
            ) : (
              <CreditCard className="h-24 w-24 text-gray-300" />
            )}
          </div>

          {/* Card info */}
          <div className="space-y-4">
            {/* Bank logo + name */}
            <div className="flex items-center gap-3">
              {bankLogo && (
                <Image src={`/banks/${bankLogo}`} alt={bank} width={128} height={64} className="h-16 w-32 object-contain" />
              )}
              <span className="text-gray-500 text-sm">{bank}</span>
            </div>

            <h1 className="text-2xl font-bold leading-tight text-gray-900">{card.name}</h1>

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
                <div className="bg-white rounded-xl p-3 border border-gray-200">
                  <p className="text-xs text-gray-400 mb-1">Pendapatan Min.</p>
                  <p className="text-gray-900 font-semibold text-sm">RM{card.min_income_monthly.toLocaleString()}/bln</p>
                </div>
              )}
              {card.interest_rate && (
                <div className="bg-white rounded-xl p-3 border border-gray-200">
                  <p className="text-xs text-gray-400 mb-1">{card.is_islamic ? 'Kadar Keuntungan' : 'Kadar Faedah'}</p>
                  <p className="text-gray-900 font-semibold text-sm">{card.interest_rate}</p>
                </div>
              )}
              {card.interest_free_days > 0 && (
                <div className="bg-white rounded-xl p-3 border border-gray-200">
                  <p className="text-xs text-gray-400 mb-1">{card.is_islamic ? 'Tempoh Bebas Keuntungan' : 'Tempoh Bebas Faedah'}</p>
                  <p className="text-gray-900 font-semibold text-sm">{card.interest_free_days} hari</p>
                </div>
              )}
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <p className="text-xs text-gray-400 mb-1">Yuran Tahunan</p>
                <p className={`font-semibold text-sm ${card.is_free_annual ? 'text-green-600' : 'text-gray-900'}`}>
                  {card.is_free_annual ? 'Percuma' : card.annual_fee_str || 'Tertakluk syarat'}
                </p>
              </div>
            </div>

            {/* Apply CTA */}
            <a
              href="https://invl.me/clo21n7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition-all shadow-md"
            >
              Mohon Sekarang <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Review / description */}
        {(card.review || card.description) && (
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-3 text-gray-900">Tentang Kad Ini</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{card.review || card.description}</p>
          </section>
        )}

        {/* Benefits */}
        {card.benefits.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> Faedah & Keistimewaan
            </h2>
            <div className="space-y-3">
              {card.benefits.map((b, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <RichText text={b} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        {card.features.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              <Percent className="h-5 w-5 text-blue-500" /> Pelan & Kemudahan
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {card.features.filter(f => f.length > 10).map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <RichText text={f} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fees */}
        {feeItems.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              <AlertCircle className="h-5 w-5 text-amber-500" /> Yuran & Caj
            </h2>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {feeItems.map((item, i) => (
                <div key={i} className={`flex justify-between items-start gap-4 px-5 py-3.5 text-sm ${i !== 0 ? 'border-t border-gray-100' : ''}`}>
                  <span className="text-gray-500 flex-shrink-0">{item.label}</span>
                  <span className="text-gray-900 text-right font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Requirements */}
        {card.requirements && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              <Calendar className="h-5 w-5 text-gray-400" /> Kelayakan
            </h2>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <RichText text={card.requirements} />
            </div>
          </section>
        )}

        {/* Apply bottom CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center space-y-3">
          <h3 className="font-semibold text-gray-900">Berminat dengan {card.name}?</h3>
          <p className="text-gray-500 text-sm">Mohon sekarang dan nikmati faedah kad ini</p>
          <a
            href="https://invl.me/clo21n7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-md"
          >
            Mohon Sekarang <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Back link */}
        <div className="text-center pb-4">
          <Link href="/compare" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            ← Lihat semua kad kredit
          </Link>
        </div>
      </div>
    </div>
  )
}
