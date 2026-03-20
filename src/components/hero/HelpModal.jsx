import { motion } from "framer-motion";
import { X, HelpCircle, User, Globe, Folder, Github, Compass, Palette, Gamepad2, Sparkles, Link2, FileText } from "lucide-react";
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
          <h2>Welcome! Start Here</h2>
          <button className="help-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="help-modal-content">
          {/* Row 1 */}
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
              <Folder size={16} />
              <h3>What are "projects"?</h3>
            </div>
            <p>
              Each card is a real project: apps, data analysis, or AI tools. 
              The title tells you what problem it solves.
            </p>
          </section>

          {/* Row 2 */}
          <section className="help-section">
            <div className="help-section-title">
              <Github size={16} />
              <h3>Project links</h3>
            </div>
            <ul className="help-list">
              <li><strong>GitHub</strong>: where developers store and share code</li>
              <li><strong>HuggingFace</strong>: a platform for AI models and demos</li>
              <li><strong>Kaggle</strong>: a site for data science projects and competitions</li>
            </ul>
          </section>

          <section className="help-section">
            <div className="help-section-title">
              <Link2 size={16} />
              <h3>Why two links?</h3>
            </div>
            <p>
              Some projects have <strong>GitHub</strong> (source code) + <strong>Live</strong> (try it yourself). 
              ML projects often lack live links since they're about training models, not hosting apps.
            </p>
          </section>

          <section className="help-section">
            <div className="help-section-title">
              <Compass size={16} />
              <h3>How to explore</h3>
            </div>
            <ul className="help-list">
              <li><strong>Tabs</strong>: Skills, Projects, Education, Hobbies</li>
              <li><strong>Social icons</strong>: my profiles (LinkedIn, GitHub)</li>
              <li><strong>Resume</strong>: opens traditional PDF resume</li>
            </ul>
          </section>

          {/* Row 3 */}
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

          <section className="help-section">
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

          <section className="help-section">
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
