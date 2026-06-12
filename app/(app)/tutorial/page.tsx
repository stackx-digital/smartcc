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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">User Guide</h1>
        <p className="text-gray-400 text-sm">Learn how to use smartcc to optimise your credit card float</p>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {[
          { href: '#konsep', icon: Lightbulb, label: 'Float Concept', color: 'bg-amber-50 text-amber-600 border-amber-100' },
          { href: '#dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'bg-blue-50 text-blue-600 border-blue-100' },
          { href: '#planner', icon: Calculator, label: 'Planner', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
          { href: '#tips', icon: TrendingUp, label: 'Pro Tips', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
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
          <h2 className="text-xl font-bold text-gray-900">Understanding the Float Concept</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <p className="text-gray-700 leading-relaxed mb-5">
            <strong>Float</strong> is the number of days between when you make a credit card purchase and when you need to pay — <span className="text-blue-600 font-semibold">with zero interest.</span> The longer the float, the longer your money stays in your account.
          </p>

          {/* Formula box */}
          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white mb-5">
            <p className="text-sm text-blue-200 mb-1 font-medium">Formula</p>
            <p className="text-2xl font-extrabold">Float = Due Date − Purchase Date</p>
          </div>

          {/* Example */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-600 mb-4">📌 Example: Card with statement on day 8, due +20 days</p>
            <div className="space-y-2.5">
              {[
                { step: '1', text: 'Purchase on Jan 9 (one day after statement)', color: 'bg-blue-100 text-blue-700' },
                { step: '2', text: 'Statement date: Feb 8', color: 'bg-slate-100 text-slate-700' },
                { step: '3', text: 'Due date: Feb 28', color: 'bg-slate-100 text-slate-700' },
                { step: '✓', text: 'Float = 50 days! Your money sits for nearly 2 months', color: 'bg-emerald-100 text-emerald-700' },
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
              <span className="font-semibold text-red-700 text-sm">Don't do this</span>
            </div>
            <p className="text-sm text-gray-700">Buy <strong>3 days before</strong> statement date → only ~22 days float</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-emerald-700 text-sm">The right way</span>
            </div>
            <p className="text-sm text-gray-700">Buy <strong>one day after</strong> statement date → up to ~50 days float</p>
          </div>
        </div>
      </section>

      {/* Section 2: Dashboard */}
      <section id="dashboard" className="mb-14 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard — View Status of All Cards</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            The dashboard shows all your credit cards with a traffic light status — so you can see <strong>at a glance</strong> which card is best to use today.
          </p>

          {/* Traffic light explanation */}
          <div className="space-y-3">
            {[
              {
                dot: 'bg-emerald-500',
                label: 'Green — Best Time',
                desc: 'Just after statement date. Long float (35–50 days). Use this card now!',
                bg: 'bg-emerald-50 border-emerald-100',
              },
              {
                dot: 'bg-amber-500',
                label: 'Yellow — Usable',
                desc: 'Moderate float (20–34 days). Still fine for everyday purchases.',
                bg: 'bg-amber-50 border-amber-100',
              },
              {
                dot: 'bg-red-500',
                label: 'Red — Avoid for Now',
                desc: 'Near statement date. Short float (< 20 days). Hold off on big purchases.',
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
            <p className="text-sm font-semibold text-blue-800 mb-1">No cards yet?</p>
            <p className="text-sm text-blue-700">Add your credit cards in the <Link href="/cards" className="font-semibold underline underline-offset-2">My Cards</Link> section to get started. You only need to enter the credit limit, current balance, and statement day.</p>
          </div>
        </div>
      </section>

      {/* Section 3: My Cards */}
      <section id="cards" className="mb-14 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
          <h2 className="text-xl font-bold text-gray-900">My Cards — Manage Your Credit Cards</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-700 text-sm leading-relaxed mb-5">
            Add all your credit cards. You <strong>do not need to enter the full card number</strong> — only basic information needed for float calculations.
          </p>

          <div className="space-y-3">
            {[
              { icon: '🏦', label: 'Card Name & Bank', desc: 'e.g. "Maybank Visa Gold" — to identify your card' },
              { icon: '💰', label: 'Credit Limit', desc: 'The maximum amount allowed by the bank' },
              { icon: '📊', label: 'Current Balance', desc: 'The amount you have spent (outstanding balance)' },
              { icon: '📅', label: 'Statement Day', desc: 'The day each month your statement is generated. This is the key to float calculation!' },
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
              💡 <strong>Where to find the statement day?</strong> Check your monthly credit card statement, or log in to your bank's internet banking.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Purchase Planner */}
      <section id="planner" className="mb-14 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">4</div>
          <h2 className="text-xl font-bold text-gray-900">Purchase Planner — Choose the Best Card</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <p className="text-gray-700 text-sm leading-relaxed mb-5">
            Purchase Planner compares <strong>all your credit cards at once</strong> for your chosen purchase date — and recommends the card that gives the longest float.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { num: '1', title: 'Select purchase date', desc: 'Enter the date you plan to make the purchase (can be a future date)' },
              { num: '2', title: 'Enter item name & amount (optional)', desc: 'To save the record in History' },
              { num: '3', title: 'System compares all cards', desc: 'Float for each card is calculated automatically' },
              { num: '4', title: 'Pick the recommended card', desc: 'The card with the longest float is marked as "Recommended"' },
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
            <p className="text-sm font-semibold text-indigo-800 mb-1">Example use case</p>
            <p className="text-sm text-indigo-700">Planning to buy a laptop next week. Enter the date in the Planner — the system will tell you "use Maybank Card, get 47 days float" vs "CIMB Card, only 23 days float."</p>
          </div>
        </div>
      </section>

      {/* Section 5: History */}
      <section id="history" className="mb-14 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">5</div>
          <h2 className="text-xl font-bold text-gray-900">History — Your Float Records</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            All float calculations you save will be listed here. You can filter by card or date range.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: '📋', label: 'Full records', desc: 'Item name, amount, date, float days' },
              { icon: '🔍', label: 'Filter & search', desc: 'Filter by card or time period' },
              { icon: '📥', label: 'Export CSV', desc: 'Available for Pro users' },
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
          <h2 className="text-xl font-bold text-gray-900">Pro Tips</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: '💳', title: 'Pay Statement Balance, Not Minimum', desc: 'Pay your full statement balance before the due date = 0% interest. Never pay only the minimum.' },
            { icon: '📅', title: 'Buy One Day After Statement', desc: 'This is the best time for maximum float. Save big purchases for right after your statement date.' },
            { icon: '🎯', title: 'Don\'t Pay Per Transaction', desc: 'Paying each transaction separately will keep your statement balance low and cause you to miss cashback thresholds.' },
            { icon: '🃏', title: '3-Card Strategy', desc: 'Card 1: daily spending (rewards). Card 2: backup balance transfer. Card 3: 0% instalment for big purchases.' },
            { icon: '📊', title: 'Manage Utilization Rate', desc: 'Keep utilization below 30% of your credit limit for a healthy credit score.' },
            { icon: '🔔', title: 'Set Due Date Reminder', desc: 'Set a reminder 3 days before the due date to avoid late payments and penalty charges.' },
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
        <p className="font-bold text-lg mb-2">Ready? Start using smartcc now!</p>
        <p className="text-blue-200 text-sm mb-5">Add your first credit card and see how many float days you can get.</p>
        <Link href="/cards" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-lg">
          Add Credit Card <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  )
}
