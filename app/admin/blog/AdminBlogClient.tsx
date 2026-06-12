'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'

type Post = { id: string; title: string; slug: string; excerpt: string | null; published: boolean; published_at: string | null; created_at: string }

export default function AdminBlogClient({ posts: initial }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initial)

  async function togglePublish(post: Post) {
    const supabase = createClient()
    const updates = {
      published: !post.published,
      published_at: !post.published ? new Date().toISOString() : null,
    }
    const { error } = await supabase.from('blog_posts').update(updates).eq('id', post.id)
    if (error) { toast.error('Failed to update'); return }
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ...updates } : p))
    toast.success(!post.published ? 'Post published' : 'Post hidden')
  }

  async function deletePost(post: Post) {
    if (!confirm(`Delete "${post.title}"?`)) return
    const supabase = createClient()
    const { error } = await supabase.from('blog_posts').delete().eq('id', post.id)
    if (error) { toast.error('Failed to delete'); return }
    setPosts(prev => prev.filter(p => p.id !== post.id))
    toast.success('Post deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} artikel</p>
        </div>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> New Article
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${post.published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-sm text-gray-400 truncate">{post.excerpt || post.slug}</p>
              <p className="text-xs text-gray-300 mt-1">
                {post.published && post.published_at
                  ? `Published ${new Date(post.published_at).toLocaleDateString('en-MY')}`
                  : `Created ${new Date(post.created_at).toLocaleDateString('en-MY')}`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {post.published && (
                <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View post">
                  <Eye className="h-4 w-4" />
                </Link>
              )}
              <button onClick={() => togglePublish(post)} className="p-2 text-gray-400 hover:text-emerald-600 transition-colors" title={post.published ? 'Hide' : 'Publish'}>
                {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <Link href={`/admin/blog/${post.id}/edit`} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Edit">
                <Pencil className="h-4 w-4" />
              </Link>
              <button onClick={() => deletePost(post)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
            <FileTextIcon />
            <p className="mt-3 font-medium">No articles yet</p>
            <p className="text-sm mt-1">Click &ldquo;New Article&rdquo; to start writing</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FileTextIcon() {
  return (
    <svg className="h-10 w-10 mx-auto text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}
