# Blog Pipeline

## Source folder

All blog source files now live in `blog-posts\`.

Each post gets its own numbered folder, for example:

```text
blog-posts\
  2\
    second.md
    agent-readiness-on-websites.png
```

Each post folder must contain:

- exactly one `.md` file
- exactly one `.png` file

## Markdown frontmatter

The markdown file must start with frontmatter like this:

```md
---
title: "Agent Readiness on Websites..."
date: "2026-04-26"
thumbnail: "/blogs/assets/agent-readiness-on-websites.png"
category: ["Technical"]
---
```

`slug` is also supported when you want a fixed URL that should not change after the post is published.

## Command

Run:

```bash
npm run blogs:sync
```

## What the command does

The command reads every folder inside `blog-posts\` and then:

1. validates that each folder has one markdown file and one PNG file
2. parses the frontmatter and markdown body
3. creates or updates the static blog page at `public\blogs\<slug>\index.html`
4. copies the PNG into `public\blogs\assets\`
5. rebuilds `public\blogs\blogs.json`
6. rebuilds `public\blogs\rss.xml`
7. updates `public\sitemap.xml`
8. updates the blog sections in `public\llms.txt` and `public\llms-full.txt`

## What the command does not do

This command does **not**:

- build the site
- deploy the site
- run git commands

## Normal workflow

1. Create a new numbered folder inside `blog-posts\`.
2. Put one markdown file and one PNG file inside it.
3. Fill the markdown frontmatter correctly.
4. Run `npm run blogs:sync`.
