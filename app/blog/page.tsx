import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { ArrowRight, Calendar } from 'lucide-react'

export const revalidate = 60

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              Log Masuk
            </Link>
            <Link href="/auth/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200/60">
              Cuba Percuma
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Blog</span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Ilmu Kad Kredit</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Tips, strategi, dan panduan untuk optimize penggunaan kad kredit anda</p>
        </div>

        {(posts ?? []).length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="font-medium">Tiada artikel lagi. Nantikan!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(posts ?? []).map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
                {post.cover_image && (
                  <div className="h-44 overflow-hidden bg-gray-100">
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                  {post.excerpt && <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{post.excerpt}</p>}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    {post.published_at && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.published_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    <span className="text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Baca <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
