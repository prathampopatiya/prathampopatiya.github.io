'use client'

import Link from 'next/link'
import { Terminal, Github, Twitter, Rss } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Header() {
  const [typedText, setTypedText] = useState('')
  const fullText = '~/security-research'

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 80)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 group-hover:border-primary/50 transition-colors">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <div className="font-mono">
            <span className="text-muted-foreground">$</span>
            <span className="text-primary ml-1">{typedText}</span>
            <span className="cursor-blink text-primary">_</span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            [home]
          </Link>
          <Link 
            href="/posts" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            [posts]
          </Link>
          <Link 
            href="/about" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            [about]
          </Link>
          
          <div className="flex items-center gap-3 ml-4 border-l border-border pl-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <Link 
              href="/rss.xml"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="RSS Feed"
            >
              <Rss className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
