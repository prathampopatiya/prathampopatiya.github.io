import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  author?: string
  risk?: 'critical' | 'high' | 'medium' | 'low'
  category?: 'reverse-engineering' | 'malware-analysis' | 'exploit' | 'research'
  readingTime?: number
}

export interface Post extends PostMeta {
  content: string
}

export function getSortedPostsData(): PostMeta[] {
  // Ensure posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      // Calculate reading time (rough estimate: 200 words per minute)
      const wordCount = matterResult.content.split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200)

      return {
        slug,
        title: matterResult.data.title || 'Untitled',
        date: matterResult.data.date || new Date().toISOString(),
        excerpt: matterResult.data.excerpt || '',
        tags: matterResult.data.tags || [],
        author: matterResult.data.author,
        risk: matterResult.data.risk,
        category: matterResult.data.category,
        readingTime,
      }
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }))
}

export async function getPostData(slug: string): Promise<Post> {
  const decodedSlug = decodeURIComponent(slug)
  const fullPath = path.join(postsDirectory, `${decodedSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  let contentHtml: string
  try {
    const processedContent = await unified()
      .use(remarkParse)
      .use(gfm)
      .use(remarkRehype)
      .use(rehypePrettyCode, {
        theme: 'one-dark-pro',
        keepBackground: true,
      })
      .use(rehypeStringify)
      .process(matterResult.content)

    contentHtml = String(processedContent)
  } catch (error) {
    console.error('Failed to parse with rehype-pretty-code:', error)
    const processedContent = await remark()
      .use(gfm)
      .use(html, { sanitize: false })
      .process(matterResult.content)
    contentHtml = processedContent.toString()
  }

  // Manual markdown alerts processing
  contentHtml = contentHtml.replace(
    /<blockquote>\s*<p>\[!NOTE\]\s*([\s\S]*?)<\/blockquote>/gi,
    '<div class="custom-alert custom-alert-note"><div class="custom-alert-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> Note</div><div class="custom-alert-content"><p>$1</div>'
  )
  contentHtml = contentHtml.replace(
    /<blockquote>\s*<p>\[!TIP\]\s*([\s\S]*?)<\/blockquote>/gi,
    '<div class="custom-alert custom-alert-tip"><div class="custom-alert-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> Tip</div><div class="custom-alert-content"><p>$1</div>'
  )
  contentHtml = contentHtml.replace(
    /<blockquote>\s*<p>\[!WARNING\]\s*([\s\S]*?)<\/blockquote>/gi,
    '<div class="custom-alert custom-alert-warning"><div class="custom-alert-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> Warning</div><div class="custom-alert-content"><p>$1</div>'
  )

  // Calculate reading time
  const wordCount = matterResult.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  return {
    slug,
    content: contentHtml,
    title: matterResult.data.title || 'Untitled',
    date: matterResult.data.date || new Date().toISOString(),
    excerpt: matterResult.data.excerpt || '',
    tags: matterResult.data.tags || [],
    author: matterResult.data.author,
    risk: matterResult.data.risk,
    category: matterResult.data.category,
    readingTime,
  }
}