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

**Routing:** File-based in `src/app/` using App Router. Root layout (`src/app/layout.tsx`) loads Geist fonts and imports `src/lib/styles/globals.scss` for global styles.

**Global styles** live in `src/lib/styles/`:

- `globals.scss` — body defaults and font-smoothing
- `_constants.scss` — SCSS variables (`$accent`, `$background`, `$foreground`, `$font-mono`, `$border-subtle`, `$text-dim`, `$text-mid`)
- `_mixins.scss` — reusable declaration blocks (`fill-parent`, `mono-label`, `game-button`)
- `index.scss` — barrel that forwards constants and mixins

### Components

**Components** live in `src/components/`. Each component requires three co-located files:

- `ComponentName/ComponentName.tsx`
- `ComponentName/ComponentName.module.scss`
- `ComponentName/ComponentName.md`

Shared UI primitives live in `src/components/common/` (Modal, Dropdown, Accordion, Spinner, etc.).

**Component co-location**: If a child component is only used by a single parent component, place its directory inside the parent's directory rather than as a sibling. Components used by multiple parents live at the nearest shared ancestor level.

**Component reuse**: When two components share the same markup structure and styles with only content differing, extract a shared component with props rather than duplicating. Thin wrapper components that only pass fixed props to a shared component do not need a `.module.scss` file.

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

**Icons** live in `src/lib/icons/` (flat, no subdirectories) and must be named with the `Icon` suffix (e.g., `ChevronIcon`).

### Classes

**Utility classes** live in `src/lib/utils/` (PascalCase TypeScript classes).

## Component Structure

Custom ESLint rules (in `.eslint-rules/`) enforce a strict section layout inside component functions:

```typescript
const MyComponent: React.FC = () => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // RENDERING
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

**What belongs in each section:**

- **CONSTANTS** — `UPPER_SNAKE_CASE` typed consts, non-Props type aliases, and enums. These are values that depend on props/state/refs and cannot be moved to module level.
- **HOOKS** — `useRef`, `usePathname`, `useReducer`, and `useRouter` only. No other hooks belong here.
- **STATE** — `useState` calls only.
- **HANDLERS** — `handle*`-named arrow functions and `useCallback` calls.
- **COMPUTATIONS** — Arrow functions and `useMemo` calls that derive values from state/props.
- **RENDERING** — `render*` arrow functions that return JSX, and typed camelCase consts that hold non-hook values used in the return. No hook calls allowed.
- **EFFECTS** — `useEffect` calls only.
- **MARKUP** — The `return` statement.

The exported component name must match the filename.

**`'use client'`** must appear at the top of any component that uses React hooks (`useState`, `useEffect`, etc.), browser APIs, or Next.js client hooks (`useRouter`, `usePathname`, etc.).

**Static module-level data** (arrays, constants, interface definitions that never change) belongs at module level outside the component function — not inside any section block.

**Props** use `type` (not `interface`), named `ComponentNameProps`. Optional props use `?`. The component signature destructures props inline:

```typescript
type MyComponentProps = {
    value: string;
    onChange?: (value: string) => void;
};

const MyComponent: React.FC<MyComponentProps> = ({ value, onChange }) => {
```

**Functions:** Always use arrow functions (`const fn = () => ...`). Never use the `function` keyword — this applies to component helpers, callbacks, and module-level functions.

**Event handlers** are prefixed with `handle`, named after event + subject: `handleClick`, `handleKeyDown`, `handleMenuSelect`. Callback parameters are always explicitly typed even when TypeScript can infer them.

**Conditional rendering:** Use ternary (`condition ? <A /> : null`). Do not use `&&` short-circuit — falsy values can render unexpectedly.

**Inline styles** are only used for values that are dynamic at runtime (e.g. user-defined colors). CSS custom properties set via inline style use the `as React.CSSProperties` cast:

```tsx
style={{ '--color': value } as React.CSSProperties}
```

**Avoid `setState` inside `useEffect` bodies.** If multiple state values transition together, use `useReducer` and dispatch from the effect instead. If a value must persist after a nullable prop clears (e.g. during a close animation), split into a non-nullable data prop + a separate `open: boolean` controlled by the parent.

### Component optimization

When optimizing components:

**Do:** remove unused variables/props/refs, simplify logic, fix missing effect dependencies, improve type safety, convert arrays to Maps/Records for O(1) lookups when frequently searched.

**Don't:** change `condition ? <X /> : null` to `condition && <X />`, add ARIA attributes unprompted, use array filter/join for className construction, remove redundant type annotations.

## Code Style

- **Formatting:** 4-space indentation, 80-char line width, single quotes, trailing commas (ES5)
- **Import order:** React → Next.js → third-party → components → lib → aliases → relative
- **SCSS constants:** `$accent`, `$background`, `$foreground` defined in `_constants.scss` — use these in component SCSS files, not CSS `var()` calls. CSS variables are only used where runtime values are unavoidable (e.g. `var(--font-geist-mono)` set by Next.js at runtime).
- **CSS Modules access:** Use `styles.className` for single-word class names, `styles['hyphenated-name']` for names containing hyphens

### SCSS mixins and constants

Before writing a raw CSS value in a component SCSS file, check whether it belongs in `_constants.scss` (a reusable token like a color or font) or `_mixins.scss` (a reusable block of declarations like `fill-parent`). When the same property+value combination appears in two or more places, extract it. Mixins live in `src/lib/styles/_mixins.scss` and are imported with `@use '@/styles/mixins' as *`.

**Color tokens** — use named tokens instead of raw `rgba()` calls:

- `$border-subtle` — `rgba($foreground, 0.15)`, for subtle container borders
- `$text-dim` — `rgba($foreground, 0.4)`, for inactive interactive text (e.g. buttons)
- `$text-mid` — `rgba($foreground, 0.5)`, for secondary/subtext

**Available mixins:**

- `fill-parent` — `position: absolute; inset: 0`
- `mono-label` — `font-family: $font-mono; font-weight: 700` — use for all bold monospace text (titles, nav items, button labels)
- `game-button` — bordered interactive button with hover accent transition — use for any standalone link or action button in the site UI

### SCSS nesting

Nest selectors in `.module.scss` files to mirror the JSX structure of the component. A class that wraps another class in the markup should wrap it in SCSS too:

```scss
// JSX: <div className="card"><span className="card__label" /></div>
.card {
    .card__label {
    }
}
```

Modifier classes (`&--variant`) nest inside their base class. **Base styles must appear before the modifier block** — at equal specificity, source order determines which rule wins, so the modifier must come last to override correctly:

```scss
.card {
    .card__label {
        opacity: 0;
    } // base first
    &--active {
        .card__label {
            opacity: 1;
        } // modifier after
    }
}
```

**Animations** must include a `@media (prefers-reduced-motion: reduce)` block that disables or stills the animation.

**CSS custom properties are scoped to the component that declares them.** Do not declare a variable in a parent component's SCSS intending for a child component to consume it — that creates invisible coupling. Use props instead.

**Hover styles** use `@media (hover: hover)` wrapping `&:hover` to avoid sticky hover states on touch devices:

```scss
@media (hover: hover) {
    .item:hover {
        color: $accent;
    }
}
```

**Transitions** are declared on the base element, not inside the `:hover` block.
