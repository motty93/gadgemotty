import type React from 'react'

export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || query.trim() === '') {
    return text
  }

  const terms = query.toLowerCase().trim().split(/\s+/)
  let result = text

  // 各検索単語でハイライト
  terms.forEach((term) => {
    if (term.length < 2) return

    const regex = new RegExp(`(${term})`, 'gi')
    const parts = result.split(regex)

    if (parts.length > 1) {
      result = parts
        .map((part, _) => {
          if (part.toLowerCase() === term.toLowerCase()) {
            return `<mark class="bg-yellow-200 dark:bg-yellow-700">${part}</mark>`
          }

          return part
        })
        .join('')
    }
  })

  return <span dangerouslySetInnerHTML={{ __html: result }} />
}
