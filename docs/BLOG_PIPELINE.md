# Blog Pipeline

## Source structure

All blog source content lives in `blog-posts\`.

Only **subfolders** inside `blog-posts\` are treated as blog posts. Files placed directly in `blog-posts\` are ignored.

Example:

```text
blog-posts\
  1\
    first.md
    thumbnail.png
  2\
    second.md
    second.png
```

Each post folder must contain:

- exactly one `.md` file
- exactly one `.png` file
- nothing else except ignorable system files

If that structure is wrong, `npm run blogs:sync` fails on purpose.

## Required frontmatter

Each markdown file must start with frontmatter like this:

```md
---
title: "Post title"
date: "2026-05-01"
thumbnail: "/blogs/assets/post-image.png"
category: ["Technical", "Personal"]
slug: "post-title"
---
```

### Notes

- `title` is required
- `date` is required
- `thumbnail` is required
- `category` or `categories` is required
- `slug` is optional; if omitted, it is generated from the title

## Main command

```bash
npm run blogs:sync
```

This command:

1. reads each post folder inside `blog-posts\`
2. validates the folder contents
3. parses frontmatter and markdown
4. generates `public\blogs\<slug>\index.html`
5. copies thumbnails into `public\blogs\assets\`
6. rebuilds `public\blogs\blogs.json`
7. rebuilds `public\blogs\rss.xml`
8. updates blog URLs in `public\sitemap.xml`
9. updates the blog sections in `public\llms.txt` and `public\llms-full.txt`

## What build and deploy do now

`package.json` has:

- `prebuild: npm run blogs:sync`
- `build: vite build`
- `deploy: npm run build && gh-pages -d dist --dotfiles`

That means:

- `npm run build` always regenerates blogs first
- `npm run deploy` also regenerates blogs first because it runs `build`

So yes: **`npm run deploy` is enough to publish new blogs** as long as the new source folder is already correct.

## Normal workflow

1. Create a new numbered folder inside `blog-posts\`.
2. Add one markdown file and one PNG file.
3. Fill the frontmatter correctly.
4. Run `npm run deploy` to regenerate blog output, build the site, and publish it.

If you only want to refresh locally without deploying, run:

```bash
npm run build
```
