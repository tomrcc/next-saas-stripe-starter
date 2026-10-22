# Editing the SaaS Starter website

This site is the public website of the SaaS Starter: the home page, the blog, the changelog, the documentation and the legal pages. The sign-in pages, the dashboard and the pricing page are part of the app and aren't edited here.

## Quick links

- [Pages](cloudcannon:collections/pages)
- [Blog](cloudcannon:collections/blog)
- [Changelog](cloudcannon:collections/changelog)
- [Docs](cloudcannon:collections/docs)
- [Site data](cloudcannon:collections/data)

## What the preview shows

The preview shows the website with sign-in and billing switched off. So it has no **Log in** or **Sign up** buttons, no **Pricing** link and no **Product** column in the footer, and the first button on the home page reads **Get the code**. The live website shows them as usual. Links for these parts are still listed in the header and footer data, marked with their module.

## Pages

- **Home page:** built from sections. Add, remove, reorder and edit them in the Visual Editor. Demos, logos and GitHub figures are part of the design and can't be edited here.
- **Blog** and **Changelog:** the title and introduction at the top of those listing pages. The posts below them come from the Blog and Changelog collections.
- **Privacy Policy** and **Terms of Service:** legal pages. Each numbered part of the page is a **Numbered section** component; start each one with a level-2 heading.

Use **+ Add** to create a new page built from sections, or a new legal page. A new page previews an existing page until the site has rebuilt.

## Blog

Each post has a cover image, a date, one or more authors, categories and up to three related posts. New posts open in the Content Editor.

## Changelog

Each entry has a date, an optional cover image and an author. Every entry also shows in full on the Changelog page.

## Docs

The documentation pages. After adding a page, add it to **meta** in the docs folder of Site data, or it won't show in the sidebar.

## Site data

- **authors:** names, roles, avatars and X handles shown on posts and changelog entries.
- **categories:** the blog categories, shown as tabs on the Blog page.
- **site:** the site name, the home page title and the site description.
- **navigation** and **footer:** the header links and the footer columns. A link marked with a module only shows while that module is on.
- **meta** (in the docs folder): the order of the documentation pages in the sidebar.

## Components in text

In the Content Editor, insert these from the component button:

- **Callout:** a highlighted note, info by default, or a warning, error, success or tip.
- **Link cards:** a grid of cards linking to other pages.
- **Numbered section:** one numbered part of a legal page.
- **Hidden note:** a note for editors that never shows on the page.
