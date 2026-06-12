'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Eye, Save, Send } from 'lucide-react'

type Post = {
  id: string; title: string; slug: string; excerpt: string | null;
  content: string; cover_image: string | null; published: boolean
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function BlogEditor({ post }: { post?: Post }) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? '')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!post) setSlug(slugify(val))
  }

  async function save(publish?: boolean) {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error('Title, slug, and content are required')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const payload = {
      title, slug, excerpt: excerpt || null,
      content, cover_image: coverImage || null,
      ...(publish !== undefined ? {
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
      } : {}),
    }

    let error
    if (post) {
      ;({ error } = await supabase.from('blog_posts').update(payload).eq('id', post.id))
    } else {
      ;({ error } = await supabase.from('blog_posts').insert({ ...payload, published: publish ?? false, published_at: publish ? new Date().toISOString() : null }))
    }

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(publish ? 'Published!' : 'Saved as draft')
      router.push('/admin/blog')
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{post ? 'Edit Article' : 'New Article'}</h1>
            <p className="text-sm text-gray-400">{post ? `Edit: ${post.title}` : 'Write and publish a new article'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPreview(p => !p)} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 transition-colors">
            <Eye className="h-4 w-4" /> {preview ? 'Editor' : 'Preview'}
          </button>
          <button onClick={() => save(false)} disabled={saving} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 transition-colors disabled:opacity-50">
            <Save className="h-4 w-4" /> Draft
          </button>
          <button onClick={() => save(true)} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
            <Send className="h-4 w-4" /> Publish
          </button>
        </div>
      </div>

      {preview ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{title || 'Article title'}</h1>
          {excerpt && <p className="text-lg text-gray-500 mb-6 leading-relaxed">{excerpt}</p>}
          {coverImage && <img src={coverImage} alt={title} className="w-full rounded-xl mb-8 object-cover max-h-64" />}
          <div className="prose prose-slate max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">{content}</pre>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Your article title..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Slug (URL)</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 flex-shrink-0">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(slugify(e.target.value))}
                  placeholder="tajuk-artikel"
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Summary (Excerpt)</label>
              <input
                type="text"
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="Short summary for listing..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Cover Image URL (optional)</label>
              <input
                type="url"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Content (Markdown)
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`# Title\n\nWrite your article content here using Markdown.\n\n**Bold**, *italic*, [link](url)\n\n## Subtitle\n\n- List item\n- Second item`}
              rows={24}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-y"
            />
            <p className="text-xs text-gray-400 mt-2">Supports Markdown: # heading, **bold**, *italic*, [link](url), - list, ```code```</p>
          </div>
        </div>
      )}
    </div>
  )
}
