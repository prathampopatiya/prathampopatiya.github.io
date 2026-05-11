import { getSortedPostsData } from '@/lib/posts'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { MatrixRain } from '@/components/matrix-rain'

export default function PostsPage() {
  const posts = getSortedPostsData()

  return (
    <div className="min-h-screen flex flex-col relative">
      <MatrixRain />
      <Header />
      
      <main className="flex-1 relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="font-mono text-sm text-primary mb-2">
              {'>'} find ./posts -type f -name &quot;*.md&quot;
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">All Posts</h1>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-lg p-12 text-center">
              <div className="font-mono text-muted-foreground mb-4">
                <span className="text-primary">$</span> ls -la ./posts/
              </div>
              <p className="text-muted-foreground">
                No posts found. Create markdown files in the <code className="text-primary">/posts</code> directory.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}