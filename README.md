# EcomExperts Take-Home — Security System Configurator

A two-column, data-driven security system bundle builder built with React + Vite (frontend) and Express + SQLite (backend).

---

## Quick Start

### Prerequisites

- **Node.js ≥ 18**
- Two terminal windows

---

### 1 — Backend

```bash
cd backend
npm install

# Seed the database (creates test.db and populates products/steps/variants)
npm run seed

# Start the dev server (http://localhost:5000)
npm run dev
```

> The backend serves product data at `GET /api/products` and static assets (images, icons) from `http://localhost:5000`.

---

### 2 — Frontend

```bash
cd frontend
npm install

# Start Vite dev server (http://localhost:5173)
npm run dev
```

Open **http://localhost:5173** in your browser.

---

### Production Build

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm run preview
```

---

## Architecture & Decisions

### Data layer — Express + SQLite (bonus backend)
Rather than a static local JSON file, a small Express server with a `better-sqlite3` database serves the product catalogue. This is strictly additive — the spec called only for a local JSON file, but the backend was a listed bonus. The schema separates `steps → products → variants` with foreign keys, making it easy to add or reorder products without touching code. A `seed.ts` script re-creates all rows idempotently (DELETE + INSERT) so a fresh clone is always one `npm run seed` away.

### State management — Zustand
All UI state (active accordion step, per-variant quantities, selected-variant display) lives in a single Zustand store. Selectors like `getProductQuantity`, `getSelectedCount`, and `getCartForReview` are computed on demand rather than duplicated in component state, keeping the review panel in automatic sync with the builder.

### Variant quantity model
Each `(productId, variantId)` pair is tracked independently in the cart. Switching the displayed variant on a card changes only which variant the stepper reads/writes — it never zeroes out quantities for other variants. The review panel iterates all cart entries regardless of which variant is currently "focused" on the card, so both Red × 2 and Blue × 1 can appear simultaneously.

### Persistence
The store hydrates itself from `localStorage` at module initialisation (before the first render) using `loadSavedCartFromStorage()`, so there is no flash of empty state. A `saveForLater()` action writes the full cart snapshot (quantities, selected variants, active step) to the `cart` key. Clicking **Save my system for later** calls that action and shows a brief confirmation message.

### Pre-populated state
On a clean session, `sense-hub` (the required hub) is pre-added to step 3 at quantity 1, matching the design's pre-populated review panel. The spec mentions sensors, an accessory, and a plan pre-loaded; currently only the hub is seeded into the initial cart — see **What I didn't finish** below.

---

## What I Didn't Finish / Known Gaps

| Area | Gap |
|---|---|
| **Pre-populated cart** | The spec shows sensors, an accessory (MicroSD), and a plan already in the review panel on load. Only `sense-hub` is in `initialCart`; the motion sensor, MicroSD card, and Cam Unlimited plan are not pre-added. |
| **Selected card border** | The `isSelected` border class (`border-[#4E2FD2B2]`) is applied but the base `border` utility is missing from the same element, so the border does not render. One-line fix: add `border` to the className. |
| **Collapsed step "N selected" display** | The spec says collapsed steps should show only a chevron; open steps show the "N selected" count + up-chevron. Currently every step (open or closed) shows the count. |
| **`util/accordionSteps` module** | `StepAccordion` imports `TStepComponent` from `'../util/accordionSteps'` — this file does not exist in the repository, which will cause a TypeScript compile error on a clean clone. The type can be inlined or the file created. |
| **`loadSavedSession` double-load** | The store already reads `localStorage` at module init via `loadSavedCartFromStorage()`. The `useEffect` in `App.tsx` calls `loadSavedSession()` a second time on mount, which is redundant (harmless, but noisy). |
| **Tailwind dynamic `bg-${bg}` class** | `QuantityStepper` builds a class name with a template literal (`bg-${bg}`). Tailwind v4 (JIT) does not scan dynamic strings, so the custom background colour will not be included in the output. Use a static lookup object or inline style instead. |
| **Accordion all-collapsed state** | Clicking the active step header sets `activeStep` to `0`, which closes all steps with no open panel — this is navigable but slightly odd UX. A simpler model keeps at least one step always open. |
| **Financing line** | The spec lists a "financing line" below the satisfaction badge; this is absent from the review panel. |
| **`xl:flex-col` layout regression** | The two-column layout in `App.tsx` uses `lg:flex-row xl:flex-col`, which reverts to a stacked layout on very wide screens. This seems unintentional — the design is a two-column layout at desktop widths. |
| **Root-level README** | No `README.md` exists at the repo root. Reviewers cloning the repo see nothing until they navigate into a subfolder. |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS v4, Zustand 5 |
| Backend | Node.js, Express 5, TypeScript, better-sqlite3 |

## Technical Decisions

### Responsive Design Interpretation

The Figma file provides two layouts that both use a width of **1440px**. To better demonstrate responsive implementation and breakpoint handling, I interpreted one of the layouts as a **1024px viewport** while preserving the intended visual design, spacing, and hierarchy.

### Font Optimization

The design appears to use a different font for the checkout button. I chose not to include an additional font solely for this element because introducing a new font dependency for a single button would increase asset size and network requests while providing minimal visual benefit. Instead, I prioritized performance and consistency by using the project's primary font throughout the application.
