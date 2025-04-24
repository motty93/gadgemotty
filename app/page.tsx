import Image from "next/image"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { getAllArticles } from "@/lib/markdown"

export default async function Home() {
  const articles = await getAllArticles()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex justify-center items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-black rounded-lg p-3">
            <span className="text-white text-2xl font-bold">
              B<span className="text-sm">oo</span>
            </span>
          </div>
          <h1 className="text-4xl font-black">SAY BOO!</h1>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <main className="w-full md:w-2/3 space-y-8">
          {articles.length === 0 ? (
            <div className="bg-white p-6 rounded shadow-sm">
              <p>記事がありません。Markdownファイルを追加してください。</p>
            </div>
          ) : (
            articles.map((article) => (
              <article key={article.slug} className="bg-white p-6 rounded shadow-sm">
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
            ))
          )}
        </main>

        <Sidebar recentArticles={articles} />
      </div>
    </div>
  )
}
