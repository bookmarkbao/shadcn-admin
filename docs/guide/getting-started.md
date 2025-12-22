# Getting Started

Learn how to bootstrap the Shadcn Admin dashboard locally and understand the core tooling choices.

## Prerequisites

- **Node.js** 18.18+ (align with Vite requirements)
- **pnpm** 8+ (the lockfile targets pnpm)
- Optional: **Commitizen** (`pnpm dlx cz`) for Conventional Commits

Clone the repo and install dependencies:

```bash
git clone https://github.com/satnaing/shadcn-admin.git
cd shadcn-admin
pnpm install
```

Copy environment defaults when working on Clerk routes:

```bash
cp .env.example .env
# set VITE_CLERK_PUBLISHABLE_KEY=your_key
```

## Running the App

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Vite with hot module reload on `http://localhost:5173`. |
| `pnpm build` | Type-check via `tsc -b` then build the production bundle with Vite. |
| `pnpm preview` | Serve the production bundle for final QA. |
| `pnpm lint` | Run ESLint with the configured React, Query, and Refresh rules. |
| `pnpm format:check` | Verify Prettier formatting (Tailwind + import sort plugins). |
| `pnpm format` | Apply formatting fixes. |
| `pnpm knip` | Detect unused files, exports, or dependencies. |

## Feature Modules

- **Routes (`src/routes`)**: file-based TanStack Router entries wired to feature components.
- **Features (`src/features/*`)**: each domain (tasks, users, settings) owns view models, providers, and UI.
- **Shared UI (`src/components`)**: Shadcn-derived widgets (`ui/`) and layout primitives (`layout/`).
- **Context (`src/context`)**: theme, direction, layout, and search providers shared across layouts.
- **Stores (`src/stores`)**: Zustand stores such as `auth-store` for tokens/user data.

## Updating Dependencies

Use pnpm and keep lockfile changes committed:

```bash
pnpm add <pkg>
pnpm add -D <pkg>
```

Before opening a PR, run `pnpm lint && pnpm build` and include screenshots for UI changes (light/dark + RTL).
