---
title: "Agent Readiness on Websites..."
date: "2026-04-26"
thumbnail: "/blogs/assets/agent-readiness-on-websites.png"
category: ["Technical"]
slug: "agent-readiness-on-websites"
---

# Agent Readiness on Websites...

Recently I made my [portfolio website](https://prasadgade.dev) **agent-ready**. You might ask what exactly do I mean by making my site agent ready? Well, in today's landscape, AI agents have access to web searching tools. This means that AI agents can access the internet, access URLs and fetch data from them. But the issue is, via normal scraping, such agents may fetch the incorrect information like ads or navigation of your site or misinterpret some pages or miss some important pages or different bots may interpret different sites differently.

Making your site agent ready solves this problem. Here is exactly(but is not limited to) what making sites agent ready mean :

1. Adding files to website's root directory, which have structured information about your site. Example: **robots.txt** and allowing AI agents to scrape, **llms-full.txt** etc.
2. Creating API endpoints for bots to call and directly fetch dynamic data on the go.
3. Having MCP configurations set up on your site.
4. Having A2A agent readiness cards.
5. Adding HSTS headers and Cross Referrer Policy set which allow AI agents and bots.

> In short, having files which contain structured data for bots and which are not visible on your frontend as well as having _bot-friendly_ settings configured.

### A bit of history and how it works...

Having crawler friendly settings is not a new concept and has existed for a while (Since 1994 or 30 years to be precise). Actually, having robots.txt is one of the oldest web standards which is still in practice. What this does is it allows easy access for crawlers to your data and now building upon the same idea we have agent readiness practices. Because our AI agents are now intelligent and can "understand" the data as opposed to traditional web crawlers, which were just used to fetch data, we can be a lot more creative and can present perfectly tailored data for AI agents to ingest.

You might think how do these bots find these sites if they are not visible on the frontend? The answer is easier than you might think. As I mentioned, the robots.txt standard has been there for more than 30 years. Thus it has also been fed as training data to these LLMs and these LLMs know that such files exist in the project's root directory; you just have to visit them. Hence to answer that question, LLMs _"intuitively"_ know via their training data that a website may have such machine readable files.

### What does each of the parameters in agent readiness mean?

So, for implementing agent readiness for my site, I referred two sources:

1. https://isitagentready.com/en from [Cloudflare](https://www.cloudflare.com/en-in/).
2. https://isagentready.com/en/

Of these, I found the 2nd one to be more comprehensive and detailed.
Now let me quickly explain to you the agent readiness parameters that these sites check.

1. **Machine readable files:** refer to files which AI agents can access to get information from your site, including robots.txt, llms.txt, llm-fulltext.txt, sitemap.xml etc.
2. **AI search signals:** includes author attribution, JSON-LD, website schema, FAQ Page schema etc.
3. **Semantics:** checks whether you are using correct HTML tags or if your site is just a `<div>` mess, checks accessibility settings, titles etc.
4. **Protocols:** checks if you have **MCP (model context protocol)** enabled on your site for agents to directly interact with it and perform transactions etc., checks A2A agent cards, agents.json files.
5. **Security:** checks for HTTP headers, HSTS headers, content security policy, CORS configuration, referrer policy etc.

### What did I implement in my site?

Here is a quick summary of everything that I implemented on my site which got me a score of **87/100** on **[isagentready.com](https://isagentready.com/en/)** as of writing this blog.

#### File Structure

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

#### Some Key design decision points.

1. Static APIs: since my site is a static React app, all of the API endpoints return static JSON data with no server-side processing involved.
2. Since my site is hosted on GitHub-Pages (GH-Pages) thus I could not configure most of the security parameters which is where my site is lagging behind in terms of agent readiness. Since I do not plan to move my deployment architecture, I am okay with this.

### My take on "agent readiness"

I feel having your site agent ready will become an unspoken rule in a few years. And you will be left behind if you are not complying with it. Having a site which an AI agent can easily access, understand, and interact with will no longer be a flex but rather a necessity. I also feel sites which we use for completing a certain task, such as buying things or fetching information, will heavily be replaced by AI agents doing the work for us. Additionally there might be many recruiters who might just be going on chatbots and asking them to find candidates with certain skill set and criteria, thus having your site ready for such agents to understand is going to be a massive advantage.
Ohh, well, that rings a bell to me, you can actually go to your favourite chatbot or LLM with web searching enabled and ask it to fetch all of the information from my site https://prasadgade.dev and watch how it gracefully accesses all of the information that I have served on a silver platter for it to ingest.

> Bottom line being, we not only have to make sites prettier for humans but also for AI agents in the sense that they feel like being in a data and context heaven.
