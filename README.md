# Making an Explainer Video

A web guide to planning, filming and editing a short science explainer video, built from the Astro 98 Bok Workshop slides by Erandi Chavez.

Live site: https://erandichavez.github.io/explainer-video-guide/

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things live

- `src/app/page.tsx` — the page content, one section per topic
- `src/components/` — interactive pieces (simplify stepper, jargon examples, sync timeline, workshop flow, video planner, setup diagram)
- `src/assets/` — images; `public/` — the example video and the planner `.docx`

## Deploying

Every push to `main` builds a static export and publishes it to GitHub Pages via `.github/workflows/deploy.yml`.
