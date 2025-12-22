# Developing Docs

This project stores developer documentation alongside the source tree and publishes it with [VitePress](https://vitepress.dev/).

## Directory Layout

```
docs/
  .vitepress/
    config.ts    # global site configuration
  guide/
    getting-started.md
    developing-docs.md
  reference/
    architecture.md
    scripts.md
  index.md       # landing page
```

Add new pages near related content (e.g., `/guide` for tutorials, `/reference` for API/architecture notes) and update the sidebar in `docs/.vitepress/config.ts` if you introduce new routes.

## Local Development

| Command | Description |
| --- | --- |
| `pnpm docs:dev` | Launch VitePress dev server with hot reload (defaults to `http://localhost:5173`). |
| `pnpm docs:build` | Generate the static site into `.vitepress/dist`. |
| `pnpm docs:serve` | Preview the built docs locally. |

VitePress shares the same dev port as the app. If you need both running simultaneously, pass `--port 4173` or another free port: `pnpm docs:dev --port 4173`.

## Content Guidelines

- Keep pages concise (prefer sub‑500 words) and specific to this repository.
- Include concrete examples—file paths, commands, or config snippets—so contributors can act quickly.
- Document rationales when deviating from upstream Shadcn components or CLI defaults.
- Reference environment needs (e.g., `VITE_CLERK_PUBLISHABLE_KEY`) near affected features.

## Deployment

`pnpm docs:build` outputs static assets under `docs/.vitepress/dist`. Deploy them using any static host (Netlify, Vercel, GitHub Pages). To integrate with CI, add a job that installs dependencies, runs the docs build, and publishes the `dist` folder.
