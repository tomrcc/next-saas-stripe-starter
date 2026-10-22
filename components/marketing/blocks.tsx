import { blockMap } from "@/app/cloudcannon/componentMap"

// Extra props per `_type` that a block can't read from its content. Keys must
// be lowercase: the Visual Editor lowercases `data-literal-*` names.
export type BlockExtras = Record<string, Record<string, unknown>>

// Renders a page's content_blocks from the shared block map.
export function Blocks({
  blocks,
  extras = {},
}: {
  blocks: { _type: string }[]
  extras?: BlockExtras
}) {
  return (
    <div
      data-editable="array"
      data-prop="content_blocks"
      data-component-key="_type"
    >
      {blocks.map((block, index) => {
        const Block = blockMap[block._type]
        // Skipping a block would shift every later one onto the wrong array entry.
        if (!Block) {
          throw new Error(`No block component for _type "${block._type}"`)
        }
        const blockExtras = extras[block._type] ?? {}
        // The editor re-renders a block from its content plus these literals.
        const literals = Object.fromEntries(
          Object.entries(blockExtras).map(([key, value]) => [
            `data-literal-${key}`,
            JSON.stringify(value),
          ])
        )
        return (
          <div
            key={index}
            data-editable="array-item"
            data-component={block._type}
            {...literals}
          >
            <Block {...block} {...blockExtras} />
          </div>
        )
      })}
    </div>
  )
}
