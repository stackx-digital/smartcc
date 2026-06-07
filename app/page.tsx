import Link from 'next/link'
import { Calculator, CreditCard, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Calculator,
      title: 'Float Calculator',
      description: 'Kira dengan tepat berapa hari float yang anda akan dapat untuk setiap kad dan tarikh pembelian.',
    },
    {
      icon: TrendingUp,
      title: 'Traffic Light System',
      description: 'Isyarat hijau/kuning/merah yang menunjukkan sama ada hari ini masa terbaik untuk guna kad kredit anda.',
    },
    {
      icon: CreditCard,
      title: 'Smart Planner',
      description: 'Masukkan tarikh pembelian dan bandingkan semua kad anda untuk cari float terpanjang secara automatik.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
          ✨ Percuma untuk bermula
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Maximize Your<br />
          <span className="text-blue-600">Credit Card Float</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Tahu bila masa terbaik untuk guna kad kredit dan dapatkan sehingga{' '}
          <strong>50 hari float percuma</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            See Demo
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-white rounded-xl border p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 bg-blue-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Berapa float yang anda hilang setiap bulan?</h2>
          <p className="text-blue-200 mb-6">Ramai orang tidak sedar mereka membeli pada masa yang salah dan kehilangan puluhan hari float percuma.</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
          >
            Mula Kira Float Saya
          </Link>
        </div>
      </div>
    </div>
  )
}
