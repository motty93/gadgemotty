import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { SpotlightSearch } from '@/components/spotlight-search'
import { highlightText } from '@/lib/highlight'
import { getAllArticles, getAllCategories, searchArticles } from '@/lib/markdown'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// OpenNextはSSRをサポートするため、動的ページとして機能
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q || ''
  const articles = await searchArticles(query)
  const allArticles = await getAllArticles()
  const categories = await getAllCategories()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-grow">
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
                「{query}」の検索結果 ({articles.length}件)
              </h1>

              {query.trim() === '' ? (
                <p className="text-gray-500 dark:text-gray-400">検索キーワードを入力してください。</p>
              ) : articles.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">検索結果はありません。</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <article
                      key={article.slug}
                      className="border dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col"
                    >
                      <div className="relative">
                        <Link
                          href={`/category/${encodeURIComponent(article.category.toLowerCase().replace(/\s+/g, '-'))}`}
                        >
                          <span className="absolute top-0 left-0 bg-gray-500 text-white text-xs px-2 py-1">
                            {article.category}
                          </span>
                        </Link>
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
                            {highlightText(article.title, query)}
                          </h2>
                        </Link>
                        <p className="text-sm text-gray-700 mb-4 dark:text-gray-300 excerpt-truncate flex-grow">
                          {highlightText(article.excerpt, query)}
                        </p>
                        <div className="flex justify-between items-center mt-auto">
                          <Link
                            href={`/category/${encodeURIComponent(article.category.toLowerCase().replace(/\s+/g, '-'))}`}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            {highlightText(article.category, query)}
                          </Link>
                          <span className="text-xs text-gray-500 dark:text-gray-400">© {article.date}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </main>

          <div className="w-full md:w-1/3 order-1 md:order-2 mb-6 md:mb-0">
            <Sidebar recentArticles={allArticles} categories={categories} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
