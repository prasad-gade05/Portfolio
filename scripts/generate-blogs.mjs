import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const SITE_URL = "https://prasadgade.dev";
const AUTHOR_NAME = "Prasad Gade";
const AUTHOR_EMAIL = "prasadgade4405@gmail.com";
const GOOGLE_ANALYTICS_ID = "G-382G6DQ243";
const GOATCOUNTER_URL = "https://prasadgade05.goatcounter.com/count";

const SOURCE_DIR = path.join(ROOT_DIR, "blog-posts");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const BLOGS_DIR = path.join(PUBLIC_DIR, "blogs");
const BLOG_ASSETS_DIR = path.join(BLOGS_DIR, "assets");
const BLOG_LIST_PATH = path.join(BLOGS_DIR, "blogs.json");
const BLOG_RSS_PATH = path.join(BLOGS_DIR, "rss.xml");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");
const LLMS_PATH = path.join(PUBLIC_DIR, "llms.txt");
const LLMS_FULL_PATH = path.join(PUBLIC_DIR, "llms-full.txt");

marked.setOptions({
  gfm: true,
});

function main() {
  ensureDirectory(SOURCE_DIR);
  ensureDirectory(BLOGS_DIR);

  const posts = loadPosts().sort(comparePostsNewestFirst);

  cleanGeneratedBlogDirectories();
  resetBlogAssetsDirectory();
  writeBlogPages(posts);
  writeBlogList(posts);
  writeRssFeed(posts);
  updateSitemap(posts);
  updateLlmsFiles(posts);

  console.log(`Generated ${posts.length} blog post(s).`);
}

function loadPosts() {
  const folders = fs
    .readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => compareSourceFolders(left.name, right.name));

  return folders.map((folder) => loadPost(folder.name));
}

function loadPost(folderName) {
  const folderPath = path.join(SOURCE_DIR, folderName);
  const files = fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !isIgnorableFile(entry.name));

  const markdownFiles = files.filter((file) => path.extname(file.name).toLowerCase() === ".md");
  const pngFiles = files.filter((file) => path.extname(file.name).toLowerCase() === ".png");

  if (markdownFiles.length !== 1 || pngFiles.length !== 1 || files.length !== 2) {
    throw new Error(
      `Expected exactly one .md file and one .png file in "${folderName}", found: ${files
        .map((file) => file.name)
        .join(", ")}`
    );
  }

  const markdownFile = markdownFiles[0];
  const imageFile = pngFiles[0];
  const markdownPath = path.join(folderPath, markdownFile.name);
  const imagePath = path.join(folderPath, imageFile.name);
  const rawMarkdown = fs.readFileSync(markdownPath, "utf8");
  const { data, content } = matter(rawMarkdown);

  const title = normalizeRequiredString(data.title, "title", folderName);
  const publishedDate = normalizeRequiredDate(data.date, folderName);
  const categories = normalizeCategories(data.category ?? data.categories, folderName);
  const slug = data.slug ? normalizeSlug(data.slug, folderName) : slugify(title);
  const thumbnail = normalizeThumbnail(data.thumbnail, imageFile.name, folderName);
  const bodyMarkdown = stripLeadingTitleHeading(content, title).trim();

  if (!bodyMarkdown) {
    throw new Error(`Blog "${folderName}" has no markdown body content.`);
  }

  const excerpt = trimText(extractParagraphText(bodyMarkdown, 1), 200);
  const summary = trimText(extractParagraphText(bodyMarkdown, 2), 360);
  const plainText = collapseWhitespace(stripMarkdown(bodyMarkdown));
  const wordCount = countWords(plainText);
  const readTime = Math.max(1, Math.ceil(wordCount / 225));
  const contentHtml = marked.parse(bodyMarkdown);
  const publishedDateLabel = formatDisplayDate(publishedDate);

  return {
    sourceFolder: folderName,
    sourceImagePath: imagePath,
    title,
    date: publishedDate,
    dateLabel: publishedDateLabel,
    categories,
    slug,
    thumbnail,
    excerpt,
    summary,
    wordCount,
    readTime,
    contentHtml,
    url: `/blogs/${slug}/`,
    absoluteUrl: `${SITE_URL}/blogs/${slug}/`,
    absoluteThumbnailUrl: `${SITE_URL}${thumbnail}`,
  };
}

