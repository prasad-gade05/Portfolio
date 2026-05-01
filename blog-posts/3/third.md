---
title: "The Philosophy Behind My Site"
date: "2026-05-01"
thumbnail: "/blogs/assets/the-philosophy-behind-my-site.png"
category: ["Technical", "Personal"]
slug: "the-philosophy-behind-my-site"
---

# The Philosophy Behind My Site

So this is going to be a mix of a personal as well as a technical blog about my [website](https://prasadgade.dev). Why I made it, what my thought process is behind all of the features it has, how I have implemented them, and in doing so, you would also get to know a bit about how I think, how I process things, and what my perspectives are.

A lot of people I showed my site to for the first time asked me: "Okay, so who is this site for? What do I do with it? What does this site do?" To answer these questions and to get straight to the point:

> This is my personal website, created for anyone who is curious about me to find out who I am.

### Deeper Dive...

Okay so that was the crisp one-liner. Now if we had to dive deeper, I'd start by saying that I created this site on the 8th of December 2025 with a few simple points in mind:

1. Create something of **mine** which people can see and know who I am by looking at it.

2. Create a piece of the internet which reflects my vision, my perspective and how I look at the world.

3. Create something with a truly meaningful output, a vision, and something that tells a story rather than a site just to tick a box.

So with these goals I set out to create my site, and let me start by telling you that endlessly scrolling websites are not really my thing; I feel kinda lost in scrolling websites. Yes, I know we have nav bars for the same purpose but it just doesn't cut it for me. So the first and very clear vision that I had for the design was I will be having a **SINGLE PAGE, NO SCROLL** site. I feel a user should get exactly what they are visiting the site for. If you are visiting my site to check out my projects you shouldn't have to scroll through my about section and my education then to finally get to the projects - it is simply not efficient!!! So that is what I have implemented. You are on my site for my projects? Boom right there in front of you. Perhaps you are here to look for something cool? You've got the paper playground mini-game or my Minecraft skin to interact with. Maybe you are there to read my blogs? Bingo, one click away. Without any of the unnecessary fluff getting in the way.

### A Bit of the Philosophy and Vision Behind It

As I earlier mentioned, this site is made for anyone trying to know me. A recruiter trying to look at my work and skills. A friend trying to peep on what I have been up to. Someone who met me for the first time and wants to know more about me. A family member, perhaps my mom or dad, who wants to look at what their son is doing or wants to show to someone else what their son does. Basically, you get the point-it is for everybody, and I have made sure that everyone feels welcomed once they open my site. The way that I have made sure this happens is by primarily taking care of small UI/UX tricks which do not seem like much, but trust me, they surely make the difference:

- Having a _Start Here_ modal on the site which clearly explains everything about the site, its navigation and its purpose in layman's terms.

- Having 4 different themes for the site, because hey, everyone has different perspectives. Having 4 themes gives everyone a feeling of being heard and the feeling of seeing my creation via their preferred choice of color blend.

- Having a short introduction of mine in Python code style just to keep things punchy for the geeks.

- Having a modal to open my resume in-site so that users are not redirected to another site and does not break the user flow.

- Having keyboard accessibility shortcuts just to keep the flow going for someone who is glued to their keyboard.

- Having the site responsive across all the screen sizes. (Idk this should not even be a talking point, having a responsive site is a necessity!!! But having seen several personal sites not being one, I had to mention it).

### Personality Touch

Since I had the goal of making this place my piece of the Internet I have made sure to truly reflect who I am as a person beyond tech as well. I've done this by adding quite a few things:

- _Hobbies & Interests_ section which has things listed that I enjoy doing when I am not on my laptop _(P.S very rare)_.

- I have my favourite movies and web shows listed.

- A small easter egg which is triggered by one of the famous cheat codes from a GTA game as well as triggered by a legacy keyboard sequence. _(Enough hints already!!!)_

- I have my favourite songs listed.

- My favourite book listed.

- My Minecraft skin in 3D which you can interact with.

- My personal favourite feature: **_The Paper Playground_** mini-game which literally turns my site into a paper which you can play around with, drag, stretch, pin and have fun with. _(More on the technical sides of this feature later)_.

### Blogs Pipeline

Moving to a bit of the technical side, since I have started writing blogs now (you can check out why: [here](https://prasadgade.dev/blogs/introduction-blogging-journey/)) before starting I had a decision to make. Where to write my blogs? Third party blogging platforms like Medium, etc.? Or host on my own platform? I decided to write and host my blogs on my own site. With this simple architecture: The blogs landing page will be a simple tab in my portfolio just like other tabs and each blog will have its individual new web page. Clean and scalable architecture.

On the UI part since on the mobile screens my default way to present the site was dividing the screen into two horizontal parts and showing tab contents in one part and the main intro section in top part. However this would not have been ideal for the blog. So I specially made it such that the blogs tab whenever opened occupies the whole page instead of dividing it into two parts. Honestly these are the small things that matter, choosing the solution that the situation demands and adapting instead of being stubborn on one vision.

Now let me explain the technical architecture to you. So whenever I have to write a new blog this is what I do:

First, I go to the `blog-posts/` directory present in the root of my site.

Then I create a sub-directory named after the blog number, for example `3/`.

After that I create two files: `[blog_name].md` and `[thumbnail].png`.

The structure looks like this:

```text
blog-posts/
└── 3/
    ├── third.md
    └── the-philosophy-behind-my-site.png
```

The `[blog_name].md` starts with frontmatter like this:

```yaml
---
title: "The Philosophy Behind My Site"
date: "2026-xx-xx"
thumbnail: "/blogs/assets/the-philosophy-behind-my-site.png"
category: ["Technical", "Personal"]
slug: "the-philosophy-behind-my-site"
---
```

Then I run `npm run blogs:sync`.

This command reads every folder inside `blog-posts\` and then:
1. validates that each folder has one markdown file and one PNG file.
2. parses the frontmatter and markdown body
3. creates or updates the static blog page at `public\blogs\<slug>\index.html`
4. copies the PNG into `public\blogs\assets\`
5. rebuilds `public\blogs\blogs.json`
6. rebuilds `public\blogs\rss.xml`
7. updates `public\sitemap.xml`
8. updates the blog sections in `public\llms.txt` and `public\llms-full.txt`

After that I rebuild the project and deploy it.

### Paper Playground

Now talking about my personal feature of the site which is the **Paper Playground**.

> It is a physics-based mini-game which turns my site into a cloth-like simulation which you can interact with in 3D and play around with actions like dragging, pinning and stretching.

Here is the technical breakdown:

I capture the DOM as a texture using **html2canvas**, swap it onto a **Three.js** plane mesh which is a 30 x 30 particle grid, and run **Verlet integration** physics with constraint solving to simulate realistic folding and dragging which is raycast-based.

### Other Technical Features

1. **Agent readiness:**
   Although I have an entire [blog](https://prasadgade.dev/blogs/agent-readiness-on-websites/) about this still it is worth mentioning here. So this site of mine is 100% readable by machines and AI agents. Thus it is safe to say that this site is literally for everybody, be it humans or bots.
   _You can read about how I implemented agent readiness [here](https://prasadgade.dev/blogs/agent-readiness-on-websites/)_.

2. **Hosting and Deployment:**
   This site is hosted on GitHub Pages (GH-Pages), and the custom domain is configured via `public/CNAME` which contains this domain **prasadgade.dev**

3. **Performance and optimization**
   - I have implemented bundle splitting via manual chunking.
   - Lazy loading for heavy components.
   - Typed arrays `(Float32Array)` instead of objects for paper playground since typed arrays are cache friendly.
   - Single-pass updates : Verlet + boundary collision merged.

> Yeah, that was about why and how I have created my site. With love, with intention and with clear vision in mind.
> That was the story behind the piece of creation that I call my [**website**](https://prasadgade.dev).
