// Authors and categories referenced by key in the blog posts' frontmatter.
// Editors manage both lists in data/.

import authors from "@/data/authors.json"
import categories from "@/data/categories.json"

type Category = { title: string; description: string }
type Author = { name: string; role: string; image: string; twitter: string }

export const blogCategories: Record<string, Category> = Object.fromEntries(
  categories.map(({ slug, ...category }) => [slug, category])
)

export const blogAuthors: Record<string, Author> = Object.fromEntries(
  authors.map(({ slug, ...author }) => [slug, author])
)

export type BlogCategory = string
export type BlogAuthor = string
