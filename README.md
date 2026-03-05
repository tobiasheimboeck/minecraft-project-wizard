# Paper Plugin Template Generator

A wizard (similar to [start.spring.io](https://start.spring.io)) to generate Paper/Kotlin plugin projects – single or multi-module.

**GitHub:** [github.com/tobiasheimboeck/minecraft-project-wizard](https://github.com/tobiasheimboeck/minecraft-project-wizard)

## Quick Start

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000 and configure your project. Click "Generate" to download the ZIP.

## Structure

- **template/** – Template files with placeholders
  - `single/` – Single-module project
  - `multi/` – Multi-module project (API + Plugin)
- **web/** – Next.js app (shadcn)
  - Form to configure project
  - Client-side ZIP generation with JSZip

## Updating Templates

After editing files in `template/`, regenerate the embedded templates:

```bash
cd web
npm run generate-templates
```

Or run `npm run dev` / `npm run build` – they run the generator automatically.

## Build for Production

```bash
cd web
npm run build
npm run start
```

Deploy to Vercel, Node.js host, or any platform supporting Next.js.
