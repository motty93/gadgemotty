'use client'

import { TableOfContents } from '@/components/table-of-contents'
import { MDXRemote } from 'next-mdx-remote'
import React, { useRef } from 'react'

// 型安全なコンポーネント定義
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold my-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-xl font-bold mt-8 mb-4 pt-2 border-t border-gray-200 dark:border-gray-700"
      id={props.id}
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg font-bold mt-6 mb-3" id={props.id} {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-base font-bold mt-4 mb-2" id={props.id} {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="rounded-lg my-4 mx-auto" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-blue-600 hover:underline dark:text-blue-400" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded" {...props} />
  ),
}

interface MDXContentProps {
  source: any
}

export function MDXContent({ source }: MDXContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  if (!source) {
    return (
      <>
        <TableOfContents contentRef={contentRef} />
        <div ref={contentRef} className="prose max-w-none dark:prose-invert">
          <p>記事の表示に問題が発生しました。管理者にお問い合わせください。</p>
        </div>
      </>
    )
  }

  return (
    <>
      <TableOfContents contentRef={contentRef} />
      <div ref={contentRef} className="prose max-w-none dark:prose-invert">
        <MDXRemote {...source} components={components} />
      </div>
    </>
  )
}
