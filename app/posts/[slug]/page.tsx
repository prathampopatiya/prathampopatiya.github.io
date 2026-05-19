import { getPostData, getAllPostSlugs } from '@/lib/posts'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Calendar, Tag, ArrowLeft, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = getAllPostSlugs()
  // Return at least one placeholder if no posts exist to satisfy static export
  if (posts.length === 0) {
    return [{ slug: 'placeholder' }]
  }
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
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

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  try {
    const post = await getPostData(slug)
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Calculate reading time
    const wordCount = post.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    return (
      <div className="min-h-screen flex flex-col relative">
        <Header />

        <main className="flex-1 relative z-10 container mx-auto px-4 py-16">
          <article className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              cd ../posts
            </Link>

            {/* Post Header */}
            <header className="mb-12">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readingTime} min read
                </span>
                {post.author && (
                  <span>by {post.author}</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 glitch text-balance">
                {post.title}
              </h1>

              {/* Category and Risk Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {(post as any).category && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono border border-primary/30">
                    <span>{categoryEmojis[(post as any).category] || '📌'}</span>
                    {(post as any).category.replace('-', ' ')}
                  </span>
                )}
                {(post as any).risk && (
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${riskColors[(post as any).risk]}`}>
                    <AlertCircle className="h-3 w-3" />
                    {(post as any).risk.toUpperCase()}
                  </span>
                )}
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-mono border border-accent/30"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Post Content */}
            <div
              className="prose dark:prose-invert max-w-none prose-code:bg-card/50 prose-code:text-accent prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-card/50 prose-pre:border prose-pre:border-border prose-pre:p-4 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-a:text-primary prose-a:hover:text-primary/80 prose-a:transition-colors prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Post Footer */}
            <footer className="mt-16 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <Link
                  href="/posts"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  <ArrowLeft className="h-4 w-4" />
                  back to posts
                </Link>
                <div className="font-mono text-xs text-muted-foreground">
                  EOF
                </div>
              </div>
            </footer>
          </article>
        </main>

        <Footer />
      </div>
    )
  } catch {
    notFound()
  }
}
