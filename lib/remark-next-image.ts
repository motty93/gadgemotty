import { visit } from 'unist-util-visit'

export function remarkNextImage() {
  return (tree: Node) => {
    visit(tree, 'image', (node: any) => {
      node.type = 'mdxJsxFlowElement'
      node.name = 'Image'
      node.attributes = [
        { type: 'mdxJsxAttribute', name: 'src', value: node.url },
        { type: 'mdxJsxAttribute', name: 'alt', value: node.alt || '' },
        { type: 'mdxJsxAttribute', name: 'width', value: 800 },
        { type: 'mdxJsxAttribute', name: 'height', value: 450 },
      ]
    })
  }
}
