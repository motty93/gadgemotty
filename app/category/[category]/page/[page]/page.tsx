import CategoryPage from '@/app/category/[category]/category-page'
import {
  getAllArticles,
  getAllCategories,
  getCategoryLabel,
  getFeaturedArticlesByCategory,
  getPaginatedArticlesByCategory,
} from '@/lib/markdown'
import { redirect } from 'next/navigation'

export default async function PaginatedCategoryPage({
  params,
}: { params: { category: string; page: string } }) {
  const resolvedParams = await params
  const categorySlug = resolvedParams.category
  const page = Number.parseInt(resolvedParams.page, 10)

  // ページ番号が無効な場合はリダイレクト
  if (isNaN(page) || page < 1) {
    redirect(`/category/${categorySlug}`)
  }

  const { articles, totalPages, currentPage } = await getPaginatedArticlesByCategory(categorySlug, page)

  // 存在しないページの場合はリダイレクト
  if (currentPage !== page) {
    redirect(
      currentPage === 1 ? `/category/${categorySlug}` : `/category/${categorySlug}/page/${currentPage}`,
    )
  }

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
