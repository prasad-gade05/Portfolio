# Behind This Portfolio

This note is based on the current codebase and the published static files in this repository.

I want this portfolio to feel like a personal space first and a resume second. A lot of the work behind it has gone into making it useful for different kinds of visitors while still keeping it personal.

## Built for more than one kind of visitor

- I added a **Start Here** guide that explains what the site is, what projects mean, what GitHub, Hugging Face, and Kaggle are, and how to explore the portfolio.
- In `about.json`, I describe the site as being for recruiters, friends, colleagues, tech visitors, and non-tech visitors, not only for hiring.
- I made the resume open inside the site in a modal instead of sending the visitor away to a different page, because I wanted the experience to stay self-contained.

## Personality is part of the site, not an extra layer

- I did not want the portfolio to stop at projects and skills. It also includes hobbies, favorite books, songs, movies, web shows, a Minecraft skin viewer, and small easter eggs.
- The Minecraft section is not a static image. I made it an interactive 3D viewer with rotate and zoom controls, along with custom idle, wave, and jump animations.
- The paper playground captures the current page and turns it into a draggable cloth-style simulation with pins, reset controls, and `Esc` to return.
- The theme system is also more than a simple toggle. There are four themes, the choice is saved, device preference is used as a starting point, and theme changes use a view transition when the browser supports it.

## Layout and responsiveness were carefully thought through

- On desktop, I intentionally designed the main experience to fit within one viewport, with root scrolling hidden.
- I did not want the layout to be only "mobile responsive". The project grid recalculates its column count from screen width and even centers incomplete last rows to avoid awkward empty space.
- When the Blogs tab is opened on smaller screens, the left profile rail is hidden so the reading area gets priority.
- Heavy pieces such as the PDF viewer, Minecraft viewer, blogs pane, tissue overlay, and animated background are lazy-loaded instead of all being pulled into the initial render path.

## Small UX details are handled consistently

- Multiple overlays and modals close on `Esc`, including the profile image, help modal, resume modal, Minecraft modal, movies modal, and the paper playground.
- Blog cards support keyboard activation with `Enter`, and each post card has a copy-link action.
- The root HTML includes a skip link and semantic landmarks like `header`, `nav`, `main`, and `footer` instead of leaving everything inside anonymous containers.
- There is also a no-JavaScript fallback so the site still exposes useful information and links when scripts do not run.

## There is serious work behind the agent-ready side

- I did not stop at `robots.txt` and `llms.txt`. The site publishes a wider machine-readable surface that includes `sitemap.xml`, `llms.txt`, `llms-full.txt`, OpenAPI, A2A-style agent metadata, WebMCP and MCP discovery files, an agent landing page, and an agent skills index.
- The main HTML also includes multiple JSON-LD blocks for `Person`, `WebSite`, `ProfilePage`, `BreadcrumbList`, and project `ItemList` data.
- I added dedicated static JSON endpoints for resume, detailed resume, projects, skills, social links, and the about section, so agents can fetch structured data directly instead of trying to infer everything from the interface.
- The agent layer is also honest about its limits: it documents that this is a read-only static discovery surface on GitHub Pages, not a fake live MCP server.

## The site architecture goes beyond one page

- The GitHub Pages setup is intentionally arranged so `prasadgade.dev` serves the main portfolio while other projects live under their own paths on the same domain.
- The same domain currently hosts the Audio Visualizer, Attendance Tracker, and Habit Tracker, which makes the portfolio act more like a hub than a single isolated page.
- The public agent-facing layer is curated as well. It exposes a defined public project set instead of dumping unstructured information.

## The blog pipeline adds real depth

- Blog posts live in numbered source folders, and the sync script validates that each folder contains exactly one Markdown file and one PNG.
- From that source, the pipeline generates the individual static blog page, `blogs.json`, `rss.xml`, sitemap entries, and the Blogs sections inside `llms.txt` and `llms-full.txt`.
- The generator also derives excerpts, summaries, read time, structured data, Open Graph tags, Twitter tags, and canonical metadata from the post content.
- Generated blog pages preserve theme context with the portfolio and send the **All Blogs** links back to `/?tab=blogs`, so the blog still feels connected to the main site instead of feeling bolted on.

## Final note

I do not think any one of these pieces needs to be loud on its own. What matters to me is that many small decisions point in the same direction. I wanted this site to have care, personality, and clear intent behind it. I did not build it as a box-checking portfolio. I built it as a personal website that reflects both how I work and what I enjoy.
