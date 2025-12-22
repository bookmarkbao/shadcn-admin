# Repository Guidelines

## Project Structure & Module Organization
Shadcn Admin runs on Vite with TanStack Router and all source lives in `src/`. `src/routes` drives navigation (the generated `routeTree.gen.ts` should stay untouched) while `src/features/*` contains page-level logic for dashboard, tasks, users, and more. Shared UI belongs in `src/components`; keep Shadcn derivatives inside `src/components/ui` and layouts in `src/components/layout`. Hooks, stores, helpers, and assets live in `src/hooks`, `src/stores`, `src/lib`, and `src/assets`, with theming in `src/styles`. Static files go in `public/`, Vite builds into `dist/`, and Clerk-specific screens remain isolated in `src/routes/clerk`—copy `.env.example` to `.env` and set `VITE_CLERK_PUBLISHABLE_KEY` when working there.

## Build, Test, and Development Commands
Use pnpm for every task. `pnpm dev` starts Vite with HMR on `http://localhost:5173`; `pnpm build` runs `tsc -b` then `vite build`; `pnpm preview` serves the production bundle. Run `pnpm lint` before committing, and `pnpm format:check` or `pnpm format` to enforce Prettier with the Tailwind and import-sort plugins. `pnpm knip` reports unused files and dependencies—run it when pruning features or updating Shadcn modules.

## Coding Style & Naming Conventions
The stack is TypeScript, React 19, and Tailwind. Prefer functional components, PascalCase component files, camelCase hooks/utilities, and kebab-case route folders (`src/routes/(errors)`). Keep custom Shadcn tweaks confined to `src/components/ui` and document notable deviations to simplify future upstream syncs. Tailwind classes are auto-sorted by Prettier; lean on `class-variance-authority` instead of ad-hoc string concatenation. Respect the `@` alias (root `src`) for imports and let Prettier enforce the standard two-space indentation.

## Testing Guidelines
No automated suite ships today, so new work should add Vitest + Testing Library specs beside the component (`button-card.test.tsx`) or under `src/__tests__`. Favor behavior-driven coverage—TanStack Router navigation, React Query mutations, and dark/light or RTL edge cases—over snapshots. Document any manual QA (including Clerk flows) and spell out the exact `vitest` command reviewers should run until a dedicated `pnpm test` script lands.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat(auth): add magic-link sign-in`) as seen in the history; `cz.yaml` enables Commitizen via `pnpm dlx cz`. PRs must explain motivation, summarize key changes, reference issues using `Fixes #123`, and attach before/after screenshots or clips for UI updates (cover light/dark and RTL). Verify `pnpm lint`, `pnpm build`, and any new tests succeed locally, and call out required env/config changes (e.g., Clerk keys) before requesting review.
