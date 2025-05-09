import {
  getAllArticles,
  getAllCategories,
  getCategoryLabel,
  getFeaturedArticlesByCategory,
  getPaginatedArticlesByCategory,
} from '@/lib/markdown'
import CategoryPage from './category-page'

// 動的ルーティングのためのパラメータを生成
export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({
    category: category.slug,
  }))
}

export default async function CategoryPageWrapper({ params }: { params: { category: string } }) {
  const resolvedParams = await params
  const categorySlug = resolvedParams.category
  const { articles, totalPages, currentPage } = await getPaginatedArticlesByCategory(categorySlug, 1)
  const allArticles = await getAllArticles()
  const categories = await getAllCategories()
  const categoryLabel = await getCategoryLabel(categorySlug)
  const featuredArticles = await getFeaturedArticlesByCategory(categorySlug)
  const articlesToFeature = featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 3)

  return (
    <CategoryPage
      categoryLabel={categoryLabel}
      articles={articles}
      allArticles={allArticles}
      categories={categories}
      articlesToFeature={articlesToFeature}
      pagination={{
        currentPage,
        totalPages,
        basePath: `/category/${categorySlug}`,
      }}
    />
  )
}
