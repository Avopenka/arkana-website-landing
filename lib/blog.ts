import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  author: string
  tags: string[]
  readingTime: number
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        
        // Process markdown to HTML
        const processedContent = await remark()
          .use(html)
          .process(content)
        const contentHtml = processedContent.toString()
        
        // Calculate reading time (average 200 words per minute)
        const wordCount = content.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / 200)

        return {
          slug,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt,
          content: contentHtml,
          author: data.author || 'Arkana Team',
          tags: data.tags || [],
          readingTime,
        }
      })
  )

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1
    if (a.date > b.date) return -1
    return 0
  })
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    const processedContent = await remark()
      .use(html)
      .process(content)
    const contentHtml = processedContent.toString()
    
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      content: contentHtml,
      author: data.author || 'Arkana Team',
      tags: data.tags || [],
      readingTime,
    }
  } catch {
    return null
  }
}