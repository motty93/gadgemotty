import type { ArticleData, CategoryInfo } from '@/lib/markdown'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ArchiveList } from './archive-list'
import { SearchBox } from './search-box'

interface SidebarProps {
  recentArticles: ArticleData[]
  categories?: CategoryInfo[]
}

export function Sidebar({ recentArticles, categories = [] }: SidebarProps) {
  return (
    <aside className="mt-8 space-y-6 md:space-y-8 md:sticky md:top-4 md:max-h-[calc(100vh-2rem)] md:overflow-y-auto no-scrollbar">
      {/* カテゴリー - モバイルでは常に表示 */}
      <div className="bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pb-2 border-b dark:border-gray-700">
          カテゴリー
        </h3>
        <ul className="space-y-2 sm:space-y-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                className="text-gray-700 hover:text-black flex items-center justify-between dark:text-gray-300 dark:hover:text-white py-1"
              >
                <span className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="line-clamp-1">{category.label}</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({category.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 最近の投稿 - モバイルでは常に表示 */}
      <div className="bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pb-2 border-b dark:border-gray-700">
          最近の投稿
        </h3>
        <ul className="space-y-2 sm:space-y-3">
          {recentArticles.slice(0, 5).map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="text-gray-700 hover:text-black flex items-center dark:text-gray-300 dark:hover:text-white py-1"
              >
                <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="line-clamp-1">{article.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* アーカイブ - モバイルでは折りたたみ可能 */}
      <div className="bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pb-2 border-b dark:border-gray-700">
          アーカイブ
        </h3>
        <ArchiveList articles={recentArticles} />
      </div>

      {/* コンテンツ - モバイルでは非表示 */}
      <div className="hidden md:block bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pb-2 border-b dark:border-gray-700">
          コンテンツ
        </h3>
        <ul className="space-y-2 sm:space-y-3">
          <li>
            <Link
              href="#"
              className="text-gray-700 hover:text-black flex items-center dark:text-gray-300 dark:hover:text-white py-1"
            >
              <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">科学的根拠に基づいた妊娠中の体重管理</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-gray-700 hover:text-black flex items-center dark:text-gray-300 dark:hover:text-white py-1"
            >
              <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">チャートアプリ</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-gray-700 hover:text-black flex items-center dark:text-gray-300 dark:hover:text-white py-1"
            >
              <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">お問い合わせ</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* 検索ボックス -バイルでは常に表示 */}
      <div className="bg-white p-4 sm:p-6 rounded shadow-sm dark:bg-gray-800 dark:text-white">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pb-2 border-b dark:border-gray-700">検索</h3>
        <SearchBox />
      </div>
    </aside>
  )
}