function writeBlogPages(posts) {
  for (const post of posts) {
    const postDirectory = path.join(BLOGS_DIR, post.slug);
    ensureDirectory(postDirectory);
    fs.copyFileSync(post.sourceImagePath, path.join(BLOG_ASSETS_DIR, path.basename(post.thumbnail)));
    fs.writeFileSync(path.join(postDirectory, "index.html"), renderBlogPage(post), "utf8");
  }
}

function writeBlogList(posts) {
  const payload = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    thumbnail: post.thumbnail,
    categories: post.categories,
    excerpt: post.excerpt,
    readTime: post.readTime,
    url: post.url,
  }));

  fs.writeFileSync(BLOG_LIST_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function writeRssFeed(posts) {
  const lastBuildDate = posts[0] ? formatRssDate(posts[0].date) : formatRssDate(new Date().toISOString().slice(0, 10));
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.absoluteUrl)}</link>
      <guid isPermaLink="true">${escapeXml(post.absoluteUrl)}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${escapeXml(formatRssDate(post.date))}</pubDate>
      <author>${escapeXml(`${AUTHOR_EMAIL} (${AUTHOR_NAME})`)}</author>
${post.categories.map((category) => `      <category>${escapeXml(category)}</category>`).join("\n")}
      <enclosure url="${escapeXml(post.absoluteThumbnailUrl)}" type="image/png" length="0" />
    </item>`
    )
    .join("\n\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Prasad Gade — Blog</title>
    <link>${SITE_URL}/?tab=blogs</link>
    <description>100% human written thoughts on tech, data, building things, and whatever else catches my attention. No AI content. No fluff. Just honest writing.</description>
    <language>en-us</language>
    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
    <managingEditor>${escapeXml(`${AUTHOR_EMAIL} (${AUTHOR_NAME})`)}</managingEditor>
    <webMaster>${escapeXml(`${AUTHOR_EMAIL} (${AUTHOR_NAME})`)}</webMaster>
    <atom:link href="${SITE_URL}/blogs/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/profile.jpg</url>
      <title>Prasad Gade — Blog</title>
      <link>${SITE_URL}/?tab=blogs</link>
    </image>

${items}
  </channel>
</rss>
`;

  fs.writeFileSync(BLOG_RSS_PATH, rss, "utf8");
}

function updateSitemap(posts) {
  let sitemap = fs.readFileSync(SITEMAP_PATH, "utf8");
  const rootLastmod = posts[0]?.date ?? new Date().toISOString().slice(0, 10);

  sitemap = sitemap.replace(
    /(<url>\s*<loc>https:\/\/prasadgade\.dev\/<\/loc>\s*<lastmod>)([^<]+)(<\/lastmod>[\s\S]*?<\/url>)/,
    `$1${rootLastmod}$3`
  );

  sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/prasadgade\.dev\/blogs\/[^<]+<\/loc>[\s\S]*?<\/url>/g, "");

  const blogEntries = posts
    .map(
      (post) => `  <url>
    <loc>${post.absoluteUrl}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("\n");

  sitemap = sitemap.replace(
    /(<url>\s*<loc>https:\/\/prasadgade\.dev\/<\/loc>[\s\S]*?<\/url>)/,
    (_, rootBlock) => `${rootBlock}\n${blogEntries}`
  );

  fs.writeFileSync(SITEMAP_PATH, `${sitemap.trim()}\n`, "utf8");
}

function updateLlmsFiles(posts) {
  const llmsBlogSection = `Prasad writes a personal blog at prasadgade.dev. All written content is 100% human-written. Thumbnails are AI-generated.

- Blog listing: ${SITE_URL}/?tab=blogs
- Blog metadata (JSON): ${SITE_URL}/blogs/blogs.json
- RSS feed: ${SITE_URL}/blogs/rss.xml

### Published Posts

${posts
  .map((post) => `- ${post.title}: ${post.absoluteUrl}`)
  .join("\n")}`;

  const llmsFullBlogSection = `Prasad writes a personal blog at prasadgade.dev. All written content is 100% human-written. Thumbnails are AI-generated.

- Blog listing: ${SITE_URL}/?tab=blogs
- Blog metadata (JSON): ${SITE_URL}/blogs/blogs.json
- RSS feed: ${SITE_URL}/blogs/rss.xml

### Published Posts

${posts
  .map(
    (post) => `#### ${post.title}
- URL: ${post.absoluteUrl}
- Date: ${post.dateLabel}
- ${post.categories.length === 1 ? "Category" : "Categories"}: ${post.categories.join(", ")}
- Read time: ${post.readTime} min
- Summary: ${post.summary}`
  )
  .join("\n\n")}`;

  replaceMarkdownHeadingSection(LLMS_PATH, "Blogs", llmsBlogSection);
  replaceMarkdownHeadingSection(LLMS_FULL_PATH, "Blogs", llmsFullBlogSection);
}

function replaceMarkdownHeadingSection(filePath, heading, replacementBody) {
  const source = fs.readFileSync(filePath, "utf8");
  const normalizedSource = source.replace(/\r\n/g, "\n");
  const sectionPattern = new RegExp(`## ${escapeRegExp(heading)}\\n\\n[\\s\\S]*?(?=\\n## |$)`);

  if (!sectionPattern.test(normalizedSource)) {
    throw new Error(`Could not find "## ${heading}" section in ${path.basename(filePath)}.`);
  }

  const updated = normalizedSource.replace(sectionPattern, `## ${heading}\n\n${replacementBody.trim()}\n`);
  fs.writeFileSync(filePath, updated, "utf8");
}

