# My Portfolio Site

**Live:** https://prasadgade.dev

---

## Why is this repo named `prasad-gade05.github.io`?

Intentional.

GitHub Pages requires `<username>.github.io` to serve as the **root site** for a custom domain.  
This allows:

- `https://prasadgade.dev` → Portfolio (root)
- `https://prasadgade.dev/<project>` → Other hosted projects

Clean and scalable GitHub Pages architecture.

---

## Other Projects Under This Setup

- Audio Visualizer — https://prasadgade.dev/audio_visualizer_app/
- Attendance Tracker — https://prasadgade.dev/attendance/
- Habit Tracker — https://prasadgade.dev/Habit-Tracker/

_(PS: You might’ve just learned something new about how GitHub Pages routing works)_

---

## Agent Readiness

This site is optimized for discovery by AI agents (ChatGPT, Perplexity, Google AI Overviews, etc.).

**Discovery Layer**
- `/robots.txt` — Crawler permissions (all 13 major AI bots explicitly allowed)
- `/sitemap.xml` — Page listing for search engines and crawlers
- `/llms.txt` — Short summary for LLMs ([llms.txt spec](https://llmstxt.org/))
- `/llms-full.txt` — Full profile with all projects, skills, and personality

**Structured Data (JSON-LD in page head)**
- Person, WebSite, WebPage, ProfilePage, BreadcrumbList, ItemList (Projects)
- Schema.org vocabulary with entity linking via `sameAs` and `@id` references

**Static JSON API (no server needed)**
- `/api/resume.json` — Structured resume data
- `/api/projects.json` — All projects with descriptions and links
- `/api/skills.json` — Categorized technical skills
- `/api/social.json` — Contact info and social profiles
- `/api/about.json` — Site philosophy, personality, hobbies

**Agent Protocol Discovery**
- `/.well-known/agent.json` — A2A-style agent card
- `/.well-known/agents.json` — Primary agent directory
- `/agents.json` — Root alias for agent directory discovery
- `/.well-known/webmcp.json` — WebMCP manifest for pre-navigation tool discovery
- `/.well-known/mcp.json` — MCP discovery metadata for the static portfolio surface

**Security**
- HTTPS enforced by GitHub Pages
- CSP and referrer-policy via meta tags
- Noscript fallback for crawlers that do not execute JavaScript
