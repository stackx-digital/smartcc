import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import {
  CreditCard, LayoutDashboard, Calculator, History,
  CheckCircle2, AlertTriangle, Lightbulb, ArrowRight,
  Clock, TrendingUp, Zap
} from 'lucide-react'

export default async function TutorialPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <div className="p-5 md:p-8 max-w-4xl">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Panduan Penggunaan</h1>
        <p className="text-gray-400 text-sm">Pelajari cara guna smartcc untuk optimumkan float kad kredit anda</p>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {[
          { href: '#konsep', icon: Lightbulb, label: 'Konsep Float', color: 'bg-amber-50 text-amber-600 border-amber-100' },
          { href: '#dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'bg-blue-50 text-blue-600 border-blue-100' },
          { href: '#planner', icon: Calculator, label: 'Planner', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
          { href: '#tips', icon: TrendingUp, label: 'Tips Pro', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
        ].map(item => (
          <a key={item.href} href={item.href} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-sm ${item.color}`}>
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
          </a>
        ))}
      </div>

      {/* Section 1: Konsep Float */}
      <section id="konsep" className="mb-14 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
          <h2 className="text-xl font-bold text-gray-900">Faham Konsep Float</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <p className="text-gray-700 leading-relaxed mb-5">
            <strong>Float</strong> adalah bilangan hari antara tarikh anda berbelanja dengan kad kredit hingga tarikh anda perlu bayar — <span className="text-blue-600 font-semibold">tanpa sebarang faedah.</span> Semakin panjang float, semakin lama wang anda berada dalam akaun anda.
          </p>

          {/* Formula box */}
          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white mb-5">
            <p className="text-sm text-blue-200 mb-1 font-medium">Formula</p>
            <p className="text-2xl font-extrabold">Float = Tarikh Due − Tarikh Beli</p>
          </div>

          {/* Example */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-600 mb-4">📌 Contoh: Kad dengan statement hari ke-8, due +20 hari</p>
            <div className="space-y-2.5">
              {[
                { step: '1', text: 'Beli pada 9 Januari (sehari selepas statement)', color: 'bg-blue-100 text-blue-700' },
                { step: '2', text: 'Statement keluar: 8 Februari', color: 'bg-slate-100 text-slate-700' },
                { step: '3', text: 'Tarikh due: 28 Februari', color: 'bg-slate-100 text-slate-700' },
                { step: '✓', text: 'Float = 50 hari! Wang anda ada hampir 2 bulan', color: 'bg-emerald-100 text-emerald-700' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${item.color}`}>{item.step}</span>
                  <p className="text-sm text-gray-700 pt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Red vs Green */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-red-700 text-sm">Jangan buat ini</span>
            </div>
            <p className="text-sm text-gray-700">Beli <strong>3 hari sebelum</strong> statement date → float hanya ~22 hari</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-emerald-700 text-sm">Cara betul</span>
            </div>
            <p className="text-sm text-gray-700">Beli <strong>sehari selepas</strong> statement date → float sehingga ~50 hari</p>
          </div>
        </div>
      </section>

      {/* Section 2: Dashboard */}
      <section id="dashboard" className="mb-14 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard — Tengok Status Semua Kad</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            Dashboard tunjukkan kesemua kad kredit anda dengan status traffic light — supaya anda tahu <strong>sekilas pandang</strong> kad mana yang sesuai digunakan hari ini.
          </p>

          {/* Traffic light explanation */}
          <div className="space-y-3">
            {[
              {
                dot: 'bg-emerald-500',
                label: 'Hijau — Masa Terbaik',
                desc: 'Baru lepas statement date. Float panjang (35–50 hari). Gunakan kad ini sekarang!',
                bg: 'bg-emerald-50 border-emerald-100',
              },
              {
                dot: 'bg-amber-500',
                label: 'Kuning — Boleh Guna',
                desc: 'Float sederhana (20–34 hari). Masih ok untuk pembelian biasa.',
                bg: 'bg-amber-50 border-amber-100',
              },
              {
                dot: 'bg-red-500',
                label: 'Merah — Elak Dulu',
                desc: 'Hampir statement date. Float pendek (< 20 hari). Tahan pembelian besar.',
                bg: 'bg-red-50 border-red-100',
              },
            ].map(item => (
              <div key={item.label} className={`flex items-start gap-4 p-4 rounded-xl border ${item.bg}`}>
                <span className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${item.dot}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">Belum ada kad?</p>
            <p className="text-sm text-blue-700">Tambah kad kredit anda di bahagian <Link href="/cards" className="font-semibold underline underline-offset-2">My Cards</Link> untuk mulakan. Anda hanya perlu masukkan had kredit, baki semasa, dan hari statement.</p>
          </div>
        </div>
      </section>

      {/* Section 3: My Cards */}
      <section id="cards" className="mb-14 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
          <h2 className="text-xl font-bold text-gray-900">My Cards — Urus Kad Kredit Anda</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-700 text-sm leading-relaxed mb-5">
            Tambah semua kad kredit anda. Anda <strong>tidak perlu masukkan nombor kad penuh</strong> — hanya maklumat asas untuk pengiraan float.
          </p>

          <div className="space-y-3">
            {[
              { icon: '🏦', label: 'Nama Kad & Bank', desc: 'Contoh: "Maybank Visa Gold" — untuk identify kad anda' },
              { icon: '💰', label: 'Had Kredit', desc: 'Jumlah maksimum yang dibenarkan oleh bank' },
              { icon: '📊', label: 'Baki Semasa', desc: 'Jumlah yang anda telah guna (outstanding balance)' },
              { icon: '📅', label: 'Hari Statement', desc: 'Tarikh setiap bulan bila penyata dijana. Ini kunci pengiraan float!' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              💡 <strong>Di mana nak cari hari statement?</strong> Semak penyata bulanan kad kredit anda, atau log masuk ke internet banking bank anda.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Purchase Planner */}
      <section id="planner" className="mb-14 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">4</div>
          <h2 className="text-xl font-bold text-gray-900">Purchase Planner — Pilih Kad Terbaik</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <p className="text-gray-700 text-sm leading-relaxed mb-5">
            Purchase Planner bandingkan <strong>semua kad kredit anda serentak</strong> untuk tarikh pembelian yang anda pilih — dan cadangkan kad yang bagi float paling panjang.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { num: '1', title: 'Pilih tarikh pembelian', desc: 'Masukkan tarikh bila anda nak berbelanja (boleh tarikh akan datang)' },
              { num: '2', title: 'Masukkan nama item & jumlah (pilihan)', desc: 'Untuk simpan rekod dalam History' },
              { num: '3', title: 'Sistem bandingkan semua kad', desc: 'Float untuk setiap kad dikira secara automatik' },
              { num: '4', title: 'Pilih kad cadangan', desc: 'Kad dengan float terpanjang ditanda sebagai "Recommended"' },
            ].map(step => (
              <div key={step.num} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {step.num}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-3">
          <Zap className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-800 mb-1">Contoh guna kes</p>
            <p className="text-sm text-indigo-700">Nak beli laptop minggu depan. Masukkan tarikh dalam Planner — sistem akan bagitahu "guna Kad Maybank, dapat 47 hari float" berbanding "Kad CIMB, hanya 23 hari float."</p>
          </div>
        </div>
      </section>

      {/* Section 5: History */}
      <section id="history" className="mb-14 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">5</div>
          <h2 className="text-xl font-bold text-gray-900">History — Rekod Float Anda</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Semua pengiraan float yang anda simpan akan tersenarai di sini. Boleh tapis mengikut kad atau tarikh.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: '📋', label: 'Rekod lengkap', desc: 'Nama item, jumlah, tarikh, float days' },
              { icon: '🔍', label: 'Tapis & cari', desc: 'Tapis mengikut kad atau tempoh masa' },
              { icon: '📥', label: 'Export CSV', desc: 'Tersedia untuk pengguna Pro' },
            ].map(item => (
              <div key={item.label} className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Tips Pro */}
      <section id="tips" className="mb-10 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">6</div>
          <h2 className="text-xl font-bold text-gray-900">Tips Pro</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: '💳', title: 'Bayar Statement Balance, Bukan Minimum', desc: 'Bayar penuh statement balance sebelum due date = 0% faedah. Jangan bayar minimum sahaja.' },
            { icon: '📅', title: 'Beli Sehari Selepas Statement', desc: 'Ini masa terbaik untuk float maksimum. Simpan belanja besar untuk selepas statement date.' },
            { icon: '🎯', title: 'Jangan Bayar Per-Transaksi', desc: 'Bayar setiap transaksi akan buat statement balance anda rendah dan anda rugi cashback threshold.' },
            { icon: '🃏', title: 'Strategi 3 Kad', desc: 'Kad 1: harian (rewards). Kad 2: backup balance transfer. Kad 3: ansuran 0% untuk belanja besar.' },
            { icon: '📊', title: 'Jaga Utilization Rate', desc: 'Kekalkan penggunaan di bawah 30% dari had kredit untuk skor kredit yang baik.' },
            { icon: '🔔', title: 'Set Reminder Due Date', desc: 'Set peringatan 3 hari sebelum due date untuk elak bayaran lewat dan caj penalti.' },
          ].map(tip => (
            <div key={tip.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{tip.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-7 text-white text-center shadow-xl shadow-blue-200/50">
        <p className="font-bold text-lg mb-2">Dah faham? Mula gunakan smartcc sekarang!</p>
        <p className="text-blue-200 text-sm mb-5">Tambah kad kredit pertama anda dan tengok berapa lama float yang anda boleh dapatkan.</p>
        <Link href="/cards" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-lg">
          Tambah Kad Kredit <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  )
}
