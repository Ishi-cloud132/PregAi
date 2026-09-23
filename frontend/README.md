# PREG AI — Frontend

React + TypeScript + Vite + Tailwind frontend for the PREG AI EHG-based
pregnancy monitoring platform. Architected to run standalone in **Demo Mode**
today, and to switch to a live FastAPI backend later via environment
configuration only — no component code should need to change.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The app ships with three demo accounts
(password `demo1234` for all):

| Role | Email |
|---|---|
| Admin | admin@pregai.demo |
| Clinician | clinician@pregai.demo |
| Researcher | researcher@pregai.demo |

Each role sees a different navigation set and route access (`src/constants/index.ts` → `ROLE_PERMISSIONS`).

## Connecting a real FastAPI backend

Edit `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ENABLE_MOCK_API=false
```

Every domain service (`src/services/*Service.ts`) already contains both a
mock and a real branch behind this flag — components never call `fetch()`
directly and never need to change. Update `src/types/index.ts` as the real
Pydantic schemas are finalized; it's intentionally kept close to a 1:1 mirror
of the expected FastAPI response shapes described in the project brief
(User, Patient, MonitoringSession, EHGSignal, SignalQuality, SignalFeatures,
RiskAssessment, Report, Alert).

## Architecture notes

- **`services/api.ts`** — single centralized fetch client (auth header, error
  shape). Nothing else touches `fetch()`.
- **`services/<domain>Service.ts`** — one per domain (auth, patient,
  monitoring, signal, risk, report). Each resolves to either
  `services/mock/mock<Domain>Service.ts` or a real FastAPI call depending on
  `VITE_ENABLE_MOCK_API`.
- **`services/realtimeService.ts`** — the only place that knows how live EHG
  data actually arrives. Today it polls the mock signal service; swapping in
  WebSocket/SSE/MQTT-via-FastAPI later doesn't require touching any chart or
  page component, since they only consume `subscribeToSignal()`.
- **`hooks/useEHGBuffer.ts`** — bounded rolling buffer (last 30s / configurable
  in `constants`) so continuous monitoring never accumulates unbounded state
  or freezes the browser. Reports an explicit `ConnectionState` alongside the
  data so a page can never show demo data under a `LIVE` label.
- **Demo Mode is honest everywhere**: `context/AppModeContext.tsx` tracks
  whether the app is in mock mode or the real backend has proven unreachable,
  and `components/common/DemoModeBanner.tsx` / `ConnectionIndicator.tsx`
  surface it consistently instead of silently faking a live state.
- **Role-based routing**: `components/layout/RoleRoute.tsx` hides/disables
  unauthorized routes for UX only. Actual authorization must still be
  enforced by FastAPI — this is not a security boundary.

## New in this pass: palette + type rebrand to match the NIRMAY / SIH deck

Pulled the dashboard's identity from the team's Smart India Hackathon pitch
deck rather than an arbitrary "medical dashboard" palette:

