import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbProps {
  title: string
}

export function Breadcrumb({ title }: BreadcrumbProps) {
  return (
    <nav aria-label="パンくずリスト" className="mb-4 text-sm">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            記事一覧
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        </li>
        <li className="text-gray-800 dark:text-gray-200 font-medium truncate">{title}</li>
      </ol>
    </nav>
  )
}
