// Heading lines from content, broken on wider screens only. Each line is an
// item of the caller's `data-editable="array"` element, so every line renders,
// empty ones included, to keep positions matching the array.
export function Lines({ lines }: { lines?: string[] | null }) {
  const all = lines ?? []
  return all.map((line, index) => (
    <span key={index} data-editable="array-item">
      <editable-text data-prop="">{line}</editable-text>
      {index < all.length - 1 && (
        <>
          {" "}
          <br className="hidden sm:block" />
        </>
      )}
    </span>
  ))
}
