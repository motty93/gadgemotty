import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

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
  image: string
  year: number
  month: number
}

export type CategoryInfo = {
  slug: string
  label: string
  count: number
}

// 全記事のslugを取得
export async function getAllArticleSlugs() {
  // content/articlesディレクトリが存在しない場合は作成
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
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`)

    // ファイルが存在しない場合は.mdを試す
    const mdxExists = fs.existsSync(fullPath)
    const filePath = mdxExists ? fullPath : path.join(articlesDirectory, `${slug}.md`)

    // ファイルが存在しない場合はundefinedを返す
    if (!fs.existsSync(filePath)) {
      return undefined
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')

    // マークダウンのフロントマターをパース
    const { data, content } = matter(fileContents)

    // Markdownをコンテンツに変換
    const processedContent = await remark().use(html).process(content)
    const contentHtml = processedContent.toString()

    // 日付からyearとmonthを取得
    const dateObj = new Date(data.date)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1 // JavaScriptの月は0から始まるので+1

    // 記事データを返す
    return {
      slug,
      title: data.title,
      excerpt: data.excerpt || '',
      content: contentHtml,
      category: data.category || '',
      categoryLabel: data.categoryLabel || data.category || '',
      date: data.date,
      image: data.image || '/placeholder.svg?height=400&width=600',
      year,
      month,
    }
  } catch (error) {
    console.error(`Error fetching article data for ${slug}:`, error)
    return undefined
  }
}

// 全記事のデータを取得
export async function getAllArticles(): Promise<ArticleData[]> {
  // content/articlesディレクトリが存在しない場合は作成
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

  // 日付でソート（新しい順）
  return allArticlesData
    .filter((article): article is ArticleData => article !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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

  // 同じカテゴリの記事を優先
  const sameCategory = allArticles.filter(
    (article) => article.slug !== currentSlug && article.category === currentArticle.category,
  )

  // 同じカテゴリの記事だけで足りない場合は他のカテゴリから追加
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
