import fs from 'fs'
import path from 'path'
import { compile } from '@mdx-js/mdx'
import matter from 'gray-matter'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import type { BundledArticles } from './types'

// Cloudflare Workers環境かどうかを検出
const isCloudflareWorkers =
  typeof process.env.CLOUDFLARE !== 'undefined' || typeof globalThis.caches !== 'undefined'

// バンドルされた記事データ
let bundledArticles: BundledArticles = []
if (isCloudflareWorkers) {
  try {
    // 静的インポートを使用
    bundledArticles = require('./bundled-articles.json')
  } catch (e) {
    console.warn('Bundled articles not found. Running in development mode?')
  }
}

// コンテンツディレクトリのパス
const contentDirectory = path.join(process.cwd(), 'content')
const articlesDirectory = path.join(contentDirectory, 'articles')

// 記事データの型定義
export type ArticleData = {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  categoryLabel: string
  date: string
  createdAt: string
  updatedAt: string
  image: string
  year: number
  month: number
  featured: boolean // おすすめかどうか
}

export type CategoryInfo = {
  slug: string
  label: string
  count: number
}

// mdx compile
export async function compileMdxToJsx(content: string): Promise<string> {
  const compiled = await compile(content, {
    jsx: true,
    outputFormat: 'function-body',
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
    format: 'mdx',
  })
  console.log(compiled.value)

  return String(compiled.value).replace(/^\s*export\s+default\s+/m, 'return ')
}

// 全記事のslugを取得
export async function getAllArticleSlugs() {
  if (isCloudflareWorkers) {
    return bundledArticles.map((article) => ({
      params: {
        slug: article.slug,
      },
    }))
  }

  // ローカル開発環境
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(articlesDirectory)
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.mdx?$/, ''),
      },
    }
  })
}

