import { motion } from "framer-motion";
import { X, HelpCircle, User, Globe, Folder, Github, Compass, Palette, Gamepad2, Sparkles, FileText, BookOpen, Keyboard } from "lucide-react";
import "./HelpModal.css";

const HelpModal = ({ onClose }) => {
  return (
    <motion.div
      className="help-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="help-modal-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="help-modal-header">
          <HelpCircle className="help-icon" />
          <h2>How do I get started here?</h2>
          <button className="help-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="help-modal-content">
          <section className="help-section">
            <div className="help-section-title">
              <User size={16} />
              <h3>Who am I?</h3>
            </div>
            <p>
              Hi, I'm <strong>Prasad</strong>, a computer engineer who builds software, 
              works with data, and creates intelligent tools to solve real problems.
            </p>
          </section>

          <section className="help-section">
            <div className="help-section-title">
              <Globe size={16} />
              <h3>What is this site?</h3>
            </div>
            <p>
              This is my digital home, showcasing my work, skills, and interests all in one view. 
              Think of it as an interactive, visual resume that also reflects my personality.
            </p>
            <p className="help-subtext">
              <em>For everyone: recruiters, friends, tech folks, non-tech folks, or anyone curious about who I am.</em>
            </p>
          </section>

          <section className="help-section">
            <div className="help-section-title">
              <Compass size={16} />
              <h3>How to explore</h3>
            </div>
            <ul className="help-list">
              <li><strong>Tabs</strong>: Skills, Projects, Education, Hobbies, and Blogs</li>
              <li><strong>Social icons</strong>: my profiles like LinkedIn and GitHub</li>
              <li><strong>Resume</strong>: opens my traditional PDF resume</li>
            </ul>
          </section>

          <section className="help-section help-section-wide">
            <div className="help-section-title">
              <Keyboard size={16} />
              <h3>Keyboard shortcuts</h3>
            </div>
            <ul className="help-list">
              <li><strong>?</strong>: open this guide</li>
              <li><strong>1</strong> to <strong>9</strong>, <strong>0</strong>: switch tabs</li>
              <li><strong>Arrow keys</strong>: move through interactive items in the active tab</li>
              <li><strong>Home</strong> / <strong>End</strong>: jump to the first or last interactive item in the active tab</li>
              <li><strong>Enter</strong>: open the focused card action or link</li>
              <li><strong>Space</strong>: make the Minecraft skin jump when that viewer is focused</li>
              <li><strong>R</strong>: open resume</li>
              <li><strong>T</strong>: cycle themes, even while a modal is open</li>
              <li><strong>Esc</strong>: close the current modal or overlay</li>
            </ul>
            <p className="help-subtext">
              <em>Tab mapping: 1 Projects, 2 About, 3 Skills, 4 Experience, 5 Education, 6 Achievements, 7 Certs, 8 Volunteer, 9 Hobbies, 0 Blogs.</em>
            </p>
            <p className="help-subtext">
              <em>Inside interactive tabs, focus moves through cards first and then any nested links or actions inside them. About and Skills do not need in-tab shortcuts because they have no interactive targets.</em>
            </p>
            <p className="help-subtext">
              <em>Theme cycling still works while this guide, the resume, movies, or the Minecraft modal is open.</em>
            </p>
          </section>

          <section className="help-section help-section-wide">
            <div className="help-section-title">
              <BookOpen size={16} />
              <h3>Why blogs?</h3>
            </div>
            <p>
              The <strong>Blogs</strong> tab is where I write about what I am learning, building, and noticing along the way.
            </p>
            <p className="help-subtext">
              <em>Every blog post here is 100% human written.</em>
            </p>
            <p className="help-subtext">
              <em>Projects show the final result. Blogs show the thinking, lessons, and experiments behind the work.</em>
            </p>
          </section>

          <section className="help-section">
            <div className="help-section-title">
              <Folder size={16} />
              <h3>What are "projects"?</h3>
            </div>
            <p>
              Each card is a real project: apps, data analysis, or AI tools. 
              The title tells you what problem it solves.
            </p>
          </section>

          <section className="help-section">
            <div className="help-section-title">
              <Github size={16} />
              <h3>Project links</h3>
            </div>
            <ul className="help-list">
              <li><strong>GitHub</strong>: where I store and share code</li>
              <li><strong>Hugging Face</strong>: where I share AI models and demos</li>
              <li><strong>Kaggle</strong>: where I share data science work</li>
            </ul>
            <p className="help-subtext">
              <strong>GitHub</strong> shows the code. <strong>Live</strong> lets you try the project. Some AI or data work only has repo or demo links because the main output is the model or analysis.
            </p>
          </section>

          <section className="help-section">
            <div className="help-section-title">
              <Palette size={16} />
              <h3>Themes</h3>
            </div>
            <p>
              Cycle through <strong>4 themes</strong>: Dark, Light, Arcade Dark, and Arcade Light 
              using the toggle button. Arcade themes have a retro game look!
            </p>
          </section>

          <section className="help-section help-section-wide">
            <div className="help-section-title">
              <Sparkles size={16} />
              <h3>Interactive bits</h3>
            </div>
            <ul className="help-list">
              <li><strong>My photo</strong>: click to enlarge</li>
              <li><strong>prasad_gade.py</strong>: my intro in code style (for fun!)</li>
              <li><strong>Resume button</strong>: view or download my resume</li>
              <li><strong>See All Movies</strong>: my personal watchlist</li>
            </ul>
          </section>

          <section className="help-section help-section-wide">
            <div className="help-section-title">
              <FileText size={16} />
              <h3>Paper Playground</h3>
            </div>
            <p>
              Head to <strong>Hobbies</strong> tab and click <strong>Paper Playground</strong>. 
              It turns the page into draggable paper with real physics! Press <kbd>Esc</kbd> to return.
            </p>
          </section>

          {/* Easter egg - always last/bottom */}
          <section className="help-section help-section-easter">
            <div className="help-section-title">
              <Gamepad2 size={16} />
              <h3>For the curious...</h3>
            </div>
            <p className="easter-hint">
              Try some classic controller moves on your keyboard… 🎮✨
            </p>
            <p className="easter-ps">
              <em>PS: If you grew up with Konami or typed cheats in San Andreas, you might already know what to do.</em>
            </p>
          </section>
        </div>

        <div className="help-modal-footer">
          <p>Thanks for visiting! Feel free to explore.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HelpModal;
