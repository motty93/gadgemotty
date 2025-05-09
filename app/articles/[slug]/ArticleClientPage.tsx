'use client'

import { Breadcrumb } from '@/components/breadcrumb'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { SpotlightSearch } from '@/components/spotlight-search'
import { TableOfContents } from '@/components/table-of-contents'
import { ArticleData } from '@/lib/markdown'
import { mdxToComponent } from '@/lib/mdx-to-component'
import { Calendar, RefreshCw, Tag } from 'lucide-react'
import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense, useMemo, useRef } from 'react'

interface ArticleClientPageProps {
  article: ArticleData
  relatedArticles: ArticleData[]
  allArticles: ArticleData[]
  categories: Array<{
    slug: string
    label: string
    count: number
  }>
}

export default function ArticleClientPage({
  article,
  relatedArticles,
  allArticles,
  categories,
}: ArticleClientPageProps) {
  const categorySlug = encodeURIComponent(article.category.toLowerCase().replace(/\s+/g, '-'))
  const isUpdated = article.createdAt !== article.updatedAt

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 w-full flex-grow">
        <Header articles={allArticles} />
        <SpotlightSearch articles={allArticles} isMobile={true} />

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <main className="w-full md:w-2/3">
            <article className="bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white">
              <Breadcrumb title={article.title} />

              <div className="mb-6">
                <Link href={`/category/${categorySlug}`}>
                  <span className="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded mb-2 hover:bg-gray-600">
                    {article.category}
                  </span>
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">{article.title}</h1>

                <div className="flex flex-wrap items-center text-gray-500 text-sm mb-6 dark:text-gray-400 gap-y-2">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>作成日: {article.createdAt}</span>
                  </div>
                  {isUpdated && (
                    <div className="flex items-center mr-4">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      <span>更新日: {article.updatedAt}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <Link
                      href={`/category/${categorySlug}`}
                      className="hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {article.categoryLabel}
                    </Link>
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

                <ArticleContent content={article.content} />
              </div>

              <div className="border-t pt-4 flex justify-between items-center dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">© {article.date}</div>
              </div>
            </article>

            {relatedArticles.length > 0 && (
              <div className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b dark:border-gray-700">関連記事</h2>
                <div className="grid gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <div key={relatedArticle.slug} className="flex gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
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
                          className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {relatedArticle.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{relatedArticle.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          <div className="w-full md:w-1/3 mt-6 md:mt-0">
            <Sidebar recentArticles={allArticles} categories={categories} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function ArticleContent({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null)

  const LazyBody = useMemo(
    () =>
      React.lazy(async () => {
        const Comp = await mdxToComponent(content)
        return { default: Comp }
      }),
    [content],
  )

  const components: MDXComponents = { Image }

  return (
    <>
      <TableOfContents contentRef={contentRef} />
      <div ref={contentRef} className="prose max-w-none dark:prose-invert">
        <Suspense fallback={<p>Loading...</p>}>
          <LazyBody components={components} />
        </Suspense>
      </div>
    </>
  )
}
