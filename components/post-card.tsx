import Link from 'next/link'
import { Calendar, Tag, ChevronRight } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'

interface PostCardProps {
  post: PostMeta
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="group relative border border-border rounded-lg p-6 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/20 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/20 rounded-bl-lg" />
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-mono">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formattedDate}
        </span>
        {post.tags.length > 0 && (
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {post.tags.slice(0, 2).join(', ')}
          </span>
        )}
      </div>
      
      <Link href={`/posts/${post.slug}`} className="block">
        <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2 glitch">
          {post.title}
        </h2>
      </Link>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {post.excerpt}
      </p>
      
      <Link 
        href={`/posts/${post.slug}`}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-mono"
      >
        {'>'} read_more
        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </article>
  )
}
