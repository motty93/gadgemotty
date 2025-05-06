import { FeaturedCarousel } from '@/components/featured-carousel'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { SectionTitle } from '@/components/section-title'
import { Sidebar } from '@/components/sidebar'
import { SpotlightSearch } from '@/components/spotlight-search'
import { getAllArticles, getAllCategories, getFeaturedArticles } from '@/lib/markdown'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const articles = await getAllArticles()
  const categories = await getAllCategories()
  const featuredArticles = await getFeaturedArticles()
  const articlesToFeature = featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 5)

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 w-full flex-grow">
        <Header articles={articles} />
        <SpotlightSearch articles={articles} isMobile={true} />

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <main className="w-full md:w-2/3">
            {articles.length === 0 ? (
              <div className="bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white">
                記事がありません。Markdownファイルを追加してください。
              </div>
            ) : (
              <>
                {articlesToFeature.length > 0 && (
                  <div className="mt-8">
                    <SectionTitle>おすすめ記事</SectionTitle>
                    <FeaturedCarousel articles={articlesToFeature} />
                  </div>
                )}
                <div className="mt-8">
                  <SectionTitle>すべての記事</SectionTitle>
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
                            <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 z-10">
                              {article.createdAt}
                            </span>
                            <Link href={`/articles/${article.slug}`}>
                              <Image
                                src={article.image || '/placeholder.svg'}
                                alt={article.title}
                                width={600}
                                height={300}
                                className="w-full h-40 object-cover"
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
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
                {articlesToFeature.length > 0 && articles.length > 20 && (
                  <div className="mt-14">
                    <SectionTitle>おすすめ記事</SectionTitle>
                    <FeaturedCarousel articles={articlesToFeature} />
                  </div>
                )}
              </>
            )}
          </main>

          <div className="w-full md:w-1/3 order-1 md:order-2 mb-6 md:mb-0">
            <Sidebar recentArticles={articles} categories={categories} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
