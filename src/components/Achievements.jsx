import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Trophy, FileText, Award, ExternalLink } from 'lucide-react'
import './Achievements.css'

const Achievements = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const achievements = [
    {
      icon: Trophy,
      title: '1st Place - Tech Horizon Hackathon',
      description: 'Secured 1st place among 80+ national teams in a 36-hour hackathon',
      date: 'March 2025',
      color: '#d29922',
      gradient: 'linear-gradient(135deg, #d29922 0%, #f59e0b 100%)',
      certificateLink: 'https://drive.google.com/file/d/19EXpm1wVqM35qLiHvbcFzmwwwEiFSr_4/view?usp=drive_link',
    },
    {
      icon: FileText,
      title: 'Published Researcher',
      description: 'Published ML research paper in IJIES Journal on healthcare predictions',
      date: 'April 2024',
      color: '#3fb950',
      gradient: 'linear-gradient(135deg, #3fb950 0%, #58a6ff 100%)',
      certificateLink: 'https://ijies.net/finial-docs/finial-pdf/220424918.pdf',
    },
  ]

  const certifications = [
    { name: 'Data Science Job Simulation', org: 'BCG (Forage)', date: 'Jan 2025', link: 'https://drive.google.com/file/d/1gpK6qqplU6bqYPZBVsR0iIuJwvS9_HoX/view?usp=drive_link' },
    { name: 'Developer & Technology Simulation', org: 'Accenture UK (Forage)', date: 'Jan 2025', link: 'https://drive.google.com/file/d/1pOHKmObTLFRdyLv6xlPkTdhbIK2NTT4Y/view?usp=drive_link' },
    { name: 'Cloud Computing on AWS', org: 'Udemy', date: 'Jul 2024', link: 'https://drive.google.com/file/d/1ax32PpCzf4mP2hFectfl5lubdnKU5FV6/view?usp=drive_link' },
    { name: 'The World of Computer Networking', org: 'Udemy', date: 'Jun 2024', link: 'https://drive.google.com/file/d/1yzSMpeOIgKBUel5RJ9TANkUIbMajd_FE/view?usp=drive_link' },
    { name: 'Java Training', org: 'IIT Bombay', date: 'Mar 2024', link: 'https://drive.google.com/file/d/1i7k6dmtUvIENZHQk_xJkmoKe2Lyhjnpv/view?usp=drive_link' },
    { name: 'Arduino Course', org: 'Robo-Tech-X', date: 'Aug 2023', link: 'https://drive.google.com/file/d/1DsDhr7ArZC82L7uLxHtBjRuT8j6TQRR5/view?usp=sharing' },
  ]

  return (
    <section id="achievements" className="achievements section">
      <div className="section-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <span className="section-tag">
            <span>&lt;</span> achievements <span>/&gt;</span>
          </span>
          <h2 className="section-title">Achievements & Certifications</h2>
        </motion.div>

        {/* Achievements */}
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <motion.div 
              key={index}
              className="achievement-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              style={{ '--accent-color': achievement.color }}
            >
              <div 
                className="achievement-icon"
                style={{ background: achievement.gradient }}
              >
                <achievement.icon size={28} />
              </div>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <span className="achievement-date">{achievement.date}</span>
              {achievement.certificateLink && (
                <a 
                  href={achievement.certificateLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="achievement-cert-btn"
                >
                  <ExternalLink size={14} />
                  View Certificate
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div 
          className="certifications"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="certifications-title">
            <Award size={20} />
            Certifications
          </h3>
          <div className="cert-grid">
            {certifications.map((cert, index) => (
              <motion.div 
                key={index}
                className="cert-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <div className="cert-logo">
                  {cert.org.split(' ')[0].substring(0, 3).toUpperCase()}
                </div>
                <div className="cert-content">
                  <h4>{cert.name}</h4>
                  <p>{cert.org}</p>
                  <span className="cert-date">{cert.date}</span>
                </div>
                {cert.link && (
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cert-view-btn"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Achievements
