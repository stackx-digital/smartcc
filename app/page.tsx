import Link from 'next/link'
import {
  Calculator, CreditCard, TrendingUp, CheckCircle2, AlertTriangle,
  BarChart3, Shield, Zap, ChevronDown, Star, ArrowRight, Clock, Sparkles, X
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8faff] text-gray-900 overflow-x-hidden">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              Log Masuk
            </Link>
            <Link href="/auth/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200/60">
              Cuba Percuma
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── OPENING STORY ─── */}
      <section className="relative pt-20 pb-28 px-4 overflow-hidden">
        <div className="mesh-blob-1 -top-32 -left-32 opacity-70" />
        <div className="mesh-blob-2 top-20 right-0 opacity-80" />
        <div className="mesh-blob-3 bottom-0 left-1/3 opacity-60" />
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-200 text-blue-700 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Percuma selamanya untuk 2 kad kredit
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Guna kad kredit{' '}
            <span className="relative inline-block">
              <span className="gradient-text">setiap hari,</span>
              <svg className="absolute -bottom-1 left-0 w-full" height="5" viewBox="0 0 300 5" fill="none" preserveAspectRatio="none">
                <path d="M0 2.5 Q75 0 150 2.5 Q225 5 300 2.5" stroke="url(#ug)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <defs>
                  <linearGradient id="ug" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="100%" stopColor="#6366f1"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>{' '}
            tapi cashback sifar?
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Bukan sebab anda tak berbelanja. Tapi sebab anda{' '}
            <strong className="text-gray-800">tidak tahu satu perkara mudah</strong>{' '}
            — yang kami akan tunjukkan kepada anda hari ini.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-300/40 hover:shadow-blue-400/40 hover:-translate-y-0.5"
            >
              Tunjukkan Saya <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-gray-700 font-semibold text-base hover:bg-white hover:border-gray-300 transition-all shadow-sm backdrop-blur"
            >
              Lihat Demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-gray-500">
            {['Tiada kad kredit diperlukan', 'Persediaan dalam 2 minit', 'Selamat & peribadi'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: '50', label: 'Hari Float Max', color: 'text-blue-600' },
              { value: 'RM0', label: 'Kos Bermula', color: 'text-emerald-600' },
              { value: '2min', label: 'Setup Masa', color: 'text-violet-600' },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-2xl p-4 shadow-lg shadow-blue-100/50">
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE STORY: PAIN POINT ─── */}
      <section className="relative py-24 px-4 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Kisah Sebenar</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Adakah ini anda?</h2>
          </div>

          {/* Story card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 p-8 sm:p-10 shadow-lg mb-10">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Ahmad, 35 tahun. Bergaji RM5,000 sebulan. Pegang dua kad kredit.
              Berbelanja RM300 di sini, RM500 di sana — makan, minyak, groceries, online shopping.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Setiap bulan bila ada bil masuk, dia <strong className="text-gray-900">terus bayar</strong>.
              Dia rasa dia bijak — &ldquo;bayar cepat, elak faedah.&rdquo;
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Hujung tahun dia check cashback: <strong className="text-red-600 text-xl">RM0.</strong>{' '}
              Walhal dia dah guna kad kredit lebih RM6,000 setahun.
            </p>
          </div>

          {/* The reveal */}
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6 shadow-sm">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900 mb-2">Apa yang Ahmad buat salah?</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Setiap kali dia berbelanja RM300, dia terus bayar. Jadi baki di penyata dia sentiasa rendah.
                  Kad cashback dia ada syarat: kena capai <strong>RM4,000 dalam satu penyata</strong> baru dapat cashback.
                  Sebab dia bayar tiap kali, penyata dia tak pernah sampai RM4,000 — walaupun dia dah guna RM6,000 setahun.{' '}
                  <strong className="text-red-700">RM0 cashback. Setiap tahun.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE HARD TRUTH ─── */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
        <div className="mesh-blob-1 -top-40 left-1/4 opacity-20" />

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Kebenaran Pahit</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Musuh sebenar bukan faedah kad kredit.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Musuh sebenar adalah <strong className="text-white">kejahilan tentang cara kad kredit sebenarnya berfungsi.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '😶',
                title: 'Ramai orang keliru',
                desc: 'Antara "statement balance" dan "outstanding balance". Ini beza yang boleh kos anda ratusan ringgit setiap tahun.',
              },
              {
                icon: '💸',
                title: 'Bayar masa salah',
                desc: 'Bayar terlalu awal membunuh peluang cashback. Bayar terlalu lambat kena faedah. Ada masa yang tepat — dan ramai tak tahu bila.',
              },
              {
                icon: '🃏',
                title: 'Satu kad sahaja',
                desc: 'Guna satu kad untuk semua benda = tiada strategi. Kad kredit ada kelebihan berbeza. Gunakan strategi 3-kad untuk lindungi diri anda.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-7 hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-8 text-center">
            <p className="text-blue-200 text-lg leading-relaxed">
              &ldquo;Hutang bukan takdir. Ia adalah pilihan — yang bermula daripada kurang ilmu.&rdquo;
            </p>
            <p className="text-blue-400 text-sm mt-3">— Prinsip pengurusan kad kredit bijak</p>
          </div>
        </div>
      </section>

      {/* ─── THE FLOAT REVELATION ─── */}
      <section className="relative py-24 px-4 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-25" />
        <div className="mesh-blob-2 top-0 right-0 opacity-40" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Penyelesaian</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Apa itu "Float" — dan kenapa ia penting?</h2>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-7 shadow-lg border border-blue-50">
              <h3 className="font-bold text-lg mb-3 text-gray-900">Bayangkan ini:</h3>
              <p className="text-gray-600 leading-relaxed">
                Anda beli sesuatu hari ini dengan kad kredit. Tapi anda <em>sebenarnya</em> tak perlu bayar balik
                selama <strong className="text-blue-700">50 hari</strong> — tanpa faedah sesen pun.
                Selama 50 hari tu, wang anda masih ada dalam akaun anda. Menjana faedah. Boleh digunakan untuk keperluan lain.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-7 shadow-lg border border-emerald-50">
              <h3 className="font-bold text-lg mb-3 text-gray-900">Tapi hanya jika anda tahu <em>bila</em> nak beli:</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-red-700 text-sm">Beli masa salah</span>
                  </div>
                  <p className="text-red-600 text-sm">3 hari sebelum statement → hanya <strong>22 hari</strong> float</p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-emerald-700 text-sm">Beli masa betul</span>
                  </div>
                  <p className="text-emerald-600 text-sm">Sehari selepas statement → sehingga <strong>50 hari</strong> float</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-blue-600 p-7 text-white shadow-xl shadow-blue-200/60">
              <p className="text-lg font-semibold mb-2">Perbezaan = 28 hari.</p>
              <p className="text-blue-200 leading-relaxed">
                Untuk pembelian RM10,000 — itu bermakna RM10,000 ada dalam akaun simpanan anda
                selama <strong className="text-white">28 hari lebih</strong>. Dengan kadar faedah 3.5% setahun,
                itu lebih RM26 anda dapat percuma. Setiap pembelian besar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE 3-CARD STRATEGY ─── */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#f8faff]">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Strategi Pro</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Strategi 3 Kad — Perisai Kewangan Anda</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Orang yang bijak guna kad kredit tidak bergantung pada satu kad sahaja.
              Mereka ada sistem — dan sistem itu ada tiga peringkat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '1',
                color: 'from-blue-500 to-blue-600',
                badge: 'bg-blue-100 text-blue-700',
                title: 'Kad Harian (Rewards)',
                role: 'Penjana Ganjaran',
                desc: 'Kad untuk kegunaan harian — makan, minyak, groceries. Pilih kad yang bagi cashback atau points terbaik. Guna konsisten, bayar PENUH setiap penyata.',
                tip: 'Tip: Capai threshold cashback setiap bulan. Jangan bayar tiap transaksi!',
              },
              {
                num: '2',
                color: 'from-amber-500 to-orange-500',
                badge: 'bg-amber-100 text-amber-700',
                title: 'Kad Balance Transfer',
                role: 'Pelan Backup',
                desc: 'Kad dengan kemudahan balance transfer pada kadar faedah rendah (0–5%). Guna hanya dalam kecemasan. Ini "jaring keselamatan" kewangan anda.',
                tip: 'Tip: Jangan guna untuk pembelian biasa. Simpan untuk keadaan terdesak.',
              },
              {
                num: '3',
                color: 'from-emerald-500 to-teal-600',
                badge: 'bg-emerald-100 text-emerald-700',
                title: 'Kad 0% EPP / FPP',
                role: 'Pembelian Besar',
                desc: 'Untuk pembelian besar seperti elektronik, perabot, perjalanan. Bahagi kepada 12–24 bulan tanpa faedah. Wang anda kekal lebih lama.',
                tip: 'Tip: Selalu semak minimum pembelian dan terma sebelum apply.',
              },
            ].map((card, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform duration-200">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} text-white font-black text-lg mb-4 shadow-md`}>
                  {card.num}
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-3 ${card.badge}`}>{card.role}</span>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{card.desc}</p>
                <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                  <p className="text-xs text-gray-500 italic">{card.tip}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">
              smartcc membantu anda urus semua 3 kad ini dalam satu dashboard — dan tahu <em>kad mana</em> nak guna <em>hari ini.</em>
            </p>
          </div>
        </div>
      </section>

      {/* ─── HOW SMARTCC SOLVES IT ─── */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Penyelesaian</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              smartcc buat semua pengiraan ini untuk anda
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Dalam masa 2 minit, anda tahu tepat — kad mana, hari bila.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px bg-gradient-to-r from-blue-500/50 to-indigo-500/50" />
            {[
              { step: '01', title: 'Daftar & Tambah Kad', desc: 'Masukkan maklumat asas kad kredit anda — had kredit, baki, dan hari statement. Tiada nombor kad penuh diperlukan.' },
              { step: '02', title: 'Dashboard Sekilas Pandang', desc: 'Traffic light hijau/kuning/merah tunjukkan status setiap kad. Hijau = masa terbaik beli sekarang. Merah = tahan dulu.' },
              { step: '03', title: 'Plan & Optimize', desc: 'Masukkan tarikh belanja yang dirancang. Sistem cari kad dengan float terpanjang dan cadangkan masa terbaik.' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-black mb-5 shadow-2xl shadow-blue-900/60 group-hover:scale-105 transition-transform">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="mesh-blob-2 top-0 right-0 opacity-50" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Ciri-ciri</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Semua yang anda perlukan</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Direka khas untuk pengguna kad kredit Malaysia</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BarChart3, title: 'Float Calculator', desc: 'Kira tepat bilangan hari float untuk mana-mana tarikh pembelian dan kad kredit anda.', accent: 'from-blue-500 to-blue-600' },
              { icon: Zap, title: 'Traffic Light System', desc: 'Status hijau/kuning/merah pada setiap kad — tahu sekilas pandang sama ada hari ini masa terbaik.', accent: 'from-amber-400 to-orange-500' },
              { icon: Calculator, title: 'Smart Purchase Planner', desc: 'Bandingkan semua kad anda dan dapatkan cadangan kad terbaik untuk tarikh pembelian yang dipilih.', accent: 'from-indigo-500 to-violet-600' },
              { icon: CreditCard, title: 'Pengurusan Pelbagai Kad', desc: 'Uruskan semua kad kredit dalam satu tempat. Pantau baki, had kredit, dan penggunaan setiap kad.', accent: 'from-pink-500 to-rose-500' },
              { icon: TrendingUp, title: 'Sejarah Float', desc: 'Rekod semua kiraan float anda. Tapis mengikut kad atau tarikh dan eksport ke CSV (Pro).', accent: 'from-emerald-500 to-teal-600' },
              { icon: Shield, title: 'Selamat & Peribadi', desc: 'Data anda disulitkan dan dilindungi oleh Supabase. Kami tidak simpan maklumat sensitif kad kredit.', accent: 'from-slate-600 to-slate-700' },
            ].map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 shadow-lg shadow-blue-50 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-200 group">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${f.accent} mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold mb-1.5 text-gray-900">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="relative py-24 px-4 bg-white overflow-hidden" id="harga">
        <div className="absolute inset-0 bg-dot-pattern opacity-25" />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Harga</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Harga yang berpatutan</h2>
            <p className="text-gray-500">Mula percuma. Naik taraf bila anda bersedia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Free</h3>
                <p className="text-gray-400 text-sm">Untuk bermula</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">RM0</span>
                  <span className="text-gray-400 mb-1">/bulan</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {['Sehingga 2 kad kredit', 'Float calculator', 'Traffic light dashboard', 'Smart Purchase Planner', 'Sejarah 30 hari'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="block text-center w-full py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all">
                Mula Percuma
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-2xl shadow-blue-300/40">
              <div className="absolute inset-0 bg-dot-pattern opacity-10" />
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  ⭐ PALING POPULAR
                </span>
              </div>
              <div className="relative mb-6 pt-2">
                <h3 className="text-xl font-bold mb-1">Pro</h3>
                <p className="text-blue-200 text-sm">Untuk pengguna serius</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">RM9</span>
                  <span className="text-blue-200 mb-1">/bulan</span>
                </div>
              </div>
              <ul className="relative space-y-3 mb-8">
                {['Semua ciri Free', 'Kad kredit tanpa had', 'Export sejarah ke CSV', 'Sejarah penuh (tiada had)', 'Analitik lanjutan', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-200 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="relative block text-center w-full py-3 rounded-xl bg-white font-bold text-blue-600 hover:bg-blue-50 transition-colors shadow-lg">
                Cuba Pro Percuma 14 Hari
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FORMULA ─── */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
        <div className="mesh-blob-3 top-1/4 right-1/4 opacity-30" />
        <div className="relative max-w-2xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Formula</span>
          <h2 className="text-3xl font-bold text-white mb-4">Formula Float yang Terbukti</h2>
          <p className="text-slate-400 mb-10">Matematik mudah yang ramai tidak gunakan sepenuhnya</p>

          <div className="rounded-2xl p-8 text-left border border-slate-700 bg-slate-800 shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-5xl">🧮</span>
              <p className="text-2xl font-bold text-white mt-4">Float = Tarikh Due − Tarikh Beli</p>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 text-sm space-y-3">
              <p className="text-blue-400 font-semibold text-base">Contoh: Kad statement hari ke-8, due +20 hari</p>
              <p className="text-slate-200">• Beli pada <strong className="text-white font-bold">9 Januari</strong> <span className="text-slate-400">(sehari selepas statement)</span></p>
              <p className="text-slate-200">• Statement seterusnya: <strong className="text-white font-bold">8 Februari</strong></p>
              <p className="text-slate-200">• Tarikh due: <strong className="text-white font-bold">28 Februari</strong></p>
              <div className="pt-2 border-t border-slate-700">
                <p className="text-emerald-400 font-bold text-base">→ Float = <span className="text-emerald-300">50 hari!</span> Wang di tangan hampir 2 bulan.</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-5 text-center">
              smartcc kira semua ini secara automatik untuk setiap kad anda.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="relative max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">FAQ</span>
            <h2 className="text-3xl font-bold">Soalan Lazim</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'Adakah selamat untuk masukkan maklumat kad kredit?', a: 'smartcc tidak simpan nombor penuh kad kredit anda. Kami hanya perlukan maklumat asas seperti had kredit, baki semasa, dan hari statement untuk kira float. Semua data dilindungi dengan penyulitan Supabase.' },
              { q: 'Apa beza "statement balance" dan "outstanding balance"?', a: '"Statement balance" adalah amaun yang tertera dalam penyata bulanan anda — inilah yang anda perlu bayar untuk elak faedah. "Outstanding balance" adalah jumlah semasa termasuk transaksi yang belum masuk penyata. Ramai orang keliru antara dua ini dan membayar amaun yang salah.' },
              { q: 'Apa itu "float" kad kredit?', a: 'Float adalah bilangan hari antara tarikh anda membeli sesuatu dan tarikh anda perlu bayar. Semakin panjang float, semakin lama wang anda ada dalam tangan atau dalam akaun simpanan yang menjana faedah.' },
              { q: 'Boleh ke saya guna untuk semua jenis kad kredit?', a: 'Ya! smartcc berfungsi untuk semua kad kredit Malaysia — Visa, Mastercard, dan Amex dari mana-mana bank termasuk Maybank, CIMB, Affin, Al-Rajhi, dan lain-lain.' },
              { q: 'Adakah pelan Free benar-benar percuma?', a: 'Ya, pelan Free adalah percuma selamanya. Anda boleh tambah sehingga 2 kad kredit dan guna semua ciri asas tanpa had masa. Naik taraf ke Pro hanya jika anda perlukan lebih banyak kad atau ciri lanjutan.' },
              { q: 'Bagaimana cara bayar untuk Pro?', a: 'Fungsi pembayaran sedang dalam pembangunan. Buat masa ini anda boleh daftar dan guna semua ciri secara percuma. Kami akan maklumkan apabila ia sedia.' },
            ].map((item, i) => (
              <details key={i} className="group glass-card rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium list-none text-gray-800">
                  {item.q}
                  <ChevronDown className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform duration-200 flex-shrink-0 ml-3" />
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800" />
        <div className="absolute inset-0 bg-dot-pattern opacity-15" />
        <div className="mesh-blob-1 -top-20 -left-20 opacity-30" />
        <div className="mesh-blob-2 -bottom-20 right-0 opacity-20" />

        <div className="relative max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8 backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-current text-amber-300" />
            Ahmad dah daftar. Giliran anda sekarang.
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 leading-tight">
            Jangan biar tahun depan<br />cashback anda sifar lagi.
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Daftar dalam masa 2 minit. Percuma. Mula optimize float anda hari ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-base hover:bg-blue-50 transition-all shadow-2xl hover:-translate-y-0.5"
            >
              Daftar Percuma Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/30 bg-white/10 text-white font-semibold text-base hover:bg-white/20 transition-all backdrop-blur"
            >
              Log Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 px-4 bg-slate-950 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <Logo size="sm" className="[&_span]:text-white" />
          <p>© 2026 smartcc. Hak cipta terpelihara.</p>
          <div className="flex gap-5">
            <Link href="/auth/login" className="hover:text-white transition-colors">Log Masuk</Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">Daftar</Link>
            <Link href="#harga" className="hover:text-white transition-colors">Harga</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
