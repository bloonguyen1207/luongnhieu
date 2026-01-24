# LuongNhieu — Vietnam Salary Calculator

A bilingual, themeable, precision salary calculator for Vietnam. Computes net/gross salary, PIT (2025 vs 2026), insurance contributions, and employer costs. Built with React + Vite, Tailwind CSS, and a minimal Express server for production.

## Features
- Salary calculator with progressive PIT for 2025 (7 brackets) and 2026 (5 brackets)
- Net ↔ Gross conversion with iterative refinement
- Employee and employer insurance breakdown (BHXH, BHYT, BHTN)
- Region selection and dependents deduction
- Bilingual UI (English/Vietnamese) and dark mode toggle
- Minimum wage cards (2025 vs 2026) and comparison
- Client-side routing with `wouter`; production server fallback to `index.html`
- Optional Google Maps integration via proxy

## Tech Stack
- React 19, Vite 7, TypeScript 5
- Tailwind CSS 4, Radix UI components
- Wouter (routing), Lucide icons
- Express + esbuild for production server bundling

## Project Structure
```
client/
  index.html
  src/
    App.tsx
    main.tsx
    index.css
    pages/
      Home.tsx
      NotFound.tsx
    components/
      SalaryCalculator.tsx
      Map.tsx
      ui/...
    contexts/
      ThemeContext.tsx
      LanguageContext.tsx
    lib/
      salaryCalculator.ts
      i18n.ts
      utils.ts
server/
  index.ts
shared/
  const.ts
vite.config.ts
package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ (recommended)
- pnpm (project uses `pnpm-lock.yaml`)

### Install
```bash
pnpm install
```

### Development
Runs Vite dev server (defaults to port 3000 or the next available).
```bash
pnpm dev
```
Open the logged URL (typically http://localhost:3000).

### Build
Bundles the client to `dist/public` and the server to `dist/index.js`.
```bash
pnpm build
```

### Start (Production)
Starts the Express server, serving static assets from `dist/public` and routing all paths to `index.html`.
```bash
pnpm start
```
Environment: `NODE_ENV=production` (already set by the script). Optional `PORT` overrides the default 3000.

### Preview (Static)
Serves built client assets using Vite's preview server.
```bash
pnpm preview
```

## Environment Variables
Some features require environment variables. Create a `.env` in repo root (Vite reads `envDir` at project root).

- `VITE_FRONTEND_FORGE_API_KEY` — Required for Google Maps loading via proxy.
- `VITE_FRONTEND_FORGE_API_URL` — Optional; defaults to `https://forge.butterfly-effect.dev`.
- `VITE_ANALYTICS_ENDPOINT` — Optional; used in `index.html` for Umami script.
- `VITE_ANALYTICS_WEBSITE_ID` — Optional; used in `index.html` for Umami script.

Example:
```env
VITE_FRONTEND_FORGE_API_KEY=your_google_maps_api_key
VITE_FRONTEND_FORGE_API_URL=https://forge.butterfly-effect.dev
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Key Files
- Salary logic: [client/src/lib/salaryCalculator.ts](client/src/lib/salaryCalculator.ts)
  - 2025 vs 2026 PIT brackets, employee/employer insurance rates
  - Net ↔ Gross calculation, detailed breakdown
- Translations: [client/src/lib/i18n.ts](client/src/lib/i18n.ts)
- Theme: [client/src/contexts/ThemeContext.tsx](client/src/contexts/ThemeContext.tsx)
- Language: [client/src/contexts/LanguageContext.tsx](client/src/contexts/LanguageContext.tsx)
- Router & App shell: [client/src/App.tsx](client/src/App.tsx)
- Home page: [client/src/pages/Home.tsx](client/src/pages/Home.tsx)
- UI styles: [client/src/index.css](client/src/index.css)
- Production server: [server/index.ts](server/index.ts)
- Vite config: [vite.config.ts](vite.config.ts)

## Routing
- `/` → Home (calculator, minimum wage cards)
- `/404` → NotFound
- Fallback route serves NotFound

In production, the Express server serves `index.html` for all routes to support client-side navigation.

## Maps Integration
The `MapView` component loads Google Maps via a proxy service to avoid exposing the API key in HTML.
- Component: [client/src/components/Map.tsx](client/src/components/Map.tsx)
- Requires `VITE_FRONTEND_FORGE_API_KEY` and optional `VITE_FRONTEND_FORGE_API_URL`

## Scripts
- `pnpm dev` — Start Vite dev server
- `pnpm build` — Build client + bundle server to `dist`
- `pnpm start` — Run production server (`NODE_ENV=production`)
- `pnpm check` — Type-check with `tsc`
- `pnpm format` — Format with Prettier

## Notes
- Vite root is `client/`; build output goes to `dist/public` (see [vite.config.ts](vite.config.ts)).
- Static files are served from `dist/public`; client routing uses a wildcard fallback.
- `pnpm` patch applied: `wouter@3.7.1` via [patches/wouter@3.7.1.patch](patches/wouter@3.7.1.patch).

## License
MIT
