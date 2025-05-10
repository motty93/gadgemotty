import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

function remarkNextImageHtml() {
  return (tree: any) => {
    visit(tree, 'image', (node: any) => {
      const src = node.url
      const alt = node.alt || ''

      node.type = 'html'
      node.value = `<next-image-placeholder data-src="${src}" data-alt="${alt}" data-width="800" data-height="450"></next-image-placeholder>`
    })
  }
}

export async function mdxToHtml(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkNextImageHtml) // カスタムプラグインを追加
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content)

  return String(file)
}
