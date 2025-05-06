import HomePage from '@/app/home-page'
import { getAllCategories, getFeaturedArticles, getPaginatedArticles } from '@/lib/markdown'
import { redirect } from 'next/navigation'

export default async function PaginatedHomePage({ params }: { params: { page: string } }) {
  const resolvedParams = await params
  const page = Number.parseInt(resolvedParams.page, 10)

  // ページ番号が無効な場合はリダイレクト
  if (isNaN(page) || page < 1) {
    redirect('/')
  }

  const { articles, totalPages, currentPage } = await getPaginatedArticles(page)

  // 存在しないページの場合はリダイレクト
  if (currentPage !== page) {
    redirect(currentPage === 1 ? '/' : `/page/${currentPage}`)
  }

  const categories = await getAllCategories()
  const featuredArticles = await getFeaturedArticles()
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
