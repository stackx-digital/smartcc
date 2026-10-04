import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import cardsRaw from '../cards-data.json'
import detailsRaw from '../cards-detail.json'
import type { CardSummary, CardDetail } from '../types'
import { CardDetailClient } from './CardDetailClient'

const cards = cardsRaw as CardSummary[]
const details = detailsRaw as Record<string, CardDetail>

export async function generateStaticParams() {
  return cards.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const card = cards.find(c => c.slug === slug)
  if (!card) return {}
  return {
    title: `${card.name} — smartcc`,
    description: card.description || `Semak maklumat lengkap ${card.name} termasuk pulangan tunai, yuran dan faedah.`,
  }
}

export default async function CardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const card = cards.find(c => c.slug === slug)
  const detail = details[slug]
  if (!card || !detail) notFound()
  return <CardDetailClient card={card} detail={detail} />
}
