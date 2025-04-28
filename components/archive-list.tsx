'use client'

import type { ArticleData } from '@/lib/markdown'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type ArchiveItem = {
  year: number
  months: {
    month: number
    count: number
    monthName: string
  }[]
}

const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

interface ArchiveListProps {
  articles: ArticleData[]
}

export function ArchiveList({ articles }: ArchiveListProps) {
  const [expandedYears, setExpandedYears] = useState<number[]>([])
  const [archiveData, setArchiveData] = useState<ArchiveItem[]>([])

  useEffect(() => {
    if (articles.length > 0 && expandedYears.length === 0) {
      const latestYear = articles[0].year
      setExpandedYears([latestYear])
    }

    const archiveMap = new Map<number, Map<number, number>>()

    articles.forEach((article) => {
      const { year, month } = article

      if (!archiveMap.has(year)) {
        archiveMap.set(year, new Map<number, number>())
      }

      const yearMap = archiveMap.get(year)!
      const count = yearMap.get(month) || 0
      yearMap.set(month, count + 1)
    })

    const sortedArchive = Array.from(archiveMap.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, monthMap]) => {
        const months = Array.from(monthMap.entries())
          .sort((a, b) => b[0] - a[0])
          .map(([month, count]) => ({
            month,
            count,
            monthName: monthNames[month - 1],
          }))

        return { year, months }
      })

    setArchiveData(sortedArchive)
  }, [articles, expandedYears.length])

  const toggleYear = (year: number) => {
    if (expandedYears.includes(year)) {
      setExpandedYears(expandedYears.filter((y) => y !== year))
    } else {
      setExpandedYears([...expandedYears, year])
    }
  }

  return (
    <div className="space-y-2">
      {archiveData.map((yearData) => (
        <div key={yearData.year} className="space-y-1">
          <button
            onClick={() => toggleYear(yearData.year)}
            className="flex items-center w-full text-left font-medium hover:text-black dark:hover:text-white py-1"
            aria-expanded={expandedYears.includes(yearData.year)}
          >
            {expandedYears.includes(yearData.year) ? (
              <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
            )}
            {yearData.year}年
          </button>

          {expandedYears.includes(yearData.year) && (
            <ul className="pl-6 space-y-1">
              {yearData.months.map((monthData) => (
                <li key={`${yearData.year}-${monthData.month}`}>
                  <Link
                    href={`/archive/${yearData.year}/${monthData.month}`}
                    className="text-gray-700 hover:text-black flex items-center justify-between dark:text-gray-300 dark:hover:text-white py-1"
                  >
                    <span>{monthData.monthName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({monthData.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
