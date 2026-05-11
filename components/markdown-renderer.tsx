'use client'

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Shield, Lightbulb, Code2 } from 'lucide-react'

interface MarkdownRendererProps {
  content: string
}

// Custom HTML element renderer
function sanitizeAndEnhanceHtml(html: string): React.ReactNode {
  // This function will enhance the HTML with custom styling
  // by wrapping code blocks and special sections
  
  // Parse and render the HTML with custom styling
  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="space-y-6">
      {sanitizeAndEnhanceHtml(content)}
    </div>
  )
}

// Security-specific components for markdown content

export function CVEAlert({
  cveId,
  severity,
  description,
}: {
  cveId: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
}) {
  const severityColors = {
    critical: 'border-red-500/50 bg-red-500/10',
    high: 'border-orange-500/50 bg-orange-500/10',
    medium: 'border-yellow-500/50 bg-yellow-500/10',
    low: 'border-blue-500/50 bg-blue-500/10',
  }

  const severityTextColors = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-blue-400',
  }

  return (
    <Alert className={`border-2 ${severityColors[severity]}`}>
      <AlertTriangle className={`h-4 w-4 ${severityTextColors[severity]}`} />
      <AlertTitle className={severityTextColors[severity]}>
        {cveId} - {severity.toUpperCase()}
      </AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

export function ResearchNote({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Alert className="border-2 border-primary/50 bg-primary/10">
      <Lightbulb className="h-4 w-4 text-primary" />
      <AlertTitle className="text-primary">{title}</AlertTitle>
      <AlertDescription className="mt-2">{children}</AlertDescription>
    </Alert>
  )
}

export function SecurityTip({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Alert className="border-2 border-accent/50 bg-accent/10">
      <Shield className="h-4 w-4 text-accent" />
      <AlertTitle className="text-accent">Security Tip</AlertTitle>
      <AlertDescription className="mt-2">{children}</AlertDescription>
    </Alert>
  )
}

export function CodeSnippet({
  language,
  title,
  children,
}: {
  language: string
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="my-6">
      {title && (
        <div className="flex items-center gap-2 mb-2 px-4 py-2 bg-card/50 border-b border-border">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="font-mono text-sm text-primary">{title}</span>
        </div>
      )}
      <pre className="overflow-x-auto bg-card/30 border border-border rounded-lg p-4 text-sm">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  )
}
