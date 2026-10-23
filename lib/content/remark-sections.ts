type Node = { type: string; depth?: number; children?: Node[]; data?: object }

// Wraps each `## heading` and the content up to the next one in a <section>,
// so a legal page's file stays plain markdown for editors. mdast-util-to-hast
// renders the unknown node type as its `hName`.
export function remarkSections() {
  return (tree: { children: Node[] }) => {
    const children: Node[] = []
    let section: Node[] | undefined

    for (const node of tree.children) {
      if (node.type === "heading" && node.depth === 2) {
        section = [node]
        children.push({
          type: "section",
          children: section,
          data: { hName: "section" },
        })
      } else if (section) {
        section.push(node)
      } else {
        children.push(node)
      }
    }

    tree.children = children
  }
}