function cleanGeneratedBlogDirectories() {
  const entries = fs.readdirSync(BLOGS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (entry.name === "assets" || entry.name === "content") {
      continue;
    }

    fs.rmSync(path.join(BLOGS_DIR, entry.name), { recursive: true, force: true });
  }
}

function resetBlogAssetsDirectory() {
  fs.rmSync(BLOG_ASSETS_DIR, { recursive: true, force: true });
  ensureDirectory(BLOG_ASSETS_DIR);
}

function renderBlogPage(post) {
  const metaDescription = escapeHtml(post.excerpt);
  const title = escapeHtml(post.title);
  const categoryTags = post.categories
    .map((category) => `<span class="category-tag">${escapeHtml(category)}</span>`)
    .join("\n          ");
  const articleTags = post.categories
    .map((category) => `  <meta property="article:tag" content="${escapeHtml(category)}" />`)
    .join("\n");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.absoluteThumbnailUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    description: post.summary,
    url: post.absoluteUrl,
    keywords: [...post.categories, "Blog"],
    wordCount: post.wordCount,
    timeRequired: `PT${post.readTime}M`,
  };
  const analyticsLoaderScript = `(() => {
    const schedule = (callback) => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback, { timeout: 2000 });
        return;
      }

      window.setTimeout(callback, 1200);
    };

    const appendScript = (attributes) => {
      const script = document.createElement('script');
      Object.entries(attributes).forEach(([key, value]) => {
        if (value === true) {
          script.setAttribute(key, '');
          return;
        }

        script.setAttribute(key, value);
      });
      document.head.appendChild(script);
    };

    schedule(() => {
      appendScript({
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}',
      });

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', '${GOOGLE_ANALYTICS_ID}');

      appendScript({
        async: true,
        'data-goatcounter': '${GOATCOUNTER_URL}',
        src: '//gc.zgo.at/count.js',
      });
    });
  })();`;

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — ${AUTHOR_NAME}</title>

  <!-- SEO -->
  <meta name="description" content="${metaDescription}" />
  <meta name="author" content="${AUTHOR_NAME}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="canonical" href="${post.absoluteUrl}" />

  <!-- OpenGraph -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${post.absoluteUrl}" />
  <meta property="og:title" content="${title} — ${AUTHOR_NAME}" />
  <meta property="og:description" content="${escapeHtml(post.summary)}" />
  <meta property="og:image" content="${post.absoluteThumbnailUrl}" />
  <meta property="og:site_name" content="${AUTHOR_NAME} — Blog" />
  <meta property="article:author" content="${AUTHOR_NAME}" />
  <meta property="article:published_time" content="${post.date}" />
  <meta property="article:section" content="${escapeHtml(post.categories[0])}" />
