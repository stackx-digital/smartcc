import Link from 'next/link'
import {
  Calculator, CreditCard, TrendingUp, CheckCircle2, AlertTriangle,
  BarChart3, Shield, Zap, ChevronDown, Star, ArrowRight, Clock
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">CardFloat Pro</span>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">
              Log Masuk
            </Link>
            <Link href="/auth/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Cuba Percuma
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
            <Star className="h-3.5 w-3.5 fill-current" />
            Percuma selamanya untuk 2 kad kredit
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Dapatkan Sehingga{' '}
            <span className="text-blue-600 relative">
              50 Hari Float
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 300 6" fill="none">
                <path d="M0 3 Q75 0 150 3 Q225 6 300 3" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
            </span>{' '}
            Percuma
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ramai pengguna kad kredit tidak tahu <strong className="text-gray-900">bila masa terbaik untuk berbelanja.</strong>{' '}
            CardFloat Pro tunjukkan kad mana dan hari bila untuk capai float maksimum — tanpa bayar faedah sesen pun.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 h-13 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300"
            >
              Mulakan Percuma <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center h-13 px-8 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold text-base hover:border-gray-300 transition-colors"
            >
              Lihat Demo
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Tiada kad kredit diperlukan
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Persediaan dalam 2 minit
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Selamat & peribadi
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Berapa banyak float yang anda bazir setiap bulan?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Kebanyakan pengguna kad kredit buat kesilapan ini tanpa sedar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertTriangle,
                color: 'text-red-500 bg-red-50',
                title: 'Beli Masa Salah',
                desc: 'Membeli 1–3 hari sebelum statement date bermakna anda hanya dapat ~22 hari float. Bayaran due hampir tiba!',
                stat: '~22 hari float',
                statColor: 'text-red-600 bg-red-50',
              },
              {
                icon: Clock,
                color: 'text-amber-500 bg-amber-50',
                title: 'Tak Tahu Kad Mana',
                desc: 'Punya 2-3 kad dengan statement date berbeza tapi sentiasa guna kad yang sama? Anda mungkin rugi 20+ hari float.',
                stat: '~31 hari float',
                statColor: 'text-amber-600 bg-amber-50',
              },
              {
                icon: TrendingUp,
                color: 'text-green-500 bg-green-50',
                title: 'Beli Masa Tepat',
                desc: 'Beli sehari selepas statement date dengan kad yang betul — float sehingga 50 hari. Wang di tangan lebih lama!',
                stat: '~50 hari float',
                statColor: 'text-green-600 bg-green-50',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.desc}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${item.statColor}`}>
                  {item.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Macam mana ia berfungsi?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">3 langkah mudah untuk optimumkan float kad kredit anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line desktop */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-blue-100 z-0" />

            {[
              {
                step: '01',
                title: 'Daftar & Tambah Kad',
                desc: 'Daftar akaun percuma. Masukkan maklumat kad kredit anda — had kredit, baki, dan hari statement.',
              },
              {
                step: '02',
                title: 'Semak Dashboard',
                desc: 'Dashboard tunjukkan traffic light status setiap kad — hijau (masa terbaik), kuning (ok), merah (tahan dulu).',
              },
              {
                step: '03',
                title: 'Plan Pembelian',
                desc: 'Guna Smart Planner — masukkan tarikh belanja, dan sistem cari kad dengan float terpanjang untuk anda.',
              },
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-xl font-bold mb-5 shadow-lg shadow-blue-200">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Semua yang anda perlukan</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Direka khas untuk pengguna kad kredit Malaysia</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: BarChart3,
                title: 'Float Calculator',
                desc: 'Kira tepat bilangan hari float untuk mana-mana tarikh pembelian dan kad kredit anda.',
              },
              {
                icon: Zap,
                title: 'Traffic Light System',
                desc: 'Status hijau/kuning/merah pada setiap kad — tahu sekilas pandang sama ada hari ini masa terbaik atau tidak.',
              },
              {
                icon: Calculator,
                title: 'Smart Purchase Planner',
                desc: 'Bandingkan semua kad anda dan dapatkan cadangan kad terbaik untuk tarikh pembelian yang dipilih.',
              },
              {
                icon: CreditCard,
                title: 'Pengurusan Pelbagai Kad',
                desc: 'Uruskan semua kad kredit dalam satu tempat. Pantau baki, had kredit, dan penggunaan setiap kad.',
              },
              {
                icon: TrendingUp,
                title: 'Sejarah Float',
                desc: 'Rekod semua kiraan float anda. Tapis mengikut kad atau tarikh dan eksport ke CSV (Pro).',
              },
              {
                icon: Shield,
                title: 'Selamat & Peribadi',
                desc: 'Data anda disulitkan dan dilindungi oleh Supabase. Kami tidak simpan maklumat sensitif kad kredit.',
              },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 mb-4">
                  <f.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 px-4" id="harga">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Harga yang berpatutan</h2>
            <p className="text-gray-600">Mula percuma. Naik taraf bila anda bersedia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border-2 border-gray-100 p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Free</h3>
                <p className="text-gray-500 text-sm">Untuk bermula</p>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">RM0</span>
                  <span className="text-gray-500 ml-1">/bulan</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Sehingga 2 kad kredit',
                  'Float calculator',
                  'Traffic light dashboard',
                  'Smart Purchase Planner',
                  'Sejarah 30 hari',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="block text-center w-full py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Mula Percuma
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-blue-600 p-8 relative bg-blue-600 text-white">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  PALING POPULAR
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Pro</h3>
                <p className="text-blue-200 text-sm">Untuk pengguna serius</p>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">RM9</span>
                  <span className="text-blue-200 ml-1">/bulan</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Semua ciri Free',
                  'Kad kredit tanpa had',
                  'Export sejarah ke CSV',
                  'Sejarah penuh (tiada had)',
                  'Analitik lanjutan',
                  'Priority support',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-200 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="block text-center w-full py-3 rounded-xl bg-white font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Cuba Pro Percuma 14 Hari
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / TRUST */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Formula Float yang Terbukti</h2>
            <p className="text-gray-600">Matematik mudah yang ramai tidak gunakan sepenuhnya</p>
          </div>

          <div className="bg-white rounded-2xl border p-8 max-w-2xl mx-auto text-center">
            <div className="text-5xl mb-6">🧮</div>
            <p className="text-lg font-semibold mb-4 text-gray-700">
              Float = Tarikh Due − Tarikh Beli
            </p>
            <div className="bg-blue-50 rounded-xl p-5 text-sm text-blue-800 text-left space-y-2">
              <p><strong>Contoh:</strong> Kad statement hari ke-8, due +20 hari</p>
              <p>• Beli pada <strong>9 Januari</strong> (sehari selepas statement)</p>
              <p>• Statement seterusnya: <strong>8 Februari</strong></p>
              <p>• Tarikh due: <strong>28 Februari</strong></p>
              <p className="text-green-700 font-bold">→ Float = <strong>50 hari!</strong> Wang di tangan hampir 2 bulan.</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              CardFloat Pro kira semua ini secara automatik untuk setiap kad anda.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Soalan Lazim</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Adakah selamat untuk masukkan maklumat kad kredit?',
                a: 'CardFloat Pro tidak simpan nombor penuh kad kredit anda. Kami hanya perlukan maklumat asas seperti had kredit, baki semasa, dan hari statement untuk kira float. Semua data dilindungi dengan penyulitan Supabase.',
              },
              {
                q: 'Apa itu "float" kad kredit?',
                a: 'Float adalah bilangan hari antara tarikh anda membeli sesuatu dan tarikh anda perlu bayar. Semakin panjang float, semakin lama wang anda ada dalam tangan (atau dalam akaun simpanan yang menjana faedah).',
              },
              {
                q: 'Boleh ke saya guna untuk semua jenis kad kredit?',
                a: 'Ya! CardFloat Pro berfungsi untuk semua kad kredit Malaysia — Visa, Mastercard, dan Amex dari mana-mana bank termasuk Maybank, CIMB, Affin, Al-Rajhi, dan lain-lain.',
              },
              {
                q: 'Adakah pelan Free benar-benar percuma?',
                a: 'Ya, pelan Free adalah percuma selamanya. Anda boleh tambah sehingga 2 kad kredit dan guna semua ciri asas tanpa had masa. Naik taraf ke Pro hanya jika anda perlukan lebih banyak kad atau ciri lanjutan.',
              },
              {
                q: 'Bagaimana cara bayar untuk Pro?',
                a: 'Fungsi pembayaran sedang dalam pembangunan. Buat masa ini anda boleh daftar dan guna semua ciri secara percuma. Kami akan maklumkan apabila ia sedia.',
              },
            ].map((item, i) => (
              <details key={i} className="group rounded-xl border border-gray-100 bg-white">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium list-none">
                  {item.q}
                  <ChevronDown className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" />
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Jangan bazir float lagi mulai hari ini
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Daftar dalam masa 2 minit. Percuma. Tiada kad kredit diperlukan untuk mendaftar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-base hover:bg-blue-50 transition-colors shadow-lg"
            >
              Daftar Percuma Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-blue-400 text-white font-semibold text-base hover:bg-blue-700 transition-colors"
            >
              Log Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="font-semibold text-gray-900">CardFloat Pro</div>
          <p>© 2025 CardFloat Pro. Hak cipta terpelihara.</p>
          <div className="flex gap-4">
            <Link href="/auth/login" className="hover:text-gray-900">Log Masuk</Link>
            <Link href="/auth/register" className="hover:text-gray-900">Daftar</Link>
            <Link href="#harga" className="hover:text-gray-900">Harga</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

