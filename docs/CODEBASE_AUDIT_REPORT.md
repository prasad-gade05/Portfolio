# Codebase Fixes and Optimizations

This file lists the fixes, refactors, and optimizations that are already implemented in this repository.

It does **not** list old recommendations that were never applied.

## Implemented changes

### 1. Frontend structure

- `src\components\Hero.css` was split into focused files under `src\components\hero\styles\`.
- `src\components\hero\ContentTabs.jsx` was split into smaller pane and hook files under `src\components\hero\contentTabs\`.
- `src\data\portfolioData.js` now acts as a stable re-export layer over:
  - `portfolioSocial.js`
  - `portfolioSkills.js`
  - `portfolioCareer.js`
  - `portfolioProjects.js`
  - `portfolioPersonal.js`

### 2. Runtime performance

- `src\components\NeuralBackground.jsx` was optimized to avoid brute-force pair checks on every frame.
- `src\components\neuralBackgroundUtils.js` now supports the background logic with capped particle work and spatial bucketing.
- `src\utils\domCapture.js` now caches the lazy `html2canvas` import instead of re-requesting it.

### 3. Build and delivery

- `npm run build` now regenerates blogs first through the `prebuild` hook.
- `npm run deploy` uses that same build flow, so new blogs are included automatically.
- `vite.config.js` now splits heavy dependencies into dedicated chunks:
  - `icons-vendor`
  - `animation-vendor`
  - `pdf-vendor`
  - `skinview-vendor`
  - `three-vendor`
- The React Three / Three.js stack is isolated so it is only loaded with the tissue playground path.
- `eslint.config.js` now:
  - lints `scripts\**\*.{js,mjs}`
  - ignores generated `coverage\`

### 4. Dependency cleanup

Unused packages removed from `package.json`:

- `@react-three/drei`
- `@splinetool/react-spline`
- `fuse.js`
- `react-countup`
- `react-intersection-observer`

### 5. Blog system improvements

- `scripts\generate-blogs.mjs` validates blog folders strictly.
- Blog sync rebuilds blog pages, metadata, RSS, sitemap entries, and LLM text sections from the same source folders.
- Generated blog pages keep the portfolio theme context and link back to `/?tab=blogs`.

### 6. UI correctness fixes

- The hero shell was restored to fixed viewport height so tab changes no longer change the left-column sizing.
- Content-driven tag and chip lists now sanitize blank values and use stable keys, which prevents duplicate React key warnings caused by empty or repeated raw values.

### 7. Testing setup

- Vitest and Testing Library are configured for this repo.
- Production code in `src\` now has a broad test base across app shell, hero components, utilities, data modules, and tissue logic.
- Coverage reporting is available through `npm run test:coverage`.

## Available commands

| Command | What it does | When to use it |
| --- | --- | --- |
| `npm run dev` | Starts the Vite dev server. | Normal local development. |
| `npm run blogs:sync` | Rebuilds blog pages, `blogs.json`, RSS, sitemap blog entries, and blog sections in `llms.txt` files. | When working on blog content or the blog generator. |
| `npm run lint` | Runs ESLint on app code and script files. | Before shipping changes. |
| `npm run test` | Runs the Vitest suite once. | To check that behavior still works. |
| `npm run test:coverage` | Runs the Vitest suite with V8 coverage reporting. | To inspect coverage and find uncovered code. |
| `npm run build` | Runs `prebuild`, which runs `npm run blogs:sync`, then creates the production build with Vite. | Before deploy and for production validation. |
| `npm run preview` | Serves the built `dist\` output locally. | To inspect the production build locally. |
| `npm run deploy` | Runs `npm run build` and publishes `dist\` with `gh-pages`. | To publish the site. |

## What the validation commands mean

- **Lint** checks code quality and catches unused variables and rule violations.
- **Test** checks runtime behavior through the automated test suite.
- **Coverage** shows how much of the production code is exercised by tests.
- **Build** checks the production bundling path and confirms the site can be generated for deploy.

## Current workflow summary

### For normal app changes

```bash
npm run lint
npm run test
npm run build
```

### For blog changes only

```bash
npm run deploy
```

That single deploy command now regenerates blogs, builds the site, and publishes the result.

## Current validation status

- `npm run lint` passes
- `npm run test` passes with **19** test files and **44** tests
- `npm run test:coverage` passes with **85.58%** statements and **87.48%** lines overall
- `npm run build` passes
