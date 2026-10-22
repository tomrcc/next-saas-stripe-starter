import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import authors from "@/data/authors.json"

// "Written by" in a post's sidebar: `authors` on blog posts, `author` on
// changelog entries. Registered for the Visual Editor, so it looks the authors
// up itself and re-renders when the select changes.
export function PostAuthors({
  authors: slugs,
  author,
}: {
  authors?: string[] | null
  author?: string | null
}) {
  const indexes = (slugs ?? (author ? [author] : []))
    .map((slug) => authors.findIndex((item) => item.slug === slug))
    .filter((index) => index !== -1)
  if (indexes.length === 0) return null

  return (
    <div className="pb-5">
      <p className="text-sm text-muted-foreground">Written by</p>
      <div className="mt-3 space-y-3">
        {indexes.map((index) => {
          const item = authors[index]
          return (
            <div key={item.slug} className="flex items-center gap-3">
              <Avatar className="size-9 border">
                <AvatarImage src={item.image} alt={item.name} />
                <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p
                  data-editable="text"
                  data-prop={`@data[authors].${index}.name`}
                  className="text-sm leading-none font-semibold"
                >
                  {item.name}
                </p>
                <p
                  data-editable="text"
                  data-prop={`@data[authors].${index}.role`}
                  className="mt-1 text-xs text-muted-foreground"
                >
                  {item.role}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
