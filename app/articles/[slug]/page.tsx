import {
  getAllArticleSlugs,
  getAllArticles,
  getAllCategories,
  getArticleData,
  getRelatedArticles,
} from '@/lib/markdown'
import { notFound } from 'next/navigation'
import ArticleClientPage from './ArticleClientPage'

export async function generateStaticParams() {
  const paths = await getAllArticleSlugs()

  return paths.map((path) => ({
    slug: path.params.slug,
  }))
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params
  const article = await getArticleData(resolvedParams.slug)
  const relatedArticles = await getRelatedArticles(resolvedParams.slug)
  const allArticles = await getAllArticles()
  const categories = await getAllCategories()

  if (!article) {
    notFound()
  }

  return (
    <ArticleClientPage
      article={article}
      relatedArticles={relatedArticles}
      allArticles={allArticles}
      categories={categories}
    />
  )
}
