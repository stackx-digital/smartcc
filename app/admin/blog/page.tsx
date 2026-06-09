import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import AdminBlogClient from './AdminBlogClient'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, published, published_at, created_at')
    .order('created_at', { ascending: false })

  return <AdminBlogClient posts={posts ?? []} />
}
