# Lương Nhiêu — Vietnam Salary Calculator

[![Deploy to GitHub Pages](https://github.com/bloonguyen1207/luongnhieu/actions/workflows/deploy.yml/badge.svg)](https://github.com/bloonguyen1207/luongnhieu/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A bilingual, themeable, precision salary & tax calculator for Vietnam. Computes net/gross salary, PIT (2025 vs 2026), insurance contributions, employer cost, and **freelancer** taxes. Built with React + Vite, Tailwind CSS, and a minimal Express server for production.

**🔗 Live demo: https://bloonguyen1207.github.io/luongnhieu/**

> Free and open source (MIT). Informational only — not binding tax advice.

## Features
- **Employee mode**: progressive PIT for 2025 (7 brackets) and 2026 (5 brackets), employee + employer insurance (BHXH, BHYT, BHTN), region & dependents
- **Freelancer — Service Contract** (Circular 111/2013/TT-BTC): 10% withholding for domestic payers, self-declaration for foreign payers, annual finalization
- **Freelancer — Household Business** (Circular 40/2021/TT-BTC + Decree 141/2026/ND-CP): VAT 5% + PIT 2%, ₫1B/year exemption threshold
- **Voluntary insurance** (BHXH 22% + household BHYT 4.5%) for freelancers
- **Finalization period** selector — view amounts per Month / Quarter / Year
- **Net ↔ Gross / Net → invoice** solving via binary search (sub-VND precision)
- PIT bracket breakdown and 2025-vs-2026 comparison
- Bilingual UI (English / Vietnamese), light + dark "Jade Money" theme
- Minimum wage cards (2025 vs 2026)

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

## Contributing

Contributions, tax-law corrections, and translations are welcome. See
[CONTRIBUTING.md](CONTRIBUTING.md) for setup and guidelines.

- 🐛 [Report a bug](https://github.com/bloonguyen1207/luongnhieu/issues/new?template=bug_report.yml)
- 🧮 [Report a calculation / tax-law error](https://github.com/bloonguyen1207/luongnhieu/issues/new?template=calculation_error.yml) (please cite the legal source)
- ✨ [Request a feature](https://github.com/bloonguyen1207/luongnhieu/issues/new?template=feature_request.yml)

For any change to tax math, cite the legal basis (law / decree / circular + effective date) and include a worked example.

## Support

If this tool saved you time, you can support its development. _(Donation links
coming soon — see [.github/FUNDING.yml](.github/FUNDING.yml).)_

## License

[MIT](LICENSE) © Bloo Nguyen
