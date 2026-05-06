# Keyboard and Agent Readiness

## Keyboard shortcuts

Press `?` in the app to open the shortcut guide.

- `1` to `9`, `0` switch the main tabs: 1 Projects, 2 About, 3 Skills, 4 Experience, 5 Education, 6 Achievements, 7 Certs, 8 Volunteer, 9 Hobbies, 0 Blogs
- `Arrow` keys move through the interactive items in the active tab
- `Home` / `End` jump to the first or last interactive item in the active tab
- `Enter` opens the focused card action or link
- `Space` makes the Minecraft skin jump when the viewer is focused
- `R` opens the resume
- `T` cycles themes even while the Start Here, movies, resume, or Minecraft modal is open
- `Esc` closes the current modal or overlay
- Shortcuts are ignored while typing inside inputs, textareas, selects, and contenteditable fields
- In interactive tabs, focus moves through cards first and then their nested links/actions (project links, achievement links, certificate links, hobby actions, blog filters, sort options, blog cards, and share buttons)
- About and Skills do not expose in-pane interactive targets, so only the global shortcuts apply there

## Agent readiness

The agent-facing surface is static and lives in `public\`.

```text
public\
├── .well-known\
│   ├── agent.json
│   ├── agent-skills\index.json
│   ├── agents.json
│   ├── api-catalog
│   ├── mcp.json
│   ├── openapi
│   └── webmcp.json
├── agent\index.html
├── api\
│   ├── about.json
│   ├── projects.json
│   ├── resume-master.json
│   ├── resume.json
│   ├── skills.json
│   └── social.json
├── agents.json
├── llms-full.txt
├── llms.txt
├── openapi.json
├── robots.txt
└── sitemap.xml
```

- `api\about.json` includes site features and keyboard shortcut details
- `llms.txt` and `llms-full.txt` summarize the same public surface for LLM consumption
- `.well-known\*.json` and `openapi.json` publish discovery metadata for the static endpoints
