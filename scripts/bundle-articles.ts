import fs from 'fs'
import path from 'path'
import { compile } from '@mdx-js/mdx'
import matter from 'gray-matter'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

async function bundleArticles() {
  const articlesDirectory = path.join(process.cwd(), 'content', 'articles')
  const fileNames = fs.readdirSync(articlesDirectory)

  const articles = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      const compiled = await compile(content, {
        jsx: true,
        outputFormat: 'function-body',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
        format: 'mdx',
      })

      const compiledCode = String(compiled.value).replace(/^export default /, 'return ')

      return {
        slug: fileName.replace(/\.mdx?$/, ''),
        content: compiledCode,
        ...data,
      }
    }),
  )

  // JSONファイルとして出力
  const outputPath = path.join(process.cwd(), 'lib', 'bundled-articles.json')
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2))

  // 型定義ファイルも生成
  const typeDefPath = path.join(process.cwd(), 'lib', 'bundled-articles.d.ts')
  const typeDef = `import { BundledArticles } from './types';

declare const bundledArticles: BundledArticles;
export default bundledArticles;
`
  fs.writeFileSync(typeDefPath, typeDef)

  console.log(`Bundled ${articles.length} articles to ${outputPath}`)
  console.log(`Generated type definitions at ${typeDefPath}`)
}

bundleArticles().catch((error) => console.error(error))
