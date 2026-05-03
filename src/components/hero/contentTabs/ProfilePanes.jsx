import { motion } from "framer-motion";
import { Code, User } from "lucide-react";
import { handleCardTilt, resetCardTilt } from "../../../utils/cardTilt";
import { skillIcons, skills } from "../../../data/portfolioData";
import { getListItemKey, getRenderableListValues } from "../../../utils/listRendering";
import { tabPaneMotionProps } from "./motion";

export const AboutPane = ({ isSplit }) => (
  <motion.div
    key="about"
    className={`tab-pane about-pane ${isSplit ? "split" : ""}`}
    {...tabPaneMotionProps}
  >
    <div className="pane-header">
      <User size={16} />
      <span>About Me</span>
    </div>
    <div className="about-card" onMouseMove={handleCardTilt} onMouseLeave={resetCardTilt}>
      <p className="about-intro">
        I&apos;m a Computer Engineer with expertise in Data Analytics, Data Science, and Cross-Platform App
        Development. I build scalable, insight-driven solutions that merge data with clean engineering.
      </p>
      <p className="about-subtitle">I work across the entire data pipeline:</p>
      <ul className="about-points">
        <li>Data cleaning &amp; transformation with Python &amp; SQL</li>
        <li>Interactive dashboards with Power BI</li>
        <li>Machine learning models for prediction &amp; classification</li>
      </ul>
      <p className="about-detail">
        I bring a product mindset to every project, focusing on code quality, model performance, and user
        impact. I write clean, maintainable code and follow sound software design principles.
      </p>
      <p className="about-cta">
        Open to opportunities and collaborations in Data Analytics, Data Science, and App Development.
      </p>
    </div>
  </motion.div>
);

export const SkillsPane = ({ isSplit }) => (
  <motion.div
    key="skills"
    className={`tab-pane skills-pane ${isSplit ? "split" : ""}`}
    {...tabPaneMotionProps}
  >
    <div className="pane-header">
      <Code size={16} />
      <span>Core Skills</span>
    </div>
    <div className="skills-compact">
      {Object.entries(skills).map(([category, items]) => (
        <div key={category} className="skill-group" onMouseMove={handleCardTilt} onMouseLeave={resetCardTilt}>
          <span className="skill-category">{category}</span>
          <div className="skill-items">
            {getRenderableListValues(items).map((skill, index) => {
              const IconComp = skillIcons[skill];

              return (
                <span key={getListItemKey(`${category}-skill`, skill, index)} className="skill-chip">
                  {IconComp && <IconComp size={14} />}
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);
