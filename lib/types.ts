import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface BundledArticle {
  slug: string
  title: string
  excerpt?: string
  content: string
  mdxSource?: MDXRemoteSerializeResult
  category: string
  categoryLabel?: string
  date: string
  createdAt?: string
  updatedAt?: string
  image?: string
  featured?: boolean
}

export type BundledArticles = BundledArticle[]
