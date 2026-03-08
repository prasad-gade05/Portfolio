notice when i reduce the zoom of page how at one point the entire visible content of the page becomes like a small card on a page.



i am thinking of adding a small game, or animation kind of doodle to this



like a tissue paper animation basically i will be able to pick up one corner of the page and then the entire card will go to this less zoomed in state and then behave like a tissue with which users can interact with real physics like fold it roll it etc.



how can this be done



Here is a comprehensive breakdown designed to get the best possible result from an AI coding agent, followed by the detailed technical solution.



Part 1: The "Mega-Prompt" for AI Agents



Copy and paste the text below into an AI coding tool (like Cursor, GitHub Copilot, or ChatGPT-4) to get it to build this for you.



System/Context:

I am building a React/Next.js portfolio website. The current view is a standard 2D DOM structure. I want to implement a high-end "Physics Interaction" mode inspired by WebGL award-winning sites.



The Goal:

I need a feature where the user can "peel" the website off the screen. When triggered (e.g., by dragging the top-right corner or pressing a button), the following sequence must happen:



Capture: The current visible DOM state is captured as an image/texture.



Transition: The real DOM is hidden, and a full-screen Three.js canvas fades in.



Simulation: The captured image is applied as a texture onto a 3D Plane Mesh. This mesh must behave like "Tissue Paper" or "Cloth."



Interaction: The user can click and drag any part of this mesh (via Raycasting). The physics should allow the paper to fold, crumple, roll, and flutter with air resistance.



Technical Specifications for the Agent:



Tech Stack: React, Three.js (@react-three/fiber is preferred if using React), html2canvas (for DOM capture).



Physics Engine: Use Verlet Integration (custom cloth physics) or cannon-es. Do not use rigid body physics; this must be soft-body/cloth physics.



Geometry: Use a PlaneGeometry with a high segment count (e.g., 30x30 or 50x50) to allow for smooth folding.



Constraints: Implement structural constraints (neighbors), shear constraints (diagonals), and bend constraints so the paper holds its shape but remains flexible.



Visuals: The paper should be double-sided (THREE.DoubleSide). When the user drags the mouse, the vertices near the cursor should follow the mouse position, pulling the rest of the cloth with them.



Part 2: Your Initial Prompt



"notice when i reduce the zoom of page how at one point the entire visible content of the page becomes like a small card on a page. i am thinking of adding a small game, or animation kind of doodle to this like a tissue paper animation basically i will be able to pick up one corner of the page and then the entire card will go to this less zoomed in state and then behave like a tissue with which users can interact with real physics like fold it roll it etc. how can this be done"



Part 3: The Detailed Solution (.md)



Here is a massive, deep-dive technical specification and implementation guide. This document outlines the architecture, the math behind the physics, and the code structure required to build the "Tissue Paper DOM" effect.



code

Markdown

download

content\_copy

expand\_less

\# Technical Specification: The "Tissue Paper" WebGL Transformation



\## 1. Architectural Overview



The illusion of turning a website into a physical object relies on a "Sleight of Hand" technique. The browser cannot bend HTML elements. Therefore, we must swap the HTML for a 3D model at the exact moment interaction begins.



\### The Pipeline

1\.  \*\*Trigger Event:\*\* User hovers/grabs the corner trigger zone.

2\.  \*\*Rasterization:\*\* `html2canvas` converts the DOM tree into a base64 PNG.

3\.  \*\*WebGL Injection:\*\* A Three.js scene initializes on top of the DOM.

4\.  \*\*Texture Mapping:\*\* The PNG is mapped to a highly subdivided 3D Plane.

5\.  \*\*DOM Hiding:\*\* The actual HTML is set to `opacity: 0`.

6\.  \*\*Physics Loop:\*\* A Verlet Integration loop calculates vertex positions every frame.



---



\## 2. The Physics Model: Verlet Integration



For tissue paper, standard rigid-body physics (like Box2D) fail because they treat objects as solid blocks. We need \*\*Soft Body Dynamics\*\*.



We will treat the page not as one object, but as a grid of \*\*Particles\*\* connected by \*\*Springs (Constraints)\*\*.



\### A. The Particle

Every vertex on our 3D plane (e.g., a 20x20 grid has 400 vertices) becomes a particle.

\*   \*\*State:\*\* It needs a `Current Position` and a `Previous Position`.

\*   \*\*Movement:\*\* We don't use velocity variables. Velocity is calculated implicitly: `Velocity = CurrentPosition - PreviousPosition`.



