import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  // ページネーションの範囲を計算（現在のページの前後2ページずつ表示）
  const getPageRange = () => {
    const range = []
    const rangeSize = 2 // 現在のページの前後に表示するページ数

    let start = Math.max(1, currentPage - rangeSize)
    let end = Math.min(totalPages, currentPage + rangeSize)

    // 範囲が片側に偏っている場合、もう片側を拡張
    if (currentPage - start < rangeSize) {
      end = Math.min(totalPages, end + (rangeSize - (currentPage - start)))
    }
    if (end - currentPage < rangeSize) {
      start = Math.max(1, start - (rangeSize - (end - currentPage)))
    }

    for (let i = start; i <= end; i++) {
      range.push(i)
    }
    return range
  }

  const pageRange = getPageRange()

  return (
    <nav className="flex justify-center items-center mt-8" aria-label="ページネーション">
      <ul className="flex items-center space-x-1">
        {/* 前のページボタン */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={`${basePath}${currentPage > 2 ? `/page/${currentPage - 1}` : ''}`}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="前のページ"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed">
              <ChevronLeft className="h-5 w-5" />
            </span>
          )}
        </li>

        {/* 最初のページへのリンク（必要な場合） */}
        {pageRange[0] > 1 && (
          <>
            <li>
              <Link
                href={basePath}
                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                1
              </Link>
            </li>
            {pageRange[0] > 2 && (
              <li>
                <span className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400">
                  ...
                </span>
              </li>
            )}
          </>
        )}

        {/* ページ番号 */}
        {pageRange.map((page) => (
          <li key={page}>
            {page === currentPage ? (
              <span className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 dark:bg-gray-600 text-white font-medium">
                {page}
              </span>
            ) : (
              <Link
                href={`${basePath}${page > 1 ? `/page/${page}` : ''}`}
                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* 最後のページへのリンク（必要な場合） */}
        {pageRange[pageRange.length - 1] < totalPages && (
          <>
            {pageRange[pageRange.length - 1] < totalPages - 1 && (
              <li>
                <span className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400">
                  ...
                </span>
              </li>
            )}
            <li>
              <Link
                href={`${basePath}/page/${totalPages}`}
                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {totalPages}
              </Link>
            </li>
          </>
        )}

        {/* 次のページボタン */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={`${basePath}/page/${currentPage + 1}`}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="次のページ"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed">
              <ChevronRight className="h-5 w-5" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
