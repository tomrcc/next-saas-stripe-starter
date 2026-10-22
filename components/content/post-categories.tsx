import { Badge } from "@/components/ui/badge"
import categories from "@/data/categories.json"

// A post's category badges. Registered for the Visual Editor, so it looks the
// titles up itself and re-renders when the categories select changes.
export function PostCategories({
  categories: slugs,
}: {
  categories?: string[] | null
}) {
  if (!slugs?.length) return null
  return slugs.map((slug) => {
    const index = categories.findIndex((item) => item.slug === slug)
    return (
      <Badge key={slug} variant="secondary" className="rounded-lg">
        {index === -1 ? (
          slug
        ) : (
          <editable-text data-prop={`@data[categories].${index}.title`}>
            {categories[index].title}
          </editable-text>
        )}
      </Badge>
    )
  })
}
