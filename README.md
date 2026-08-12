# Bedside Client

The main user-facing app: onboarding, MMI/PREview/CASPr (on the way) practice flows, dashboard. Next.js App Router + Tailwind.

## Stack

- **Framework**: Next.js (App Router), TypeScript
- **Styling**: Tailwind, custom CSS variables for the design system (see `lib/fonts.ts` and Design Branding doc)
- **Auth**: Clerk (`@clerk/nextjs`), gated via `proxy.ts` (Clerk middleware — public routes are `/`, `/sign-in(.*)`, `/sign-up(.*)`, everything else requires auth)
- **API**: talks to the a server repo over HTTP, via delegators in `lib/api/`

## Getting set up

1. **Install dependencies**
```bash
npm install
```
Husky is configured (`prepare: husky`) — a pre-commit hook runs `lint-staged` (`eslint --max-warnings=0` on staged `.ts`/`.tsx` files). This will block commits with lint errors, not just warn. This is there so that you follow best practices with TypeScript development and ensures codebase is pure of no issues.

2. **Env vars** Refer to the .env.examples to help you or contact organization administrator for setting up environment variables

3. **Run dev server**
```bash
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Infisical-injected local dev server |
| `npm run build` | `next build` |
| `npm start` | `next start` — production server |
| `npm run lint` | ESLint |

## Folder structure

```
app/                    # Next.js App Router pages
├── dashboard/
├── mmi/[slug]/          # single-station MMI practice
├── mmi/circuit/          # full timed MMI circuit flow
├── preview/[slug]/, preview/full/   # PREview equivalents
├── onboarding/            # track → format selection, then per-format intro
├── sign-in/, sign-up/      # Clerk catch-all routes
└── desktop-only/            # shown when DesktopOnlyGate blocks a mobile viewport

components/
├── circuit/               # multi-station circuit runner (intro, transitions, results)
├── dashboard/               # dashboard widgets (readiness, streak, activity, etc.)
├── mmi/                      # station runner, recorders, rating panel, feedback
├── onboarding/                 # track/format selectors, breadcrumb, session bar
├── sections/                     # marketing/landing page sections
├── ui/                             # generic UI primitives + dev-only helpers
└── UserProfile/                     # account settings sections

lib/
├── api/                    # fetch wrappers per resource (mmi.ts, preview.ts, circuit.ts, stations.ts)
├── actions.ts                # server actions (saveTrack, saveFormat, onboarding progress)
├── features.ts                 # server-driven UI content (tracks/formats) fetching + typing
└── fonts.ts, iconRegistry.ts, utils.ts
```

## Things to know before you touch this
- **Format availability is data-driven, not hardcoded.** Which formats show as selectable (CASPer is currently hidden) is controlled by the `features` collection in a NoSQL store via the server's `/api/features` endpoint, not by editing frontend code. If you need to turn CASPer on, that's an admin-site/data change, not a client code change.
- **No mobile support yet.** `components/layout/DesktopOnlyGate.tsx` + server-side checks actively redirect mobile viewports to `/desktop-only`. This is intentional (see Tech Debt doc), not a bug — don't "fix" it without checking with product first.
- **Server actions vs API routes**: `lib/actions.ts` uses Next.js server actions (talk to Clerk directly, e.g. onboarding progress stored in Clerk `publicMetadata`). Everything else goes through `lib/api/*` hitting the Express server. Know which one you're extending before adding a new data flow.
- **Design system**: colors and fonts are CSS variables + Tailwind config, not ad-hoc hex codes — check the Design Branding doc in Notion before introducing new colors. The visual language (hard-edged neubrutalist cards, offset shadows, sparkle motif) is a deliberate brand choice, not a placeholder style.

## Related docs (Notion)
- Design Branding (fonts, colors, layout patterns, tone)
- Onboarding (package auth, Infisical, service providers)
- Tech Debt