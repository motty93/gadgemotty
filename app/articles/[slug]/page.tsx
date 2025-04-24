import { Sidebar } from '@/components/sidebar'
import { getAllArticleSlugs, getArticleData, getRelatedArticles } from '@/lib/markdown'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// 動的ルーティングのためのパラメータを生成
export async function generateStaticParams() {
  const paths = await getAllArticleSlugs()

  return paths.map((path) => ({
    slug: path.params.slug,
  }))
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  // @ts-ignore: Next.jsでは必要だが型チェックでは不要と判断される
  const { slug } = await params
  const article = await getArticleData(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(slug)
  const allArticles = await getRelatedArticles('', 5)

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
          <article className="bg-white p-6 rounded shadow-sm">
            <Link href="/" className="text-gray-600 hover:text-black flex items-center mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ホームに戻る
            </Link>

            <div className="mb-6">
              <span className="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded mb-2">
                {article.category}
              </span>
              <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

              <div className="flex items-center text-gray-500 text-sm mb-6">
                <div className="flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>{article.categoryLabel}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <Image
                src={article.image || '/placeholder.svg'}
                alt={article.title}
                width={800}
                height={450}
                className="w-full rounded mb-6"
              />

              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">© {article.date}</div>
            </div>
          </article>

          {relatedArticles.length > 0 && (
            <div className="mt-8 bg-white p-6 rounded shadow-sm">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">関連記事</h2>
              <div className="grid gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <div key={relatedArticle.slug} className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <Image
                        src={relatedArticle.image || '/placeholder.svg'}
                        alt={relatedArticle.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/articles/${relatedArticle.slug}`}
                        className="font-medium hover:text-blue-600"
                      >
                        {relatedArticle.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{relatedArticle.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <Sidebar recentArticles={allArticles} />
      </div>
    </div>
  )
}
