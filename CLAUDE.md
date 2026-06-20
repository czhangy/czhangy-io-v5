# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Note: If I repeat an instruction more than once, suggest adding it to this file.

> Build verification is not necessary for any change.

## Project Overview

> This description should be updated as the project is built out further.

czhangy-io is Charles Zhang's personal site, designed with a pseudo-video game aesthetic. Planned pages include a job history/experience page, a blog, and potentially other sections typical of a developer portfolio — all presented through a game-inspired UI theme.

## Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run lint       # Run ESLint
npm run format     # Run Prettier
```

Code generators (Python-based, run from project root):
```bash
npm run gen:component   # Scaffold a new React component
npm run gen:icon        # Scaffold a new icon component
npm run gen:class       # Scaffold a new utility class
```

Pre-commit hooks via Husky/lint-staged automatically run ESLint, Prettier, and Stylelint on staged files.

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript 5 (strict), SCSS modules, Axios

**Path aliases** (defined in `tsconfig.json`, respected by Turbopack for all module types including SCSS):
- `@/*` → `src/*`
- `@/styles/*` → `src/lib/styles/*`

**Routing:** File-based in `src/app/` using App Router. Root layout (`src/app/layout.tsx`) loads Geist fonts and imports `src/lib/styles/globals.scss` for global Tailwind styles.

**Global styles** live in `src/lib/styles/`:
- `globals.scss` — Tailwind import, CSS variables, and body defaults
- `_constants.scss` — SCSS variables (e.g. `$accent`)
- `index.scss` — barrel that forwards `_constants.scss`; component SCSS files import directly from `@/styles/constants`

### Components

**Components** live in `src/components/`. Each component requires three co-located files:
- `ComponentName/ComponentName.tsx`
- `ComponentName/ComponentName.module.scss`
- `ComponentName/ComponentName.md`

Shared UI primitives live in `src/components/common/` (Modal, Dropdown, Accordion, Spinner, etc.).

**Component co-location**: If a child component is only used by a single parent component, place its directory inside the parent's directory rather than as a sibling. Components used by multiple parents live at the nearest shared ancestor level.

Each component directory contains a `ComponentName.md` documentation file co-located with the `.tsx` and `.module.scss` files. Whenever a component is modified, its documentation file must be updated to reflect the changes.

Documentation files follow this structure (omit any section that does not apply):

```
# ComponentName

A brief description of what the component is — no implementation details, prop names, or behavior specifics.

## Props

| Prop       | Type   | Required | Default   | Description |
| ---------- | ------ | -------- | --------- | ----------- |
| `propName` | `type` | Yes/No   | `default` | Description |

## State

| State       | Type   | Initial value  | Description |
| ----------- | ------ | -------------- | ----------- |
| `stateName` | `type` | `initialValue` | Description |

## Effects

- **On [trigger]** — description of the effect's purpose

## Computations

- `variableName` — description of what it represents and why it is computed

## SCSS Variable Dependencies

- `--variable-name` — description of where it is expected to be set by a parent

Only list variables that this component consumes but does not define. Do not list variables that this component defines and passes down to its children.
```

**Icons** live in `src/components/icons/` and must be named with the `Icon` suffix (e.g., `ChevronIcon`).

### Classes

**Utility classes** live in `src/lib/utils/` (PascalCase TypeScript classes).

## Component Structure

Custom ESLint rules (in `.eslint-rules/`) enforce a strict section layout inside component functions:

```typescript
const MyComponent: React.FC = () => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return <div></div>;
};

export default MyComponent;
```

Only include sections that are actually used. MARKUP is always required. The divider lines must contain at least 20 dashes (the ESLint rule enforces this).

The exported component name must match the filename.

## Code Style

- **Formatting:** 4-space indentation, 80-char line width, single quotes, trailing commas (ES5)
- **Import order:** React → Next.js → third-party → components → lib → aliases → relative
- **SCSS constants:** `$accent`, `$background`, `$foreground` defined in `_constants.scss` — use these in component SCSS files, not CSS `var()` calls. CSS variables are only used where runtime values are unavoidable (e.g. `var(--font-geist-mono)` set by Next.js at runtime).
- **CSS Modules access:** Use `styles.className` for single-word class names, `styles['hyphenated-name']` for names containing hyphens

### SCSS nesting

Nest selectors in `.module.scss` files to mirror the JSX structure of the component. A class that wraps another class in the markup should wrap it in SCSS too:

```scss
// JSX: <div className="card"><span className="card__label" /></div>
.card {
    .card__label { }
}
```

Modifier classes (`&--variant`) nest inside their base class, and any children that change under that modifier nest inside the modifier:

```scss
.card {
    &--active {
        .card__label { color: $accent; }
    }
    .card__label { }
}
```
