import { FeaturedCarousel } from '@/components/featured-carousel'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Pagination } from '@/components/pagination'
import { SectionTitle } from '@/components/section-title'
import { Sidebar } from '@/components/sidebar'
import { SpotlightSearch } from '@/components/spotlight-search'
import type { ArticleData, CategoryInfo } from '@/lib/markdown'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryPageProps {
  categoryLabel: string
  articles: ArticleData[]
  allArticles: ArticleData[]
  categories: CategoryInfo[]
  articlesToFeature: ArticleData[]
  pagination?: {
    currentPage: number
    totalPages: number
    basePath: string
  }
}

export default function CategoryPage({
  categoryLabel,
  articles,
  allArticles,
  categories,
  articlesToFeature,
  pagination,
}: CategoryPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-grow">
        <Header articles={allArticles} />

        {/* モバイル用の検索フォーム - ヘッダーと記事一覧の間に表示 */}
        <SpotlightSearch articles={allArticles} isMobile={true} />

        <div className="flex flex-col md:flex-row gap-8">
          <main className="w-full md:w-2/3">
            <div className="bg-white p-6 rounded shadow-sm mb-8 dark:bg-gray-800 dark:text-white">
              <Link
                href="/"
                className="text-gray-600 hover:text-black flex items-center mb-6 dark:text-gray-300 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                ホームに戻る
              </Link>
              <h1 className="text-2xl font-bold mb-6">
                カテゴリー: {categoryLabel} ({articles.length}件)
              </h1>

              {articles.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">このカテゴリーの記事はありません。</p>
              ) : (
                <>
                  {/* おすすめ記事セクション */}
                  {articlesToFeature.length > 0 && (
                    <div className="mb-8">
                      <SectionTitle>おすすめ記事</SectionTitle>
                      <FeaturedCarousel articles={articlesToFeature} />
                    </div>
                  )}

                  {/* 記事一覧セクション */}
                  <div>
                    <SectionTitle>すべての記事</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {articles.map((article) => (
                        <article
                          key={article.slug}
                          className="border dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col"
                        >
                          <div className="relative">
                            <Link
                              href={`/category/${encodeURIComponent(
                                article.category.toLowerCase().replace(/\s+/g, '-'),
                              )}`}
                            >
                              <span className="absolute top-0 left-0 bg-gray-500 text-white text-xs px-2 py-1">
                                {article.category}
                              </span>
                            </Link>
                            <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-10">
                              {article.createdAt}
                            </span>
                            <Link href={`/articles/${article.slug}`}>
                              <Image
                                src={article.image || '/placeholder.svg'}
                                alt={article.title}
                                width={300}
                                height={200}
                                className="w-full h-40 object-cover"
                              />
                            </Link>
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <Link href={`/articles/${article.slug}`}>
                              <h2 className="text-lg font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
                                {article.title}
                              </h2>
                            </Link>
                            <p className="text-sm text-gray-700 mb-4 dark:text-gray-300 excerpt-truncate flex-grow">
                              {article.excerpt}
                            </p>
                            <div className="flex justify-end mt-auto">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                © {article.date}
                              </span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                    {/* ページネーション */}
                    {pagination && <Pagination {...pagination} />}
                  </div>
                </>
              )}
            </div>
          </main>

          <Sidebar recentArticles={allArticles} categories={categories} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
