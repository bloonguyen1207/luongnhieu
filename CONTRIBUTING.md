# Contributing to Lương Nhiêu

Thanks for your interest in improving Lương Nhiêu — a free, open-source Vietnam
salary & tax calculator. Contributions of all kinds are welcome: bug reports,
tax-law corrections, translations, features, and docs.

## Ways to contribute

- **Report a bug** — [open a bug report](https://github.com/bloonguyen1207/luongnhieu/issues/new?template=bug_report.yml).
- **Report a calculation / tax-law error** — accuracy is the whole point of this
  project. Use the [calculation error template](https://github.com/bloonguyen1207/luongnhieu/issues/new?template=calculation_error.yml)
  and **include the legal source** (circular, decree, or law article) so we can verify.
- **Request a feature** — [open a feature request](https://github.com/bloonguyen1207/luongnhieu/issues/new?template=feature_request.yml).
- **Improve translations** — strings live in [`client/src/lib/i18n.ts`](client/src/lib/i18n.ts) (English + Vietnamese).
- **Send a pull request** — see below.

## Local setup

Prerequisites: **Node.js 18+** and **pnpm**.

```bash
pnpm install
pnpm dev          # start the dev server
```

Before opening a PR:

```bash
pnpm check        # TypeScript type-check (must pass)
pnpm build        # production build (must succeed)
pnpm format       # Prettier
```

## Pull request guidelines

1. Branch off `master`.
2. Keep PRs focused — one logical change per PR.
3. **For any change to tax math**, cite the legal basis in the PR description and,
   where practical, add a worked example (inputs → expected output). The tax logic
   lives in [`client/src/lib/salaryCalculator.ts`](client/src/lib/salaryCalculator.ts).
4. `pnpm check` and `pnpm build` must pass.
5. Update [`README.md`](README.md) / i18n strings if behavior or copy changes.

## Tax accuracy

This tool models Vietnamese labor and tax law and is used by real people to make
real decisions. When in doubt, prefer the **official source** (Quốc hội laws,
Chính phủ decrees, Bộ Tài chính circulars) over secondary summaries, and note the
effective date. The disclaimer in the footer makes clear this is informational,
not binding advice — but we still aim to be exactly right.

## Code of conduct

Be respectful and constructive. We're here to build something genuinely useful for
Vietnamese workers and freelancers.
