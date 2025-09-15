### ContractHub

## Setup instructions
- **Prerequisites**: Node.js 18+ and npm 9+ recommended.
- **Install dependencies**:
```bash
npm install
```
- **Start dev server** (Vite on port 8080):
```bash
npm run dev
```
- **Build for production** (outputs to `dist`):
```bash
npm run build
```
- **Preview production build**:
```bash
npm run preview
```

Notes:
- Dev server binds to host `::` (all interfaces, IPv6) and port `8080` (see `vite.config.ts`).
- Static data and assets live in `public/` (e.g., `contracts.json`, `contract-details.json`).
- Path alias `@` points to `./src` (import like `@/components/...`).

## Tech stack choices
- **Framework**: React 18 with TypeScript.
- **Bundler/dev server**: Vite 5 with `@vitejs/plugin-react-swc` (SWC for fast TS/JSX).
- **Routing**: `react-router-dom` v6.
- **Server state**: TanStack Query (`@tanstack/react-query`).
- **Forms & validation**: `react-hook-form` + `zod` (via `@hookform/resolvers`).
- **UI system**:
  - Tailwind CSS 3 with `tailwindcss-animate` and custom tokens in `tailwind.config.ts`.
  - Headless primitives from Radix UI (`@radix-ui/react-*`).
  - shadcn/ui-style components under `src/components/ui/*`.
  - Icons: `lucide-react`; toasts: `sonner`.
  - Extras: `embla-carousel-react`, `react-resizable-panels`, `recharts`, `date-fns`.
- **Linting**: ESLint 9 with TypeScript ESLint, React Hooks, React Refresh (`eslint.config.js`).
- **Output**: Static site in `dist/` suitable for static hosting.

## Assumptions made
- **No backend required**: Contract data is served from static JSON in `public/`.
- **Client-only auth**: `AuthContext` maintains local state; no external auth provider configured.
- **Env vars**: None required to run locally; no `.env` needed by default.
- **Port/host**: Local dev on port `8080`; change in `vite.config.ts` if necessary.
- **Package manager**: `npm` is primary (has `package-lock.json`); a `bun.lockb` exists but npm workflow is canonical here.
- **Browser support**: Modern evergreen browsers; no legacy support.
