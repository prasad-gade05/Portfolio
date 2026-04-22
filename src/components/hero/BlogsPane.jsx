import { useState, useMemo, useEffect, useRef } from "react";
import { ExternalLink, Share2, Check, ChevronDown } from "lucide-react";
import blogsData from "../../../public/blogs/blogs.json";
import "./BlogsPane.css";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const ALL_CATEGORIES = ["All", ...Array.from(new Set(blogsData.flatMap((b) => b.categories)))];

const BlogCard = ({ blog }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `https://prasadgade.dev${blog.url}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCardClick = () => {
    window.open(`https://prasadgade.dev${blog.url}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="blog-card" onClick={handleCardClick} role="article" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}>
      <div className="blog-card-thumb-wrap">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="blog-card-thumb"
          loading="lazy"
        />
        <button
          className={`blog-card-share ${copied ? "copied" : ""}`}
          onClick={handleShare}
          title={copied ? "Link copied!" : "Copy link"}
          aria-label="Copy blog link"
        >
          {copied ? <Check size={13} /> : <Share2 size={13} />}
        </button>
      </div>
      <div className="blog-card-body">
        <div className="blog-card-categories">
          {blog.categories.map((cat) => (
            <span key={cat} className="blog-category-tag">{cat}</span>
          ))}
        </div>
        <h3 className="blog-card-title">{blog.title}</h3>
        <p className="blog-card-excerpt">{blog.excerpt}</p>
        <div className="blog-card-meta">
          <time dateTime={blog.date}>{formatDate(blog.date)}</time>
          <span className="meta-dot">·</span>
          <span>{blog.readTime} min read</span>
          <span className="blog-card-read-more">
            Read <ExternalLink size={11} />
          </span>
        </div>
      </div>
    </div>
  );
};

const BlogsPane = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    };
    if (showSort) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSort]);

  const results = useMemo(() => {
    let list = [...blogsData];

    if (activeCategory !== "All") {
      list = list.filter((b) => b.categories.includes(activeCategory));
    }

    list.sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      return sortOrder === "newest" ? db - da : da - db;
    });

    return list;
  }, [activeCategory, sortOrder]);

  return (
    <div className="blogs-pane">
      {/* Manifesto */}
      <div className="blogs-manifesto">
        <span className="manifesto-label">About this space</span>
        <p className="manifesto-intro">
          Welcome to my blog space — a place for my thoughts on tech, data, and life.
        </p>
        <ul className="manifesto-bullets">
          <li>From automated data pipelines to insightful 3 AM thoughts</li>
          <li>No fluff · 100% human-written</li>
          <li>Just my journey, shared honestly</li>
        </ul>
      </div>

      {/* Controls */}
      <div className="blogs-controls">
        <div className="blogs-filters-row">
          <div className="blogs-categories">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-chip ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sort-dropdown-wrap" ref={sortRef}>
            <button
              className="sort-btn"
              onClick={() => setShowSort((p) => !p)}
              aria-label="Sort blogs"
            >
              {sortOrder === "newest" ? "Newest" : "Oldest"}
              <ChevronDown size={13} style={{ transform: showSort ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {showSort && (
              <div className="sort-menu">
                <button
                  className={`sort-option ${sortOrder === "newest" ? "active" : ""}`}
                  onClick={() => { setSortOrder("newest"); setShowSort(false); }}
                >
                  Newest First
                </button>
                <button
                  className={`sort-option ${sortOrder === "oldest" ? "active" : ""}`}
                  onClick={() => { setSortOrder("oldest"); setShowSort(false); }}
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="blogs-grid">
        {results.length > 0 ? (
          results.map((blog) => <BlogCard key={blog.slug} blog={blog} />)
        ) : (
          <div className="blogs-empty">
            <p>No blogs in this category yet.</p>
            <button className="blogs-empty-clear" onClick={() => setActiveCategory("All")}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPane;
