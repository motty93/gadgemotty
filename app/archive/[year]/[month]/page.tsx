import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { getAllArticles, getArticlesByYearMonth } from "@/lib/markdown"

// 月の名前（日本語）
const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

export default async function ArchivePage({ params }: { params: { year: string; month: string } }) {
  const year = Number.parseInt(params.year)
  const month = Number.parseInt(params.month)
  const articles = await getArticlesByYearMonth(year, month)
  const allArticles = await getAllArticles()
  const monthName = monthNames[month - 1]

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
              {year}年{monthName}のアーカイブ
            </h1>

            {articles.length === 0 ? (
              <p className="text-gray-500">この月の記事はありません。</p>
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
                              src={article.image || "/placeholder.svg"}
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
                          <h2 className="text-xl font-bold mb-2 hover:text-blue-600">{article.title}</h2>
                        </Link>
                        <p className="text-sm text-gray-700 mb-4">{article.excerpt}</p>
                        <div className="flex justify-end">
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
