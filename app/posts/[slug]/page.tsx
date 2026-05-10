import { getPostData, getAllPostSlugs } from '@/lib/posts'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MatrixRain } from '@/components/matrix-rain'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
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

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  
  try {
    const post = await getPostData(slug)
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return (
      <div className="min-h-screen flex flex-col relative">
        <MatrixRain />
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
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </span>
                {post.author && (
                  <span>by {post.author}</span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 glitch text-balance">
                {post.title}
              </h1>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono"
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
              className="prose max-w-none"
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
