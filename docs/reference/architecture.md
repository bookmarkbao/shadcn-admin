# Architecture

This page explains how Shadcn Admin achieves modularity through TanStack Router, feature-driven folders, and context providers.

## Routing Layers

- **Root (`src/routes/__root.tsx`)** wires React Query + router devtools, Toaster, and global error boundaries.
- **Authenticated shell (`src/routes/_authenticated`)** renders `AuthenticatedLayout`, which applies sidebar state, layout/search providers, and shared chrome.
- **Auth routes (`src/routes/(auth)/*`)** expose public flows such as sign-in, sign-up, and OTP; each file merely connects the route to its feature component and input schema.
- **Clerk integration (`src/routes/clerk`)** is isolated so the provider can be removed entirely if you do not need Clerk.

## Feature Modules

Each directory under `src/features` bundles data, providers, and UI for a specific domain (dashboard, tasks, users, settings, etc.). Example: the Tasks module composes `TasksProvider`, table components, and dialogs to keep mutations and modals encapsulated. Shared assets stay in `src/assets`, while reusable components—including modified Shadcn parts—live in `src/components/ui`.

## State & Context

- **Zustand (`src/stores`)** manages auth tokens and user metadata, persisting them via cookie helpers.
- **Context providers (`src/context`)** configure theme, font, direction, layout, and search at the root, ensuring cross-feature concerns are pluggable.
- **React Query (`src/main.tsx`)** centralizes API retries and auth failure handling; 401 responses reset the auth store and redirect to sign-in.

## Styling & Theming

TailwindCSS powers utility classes, with custom tokens defined in `src/styles/theme.css`. Prettier (with Tailwind and import-sort plugins) enforces class ordering, keeping components readable.

## Extending the Architecture

1. Create a folder under `src/features/<domain>` for new domains.
2. Add a route file under `src/routes` that points to the feature’s entry component.
3. Place shared UI improvements inside `src/components` rather than cross-importing between features.
4. Update docs in `/docs/reference/architecture.md` when you introduce new layers or providers.