// 特定の記事データを取得
export async function getArticleData(slug: string): Promise<ArticleData | undefined> {
  if (isCloudflareWorkers) {
    const article = bundledArticles.find((a) => a.slug === slug)
    if (!article) return undefined

    const dateObj = new Date(article.date)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1

    return {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content, // jsx string
      category: article.category || '',
      categoryLabel: article.categoryLabel || article.category || '',
      date: article.date,
      createdAt: article.createdAt || article.date,
      updatedAt: article.updatedAt || article.date,
      image: article.image || '/placeholder.svg?height=400&width=600',
      year,
      month,
      featured: article.featured || false,
    }
  }

  // ローカル開発環境
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`)
    const mdxExists = fs.existsSync(fullPath)
    const filePath = mdxExists ? fullPath : path.join(articlesDirectory, `${slug}.md`)

    if (!fs.existsSync(filePath)) {
      return undefined
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const compiledCode = await compileMdxToJsx(content)

    const dateObj = new Date(data.date)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt || '',
      content: compiledCode,
      category: data.category || '',
      categoryLabel: data.categoryLabel || data.category || '',
      date: data.date,
      createdAt: data.createdAt || data.date,
      updatedAt: data.updatedAt || data.date,
      image: data.image || '/placeholder.svg?height=400&width=600',
      year,
      month,
      featured: data.featured || false,
    }
  } catch (error) {
    console.error(`Error fetching article data for ${slug}:`, error)
    return undefined
  }
}

// 全記事のデータを取得
export async function getAllArticles(): Promise<ArticleData[]> {
  if (isCloudflareWorkers) {
    const allArticlesData = await Promise.all(bundledArticles.map((article) => getArticleData(article.slug)))

    return allArticlesData
      .filter((article): article is ArticleData => article !== undefined)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // ローカル開発環境
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(articlesDirectory)
  const allArticlesData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const articleData = await getArticleData(slug)
      return articleData
    }),
  )

  return allArticlesData
    .filter((article): article is ArticleData => article !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// おすすめ記事を取得
export async function getFeaturedArticles(): Promise<ArticleData[]> {
  const articles = await getAllArticles()

  return articles.filter((article) => article.featured)
}

// 特定の年月の記事を取得
export async function getArticlesByYearMonth(year: number, month: number): Promise<ArticleData[]> {
  const articles = await getAllArticles()
  return articles.filter((article) => article.year === year && article.month === month)
}

// 関連記事を取得（同じカテゴリの他の記事を優先）
export async function getRelatedArticles(currentSlug: string, limit = 3): Promise<ArticleData[]> {
  const allArticles = await getAllArticles()
  const currentArticle = allArticles.find((article) => article.slug === currentSlug)

  if (!currentArticle) {
    return allArticles.filter((article) => article.slug !== currentSlug).slice(0, limit)
  }

  const sameCategory = allArticles.filter(
    (article) => article.slug !== currentSlug && article.category === currentArticle.category,
  )

  const otherArticles = allArticles.filter(
    (article) => article.slug !== currentSlug && article.category !== currentArticle.category,
  )

  return [...sameCategory, ...otherArticles].slice(0, limit)
}

export async function searchArticles(query: string): Promise<ArticleData[]> {
  const articles = await getAllArticles()

  if (!query || query.trim() === '') {
    return articles
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/)

  return articles.filter((article) => {
    const searchableText = `
      ${article.title.toLowerCase()}
      ${article.excerpt.toLowerCase()}
      ${article.category.toLowerCase()}
      ${article.content.toLowerCase()}
    `

    return searchTerms.every((term) => searchableText.includes(term))
  })
}

export async function getAllCategories(): Promise<CategoryInfo[]> {
  const articles = await getAllArticles()

  const categoryMap = new Map<string, { label: string; count: number }>()

  for (const article of articles) {
    const { category, categoryLabel } = article

    if (category) {
      const slug = encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))

      if (categoryMap.has(slug)) {
        const categoryInfo = categoryMap.get(slug) || { label: '', count: 0 }
        categoryMap.set(slug, {
          ...categoryInfo,
          count: categoryInfo.count + 1,
        })
      } else {
        categoryMap.set(slug, {
          label: categoryLabel || category,
          count: 1,
        })
      }
    }
  }

  return Array.from(categoryMap.entries())
    .map(([slug, { label, count }]) => ({
      slug,
      label,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export async function getArticlesByCategory(categorySlug: string): Promise<ArticleData[]> {
  const articles = await getAllArticles()

  return articles.filter((article) => {
    const articleCategorySlug = encodeURIComponent(article.category.toLowerCase().replace(/\s+/g, '-'))
    return articleCategorySlug === categorySlug
  })
}

export async function getFeaturedArticlesByCategory(categorySlug: string): Promise<ArticleData[]> {
  const articles = await getArticlesByCategory(categorySlug)

  return articles.filter((article) => article.featured)
}

export async function getCategoryLabel(categorySlug: string): Promise<string> {
  const categories = await getAllCategories()
  const category = categories.find((cat) => cat.slug === categorySlug)
  return category ? category.label : categorySlug
}

// ページネーション用の記事を取得
export async function getPaginatedArticles(
  page = 1,
  limit = 20,
): Promise<{
  articles: ArticleData[]
  totalPages: number
  currentPage: number
}> {
  const allArticles = await getAllArticles()
  const totalPages = Math.ceil(allArticles.length / limit)
  const currentPage = Math.min(Math.max(1, page), totalPages) // 1〜totalPagesの範囲に制限

  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit
  const paginatedArticles = allArticles.slice(startIndex, endIndex)

  return {
    articles: paginatedArticles,
    totalPages,
    currentPage,
  }
}

// カテゴリー別のページネーション記事を取得
export async function getPaginatedArticlesByCategory(
  categorySlug: string,
  page = 1,
  limit = 20,
): Promise<{
  articles: ArticleData[]
  totalPages: number
  currentPage: number
}> {
  const allCategoryArticles = await getArticlesByCategory(categorySlug)
  const totalPages = Math.ceil(allCategoryArticles.length / limit)
  const currentPage = Math.min(Math.max(1, page), totalPages || 1) // 1〜totalPagesの範囲に制限

  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit
  const paginatedArticles = allCategoryArticles.slice(startIndex, endIndex)

  return {
    articles: paginatedArticles,
    totalPages,
    currentPage,
  }
}
