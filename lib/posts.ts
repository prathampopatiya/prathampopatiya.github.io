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
  const fullPath = path.join(postsDirectory, `${slug}.md`)
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