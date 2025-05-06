import { getAllCategories, getFeaturedArticles, getPaginatedArticles } from '@/lib/markdown'
import HomePage from './home-page'

export default async function Home() {
  const { articles, totalPages, currentPage } = await getPaginatedArticles(1)
  const categories = await getAllCategories()

  // おすすめ記事をフロントマターから取得
  const featuredArticles = await getFeaturedArticles()

  // おすすめ記事がない場合は最新の記事を使用
  const articlesToFeature = featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 5)

  return (
    <HomePage
      articles={articles}
      categories={categories}
      articlesToFeature={articlesToFeature}
      pagination={{
        currentPage,
        totalPages,
        basePath: '',
      }}
    />
  )
}
