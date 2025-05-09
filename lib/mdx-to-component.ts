import { compile, run } from '@mdx-js/mdx'
import * as mdxReact from '@mdx-js/react'
import { MDXComponents } from 'mdx/types'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import { remarkNextImage } from './remark-next-image'

export async function mdxToComponent(src: string) {
  const compiled = await compile(src, {
    jsx: false,
    outputFormat: 'function-body',
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [remarkGfm, remarkNextImage],
  })

  const { default: MDX } = await run(String(compiled), {
    ...runtime, // jsx, jsxs, Fragment
    ...mdxReact, // useMDXComponents, MDXPorvider, etc...
    baseUrl: import.meta.url,
  })

  return MDX as React.ComponentType<{ components?: MDXComponents }>
}
