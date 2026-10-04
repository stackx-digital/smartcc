import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import cardsRaw from '../cards-data.json'
import { CardDetailClient } from './CardDetailClient'

interface Card {
  name: string; slug: string; url: string; description: string
  min_income_monthly: number; annual_fee_str: string; is_free_annual: boolean
  cashback: string; cashback_pct: number; interest_rate: string; interest_free_days: number
  is_travel: boolean; is_petrol: boolean; is_dining: boolean; is_grocery: boolean
  is_islamic: boolean; is_shopping: boolean; has_cashback: boolean; image: string | null
  benefits: string[]; features: string[]; fees: string; requirements: string; review: string
}

const cards = cardsRaw as Card[]

export async function generateStaticParams() {
  return cards.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const card = cards.find(c => c.slug === slug)
  if (!card) return {}
  return {
    title: `${card.name} — smartcc`,
    description: card.description || card.review || `Semak maklumat lengkap ${card.name} termasuk cashback, yuran, dan faedah.`,
  }
}

export default async function CardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const card = cards.find(c => c.slug === slug)
  if (!card) notFound()
  return <CardDetailClient card={card} />
}
