import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Simplified version of the bundling script that avoids using next-mdx-remote/serialize
async function bundleArticles() {
  const articlesDirectory = path.join(process.cwd(), 'content', 'articles')

  // Create the directory if it doesn't exist
  if (!fs.existsSync(articlesDirectory)) {
    console.log(`Creating articles directory at ${articlesDirectory}`)
    fs.mkdirSync(articlesDirectory, { recursive: true })
    console.log('No articles found. Bundle complete.')

    // Create an empty bundle file
    const outputPath = path.join(process.cwd(), 'lib', 'bundled-articles.json')
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2))

    // Create type definition file
    const typeDefPath = path.join(process.cwd(), 'lib', 'bundled-articles.d.ts')
    const typeDef = `import { BundledArticles } from './types';

declare const bundledArticles: BundledArticles;
export default bundledArticles;
`
    fs.writeFileSync(typeDefPath, typeDef)

    return
  }

  const fileNames = fs.readdirSync(articlesDirectory)

  const articles = fileNames.map((fileName) => {
    const filePath = path.join(articlesDirectory, fileName)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    // Format the date strings
    const date = data.date || new Date().toISOString().split('T')[0]
    const createdAt = data.createdAt || date
    const updatedAt = data.updatedAt || date

    return {
      slug: fileName.replace(/\.mdx?$/, ''),
      content,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      category: data.category || 'Uncategorized',
      categoryLabel: data.categoryLabel || data.category || 'Uncategorized',
      date,
      createdAt,
      updatedAt,
      image: data.image || '/placeholder.svg?height=400&width=600',
      featured: data.featured || false,
    }
  })

  // Ensure the lib directory exists
  const libDir = path.join(process.cwd(), 'lib')
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true })
  }

  // Output as JSON file
  const outputPath = path.join(process.cwd(), 'lib', 'bundled-articles.json')
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2))

  // Generate type definition file
  const typeDefPath = path.join(process.cwd(), 'lib', 'bundled-articles.d.ts')
  const typeDef = `import { BundledArticles } from './types';

declare const bundledArticles: BundledArticles;
export default bundledArticles;
`
  fs.writeFileSync(typeDefPath, typeDef)

  console.log(`Bundled ${articles.length} articles to ${outputPath}`)
  console.log(`Generated type definitions at ${typeDefPath}`)
}

bundleArticles().catch(console.error)