${articleTags}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@prasad_gade05" />
  <meta name="twitter:creator" content="@prasad_gade05" />
  <meta name="twitter:title" content="${title} — ${AUTHOR_NAME}" />
  <meta name="twitter:description" content="${escapeHtml(post.summary)}" />
  <meta name="twitter:image" content="${post.absoluteThumbnailUrl}" />

  <!-- RSS Feed -->
  <link rel="alternate" type="application/rss+xml" title="${AUTHOR_NAME} — Blog RSS" href="${SITE_URL}/blogs/rss.xml" />

  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preload" as="image" href="${post.thumbnail}" fetchpriority="high" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
  />
  <script>
    (function() {
      var portfolioTheme = null;
      var blogTheme = null;
      try {
        portfolioTheme = localStorage.getItem('portfolio-theme');
        blogTheme = localStorage.getItem('blog-theme');
      } catch (_) {}

      var theme = null;
      if (portfolioTheme) {
        theme = portfolioTheme === 'light' || portfolioTheme === 'arcade-light' ? 'light' : 'dark';
      }
      if (!theme) theme = blogTheme;
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      }
    })();
  </script>
  <script>${analyticsLoaderScript}</script>
  <link rel="stylesheet" href="/blogs/blog.css" />

  <!-- Structured Data -->
  <script type="application/ld+json">
  ${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>
<body>
  <div class="reading-progress" id="reading-progress"></div>

  <nav class="blog-nav" aria-label="Blog navigation">
    <a href="${SITE_URL}/?tab=blogs" class="nav-logo" id="all-blogs-link">← All Blogs</a>
    <div class="nav-actions">
      <button class="theme-toggle" onclick="toggleTheme()" id="theme-btn" aria-label="Toggle theme">☀ Light</button>
      <button class="share-btn" onclick="sharePost()" id="share-btn" aria-label="Share this post">⇪ Share</button>
    </div>
  </nav>

  <main>
    <article>
      <header class="blog-header">
        <div class="blog-categories">
          ${categoryTags}
        </div>
        <h1 class="blog-title">${title}</h1>
        <div class="blog-meta">
          <span class="author">${AUTHOR_NAME}</span>
          <span class="separator">·</span>
          <time datetime="${post.date}">${post.dateLabel}</time>
          <span class="separator">·</span>
          <span>${post.readTime} min read</span>
        </div>
        <div class="blog-thumbnail">
          <img
            src="${post.thumbnail}"
            alt="${title} thumbnail"
            width="1376"
            height="768"
            loading="eager"
            fetchpriority="high"
          />
        </div>
      </header>

      <div class="blog-content">
${post.contentHtml.trim()}
      </div>
    </article>
  </main>

  <footer class="blog-footer">
    <p class="human-written-note">All written content is 100% human written · Thumbnail generated by AI</p>
    <div class="footer-links">
      <a href="${SITE_URL}" rel="noopener noreferrer">Portfolio</a>
      <a href="${SITE_URL}/?tab=blogs" rel="noopener noreferrer" id="footer-all-blogs-link">All Blogs</a>
      <a href="https://github.com/prasad-gade05" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="mailto:${AUTHOR_EMAIL}">Mail</a>
    </div>
  </footer>

  <script>
    const progressBar = document.getElementById('reading-progress');
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(progress, 100) + '%';
    }, { passive: true });

    const THEME_KEY = 'blog-theme';
    const PORTFOLIO_THEME_KEY = 'portfolio-theme';
    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-btn');
    const allBlogsLinks = [
      document.getElementById('all-blogs-link'),
      document.getElementById('footer-all-blogs-link'),
    ].filter(Boolean);
    let portfolioTheme = null;

    const resolvePortfolioTheme = (theme) => {
      if (portfolioTheme === 'arcade-dark' || portfolioTheme === 'arcade-light') {
        return theme === 'light' ? 'arcade-light' : 'arcade-dark';
      }
      return theme;
    };

    const syncAllBlogsLinks = () => {
      const href = '${SITE_URL}/?tab=blogs&theme=' + encodeURIComponent(portfolioTheme || 'dark');
      allBlogsLinks.forEach((link) => {
        link.href = href;
      });
    };

    const applyTheme = (theme) => {
      html.setAttribute('data-theme', theme);
      themeBtn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
      portfolioTheme = resolvePortfolioTheme(theme);
      syncAllBlogsLinks();
      try {
        localStorage.setItem(THEME_KEY, theme);
        localStorage.setItem(PORTFOLIO_THEME_KEY, portfolioTheme);
      } catch (_) {}
    };

    const savedTheme = (() => {
      try { return localStorage.getItem(THEME_KEY); } catch (_) { return null; }
    })();
    portfolioTheme = (() => {
      try { return localStorage.getItem(PORTFOLIO_THEME_KEY); } catch (_) { return null; }
    })();
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme((portfolioTheme === 'light' || portfolioTheme === 'arcade-light' ? 'light' : portfolioTheme ? 'dark' : null) || savedTheme || (systemDark ? 'dark' : 'light'));

    const toggleTheme = () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    };

    const shareBtn = document.getElementById('share-btn');
    const sharePost = () => {
      const url = '${post.absoluteUrl}';
      navigator.clipboard.writeText(url).then(() => {
        shareBtn.textContent = '✓ Copied!';
        shareBtn.classList.add('copied');
        setTimeout(() => {
          shareBtn.textContent = '⇪ Share';
          shareBtn.classList.remove('copied');
        }, 2200);
      }).catch(() => {
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        shareBtn.textContent = '✓ Copied!';
        setTimeout(() => { shareBtn.textContent = '⇪ Share'; }, 2200);
      });
    };
  </script>
