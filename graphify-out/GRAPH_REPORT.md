# Graph Report - .  (2026-04-19)

## Corpus Check
- Corpus is ~38,468 words - fits in a single context window. You may not need a graph.

## Summary
- 83 nodes · 84 edges · 17 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `ClothSimulation` - 10 edges
2. `Prasad Gade` - 10 edges
3. `Portfolio Site (prasadgade.dev)` - 7 edges
4. `UPI Analytics Platform` - 5 edges
5. `Comparative Analysis ML/DL Intrusion Detection` - 4 edges
6. `R3 Systems Data Analyst Internship` - 3 edges
7. `Lex Simulacra - AI Legal Courtroom Simulator` - 3 edges
8. `Python (Primary Language)` - 3 edges
9. `Data Science / ML Stack` - 3 edges
10. `getOptimalCols()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Favicon - Green Gradient P on Dark Background` --conceptually_related_to--> `Portfolio Site (prasadgade.dev)`  [INFERRED]
  public/favicon.svg → README.md
- `React Framework Logo` --conceptually_related_to--> `Portfolio Site (prasadgade.dev)`  [INFERRED]
  src/assets/react.svg → README.md
- `Portfolio Site (prasadgade.dev)` --references--> `Prasad Gade`  [EXTRACTED]
  README.md → public/Prasad_Gade_Resume.pdf
- `React Framework Logo` --conceptually_related_to--> `Web Development Stack (JS, Flask, Django)`  [INFERRED]
  src/assets/react.svg → public/Prasad_Gade_Resume.pdf
- `Profile Photo - Prasad Gade Headshot` --conceptually_related_to--> `Prasad Gade`  [INFERRED]
  public/profile.jpg → public/Prasad_Gade_Resume.pdf

## Hyperedges (group relationships)
- **Data Analytics & ML Project Portfolio** — resume_upi_analytics, resume_lex_simulacra, resume_intrusion_detection, resume_skills_data_science, resume_skills_python [INFERRED 0.85]
- **GitHub Pages Hosted Projects** — readme_portfolio_site, readme_audio_visualizer, readme_attendance_tracker, readme_habit_tracker, readme_github_pages_architecture [EXTRACTED 1.00]
- **Portfolio Visual Identity Assets** — favicon_branding, profile_photo, minecraft_skin, react_logo [INFERRED 0.75]

## Communities

### Community 0 - "Profile & Resume Assets"
Cohesion: 0.23
Nodes (13): Minecraft Character Skin - Purple/Black Theme, Profile Photo - Prasad Gade Headshot, BCG Data Science Simulation, Comparative Analysis ML/DL Intrusion Detection, Lex Simulacra - AI Legal Courtroom Simulator, Prasad Gade, R3 Systems Data Analyst Internship, Data Science / ML Stack (+5 more)

### Community 1 - "Code Display Components"
Cohesion: 0.24
Nodes (2): ContentTabs(), getOptimalCols()

### Community 2 - "Cloth Physics Engine"
Cohesion: 0.22
Nodes (1): ClothSimulation

### Community 3 - "Branding & Sub-Projects"
Cohesion: 0.2
Nodes (10): Favicon - Green Gradient P on Dark Background, React Framework Logo, Attendance Tracker Project, Audio Visualizer Project, GitHub Pages Custom Domain Architecture, Habit Tracker Project, Portfolio Site (prasadgade.dev), Full-Stack Donation Platform (Hackathon) (+2 more)

### Community 4 - "Tissue Paper UI"
Cohesion: 0.25
Nodes (2): TissueOverlay(), useCurrentTheme()

### Community 5 - "Hero UI Widgets"
Cohesion: 0.25
Nodes (0): 

### Community 6 - "App Entry & Capture"
Cohesion: 0.5
Nodes (0): 

### Community 7 - "Click Sparkle Effects"
Cohesion: 0.5
Nodes (0): 

### Community 8 - "Build Configuration"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Minecraft Skin Viewer"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Neural Background Animation"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Resume Viewer"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Movies Modal"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Linting Configuration"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "App Bootstrap"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "AWS Certification"
Cohesion: 1.0
Nodes (1): AWS Cloud Computing Certification

### Community 16 - "Java Certification"
Cohesion: 1.0
Nodes (1): Java Training - IIT Bombay

## Knowledge Gaps
- **12 isolated node(s):** `GitHub Pages Custom Domain Architecture`, `Audio Visualizer Project`, `Attendance Tracker Project`, `Habit Tracker Project`, `SPIT Mumbai - B.Tech Computer Engineering` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Build Configuration`** (2 nodes): `vite.config.js`, `manualChunks()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minecraft Skin Viewer`** (2 nodes): `MinecraftSkinViewer.jsx`, `MinecraftSkinViewer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Neural Background Animation`** (2 nodes): `NeuralBackground.jsx`, `NeuralBackground()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Resume Viewer`** (2 nodes): `ResumeViewer.jsx`, `ResumeViewer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Movies Modal`** (2 nodes): `MoviesModal.jsx`, `MoviesModal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Linting Configuration`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Bootstrap`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AWS Certification`** (1 nodes): `AWS Cloud Computing Certification`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Java Certification`** (1 nodes): `Java Training - IIT Bombay`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Prasad Gade` connect `Profile & Resume Assets` to `Branding & Sub-Projects`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `ClothSimulation` connect `Cloth Physics Engine` to `Tissue Paper UI`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Portfolio Site (prasadgade.dev)` connect `Branding & Sub-Projects` to `Profile & Resume Assets`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Prasad Gade` (e.g. with `Profile Photo - Prasad Gade Headshot` and `Minecraft Character Skin - Purple/Black Theme`) actually correct?**
  _`Prasad Gade` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Portfolio Site (prasadgade.dev)` (e.g. with `Favicon - Green Gradient P on Dark Background` and `React Framework Logo`) actually correct?**
  _`Portfolio Site (prasadgade.dev)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `GitHub Pages Custom Domain Architecture`, `Audio Visualizer Project`, `Attendance Tracker Project` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._