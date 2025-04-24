import { Sidebar } from '@/components/sidebar'
import { highlightText } from '@/lib/highlight'
import { getAllArticles, searchArticles } from '@/lib/markdown'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''
  const articles = await searchArticles(query)
  const allArticles = await getAllArticles()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex justify-center items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="flex items-center gap-4">
              <div className="bg-black rounded-lg p-3">
                <span className="text-white text-2xl font-bold">
                  B<span className="text-sm">oo</span>
                </span>
              </div>
              <h1 className="text-4xl font-black">SAY BOO!</h1>
            </div>
          </Link>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <main className="w-full md:w-2/3">
          <div className="bg-white p-6 rounded shadow-sm mb-8">
            <Link href="/" className="text-gray-600 hover:text-black flex items-center mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ホームに戻る
            </Link>
            <h1 className="text-2xl font-bold mb-6">
              「{query}」の検索結果 ({articles.length}件)
            </h1>

            {query.trim() === '' ? (
              <p className="text-gray-500">検索キーワードを入力してください。</p>
            ) : articles.length === 0 ? (
              <p className="text-gray-500">検索結果はありません。</p>
            ) : (
              <div className="space-y-8">
                {articles.map((article) => (
                  <article key={article.slug} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3">
                        <div className="relative">
                          <span className="absolute top-0 left-0 bg-gray-500 text-white text-xs px-2 py-1">
                            {article.category}
                          </span>
                          <Link href={`/articles/${article.slug}`}>
                            <Image
                              src={article.image || '/placeholder.svg'}
                              alt={article.title}
                              width={300}
                              height={200}
                              className="w-full"
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="w-full md:w-2/3">
                        <Link href={`/articles/${article.slug}`}>
                          <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
                            {highlightText(article.title, query)}
                          </h2>
                        </Link>
                        <p className="text-sm text-gray-700 mb-4">{highlightText(article.excerpt, query)}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            カテゴリ: {highlightText(article.category, query)}
                          </span>
                          <span className="text-xs text-gray-500">© {article.date}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>

        <Sidebar recentArticles={allArticles} />
      </div>
    </div>
  )
}
