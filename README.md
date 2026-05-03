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

## Keyboard Shortcuts

Keyboard shortcuts are available in the app. Press `?` to open the in-app guide.

---

## Agent Readiness

The agent-facing files live under `public\`:

```
public/
├── .well-known/
│   ├── agent.json                 # A2A Agent Card
│   ├── agents.json                # Agents Directory
│   ├── webmcp.json                # WebMCP Manifest
│   ├── webmcp                     # WebMCP Alias
│   ├── mcp.json                   # MCP Discovery
│   ├── api-catalog                # API Catalog
│   ├── agent-skills/
│   │   └── index.json             # Agent Skills Index
│   └── openapi                    # OpenAPI Alias
├── agent/
│   └── index.html                 # Agent Landing Page
├── api/
│   ├── resume.json                # Primary Slim Resume
│   ├── resume-master.json         # Detailed Master Resume
│   ├── projects.json              # Projects Portfolio
│   ├── skills.json                # Skills Taxonomy
│   ├── social.json                # Contact & Social
│   └── about.json                 # Personality & Hobbies
├── blogs/
│   ├── blogs.json                 # Blog Metadata
│   ├── rss.xml                    # RSS Feed
│   └── content/
│       └── introduction-blogging-journey.md
├── openapi.json                   # OpenAPI Specification
├── agents.json                    # Root Agents Directory
├── llms.txt                       # LLM Summary
├── llms-full.txt                  # LLM Full Content
├── robots.txt                     # Crawler Policy
├── sitemap.xml                    # XML Sitemap
└── Prasad_Gade_Resume.pdf         # PDF Resume
```

More detail: `docs\KEYBOARD_AND_AGENT_READINESS.md`
