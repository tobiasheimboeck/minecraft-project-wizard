# Paper Plugin Template Generator

A wizard (similar to [start.spring.io](https://start.spring.io)) to generate Paper/Kotlin plugin projects – single or multi-module.

**GitHub:** [github.com/tobiasheimboeck/minecraft-project-wizard](https://github.com/tobiasheimboeck/minecraft-project-wizard)

## Quick Start

```bash
cd wizard
npm install
npm run dev
```

Open http://localhost:5173 and configure your project. Click "Generate ZIP" to download.

## Structure

- **template/** – Template files with placeholders
  - `single/` – Single-module project
  - `multi/` – Multi-module project (API + Plugin)
- **wizard/** – Vite-based web app
  - Form to configure project
  - Client-side ZIP generation with JSZip

## Updating Templates

After editing files in `template/`, regenerate the embedded templates:

```bash
cd wizard
npm run generate-templates
```

Or run `npm run dev` / `npm run build` – they run the generator automatically.

## Build for Production

```bash
cd wizard
npm run build
```

Output is in `wizard/dist/`. Deploy to any static host (e.g. GitHub Pages).