</body>
</html>
`;
}

function normalizeRequiredString(value, fieldName, folderName) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Blog "${folderName}" is missing a valid "${fieldName}" frontmatter field.`);
  }

  return value.trim();
}

function normalizeRequiredDate(value, folderName) {
  const dateValue = normalizeRequiredString(value, "date", folderName);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    throw new Error(`Blog "${folderName}" has an invalid date "${dateValue}". Use YYYY-MM-DD.`);
  }

  return dateValue;
}

function normalizeCategories(value, folderName) {
  const categories = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  const cleaned = categories
    .flatMap((category) => category?.toString().split(",") ?? [])
    .map((category) => category.trim())
    .filter(Boolean);

  if (cleaned.length === 0) {
    throw new Error(`Blog "${folderName}" must define at least one category.`);
  }

  return cleaned;
}

function normalizeThumbnail(value, imageFileName, folderName) {
  const thumbnail = normalizeRequiredString(value, "thumbnail", folderName);

  if (thumbnail !== `/blogs/assets/${imageFileName}`) {
    throw new Error(
      `Blog "${folderName}" thumbnail must be "/blogs/assets/${imageFileName}" to match the source PNG file.`
    );
  }

  return thumbnail;
}

function normalizeSlug(value, folderName) {
  const rawSlug = normalizeRequiredString(value, "slug", folderName);
  const cleaned = rawSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!cleaned) {
    throw new Error(`Blog "${folderName}" has an invalid slug "${rawSlug}".`);
  }

  return cleaned;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripLeadingTitleHeading(markdown, title) {
  const lines = markdown.replace(/^\uFEFF/, "").split(/\r?\n/);

  while (lines.length > 0 && !lines[0].trim()) {
    lines.shift();
  }

  const firstLine = lines[0]?.trim() ?? "";
  if (firstLine === `# ${title}`) {
    lines.shift();
    while (lines.length > 0 && !lines[0].trim()) {
      lines.shift();
    }
  }

  return lines.join("\n");
}

function extractParagraphText(markdown, count) {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .filter((chunk) => {
      const firstLine = chunk.split(/\r?\n/, 1)[0].trim();
      return !/^([#>`*-]|\d+\.)/.test(firstLine) && !/^```/.test(firstLine);
    })
    .slice(0, count)
    .map((chunk) => collapseWhitespace(stripMarkdown(chunk)));

  return paragraphs.join(" ");
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>+\s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/<\/?[^>]+>/g, " ");
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function trimText(text, maxLength) {
  const normalized = collapseWhitespace(text);
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const shortened = normalized.slice(0, maxLength);
  const trimmed = shortened.slice(0, shortened.lastIndexOf(" "));
  return `${(trimmed || shortened).trim()}...`;
}

function collapseWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function formatDisplayDate(isoDate) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

function formatRssDate(isoDate) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(`${isoDate}T00:00:00+05:30`)).map((part) => [part.type, part.value])
  );

  return `${parts.weekday}, ${parts.day} ${parts.month} ${parts.year} ${parts.hour}:${parts.minute}:${parts.second} +0530`;
}

function comparePostsNewestFirst(left, right) {
  if (left.date !== right.date) {
    return right.date.localeCompare(left.date);
  }

  return compareSourceFolders(left.sourceFolder, right.sourceFolder);
}

function compareSourceFolders(left, right) {
  const leftNumber = Number(left);
  const rightNumber = Number(right);

  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
    return leftNumber - rightNumber;
  }

  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function isIgnorableFile(fileName) {
  return fileName.startsWith(".") || fileName.toLowerCase() === "thumbs.db";
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeXml(value) {
  return escapeHtml(value);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main();
