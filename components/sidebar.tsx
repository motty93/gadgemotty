import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SearchBox } from "./search-box"
import { ArchiveList } from "./archive-list"
import type { ArticleData } from "@/lib/markdown"

interface SidebarProps {
  recentArticles: ArticleData[]
}

export function Sidebar({ recentArticles }: SidebarProps) {
  return (
    <aside className="w-full md:w-1/3 space-y-8">
      <div className="bg-white p-6 rounded shadow-sm">
        <h3 className="text-xl font-bold mb-4 pb-2 border-b">検索</h3>
        <SearchBox />
      </div>

      <div className="bg-white p-6 rounded shadow-sm">
        <h3 className="text-xl font-bold mb-4 pb-2 border-b">コンテンツ</h3>
        <ul className="space-y-3">
          <li>
            <Link href="#" className="text-gray-700 hover:text-black flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              科学的根拠に基づいた妊娠中の体重管理
            </Link>
          </li>
          <li>
            <Link href="#" className="text-gray-700 hover:text-black flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              チャートアプリ
            </Link>
          </li>
          <li>
            <Link href="#" className="text-gray-700 hover:text-black flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              お問い合わせ
            </Link>
          </li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded shadow-sm">
        <h3 className="text-xl font-bold mb-4 pb-2 border-b">最近の投稿</h3>
        <ul className="space-y-3">
          {recentArticles.slice(0, 5).map((article) => (
            <li key={article.slug}>
              <Link href={`/articles/${article.slug}`} className="text-gray-700 hover:text-black flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded shadow-sm">
        <h3 className="text-xl font-bold mb-4 pb-2 border-b">アーカイブ</h3>
        <ArchiveList articles={recentArticles} />
      </div>

      <div className="bg-white p-6 rounded shadow-sm">
        <h3 className="text-xl font-bold mb-4 pb-2 border-b">カテゴリー</h3>
        <ul className="space-y-3">
          <li>
            <Link href="#" className="text-gray-700 hover:text-black flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />R
            </Link>
          </li>
          <li>
            <Link href="#" className="text-gray-700 hover:text-black flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              ウェブサービス
            </Link>
          </li>
          <li>
            <Link href="#" className="text-gray-700 hover:text-black flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              パソコン
            </Link>
          </li>
          <li>
            <Link href="#" className="text-gray-700 hover:text-black flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              ゲーム
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}
