import { getSortedPostsData } from '@/lib/posts'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { Shield, Bug, Binary, Cpu } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const posts = getSortedPostsData()

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl">
            <div className="text-sm font-medium text-primary mb-4 tracking-wider uppercase">
              Security Researcher
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance tracking-tight">
              rayqu4z4
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Diving deep into binaries, dissecting malware, and exploring the 
              low-level mechanics of software security. Welcome to my research notes.
            </p>
            
            {/* Stats/Focus Areas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors group shadow-sm">
                <Binary className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm text-muted-foreground">Reverse</div>
                <div className="font-semibold">Engineering</div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors group shadow-sm">
                <Bug className="h-6 w-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm text-muted-foreground">Malware</div>
                <div className="font-semibold">Analysis</div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors group shadow-sm">
                <Shield className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm text-muted-foreground">Exploit</div>
                <div className="font-semibold">Development</div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors group shadow-sm">
                <Cpu className="h-6 w-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm text-muted-foreground">Binary</div>
                <div className="font-semibold">Analysis</div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Recent Posts
            </h2>
            <Link 
              href="/posts" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              View all posts &rarr;
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 6).map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-lg p-12 text-center bg-muted/10">
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">
                Add markdown files to the <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">/posts</code> directory to get started.
              </p>
              <div className="inline-block bg-card border border-border rounded-lg p-4 text-left font-mono text-sm shadow-sm">
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
