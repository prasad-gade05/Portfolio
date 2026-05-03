# Behind This Portfolio

## What this site is

This site is a personal website first and a portfolio second.

The desktop experience is built around one main viewport:

- the left side introduces me
- the right side lets people explore projects, skills, education, hobbies, and blogs

That structure is intentional. I wanted visitors to understand both my work and my personality without jumping across different pages.

## Why it is built this way

I did not want a plain resume site.

I wanted one place that can work for:

- recruiters
- technical visitors
- non-technical visitors
- friends or anyone simply curious

That is why the site mixes serious work with personal context.

## What is intentionally included

- A **Start Here** guide for first-time visitors
- A resume viewer inside the site instead of sending people away
- Four themes with saved preference
- Personal sections like books, songs, movies, web shows, Minecraft, and Paper Playground
- Agent-readable public files under `public\api\` and `public\.well-known\`

## Why blogs are part of the site

Projects show what I built.

Blogs show how I think while building.

The blog section exists so I can write about:

- what I am learning
- what I am building
- why I made certain decisions
- what worked and what did not

All blog writing is **100% human written**. Thumbnails are generated separately, but the written content is mine.

## Blog system by design

The blog flow is not manual copy-paste work.

Each post starts from a source folder inside `blog-posts\`. From there, the blog generator creates:

- the static blog page
- `public\blogs\blogs.json`
- `public\blogs\rss.xml`
- blog entries in `public\sitemap.xml`
- blog sections inside `public\llms.txt` and `public\llms-full.txt`

This keeps the portfolio, blog archive, and machine-readable surfaces in sync.

## Technical decisions that matter

- Heavy features are split so they are not all loaded on first paint.
- The tab system and large data files were split into smaller focused modules.
- The hero layout is locked to the viewport on desktop so the main shell stays stable across tabs.
- Tests, linting, and build commands exist so changes can be checked before deploy.

## Final point

This site is meant to feel personal, clear, and deliberate.

The goal was never to make a flashy shell around a resume. The goal was to build a site that reflects how I work, what I care about, and how I like to present my work.
