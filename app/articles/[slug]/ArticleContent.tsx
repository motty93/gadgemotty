'use client'

import NextImageHandler from '@/components/next-image-handler'
import { TableOfContents } from '@/components/table-of-contents'
import React, { useEffect, useRef } from 'react'

interface ArticleContentProps {
  content: string
  htmlContent?: string
}

export function ArticleContent({ content, htmlContent }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const displayContent = htmlContent || content

  return (
    <>
      <TableOfContents contentRef={contentRef} />
      {htmlContent ? (
        <NextImageHandler
          htmlContent={htmlContent}
          className="prose max-w-none dark:prose-invert"
          ref={contentRef}
        />
      ) : (
        <div
          className="prose max-w-none dark:prose-invert"
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      )}
    </>
  )
}
