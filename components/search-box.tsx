'use client'

import type React from 'react'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SearchBox() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="サイト内検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 text-base"
        aria-label="検索"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="検索"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  )
}
