# Scripts & Workflows

Use pnpm for every task. The scripts below cover the application build, quality checks, and the documentation site.

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Run the Vite dev server for the main app. |
| `pnpm build` | Type-check with `tsc -b` and create the production build via Vite. |
| `pnpm preview` | Preview the production build locally. |
| `pnpm lint` | Execute ESLint with React, React Query, and Refresh rules. |
| `pnpm format:check` | Verify Prettier formatting (Tailwind + import sort). |
| `pnpm format` | Apply Prettier fixes. |
| `pnpm knip` | Detect unused files, exports, or dependencies. |
| `pnpm docs:dev` | Launch the VitePress docs dev server (defaults to `http://localhost:5173`). |
| `pnpm docs:build` | Generate static documentation under `docs/.vitepress/dist`. |
| `pnpm docs:serve` | Preview the built docs locally (great for pre-deploy QA). |

## Tips

- Pass `--open` or `--port <number>` to any dev script when running multiple services simultaneously.
- Automate lint + build + docs steps in CI to catch regressions before merging.
- When adding new scripts, document them here and include a short explanation in the relevant Guide page.
