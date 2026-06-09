import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export default async function TipsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const tips = [
    { title: 'Bayar Statement Balance, Bukan Minimum', description: 'Sentiasa bayar jumlah penuh Statement Balance sebelum due date untuk elak faedah.', icon: '💳' },
    { title: 'Beli Selepas Statement Date', description: 'Pembelian sejurus selepas statement date memberikan float terpanjang — sehingga 50 hari!', icon: '📅' },
    { title: 'Elak Beli 3 Hari Sebelum Statement', description: 'Float akan menjadi sangat pendek (< 25 hari) jika anda membeli 1–3 hari sebelum statement date.', icon: '⚠️' },
    { title: 'Gunakan Kad untuk Semua Pembelian Harian', description: 'Gunakan kad kredit untuk semua belanja harian dan bayar penuh setiap bulan untuk optimumkan cashflow.', icon: '🛒' },
    { title: 'Pantau Utilization Rate', description: 'Kekalkan penggunaan kredit di bawah 30% untuk skor kredit yang baik.', icon: '📊' },
    { title: 'Set Reminder Bayaran', description: 'Tetapkan peringatan 3 hari sebelum due date untuk elak bayaran lewat.', icon: '🔔' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Smart Tips</h1>
        <p className="text-muted-foreground text-sm mt-1">Panduan untuk optimumkan penggunaan kad kredit anda</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tips.map((tip, i) => (
          <div key={i} className="rounded-lg border p-5 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{tip.icon}</div>
            <h3 className="font-semibold mb-2">{tip.title}</h3>
            <p className="text-sm text-muted-foreground">{tip.description}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg p-4 bg-[#E6F1FB] text-[#185FA5]">
        <h3 className="font-semibold mb-2">🏆 Formula Float Optimum</h3>
        <p className="text-sm"><strong>Float = Tarikh Due − Tarikh Beli</strong></p>
        <p className="text-sm mt-1">Untuk float maksimum: Beli sehari selepas Statement Date → Due Date = Statement Date + 20 hari → Float ≈ 50 hari!</p>
      </div>
    </div>
  )
}
