import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import BlogEditor from '../../BlogEditor'

export default async function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', id).single()
  if (!post) notFound()
  return <BlogEditor post={post} />
}
