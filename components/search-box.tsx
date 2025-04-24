"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // 実際のアプリケーションでは検索結果ページにリダイレクトする
      // ここではコンソールに出力するだけ
      console.log(`Searching for: ${searchQuery}`)
      alert(`「${searchQuery}」の検索結果ページは実装中です。`)
      // router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="サイト内検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-500 hover:text-gray-700"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  )
}
