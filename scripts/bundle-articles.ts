import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

function bundleArticles() {
  const articlesDirectory = path.join(process.cwd(), 'content', 'articles')
  const fileNames = fs.readdirSync(articlesDirectory)

  const articles = fileNames.map((fileName) => {
    const filePath = path.join(articlesDirectory, fileName)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: fileName.replace(/\.mdx?$/, ''),
      content: content,
      ...data,
    }
  })

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

bundleArticles()
