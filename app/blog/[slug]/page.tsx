import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { ArrowLeft, Calendar } from 'lucide-react'

export const revalidate = 60

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  // Simple markdown → HTML renderer (no deps needed)
  const rendered = renderMarkdown(post.content)

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex items-center gap-3">
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              ← Blog
            </Link>
            <Link href="/auth/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200/60">
              Cuba Percuma
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto px-4 py-16">
        {post.cover_image && (
          <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
            <img src={post.cover_image} alt={post.title} className="w-full object-cover max-h-72" />
          </div>
        )}

        <header className="mb-10">
          {post.published_at && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          {post.excerpt && <p className="text-xl text-gray-500 leading-relaxed">{post.excerpt}</p>}
        </header>

        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />

        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
          </Link>
        </div>
      </article>
    </div>
  )
}

function renderMarkdown(md: string): string {
  let html = md
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Code block
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Unordered lists
    .replace(/^\s*[-*+] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*<\/li>)/, '<ul>$1</ul>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')

  return `<p>${html}</p>`
    .replace(/<p><(h[1-3]|ul|ol|li|pre|blockquote|hr)/g, '<$1')
    .replace(/<\/(h[1-3]|ul|ol|li|pre|blockquote)><\/p>/g, '</$1>')
}
