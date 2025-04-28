'use client'

import { ArticleData } from '@/lib/markdown'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SpotlightSearch } from './spotlight-search'

interface HeaderProps {
  articles: ArticleData[]
}

export function Header(props: HeaderProps) {
  const { articles } = props
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header className="relative">
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <div className="flex items-center gap-4">
            <div className="bg-black rounded-lg p-3">
              <span className="text-white text-2xl font-bold">
                M<span className="text-sm">t</span>
              </span>
            </div>
            <h1 className="text-3xl font-black">ガジェモティ</h1>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <SpotlightSearch articles={articles} />

          <button
            className="md:hidden p-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white z-50 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-white dark:bg-gray-900 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="p-6 pt-20">
          <button
            className="absolute top-4 right-4 p-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
            onClick={() => setIsMenuOpen(false)}
            aria-label="メニューを閉じる"
          >
            <X size={24} />
          </button>

          <nav className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-3 border-b pb-2 dark:border-gray-700">メニュー</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="block py-2 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ホーム{' '}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block py-2 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    科学的根拠に基づいた妊娠中の体重管理
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block py-2 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    チャートアプリ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block py-2 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
