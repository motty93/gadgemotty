'use client'

import type React from 'react'

import { generateSlug, generateUrlSlug } from '@/lib/utils'
import { ChevronDown, ChevronRight, List } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  urlSlug: string
  text: string
  level: number
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLDivElement | null>
}

export function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [isOpen, setIsOpen] = useState(true)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!contentRef.current) return

    const headings = contentRef.current.querySelectorAll('h2, h3, h4')
    const items: TocItem[] = []
    const usedIds = new Set<string>()

    headings.forEach((heading) => {
      const text = heading.textContent || ''
      let id = generateSlug(text)
      const urlSlug = generateUrlSlug(text)

      if (usedIds.has(id)) {
        let counter = 1
        let newId = `${id}-${counter}`
        while (usedIds.has(newId)) {
          counter++
          newId = `${id}-${counter}`
        }
        id = newId
      }

      usedIds.add(id)

      // 見出しにIDを設定
      heading.id = id

      items.push({
        id,
        urlSlug,
        text,
        level: Number.parseInt(heading.tagName.substring(1)), // h2 -> 2, h3 -> 3, etc.
      })
    })

    setTocItems(items)
  }, [contentRef])

  useEffect(() => {
    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      },
    )

    // 全ての見出し要素を監視
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [tocItems])

  // 目次が空の場合は表示しない
  if (tocItems.length === 0) {
    return null
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow-sm mb-6 dark:bg-gray-800 dark:text-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-bold mb-2"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <List className="h-5 w-5 mr-2" />
          <span>目次</span>
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {isOpen && (
        <nav className="mt-3 border-t pt-3 dark:border-gray-700">
          <ul className="space-y-2 text-sm">
            {tocItems.map((item) => (
              <li
                key={item.id}
                className={`${item.level === 2 ? 'pl-0' : item.level === 3 ? 'pl-4' : 'pl-8'}`}
              >
                <a
                  href={`#${item.urlSlug}`}
                  className={`block hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                    activeId === item.id
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById(item.id)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                      window.history.pushState(null, '', `#${item.urlSlug}`)
                      setActiveId(item.id)
                    }
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
