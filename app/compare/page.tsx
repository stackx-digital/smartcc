import type { Metadata } from 'next'
import { CompareClient } from './CompareClient'

export const metadata: Metadata = {
  title: 'Cari Kad Kredit Terbaik — smartcc',
  description: 'Jawab 4 soalan mudah dan dapatkan cadangan kad kredit yang paling sesuai untuk anda.',
}

export default function ComparePage() {
  return <CompareClient />
}
