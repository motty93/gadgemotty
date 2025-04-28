'use client'

import type React from 'react'

import type { ArticleData } from '@/lib/markdown'
import { ArrowDown, ArrowUp, Search, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'

interface SpotlightSearchProps {
  articles: ArticleData[]
  isMobile?: boolean
}

export function SpotlightSearch({ articles, isMobile = false }: SpotlightSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ArticleData[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // 検索モーダルのレンダリング（共通部分）
  const renderSearchModal = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-[10vh] px-4 sm:px-6"
      onClick={closeModal}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 検索入力 */}
        <div className="relative flex items-center border-b dark:border-gray-700">
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="記事を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full py-4 pl-12 pr-10 focus:outline-none text-lg dark:bg-gray-800 dark:text-white"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* 検索結果 */}
        <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto py-2">
          {searchResults.length === 0 && searchQuery && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              「{searchQuery}」に一致する記事が見つかりませんでした
            </div>
          )}

          {searchResults.map((article, index) => (
            <div
              key={article.slug}
              data-index={index}
              className={`px-4 py-3 cursor-pointer flex items-center gap-4 ${
                selectedIndex === index
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleSelectResult(article)}
            >
              <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={article.image || '/placeholder.svg'}
                  alt={article.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{article.excerpt}</p>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{article.date}</div>
            </div>
          ))}

          {/* キーボードナビゲーションのヘルプ */}
          {searchResults.length > 0 && (
            <div className="px-4 py-3 border-t dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <ArrowDown className="h-3 w-3" />
                </div>
                <span>で移動</span>
              </div>
              <div>
                <span>Enterで選択</span>
              </div>
              <div>
                <span>Escで閉じる</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // キーボードショートカットの検出
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K または Cmd+K (Mac) でモーダルを開く
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }

      // ESC でモーダルを閉じる
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown as any)
    return () => window.removeEventListener('keydown', handleKeyDown as any)
  }, [isOpen])

  // モーダルが開いたら入力フィールドにフォーカス
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // 検索クエリが変更されたら検索を実行
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query),
    )

    setSearchResults(results)
    setSelectedIndex(0) // 選択インデックスをリセット
  }, [searchQuery, articles])

  // モーダルが開いているときは背景スクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // キーボードナビゲーション
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return

    // 下キーで次の結果を選択
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prevIndex) => (prevIndex + 1) % searchResults.length)
      scrollSelectedIntoView()
    }
    // 上キーで前の結果を選択
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prevIndex) => (prevIndex - 1 + searchResults.length) % searchResults.length)
      scrollSelectedIntoView()
    }
    // Enterキーで選択した結果に移動
    else if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault()
      const selectedArticle = searchResults[selectedIndex]
      handleSelectResult(selectedArticle)
    }
  }

  // 選択した結果が見えるようにスクロール
  const scrollSelectedIntoView = () => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
        })
      }
    }
  }

  // 検索結果を選択したときの処理
  const handleSelectResult = (article: ArticleData) => {
    setIsOpen(false)
    setSearchQuery('')
    router.push(`/articles/${article.slug}`)
  }

  // モーダルを閉じる
  const closeModal = () => {
    setIsOpen(false)
    setSearchQuery('')
  }

  // モバイル表示用の検索フォーム
  if (isMobile) {
    return (
      <div className="md:hidden w-full mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">記事を検索...</span>
          <kbd className="ml-auto inline-flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* 検索モーダル（モバイル用と共通） */}
        {isOpen && renderSearchModal()}
      </div>
    )
  }

  // デスクトップ表示用の検索ボタン
  return (
    <>
      {/* キーボードショートカットの表示 */}
      <button
        className="hidden md:flex items-center gap-2 px-8 py-2 border rounded-md text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 dark:border-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span>検索...</span>
        <kbd className="ml-auto inline-flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* 検索モーダル */}
      {isOpen && renderSearchModal()}
    </>
  )
}
