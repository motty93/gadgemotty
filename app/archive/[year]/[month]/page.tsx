import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { SpotlightSearch } from '@/components/spotlight-search'
import { getAllArticles, getAllCategories, getArticlesByYearMonth } from '@/lib/markdown'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// 月の名前（日本語）
const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

export default async function ArchivePage({ params }: { params: { year: string; month: string } }) {
  const year = Number.parseInt(params.year)
  const month = Number.parseInt(params.month)
  const articles = await getArticlesByYearMonth(year, month)
  const allArticles = await getAllArticles()
  const categories = await getAllCategories()
  const monthName = monthNames[month - 1]

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
      <Header articles={articles} />
      <SpotlightSearch articles={allArticles} isMobile={true} />

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <main className="w-full md:w-2/3 space-y-8 md:space-y-8">
          <div className="bg-white p-6 rounded shadow-sm mb-8 dark:bg-gray-800 dark:text-white">
            <Link
              href="/"
              className="text-gray-600 hover:text-black flex items-center mb-6 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              ホームに戻る
            </Link>
            <h1 className="text-2xl font-bold mb-6">
              {year}年{monthName}のアーカイブ
            </h1>

            {articles.length === 0 ? (
              <div className="bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white">
                この月の記事はありません。
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <article
                    key={article.slug}
                    className="border dark:border-gray-700 overflow-hidden h-full flex flex-col"
                  >
                    <div className="relative">
                      <Link
                        href={`/category/${encodeURIComponent(article.category.toLowerCase().replace(/\s+/g, '-'))}`}
                      >
                        <span className="absolute top-0 left-0 bg-gray-500 text-white text-xs px-2 py-1">
                          {article.category}
                        </span>
                      </Link>
                      <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 z-10">
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
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>

        <div className="w-full md:w-1/3 order-1 md:order-2 mb-6 md:mb-0">
          <Sidebar recentArticles={articles} categories={categories} />
        </div>
      </div>
    </div>
  )
}
