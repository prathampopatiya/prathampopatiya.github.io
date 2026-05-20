import Link from 'next/link'
import { Calendar, Tag, ChevronRight, AlertCircle, Clock } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

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
  const formattedDate = formatDate(post.date)

  return (
    <article className="group relative border border-border bg-card p-6 transition-all duration-300 hover:bg-muted/30 hover:border-primary">
      {/* Active Rail (Cyberpunk accent) */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary group-hover:shadow-[0_0_12px_var(--color-primary)] transition-colors" />

      {/* Top brackets (purely aesthetic) */}
      <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-transparent group-hover:border-primary transition-colors" />
      <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-transparent group-hover:border-primary transition-colors" />
      <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-transparent group-hover:border-primary transition-colors" />
      <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-transparent group-hover:border-primary transition-colors" />

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4 font-mono tracking-widest uppercase">
        <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
          <span className="text-primary mr-1">//</span> {formattedDate}
        </span>
        {post.readingTime && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min
          </span>
        )}
        {(post as any).category && (
          <span className="px-2 py-0.5 bg-primary text-black font-bold text-[10px]">
            {(post as any).category}
          </span>
        )}
        {(post as any).risk && (
          <span className={`px-2 py-0.5 text-black font-bold text-[10px] uppercase ${
            (post as any).risk === 'critical' ? 'bg-accent' : 
            (post as any).risk === 'high' ? 'bg-primary' : 
            'bg-terminal'
          }`}>
            {(post as any).risk}
          </span>
        )}
      </div>
      
      <Link href={`/posts/${post.slug}`} className="block">
        <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 tracking-wide">
          {post.title}
        </h2>
      </Link>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 border-l-2 border-accent pl-3">
        {post.excerpt}
      </p>
      
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-widest px-2 py-1 bg-white/5 text-muted-foreground border border-border group-hover:border-border group-hover:text-foreground transition-colors uppercase"
            >
              [{tag}]
            </span>
          ))}
        </div>
      )}
      
      <Link 
        href={`/posts/${post.slug}`}
        className="inline-flex items-center gap-2 font-mono text-xs tracking-widest font-bold text-primary hover:text-accent transition-colors uppercase"
      >
        <span className="text-accent">{'>'}</span> Read_More
        <span className="animate-pulse">_</span>
      </Link>
    </article>
  )
}
