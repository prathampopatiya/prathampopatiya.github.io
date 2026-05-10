import { getSortedPostsData } from '@/lib/posts'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { MatrixRain } from '@/components/matrix-rain'
import { Shield, Bug, Binary, Cpu } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const posts = getSortedPostsData()

  return (
    <div className="min-h-screen flex flex-col relative">
      <MatrixRain />
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl">
            <div className="font-mono text-sm text-primary mb-4">
              {'>'} whoami
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 glitch text-balance">
              Security Researcher
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Diving deep into binaries, dissecting malware, and exploring the 
              low-level mechanics of software security. Welcome to my research notes.
            </p>
            
            {/* Stats/Focus Areas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="border border-border rounded-lg p-4 bg-card/30 hover:bg-card/50 transition-colors group">
                <Binary className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-mono text-sm text-muted-foreground">Reverse</div>
                <div className="font-semibold">Engineering</div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card/30 hover:bg-card/50 transition-colors group">
                <Bug className="h-6 w-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-mono text-sm text-muted-foreground">Malware</div>
                <div className="font-semibold">Analysis</div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card/30 hover:bg-card/50 transition-colors group">
                <Shield className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-mono text-sm text-muted-foreground">Exploit</div>
                <div className="font-semibold">Development</div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card/30 hover:bg-card/50 transition-colors group">
                <Cpu className="h-6 w-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-mono text-sm text-muted-foreground">Binary</div>
                <div className="font-semibold">Analysis</div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-mono">
              <span className="text-primary">$</span> ls ./recent_posts
            </h2>
            <Link 
              href="/posts" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              [view_all]
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 6).map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-lg p-12 text-center">
              <div className="font-mono text-muted-foreground mb-4">
                <span className="text-primary">$</span> cat /dev/null
              </div>
              <p className="text-muted-foreground mb-4">
                No posts yet. Add markdown files to the <code className="text-primary">/posts</code> directory.
              </p>
              <div className="inline-block bg-card border border-border rounded-lg p-4 text-left font-mono text-sm">
                <div className="text-muted-foreground"># Create your first post:</div>
                <div className="text-foreground mt-2">posts/my-first-post.md</div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