- **Primary accent** is now a deep navy blue (was violet), matching the
  deck's title color. **Secondary** is teal (was cyan/sky), matching the
  deck's teal outline boxes. Two decorative accents were renamed to match
  too: `rose` → **`purple`** (violet, matching the deck's purple boxes) and
  `teal` → **`gold`** (warm amber, matching the deck's gold "viability
  checklist" banner) — see `components/dashboard/StatCard.tsx`'s `accent`
  prop and `tailwind.config.js`.
- **Headings** now use Playfair Display (a serif, matching the deck's bold
  serif titles) instead of Space Grotesk; body text stays Inter.
- **Light mode is now the default** for new visitors (previously dark),
  since the deck itself is a light/paper background — dark mode is still
  fully supported and just as complete, toggle it from the sidebar or
  Settings.
- All of this lives in `index.css`'s two `:root[data-theme]` variable
  blocks and `tailwind.config.js` — no component markup changed, only the
  color values and font family feeding the existing token names, plus a
  handful of literal-hex spots that can't consume CSS variables (the
  Three.js electrode model's lights/materials in
  `ElectrodePlacementModel.tsx`, and Recharts' `stroke`/`fill` props via
  `hooks/useChartColors.ts`).

## New in the prior pass: light/dark theme + colour variety

**Theme toggle** — a proper light/dark mode, not just a cosmetic switch.
Toggle it from the sidebar footer (compact icon pair) or Settings → Appearance.
The choice is saved to `localStorage` (`pregai_theme`) and applied via a
`data-theme` attribute on `<html>`; an inline script in `index.html` sets
that attribute before React hydrates, so there's no flash of the wrong theme
on load. First-time visitors get their OS preference
(`prefers-color-scheme`) as the default; after that, their explicit choice
always wins.

Under the hood, every color in `tailwind.config.js` (`base`, `surface`,
`border`, `ink`, `brand`, `secondary`, `teal`, `rose`, `status.*`) now
resolves through a CSS custom property (`rgb(var(--c-x) / <alpha-value>)`),
with the two full palettes defined in `index.css` under
`:root[data-theme='dark']` and `:root[data-theme='light']`. That means
existing component code didn't need to change at all — `bg-surface`,
`text-ink-muted`, `border-brand/40` etc. just repaint themselves. The one
exception is Recharts, which needs literal hex values rather than CSS
variables; `hooks/useChartColors.ts` mirrors both palettes for chart
grid/axis/tooltip colors so charts stay legible (and don't have
invisible-on-white grid lines) in light mode too.

**More colour variety in reactive/hover states** — the accent palette used
to be just brand (violet) + secondary (cyan), both blue-family hues, so
every hover state looked the same. Added two more decorative accents, `teal`
and `rose` (purely visual, not tied to any clinical meaning — status colors
for good/warning/critical are untouched and still only mean what they've
always meant). `components/dashboard/StatCard.tsx` now takes an `accent`
prop (`brand` / `secondary` / `teal` / `rose`) with its own hover
border+glow+icon color, and the four Dashboard stat cards each get a
different one, so the dashboard doesn't read as a wall of violet on hover.

## New in the prior pass: Comparison page + visual upgrade

**Session Comparison** (`/comparison`) — the major new feature. Select a
patient and two of their monitoring sessions (or use "current vs. previous"
as a one-click default) to get: summary cards, headline delta chips (Signal
Quality / Energy / Peak-to-Peak / Median Frequency), an overlaid waveform
chart (violet = Session A, cyan = Session B, with raw/filtered toggle and
per-session show/hide), a full comparison table of the actual 10-feature
ESP32 firmware set (Variance, Energy, MAV, Peak-to-Peak, Line Length, Crest
Factor, Peak Frequency, Median Frequency, Skewness, Kurtosis), a feature
trend chart across all of that patient's sessions, a risk-assessment
comparison panel, and a neutral "Signal Insights" list.

Wording throughout is deliberately analytical, not clinical —
"increased/decreased/stable," never "improving/worsening." All comparison
data flows through `services/comparisonService.ts` (mock/real split, same
pattern as every other service) — nothing is generated inline in a
component, and feature/risk values are now seeded per session ID
(`hashSeed` in `mockData.ts`) so revisiting the same two sessions gives
stable, reproducible numbers instead of reshuffling on every fetch.

**Firmware feature set** — `types/index.ts` gained `FirmwareFeatureSet`
(the actual 10-feature ESP32 vocabulary), now also surfaced on the EHG
Signal page ("Extracted Features") and Signal EDA page (statistical
features, feature profile, frequency-domain section), via a shared
`FirmwareFeatureGrid` component and `signalService.getFirmwareFeatures()`.

**Visual upgrade** — done mostly at the design-token level in
`tailwind.config.js` so it propagated automatically: primary accent is now
violet/purple (`brand`), a new cyan/blue `secondary` accent is used
strategically for analytical contexts (Session B in comparisons, trend
highlights) rather than everywhere, surfaces got a subtle purple-tinted
elevation scale, cards got a subtle gradient sheen, and the sidebar's active
item now has a left accent bar + glow instead of a flat highlight.
`prefers-reduced-motion` is now respected globally. Existing routes, login,
demo mode, and the mock API were preserved as-is; this was an extension
pass, not a rewrite.

## New in the prior pass: reactivity, 3D sensor view, report chatbot

**Hover / reactive UI** — `components/common/Card.tsx` takes an `interactive`
prop (lift + glow on hover), `StatCard` values animate in with GSAP
count-up, `InfoTooltip` gives hover explanations on dashboard metrics, and
table rows / list rows have consistent hover transitions throughout.

**3D EHG electrode placement viewer** —
`components/monitoring/ElectrodePlacementModel.tsx`, shown on the Dashboard
and Monitoring pages. It's plain Three.js (drag to rotate, scroll to zoom,
hover a marker for its channel description), lazy-loaded via
`LazyElectrodePlacementModel` so it doesn't bloat the initial bundle (own
~137KB gzipped chunk, only fetched when one of those pages mounts).

It ships with a procedural low-poly body built from primitives, so there's
zero external-asset dependency out of the box. If you want to swap in an
actual Blender-modeled figure: export it as glTF/`.glb`, drop it at
`public/models/torso.glb`, and the component will detect and use it
automatically — no code changes. Electrode positions are illustrative
placeholders in `components/monitoring/electrodePoints.ts`; update that one
file once the hardware/clinical team finalizes real placement coordinates —
the 3D markers and the legend both read from it.

**Report explainer chatbot** — `components/reports/ReportChatPanel.tsx`,
opened from a row click on the Reports page (`ReportDetailDrawer.tsx`). It is
deliberately **not** RAG: no vector store, no document retrieval, no
external LLM call. `services/mock/reportExplainer.ts` is a small,
deterministic, template-driven engine that answers questions using only the
structured fields already loaded for that one report (risk assessment,
signal features, patient, duration) — so every answer traces back to a
specific field, which is what makes it "explainable" rather than opaque.
Intent matching is plain keyword rules over a bounded set of things a
clinician actually asks (summary, risk, why, signal quality, duration,
model, "does this replace a doctor"). It's wired through the same
mock/real service-split pattern as everything else
(`services/chatService.ts`), so if you later want a real LLM behind it,
point the real branch at a FastAPI endpoint (e.g.
`POST /api/reports/{id}/chat`) — the chat UI doesn't change either way.

## What's scaffolded vs. deep-built

This first pass prioritizes a working, navigable, type-safe architecture
across every page in the brief, with realistic (clearly-labeled) mock data
and a real mock/live service switch — over exhaustively finishing every
possible metric (e.g. full FFT/PSD frequency-domain view, PDF report
rendering, GRU/LSTM-specific model dashboards). Those are stubbed with clear
"awaiting backend" placeholders rather than invented numbers, per the brief's
instruction not to represent future functionality as currently implemented.

## Tech

React 18 · TypeScript · Vite · Tailwind CSS · React Router v6 · Recharts ·
GSAP (page-transition + login entrance only — kept deliberately sparse).
