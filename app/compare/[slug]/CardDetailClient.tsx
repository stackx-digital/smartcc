import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, CheckCircle2, AlertCircle, Percent, Calendar, CreditCard, Sparkles } from 'lucide-react'
import type { CardSummary, CardDetail, DetailEntry, DetailTable } from '../types'

const AFFILIATE_URL = 'https://invl.me/clo21n7'

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

function Table({ table }: { table: DetailTable }) {
  return (
    <div className="mt-3">
      {table.caption && <p className="text-sm font-medium text-gray-800 mb-2">{table.caption}</p>}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b border-gray-200 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-gray-700 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

function EntryList({ entries }: { entries: DetailEntry[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
      {entries.map((e, i) => (
        <div key={i} className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-1 sm:gap-6 px-5 py-3.5 text-sm">
          <span className="text-gray-500">{e.label}</span>
          <div className="space-y-2">
            {e.items.map((it, j) => (
              <div key={j}>
                {it.value && <p className="text-gray-900 font-medium">{it.value}</p>}
                {it.notes.map((n, k) => (
                  <p key={k} className="text-gray-500 text-xs mt-1 leading-relaxed">{n}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function CardDetailClient({ card, detail }: { card: CardSummary; detail: CardDetail }) {
  const bank = getBank(card.name)
  const bankLogo = BANK_LOGO_SLUG[bank]
  const about = [card.description, ...detail.review].filter((p, i, arr) => p && arr.indexOf(p) === i)

  const tags = [
    card.has_cashback && { label: `💰 Pulangan Tunai ${card.cashback}`, color: 'bg-green-50 text-green-700 border-green-200' },
    card.is_free_annual && { label: '✓ Yuran Percuma', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    card.is_travel && { label: '✈️ Pelancongan', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    card.is_petrol && { label: '⛽ Petrol', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    card.is_dining && { label: '🍜 Makan', color: 'bg-pink-50 text-pink-700 border-pink-200' },
    card.is_grocery && { label: '🛒 Barangan Runcit', color: 'bg-lime-50 text-lime-700 border-lime-200' },
    card.is_islamic && { label: '☪ Islamik', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ].filter(Boolean) as { label: string; color: string }[]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
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
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex items-center justify-center min-h-[220px]">
            {card.image ? (
              <Image src={card.image} alt={card.name} width={320} height={200} className="object-contain max-h-44 w-full drop-shadow-md" />
            ) : (
              <CreditCard className="h-24 w-24 text-gray-300" />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {bankLogo && (
                <Image src={`/banks/${bankLogo}`} alt={bank} width={128} height={64} className="h-16 w-32 object-contain" />
              )}
              <span className="text-gray-500 text-sm">{bank}</span>
            </div>

            <h1 className="text-2xl font-bold leading-tight text-gray-900">{card.name}</h1>

            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag.label} className={`text-xs border rounded-full px-3 py-1 ${tag.color}`}>{tag.label}</span>
              ))}
            </div>

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
                  {card.is_free_annual ? card.annual_fee_str || 'Percuma' : card.annual_fee_str || 'Tertakluk syarat'}
                </p>
              </div>
            </div>

            <a
              href={AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition-all shadow-md"
            >
              Mohon Sekarang <ExternalLink className="h-4 w-4" />
            </a>
            {detail.highlight && (
              <p className="flex items-start gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" /> {detail.highlight}
              </p>
            )}
          </div>
        </div>

        {about.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-lg text-gray-900">Tentang Kad Ini</h2>
            {about.map((p, i) => (
              <p key={i} className="text-gray-600 leading-relaxed text-sm">{p}</p>
            ))}
          </section>
        )}

        {detail.benefits.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> Faedah & Keistimewaan
            </h2>
            <div className="space-y-3">
              {detail.benefits.map(b => (
                <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-900">{b.title}</h3>
                  {b.text.map((p, i) => (
                    <p key={i} className="text-gray-600 text-sm leading-relaxed mt-2">{p}</p>
                  ))}
                  {b.tables.map((t, i) => <Table key={i} table={t} />)}
                </div>
              ))}
            </div>
          </section>
        )}

        {detail.features.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              <Percent className="h-5 w-5 text-blue-500" /> Pelan & Kemudahan
            </h2>
            <div className="space-y-4">
              {detail.features.map((g, i) => (
                <div key={i}>
                  {g.group && <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">{g.group}</p>}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {g.items.map((it, j) => (
                      <div key={j} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <p className="font-medium text-gray-900 text-sm">{it.name}</p>
                        {it.desc && <p className="text-gray-600 text-sm leading-relaxed mt-1">{it.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {detail.fees.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              <AlertCircle className="h-5 w-5 text-amber-500" /> Yuran & Caj
            </h2>
            <EntryList entries={detail.fees} />
          </section>
        )}

        {detail.requirements.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              <Calendar className="h-5 w-5 text-gray-400" /> Kelayakan
            </h2>
            <EntryList entries={detail.requirements} />
          </section>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center space-y-3">
          <h3 className="font-semibold text-gray-900">Berminat dengan {card.name}?</h3>
          <p className="text-gray-500 text-sm">Mohon sekarang dan nikmati faedah kad ini</p>
          <a
            href={AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-md"
          >
            Mohon Sekarang <ExternalLink className="h-4 w-4" />
          </a>
          <p className="text-xs text-gray-400">Maklumat disemak dengan RinggitPlus. Sila rujuk bank untuk terma terkini.</p>
        </div>

        <div className="text-center pb-4">
          <Link href="/compare" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            ← Lihat semua kad kredit
          </Link>
        </div>
      </div>
    </div>
  )
}
