'use client'

import NextImageHandler from '@/components/next-image-handler'
import { TableOfContents } from '@/components/table-of-contents'
import React, { useEffect, useRef, useState } from 'react'

interface ArticleContentProps {
  content: string
  htmlContent?: string
}

export function ArticleContent({ content, htmlContent }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Cloudflare Workers環境での実行か、クライアントサイドでhtmlContentがある場合
  if (htmlContent && (typeof window === 'undefined' || isClient)) {
    return (
      <>
        <TableOfContents contentRef={contentRef} />
        <NextImageHandler
          htmlContent={htmlContent}
          className="prose max-w-none dark:prose-invert"
          ref={contentRef}
        />
      </>
    )
  }

  // 開発環境 or 通常の実行環境
  // const LazyBody = useMemo(
  //   () =>
  //     typeof window !== 'undefined'
  //       ? React.lazy(async () => {
  //           const Comp = await mdxToComponent(content)
  //           return { default: Comp }
  //         })
  //       : null,
  //   [content],
  // )
  //
  // const components: MDXComponents = { Image }

  return (
    <>
      <TableOfContents contentRef={contentRef} />
      <div
        ref={contentRef}
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </>
  )
}