\### B. The Constraints (The Fabric)

To make the particles act like paper, we link them:

1\.  \*\*Structural Springs:\*\* Link a particle to its immediate Top, Bottom, Left, and Right neighbors. (Holds the paper together).

2\.  \*\*Shear Springs:\*\* Link diagonal neighbors. (Prevents the paper from skewing/distorting too much).

3\.  \*\*Bend Springs:\*\* Link particles 2 steps away (Skip one). (Determines how stiff the paper is—tissue vs. cardstock).



---



\## 3. Implementation Steps



\### Step 1: Dependencies

You will need to install these packages:

```bash

npm install three @react-three/fiber @react-three/drei html2canvas uuid

Step 2: The Capture Utility (capture.js)



This function handles the rasterization of your HTML.



code

JavaScript

download

content\_copy

expand\_less

import html2canvas from 'html2canvas';



export const captureDOM = async (elementId) => {

&nbsp; const element = document.getElementById(elementId);

&nbsp; if (!element) return null;



&nbsp; try {

&nbsp;   const canvas = await html2canvas(element, {

&nbsp;     useCORS: true, // Important if you have external images

&nbsp;     scale: 1,      // Keep scale 1:1 for crispness

&nbsp;     backgroundColor: '#1a1a1a' // Match your theme background

&nbsp;   });

&nbsp;   return canvas.toDataURL('image/png');

&nbsp; } catch (err) {

&nbsp;   console.error("Screen capture failed", err);

&nbsp;   return null;

&nbsp; }

};

Step 3: The Cloth Simulation Engine



This is the heart of the effect. We will create a custom hook or class to manage the physics.



The Math (Verlet Integration Logic)



This logic runs inside the Three.js useFrame loop (60 times per second).



code

JavaScript

download

content\_copy

expand\_less

const DAMPING = 0.96; // Air resistance (Lower = thick cloth, Higher = tissue)

const DRAG = 0.01;

const MASS = 0.1;



function updateParticles(positions, prevPositions, width, height) {

&nbsp;   for (let i = 0; i < positions.length; i++) {

&nbsp;       // 1. Calculate Velocity

&nbsp;       const vx = (positions\[i].x - prevPositions\[i].x) \* DAMPING;

&nbsp;       const vy = (positions\[i].y - prevPositions\[i].y) \* DAMPING;

&nbsp;       const vz = (positions\[i].z - prevPositions\[i].z) \* DAMPING;



&nbsp;       // 2. Save current state as previous

&nbsp;       prevPositions\[i].copy(positions\[i]);



&nbsp;       // 3. Apply Forces (Gravity + Velocity)

&nbsp;       // Tissue paper falls slowly, so gravity should be low

&nbsp;       const gravity = -0.05; 

&nbsp;       

&nbsp;       positions\[i].x += vx;

&nbsp;       positions\[i].y += vy + gravity;

&nbsp;       positions\[i].z += vz;

&nbsp;   }

}



function resolveConstraints(positions, constraints) {

&nbsp;   // We iterate multiple times per frame for stiffness

&nbsp;   const iterations = 3; 

&nbsp;   

&nbsp;   for(let k=0; k<iterations; k++) {

&nbsp;       constraints.forEach(constraint => {

&nbsp;           const p1 = positions\[constraint.indexA];

&nbsp;           const p2 = positions\[constraint.indexB];

&nbsp;           

&nbsp;           const dx = p2.x - p1.x;

&nbsp;           const dy = p2.y - p1.y;

&nbsp;           const dz = p2.z - p1.z;

&nbsp;           

&nbsp;           const dist = Math.sqrt(dx\*dx + dy\*dy + dz\*dz);

&nbsp;           const diff = (dist - constraint.restingDistance) / dist;

&nbsp;           

&nbsp;           const translateX = dx \* 0.5 \* diff;

&nbsp;           const translateY = dy \* 0.5 \* diff;

&nbsp;           const translateZ = dz \* 0.5 \* diff;

&nbsp;           

&nbsp;           // Move p1 towards p2

&nbsp;           p1.x += translateX;

&nbsp;           p1.y += translateY;

&nbsp;           p1.z += translateZ;

&nbsp;           

&nbsp;           // Move p2 towards p1

&nbsp;           p2.x -= translateX;

&nbsp;           p2.y -= translateY;

&nbsp;           p2.z -= translateZ;

&nbsp;       });

&nbsp;   }

}

Step 4: The React-Three-Fiber Component (TissuePaper.jsx)



This component renders the mesh and handles the mouse interaction.



code

Jsx

download

content\_copy

expand\_less

import React, { useRef, useMemo, useState, useEffect } from 'react';

import { useFrame, useThree } from '@react-three/fiber';

import \* as THREE from 'three';



const SEGMENTS\_X = 25; // How detailed the fold is

const SEGMENTS\_Y = 25;



export const TissuePaper = ({ textureUrl, active }) => {

&nbsp;   const meshRef = useRef();

&nbsp;   const { size, viewport } = useThree();

&nbsp;   

&nbsp;   // Load the texture from the screenshot

&nbsp;   const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), \[textureUrl]);



&nbsp;   // Initialize Geometry and Physics

&nbsp;   const \[particles, setParticles] = useState(\[]);

&nbsp;   const \[constraints, setConstraints] = useState(\[]);



&nbsp;   useEffect(() => {

&nbsp;       // Create grid of particles based on viewport size

&nbsp;       // Create constraints (horizontal, vertical links)

&nbsp;       // ... (Implementation of grid logic here)

&nbsp;   }, \[size]);



&nbsp;   // The Animation Loop

&nbsp;   useFrame((state) => {

&nbsp;       if(!meshRef.current) return;



&nbsp;       // 1. Update Physics (Verlet)

&nbsp;       // 2. Update Geometry Attributes

&nbsp;       const positionAttribute = meshRef.current.geometry.attributes.position;

&nbsp;       

&nbsp;       for(let i=0; i<particles.length; i++) {

&nbsp;           positionAttribute.setXYZ(i, particles\[i].x, particles\[i].y, particles\[i].z);

&nbsp;       }

&nbsp;       positionAttribute.needsUpdate = true;

&nbsp;       

&nbsp;       // 3. Interaction (Raycaster)

&nbsp;       // If mouse is down, find closest particle and force its position to mouse position

&nbsp;   });



&nbsp;   return (

&nbsp;       <mesh ref={meshRef}>

&nbsp;           <planeGeometry args={\[viewport.width, viewport.height, SEGMENTS\_X, SEGMENTS\_Y]} />

&nbsp;           <meshStandardMaterial 

&nbsp;               map={texture} 

&nbsp;               side={THREE.DoubleSide} 

&nbsp;               transparent={true}

&nbsp;               roughness={0.5} // Paper texture feel

&nbsp;           />

&nbsp;       </mesh>

&nbsp;   );

};

4\. Handling the Interaction (The "Grab")



To make it feel real, we need Raycasting.



Raycast on MouseMove: Check if the mouse intersects with the mesh.



Find Nearest Vertex: If intersecting, calculate which vertex index is closest to the intersection point.



Pinning: When the mouse is clicked, set the mass of that specific particle to Infinity (or simply override its position update loop).



Dragging: In the useFrame loop, if isDragging is true, manually set the position of the "pinned" particle to the 3D world coordinates of the mouse. The Constraint Solver will naturally pull the rest of the mesh along, creating the cloth effect.



5\. The "Zoom Out" Transition Logic



You mentioned the card becoming a "small card on a page."



State 0 (Normal): HTML is visible. WebGL is display: none.



State 1 (Trigger): User clicks "Zoom Out" / "Corner".



Action:



Capture DOM.



Hide DOM.



Show WebGL.



Set Mesh Position to \[0,0,0].



Animation: Use GSAP or React-Spring to animate the Mesh scale from 1 to 0.5 and position to center screen.



Result: The page looks like it detached from the screen and floated back.



6\. Optimization Tips for "Quality" Performance



Geometry Segments: Don't go over 30x30 segments unless necessary. 900 physics particles is cheap; 10,000 is expensive.



Shadows: Add a simple PlaneGeometry behind the tissue paper with a shadow material. As the paper folds, it should cast a dynamic shadow on the background, reinforcing the 3D depth.



Lighting: Use an AmbientLight (intensity 0.8) and a DirectionalLight (intensity 0.5) to highlight the crinkles in the paper as it folds.



7\. Summary of Files to Create



components/TissueOverlay.js - The main container.



components/PhysicsEngine.js - The math logic (Verlet integration).



utils/domCapture.js - The html2canvas helper.



App.js - State manager handling isTissueMode (true/false).



This approach converts your functional UI into a playful, interactive 3D toy, exactly matching your request.



code

Code

download

content\_copy

expand\_less

