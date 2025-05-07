// components/mdx-components.tsx
'use client'

import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'

export const mdxComponents: MDXComponents = {
  img: (props) => {
    const { src = '', alt = '', width = 800, height = 600, ...rest } = props

    return <Image src={src} alt={alt} width={Number(width)} height={Number(height)} {...rest} />
  },
}
