import type { Metadata } from 'next'
import { marked } from 'marked'
import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Calendar, Clock, ArrowLeft, ChevronRight } from 'lucide-react'

export const revalidate = 60

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcc.my'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, cover_image, published_at, slug')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Post not found — smartcc' }

  const description = post.excerpt || `Read ${post.title} on the smartcc blog.`
  const url = `${SITE_URL}/blog/${post.slug}`
  const image = post.cover_image || `${SITE_URL}/og-default.png`

  return {
    title: `${post.title} — smartcc`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url,
      siteName: 'smartcc',
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.published_at ?? undefined,
      locale: 'en_MY',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [image],
    },
  }
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  // Configure marked for clean HTML
  marked.setOptions({ breaks: true })
  const rendered = marked.parse(post.content) as string

  const readTime = estimateReadTime(post.content)
  const url = `${SITE_URL}/blog/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.cover_image || `${SITE_URL}/og-default.png`,
    url,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: { '@type': 'Organization', name: 'smartcc', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'smartcc',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex items-center gap-3">
            <Link href="/blog" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors hidden sm:flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Blog
            </Link>
            <Link href="/auth/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm">
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">smartcc</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-gray-700 transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-600 truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-5">
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readTime} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-[1.25] mb-5 tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-blue-500 pl-4 bg-blue-50 py-3 pr-4 rounded-r-xl">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Cover image */}
        {post.cover_image && (
          <div className="rounded-2xl overflow-hidden mb-10 shadow-md">
            <img src={post.cover_image} alt={post.title} className="w-full object-cover max-h-80" />
          </div>
        )}

        {/* Article body */}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: rendered }} />

        {/* Footer CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white text-center shadow-xl shadow-blue-200/50">
          <p className="font-bold text-xl mb-2">Want to know the best time to spend?</p>
          <p className="text-blue-200 text-sm mb-5">smartcc calculates maximum float for every one of your credit cards — for free.</p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-lg">
            Try Free Now →
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
