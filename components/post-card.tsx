import Link from 'next/link'
import { Calendar, Tag, ChevronRight, AlertCircle, Clock } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'

interface PostCardProps {
  post: PostMeta
}

const categoryEmojis: { [key: string]: string } = {
  'reverse-engineering': '🔍',
  'malware-analysis': '🦠',
  'exploit': '⚔️',
  'research': '📚',
}

const riskColors: { [key: string]: string } = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="group relative border border-border rounded-lg p-6 bg-card hover:bg-muted/50 hover:border-primary/30 transition-all duration-300 shadow-sm">
      
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3 font-mono">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formattedDate}
        </span>
        {post.readingTime && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min
          </span>
        )}
        {(post as any).category && (
          <span className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
            {categoryEmojis[(post as any).category] || '📌'}
          </span>
        )}
        {(post as any).risk && (
          <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${riskColors[(post as any).risk]}`}>
            <AlertCircle className="h-3 w-3" />
            {(post as any).risk}
          </span>
        )}
      </div>
      
      <Link href={`/posts/${post.slug}`} className="block">
        <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2 tracking-tight">
          {post.title}
        </h2>
      </Link>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {post.excerpt}
      </p>
      
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-accent/10 text-accent rounded border border-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <Link 
        href={`/posts/${post.slug}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Read more
        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </article>
  )
}
