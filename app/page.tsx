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
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              Blog
            </Link>
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              Log In
            </Link>
            <Link href="/auth/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200/60">
              Try for Free
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
            Free forever for 2 credit cards
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Using your credit card{' '}
            <span className="relative inline-block">
              <span className="gradient-text">every day,</span>
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
            but zero cashback?
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Not because you don&apos;t spend. But because you{' '}
            <strong className="text-gray-800">don&apos;t know one simple thing</strong>{' '}
            — that we&apos;re going to show you today.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-300/40 hover:shadow-blue-400/40 hover:-translate-y-0.5"
            >
              Show Me How <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-gray-700 font-semibold text-base hover:bg-white hover:border-gray-300 transition-all shadow-sm backdrop-blur"
            >
              View Demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-gray-500">
            {['No credit card required', 'Set up in 2 minutes', 'Safe & private'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: '50', label: 'Max Float Days', color: 'text-blue-600' },
              { value: 'RM0', label: 'Starting Cost', color: 'text-emerald-600' },
              { value: '2min', label: 'Setup Time', color: 'text-violet-600' },
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Real Story</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Does this sound like you?</h2>
          </div>

          {/* Story card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 p-8 sm:p-10 shadow-lg mb-10">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Ahmad, 35. Earns RM5,000 a month. Holds two credit cards.
              Spends RM300 here, RM500 there — food, fuel, groceries, online shopping.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Every time a bill comes in, he <strong className="text-gray-900">pays immediately</strong>.
              He thinks he&apos;s being smart — &ldquo;pay fast, avoid interest.&rdquo;
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              At year end he checks his cashback: <strong className="text-red-600 text-xl">RM0.</strong>{' '}
              Even though he charged over RM6,000 to his cards that year.
            </p>
          </div>

          {/* The reveal */}
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6 shadow-sm">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900 mb-2">What did Ahmad do wrong?</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Every time he spent RM300, he paid it off immediately. So his statement balance was always low.
                  His cashback card had a condition: you need to hit <strong>RM4,000 in a single statement</strong> to earn cashback.
                  Because he paid after every transaction, his statement never reached RM4,000 — even though he spent RM6,000 that year.{' '}
                  <strong className="text-red-700">RM0 cashback. Every year.</strong>
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-400 mb-3">The Hard Truth</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The real enemy isn&apos;t credit card interest.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              The real enemy is <strong className="text-white">not knowing how credit cards actually work.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '😶',
                title: 'Most people are confused',
                desc: 'Between "statement balance" and "outstanding balance". This difference can cost you hundreds of ringgit every year.',
              },
              {
                icon: '💸',
                title: 'Paying at the wrong time',
                desc: 'Paying too early kills your cashback chances. Paying too late means interest charges. There is a right time — and most people don\'t know when.',
              },
              {
                icon: '🃏',
                title: 'Only one card',
                desc: 'Using one card for everything = no strategy. Credit cards have different strengths. Use the 3-card strategy to protect yourself.',
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
              &ldquo;Debt isn&apos;t destiny. It&apos;s a choice — one that starts with a lack of knowledge.&rdquo;
            </p>
            <p className="text-blue-400 text-sm mt-3">— Smart credit card management principle</p>
          </div>
        </div>
      </section>

      {/* ─── THE FLOAT REVELATION ─── */}
      <section className="relative py-24 px-4 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-25" />
        <div className="mesh-blob-2 top-0 right-0 opacity-40" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The Solution</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What is "Float" — and why does it matter?</h2>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-7 shadow-lg border border-blue-50">
              <h3 className="font-bold text-lg mb-3 text-gray-900">Imagine this:</h3>
              <p className="text-gray-600 leading-relaxed">
                You buy something today on your credit card. But you <em>actually</em> don&apos;t need to pay it back
                for <strong className="text-blue-700">50 days</strong> — interest-free.
                For those 50 days, your money stays in your account. Earning interest. Available for other needs.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-7 shadow-lg border border-emerald-50">
              <h3 className="font-bold text-lg mb-3 text-gray-900">But only if you know <em>when</em> to buy:</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-red-700 text-sm">Wrong timing</span>
                  </div>
                  <p className="text-red-600 text-sm">3 days before statement → only <strong>22 days</strong> float</p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-emerald-700 text-sm">Right timing</span>
                  </div>
                  <p className="text-emerald-600 text-sm">One day after statement → up to <strong>50 days</strong> float</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-blue-600 p-7 text-white shadow-xl shadow-blue-200/60">
              <p className="text-lg font-semibold mb-2">The difference = 28 days.</p>
              <p className="text-blue-200 leading-relaxed">
                For a RM10,000 purchase — that means RM10,000 stays in your savings account
                for <strong className="text-white">28 extra days</strong>. At 3.5% annual interest,
                that&apos;s over RM26 you get for free. On every big purchase.
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Pro Strategy</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The 3-Card Strategy — Your Financial Shield</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Smart credit card users don&apos;t rely on just one card.
              They have a system — and that system has three layers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '1',
                color: 'from-blue-500 to-blue-600',
                badge: 'bg-blue-100 text-blue-700',
                title: 'Daily Card (Rewards)',
                role: 'Rewards Generator',
                desc: 'Your everyday card — dining, fuel, groceries. Pick the one with the best cashback or points. Use it consistently, pay the FULL balance each statement.',
                tip: 'Tip: Hit the cashback threshold every month. Don\'t pay after every transaction!',
              },
              {
                num: '2',
                color: 'from-amber-500 to-orange-500',
                badge: 'bg-amber-100 text-amber-700',
                title: 'Balance Transfer Card',
                role: 'Backup Plan',
                desc: 'A card with balance transfer facility at low interest (0–5%). Use only in emergencies. This is your financial safety net.',
                tip: 'Tip: Don\'t use for everyday purchases. Save it for urgent situations.',
              },
              {
                num: '3',
                color: 'from-emerald-500 to-teal-600',
                badge: 'bg-emerald-100 text-emerald-700',
                title: '0% EPP / FPP Card',
                role: 'Big Purchases',
                desc: 'For large purchases like electronics, furniture, travel. Split into 12–24 months interest-free. Your money stays in your hands longer.',
                tip: 'Tip: Always check minimum purchase requirements and terms before applying.',
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
              smartcc helps you manage all 3 cards in one dashboard — and know <em>which card</em> to use <em>today.</em>
            </p>
          </div>
        </div>
      </section>

      {/* ─── HOW SMARTCC SOLVES IT ─── */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">The Solution</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              smartcc does all the math for you
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">In 2 minutes, you know exactly — which card, which day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px bg-gradient-to-r from-blue-500/50 to-indigo-500/50" />
            {[
              { step: '01', title: 'Sign Up & Add Cards', desc: 'Enter your basic credit card details — credit limit, balance, and statement day. No full card numbers required.' },
              { step: '02', title: 'At-a-Glance Dashboard', desc: 'Green/yellow/red traffic lights show the status of each card. Green = best time to buy now. Red = hold off.' },
              { step: '03', title: 'Plan & Optimize', desc: 'Enter your planned purchase date. The system finds the card with the longest float and recommends the best timing.' },
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Built specifically for Malaysian credit card users</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BarChart3, title: 'Float Calculator', desc: 'Calculate exactly how many float days you get for any purchase date and credit card.', accent: 'from-blue-500 to-blue-600' },
              { icon: Zap, title: 'Traffic Light System', desc: 'Green/yellow/red status on every card — know at a glance whether today is the best time to buy.', accent: 'from-amber-400 to-orange-500' },
              { icon: Calculator, title: 'Smart Purchase Planner', desc: 'Compare all your cards and get the best card recommendation for any chosen purchase date.', accent: 'from-indigo-500 to-violet-600' },
              { icon: CreditCard, title: 'Multi-Card Management', desc: 'Manage all your credit cards in one place. Track balances, credit limits, and utilization for each card.', accent: 'from-pink-500 to-rose-500' },
              { icon: TrendingUp, title: 'Float History', desc: 'Record all your float calculations. Filter by card or date and export to CSV (Pro).', accent: 'from-emerald-500 to-teal-600' },
              { icon: Shield, title: 'Safe & Private', desc: 'Your data is encrypted and protected by Supabase. We never store sensitive credit card information.', accent: 'from-slate-600 to-slate-700' },
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
      <section className="relative py-24 px-4 bg-white overflow-hidden" id="pricing">
        <div className="absolute inset-0 bg-dot-pattern opacity-25" />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, affordable pricing</h2>
            <p className="text-gray-500">Start free. Upgrade when you&apos;re ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Free</h3>
                <p className="text-gray-400 text-sm">To get started</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">RM0</span>
                  <span className="text-gray-400 mb-1">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {['Up to 2 credit cards', 'Float calculator', 'Traffic light dashboard', 'Smart Purchase Planner', '30-day history'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="block text-center w-full py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all">
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-2xl shadow-blue-300/40">
              <div className="absolute inset-0 bg-dot-pattern opacity-10" />
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  ⭐ MOST POPULAR
                </span>
              </div>
              <div className="relative mb-6 pt-2">
                <h3 className="text-xl font-bold mb-1">Pro</h3>
                <p className="text-blue-200 text-sm">For serious users</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">RM9</span>
                  <span className="text-blue-200 mb-1">/month</span>
                </div>
              </div>
              <ul className="relative space-y-3 mb-8">
                {['Everything in Free', 'Unlimited credit cards', 'Export history to CSV', 'Full history (no limit)', 'Advanced analytics', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-200 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="relative block text-center w-full py-3 rounded-xl bg-white font-bold text-blue-600 hover:bg-blue-50 transition-colors shadow-lg">
                Try Pro Free for 14 Days
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
          <h2 className="text-3xl font-bold text-white mb-4">The Proven Float Formula</h2>
          <p className="text-slate-400 mb-10">Simple math that most people never fully use</p>

          <div className="rounded-2xl p-8 text-left border border-slate-700 bg-slate-800 shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-5xl">🧮</span>
              <p className="text-2xl font-bold text-white mt-4">Float = Due Date − Purchase Date</p>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 text-sm space-y-3">
              <p className="text-blue-400 font-semibold text-base">Example: Card statement on the 8th, due +20 days</p>
              <p className="text-slate-200">• Buy on <strong className="text-white font-bold">January 9</strong> <span className="text-slate-400">(one day after statement)</span></p>
              <p className="text-slate-200">• Next statement: <strong className="text-white font-bold">February 8</strong></p>
              <p className="text-slate-200">• Due date: <strong className="text-white font-bold">February 28</strong></p>
              <div className="pt-2 border-t border-slate-700">
                <p className="text-emerald-400 font-bold text-base">→ Float = <span className="text-emerald-300">50 days!</span> Money in hand for nearly 2 months.</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-5 text-center">
              smartcc calculates all of this automatically for every card you have.
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
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'Is it safe to enter my credit card details?', a: 'smartcc never stores your full credit card number. We only need basic information like credit limit, current balance, and statement day to calculate float. All data is protected with Supabase encryption.' },
              { q: 'What\'s the difference between "statement balance" and "outstanding balance"?', a: '"Statement balance" is the amount shown on your monthly statement — this is what you need to pay to avoid interest. "Outstanding balance" is your current total including transactions not yet on the statement. Many people confuse the two and end up paying the wrong amount.' },
              { q: 'What is credit card "float"?', a: 'Float is the number of days between when you make a purchase and when you need to pay for it. The longer the float, the longer your money stays in your hands — or in a savings account earning interest.' },
              { q: 'Does this work with all types of credit cards?', a: 'Yes! smartcc works with all Malaysian credit cards — Visa, Mastercard, and Amex from any bank including Maybank, CIMB, Affin, Al-Rajhi, and more.' },
              { q: 'Is the Free plan really free?', a: 'Yes, the Free plan is free forever. You can add up to 2 credit cards and use all core features with no time limit. Upgrade to Pro only if you need more cards or advanced features.' },
              { q: 'How do I pay for Pro?', a: 'Payment functionality is currently in development. For now, you can register and use all features for free. We\'ll notify you when it\'s ready.' },
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
            Ahmad already signed up. Now it&apos;s your turn.
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 leading-tight">
            Don&apos;t let next year end<br />with zero cashback again.
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Sign up in 2 minutes. Free. Start optimizing your float today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-base hover:bg-blue-50 transition-all shadow-2xl hover:-translate-y-0.5"
            >
              Sign Up Free Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/30 bg-white/10 text-white font-semibold text-base hover:bg-white/20 transition-all backdrop-blur"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 px-4 bg-slate-950 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <Logo size="sm" className="[&_span]:text-white" />
          <p>© 2026 smartcc. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/auth/login" className="hover:text-white transition-colors">Log In</Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">Sign Up</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
