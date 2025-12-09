import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Award, BarChart2 } from 'lucide-react'
import './Projects.css'

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [filter, setFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'ml', label: 'Machine Learning' },
    { id: 'web', label: 'Web Apps' },
    { id: 'ai', label: 'AI/LLM' },
  ]

  const projects = [
    {
      title: 'Lex Simulacra',
      subtitle: 'AI-Powered Legal Courtroom Simulator',
      category: 'ai',
      featured: false,
      description: 'AI-powered legal courtroom simulator using multi-agent orchestration with LangGraph. Simulates realistic trial proceedings with defense lawyers, prosecutors, and judges using advanced RAG for accurate legal reasoning.',
      stats: [
        { value: '99%', label: 'Citation Accuracy' },
        { value: '8', label: 'AI Agents' },
      ],
      tech: ['LangChain', 'LangGraph', 'FastAPI', 'ChromaDB', 'Streamlit', 'Ollama'],
      date: 'Nov 2025',
      gradient: 'linear-gradient(135deg, #58a6ff 0%, #3fb950 100%)',
      github: 'https://github.com/prasad-gade05/Law_Courtroom_Simulator',
      demo: null,
    },
    {
      title: 'Intrusion Detection System',
      subtitle: 'TII-SSRC-23 Dataset Analysis',
      category: 'ml',
      featured: false,
      description: 'Comprehensive ML study comparing 6 ML/DL models on 8.6M network traffic samples. Decision Tree achieved 100% recall with complete interpretability, outperforming complex deep learning architectures.',
      stats: [
        { value: '100%', label: 'Recall' },
        { value: '8.6M', label: 'Samples' },
        { value: '12.8×', label: 'Speed Advantage' },
      ],
      tech: ['XGBoost', 'PyTorch', 'TensorFlow', 'SHAP', 'Scikit-learn'],
      date: 'Oct 2025',
      gradient: 'linear-gradient(135deg, #3fb950 0%, #58a6ff 100%)',
      github: 'https://github.com/prasad-gade05/IDS_on_TII-SSRC-23',
      demo: null,
    },
    {
      title: 'Celestial Object Classifier',
      subtitle: 'SDSS Dataset Analysis',
      category: 'ml',
      featured: false,
      description: 'Classification of celestial objects from Sloan Digital Sky Survey (SDSS) dataset. Trained KNN, Decision Tree, Neural Network, and Random Forest models with saved models for inference.',
      stats: [
        { value: '4', label: 'ML Models' },
        { value: 'SDSS', label: 'Dataset' },
      ],
      tech: ['Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter'],
      date: 'Nov 2024',
      gradient: 'linear-gradient(135deg, #58a6ff 0%, #79c0ff 100%)',
      github: 'https://github.com/prasad-gade05/Celestial-Object-Classifier-using-Solana-Digital-Sky-Survey-Dataset',
      demo: null,
    },
    {
      title: 'KindHearts',
      subtitle: 'Multi-Role Donation Management Platform',
      category: 'web',
      featured: true,
      badge: 'Hackathon Winner',
      description: 'Won 1st place among 80+ teams. Comprehensive donation platform connecting donors, institutes, and shopkeepers. Features real-time tracking, crypto payments via MetaMask, and Kanban-style order management.',
      stats: [
        { value: '60%', label: 'Faster Processing' },
        { value: '45%', label: 'More Engagement' },
      ],
      tech: ['React', 'TypeScript', 'MongoDB', 'Node.js', 'MetaMask', 'Redux'],
      date: 'Feb 2025',
      gradient: 'linear-gradient(135deg, #d29922 0%, #f59e0b 100%)',
      github: 'https://github.com/prasad-gade05/KindHearts-Multi-Role-Donation-Management-Platform',
      demo: null,
    },
    {
      title: 'Audio Visualizer',
      subtitle: 'Real-Time Music Visualization',
      category: 'web',
      featured: false,
      description: 'Web-based audio visualization tool with file upload and system audio capture. Features multiple visualization modes including a 3D audio globe with modern shadcn/ui components.',
      stats: [
        { value: '3D', label: 'Globe Viz' },
        { value: 'Multi', label: 'Modes' },
      ],
      tech: ['React', 'TypeScript', 'Vite', 'Web Audio API', 'Canvas', 'shadcn/ui'],
      date: 'Aug 2025',
      gradient: 'linear-gradient(135deg, #f85149 0%, #ff7b72 100%)',
      github: 'https://github.com/prasad-gade05/audio_visualizer_app',
      demo: 'https://prasad-gade05.github.io/audio_visualizer_app/',
    },
    {
      title: 'Smart Schedule & Attendance',
      subtitle: 'Intelligent Attendance Management',
      category: 'web',
      featured: false,
      description: 'Modern application for managing academic schedules and attendance. Features attendance simulation to calculate required classes, historical data import, dynamic scheduling with extra classes and special dates.',
      stats: [
        { value: '75%', label: 'Goal Tracking' },
        { value: 'Offline', label: 'Ready' },
      ],
      tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Dexie.js', 'IndexedDB'],
      date: 'Oct 2025',
      gradient: 'linear-gradient(135deg, #58a6ff 0%, #79c0ff 100%)',
      github: 'https://github.com/prasad-gade05/attendance',
      demo: 'https://prasad-gade05.github.io/attendance/',
    },
    {
      title: 'Habit Tracker',
      subtitle: 'Privacy-First Habit Tracking',
      category: 'web',
      featured: false,
      description: 'Privacy-first, client-side habit tracking application. Features GitHub-style contribution charts, detailed analytics, streak tracking, and data export. All data stored locally in IndexedDB.',
      stats: [
        { value: 'Private', label: 'Local Storage' },
        { value: 'Streaks', label: 'Tracking' },
      ],
      tech: ['React 19', 'TypeScript', 'Vite', 'Zustand', 'Dexie.js', 'Recharts'],
      date: 'Sep 2025',
      gradient: 'linear-gradient(135deg, #3fb950 0%, #7ee787 100%)',
      github: 'https://github.com/prasad-gade05/Habit-Tracker',
      demo: 'https://prasad-gade05.github.io/Habit-Tracker/',
    },
    {
      title: 'NutriSnap',
      subtitle: 'AI-Powered Meal Journal',
      category: 'ai',
      featured: false,
      description: 'Intelligent nutrition tracking app using Google Gemini API for food image analysis. Provides detailed nutritional breakdown from photos or text descriptions without manual database lookups.',
      stats: [
        { value: '📷', label: 'Image Analysis' },
        { value: 'Private', label: 'Local Data' },
      ],
      tech: ['React', 'Vite', 'Gemini API', 'Local Storage', 'CSS'],
      date: 'Aug 2025',
      gradient: 'linear-gradient(135deg, #3fb950 0%, #7ee787 100%)',
      github: 'https://github.com/prasad-gade05/nutrition_tracker',
      demo: 'https://prasadsnutritiontracker.netlify.app/',
    },
  ]

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="projects section">
      <div className="section-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <span className="section-tag">
            <span>&lt;</span> projects <span>/&gt;</span>
          </span>
          <h2 className="section-title">Featured Projects</h2>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="project-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filters.map((f) => (
            <button
              key={f.id}
              className={`filter-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div className="projects-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                className={`project-card ${project.featured ? 'featured' : ''}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {project.badge && (
                  <div className="project-badge">
                    <Award size={14} />
                    {project.badge}
                  </div>
                )}
                
                <div className="project-visual" style={{ background: project.gradient }}>
                  <div className="project-visual-content">
                    <BarChart2 size={32} />
                  </div>
                </div>
                
                <div className="project-content">
                  <div className="project-header">
                    <span className="project-category">{project.category.toUpperCase()}</span>
                    <span className="project-date">{project.date}</span>
                  </div>
                  
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-stats">
                    {project.stats.map((stat, i) => (
                      <div key={i} className="stat-item">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="project-tech">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link github-link"
                      >
                        <Github size={14} />
                        View Code
                      </a>
                    )}
                    {project.demo && (
                      <a 
                        href={project.demo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link demo-link"
                      >
                        <ExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* GitHub Link */}
        <motion.div 
          className="projects-cta"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <a 
            href="https://github.com/prasad-gade05" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <Github size={18} />
            View All Projects on GitHub
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
