'use client'

import Link from 'next/link'
import { Terminal, Github, Twitter, Rss, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 group-hover:border-primary/50 transition-colors">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <div className="font-medium">
            <span className="text-foreground font-bold tracking-tight">rayqu4z4</span>
            <span className="text-muted-foreground ml-1 font-mono text-sm">/ research</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/posts"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Posts
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>

          <div className="flex items-center gap-3 ml-4 border-l border-border pl-4">
            <a
              href="https://github.com/prathampopatiya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com/prathampopatiya"
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          <Link
            href="/"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/posts"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Posts
          </Link>
          <Link
            href="/about"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <Link
              href="/rss.xml"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="RSS Feed"
            >
              <Rss className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
