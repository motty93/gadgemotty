"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { ArticleData } from "@/lib/markdown"

// アーカイブデータの型定義
type ArchiveItem = {
  year: number
  months: {
    month: number
    count: number
    monthName: string
  }[]
}

// 月の名前（日本語）
const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

interface ArchiveListProps {
  articles: ArticleData[]
}

export function ArchiveList({ articles }: ArchiveListProps) {
  // 展開された年のステート
  const [expandedYears, setExpandedYears] = useState<number[]>([])
  const [archiveData, setArchiveData] = useState<ArchiveItem[]>([])

  useEffect(() => {
    // 最新の年を初期展開
    if (articles.length > 0 && expandedYears.length === 0) {
      const latestYear = articles[0].year
      setExpandedYears([latestYear])
    }

    // 記事データからアーカイブデータを生成
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

    // アーカイブデータをソート
    const sortedArchive = Array.from(archiveMap.entries())
      .sort((a, b) => b[0] - a[0]) // 年を降順
      .map(([year, monthMap]) => {
        const months = Array.from(monthMap.entries())
          .sort((a, b) => b[0] - a[0]) // 月を降順
          .map(([month, count]) => ({
            month,
            count,
            monthName: monthNames[month - 1],
          }))

        return { year, months }
      })

    setArchiveData(sortedArchive)
  }, [articles, expandedYears.length])

  // 年の展開/折りたたみを切り替える関数
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
            className="flex items-center w-full text-left font-medium hover:text-black"
          >
            {expandedYears.includes(yearData.year) ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            {yearData.year}年
          </button>

          {expandedYears.includes(yearData.year) && (
            <ul className="pl-6 space-y-1">
              {yearData.months.map((monthData) => (
                <li key={`${yearData.year}-${monthData.month}`}>
                  <Link
                    href={`/archive/${yearData.year}/${monthData.month}`}
                    className="text-gray-700 hover:text-black flex items-center"
                  >
                    {monthData.monthName} ({monthData.count})
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
