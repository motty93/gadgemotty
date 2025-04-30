import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { SpotlightSearch } from '@/components/spotlight-search'
import { getAllArticles, getAllCategories } from '@/lib/markdown'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const articles = await getAllArticles()
  const categories = await getAllCategories()

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
      <Header articles={articles} />
      <SpotlightSearch articles={articles} isMobile={true} />

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <main className="w-full md:w-2/3">
          {articles.length === 0 ? (
            <div className="bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white">
              記事がありません。Markdownファイルを追加してください。
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white h-full flex flex-col"
                >
                  <div className="flex flex-col gap-4 h-full">
                    <div className="w-full relative">
                      <span className="absolute top-0 left-0 bg-gray-500 text-white text-xs px-2 py-1 z-10">
                        {article.category}
                      </span>
                      <Link href={`/articles/${article.slug}`}>
                        <Image
                          src={article.image || '/placeholder.svg'}
                          alt={article.title}
                          width={600}
                          height={300}
                          className="w-full h-40 object-cover rounded"
                        />
                      </Link>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <Link href={`/articles/${article.slug}`}>
                        <h2 className="text-lg font-bold my-2 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
                          {article.title}
                        </h2>
                      </Link>
                      <p className="text-sm text-gray-700 mb-4 dark:text-gray-300 excerpt-truncate flex-grow">
                        {article.excerpt}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <Link
                          href={`/category/${encodeURIComponent(article.category.toLowerCase().replace(/\s+/g, '-'))}`}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          {article.category}
                        </Link>
                        <span className="text-xs text-gray-500 dark:text-gray-400">© {article.date}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        <div className="w-full md:w-1/3 order-1 md:order-2 mb-6 md:mb-0">
          <Sidebar recentArticles={articles} categories={categories} />
        </div>
      </div>
    </div>
  )
}
