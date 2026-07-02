# Clocktower Companion

A small offline-first web app (PWA) for **Blood on the Clocktower** storytellers.
It keeps a collection of short atmospheric speeches — game intros, execution
stories, morning death announcements — and randomly draws one to read aloud,
with player-name/gender placeholders and per-playgroup "already heard"
tracking so no group ever hears the same story twice, in any language.

**How to use it as a storyteller: see [docs/USAGE.md](docs/USAGE.md).**

## Tech stack

- **TypeScript + Vite**, no UI framework — plain DOM with small view modules
- **vitest** for unit and UI smoke tests (`happy-dom`)
- **vite-plugin-pwa** — service worker + manifest, fully offline after install
- **localStorage** for all data (single-user, local-only by design)
- Deployed as a static site to **GitHub Pages** (`.github/workflows/deploy.yml`)

## Architecture

Strictly layered so each part can be swapped out independently:

```
src/
  domain/     Pure types + logic, no browser APIs. Unit-tested.
    types.ts          Speech, Category, Playgroup, Settings
    placeholders.ts   $Name and {he|she|they} resolution
    selection.ts      random draw excluding heard story groups
  data/       Persistence.
    repository.ts             AppRepository interface (the swap point)
    localStorageRepository.ts current backend
    seedContent.ts            bundled starter speeches (hand-editable)
    seed.ts                   first-launch import, update-safe
    exportImport.ts           JSON backup / restore / merge
  services/   Use-cases wiring domain + data.
    speechService.ts    content CRUD, drawing, AI prompt building
    sessionService.ts   settings, playgroups, heard-story tracking
  ui/         Views (plain TS + template strings) and styling.
    app.ts        tab bar + view switching
    drawView.ts   pick a category → reading screen
    manageView.ts library: speech + category management
    playgroupsView.ts, settingsView.ts, dom.ts, style.css
  main.ts     composition root
```

Key concepts:

- **Translation groups.** Speeches that tell the same story in different
  languages share a `groupId`. Usage is tracked per group, so a playgroup
  that heard the German version never gets the English one. Standalone
  speeches simply own their group. Linking is optional — don't force
  translations that would hurt the atmosphere.
- **Seed content** (`src/data/seedContent.ts`) is imported into localStorage
  on first launch; from then on localStorage is the single source of truth.
  Imported IDs are remembered, so user deletions survive app updates while
  new seed speeches still arrive.
- **Categories are data**, editable in the app. To ship new default
  categories or speeches, edit `seedContent.ts`.

## Development

```bash
npm install
npm run dev        # dev server (open on your phone via LAN IP for testing)
npm test           # domain unit tests + UI smoke tests
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
node scripts/generateIcons.mjs   # regenerate PNG icons after editing icon.svg
```

## Deployment

Pushing to `main` builds, tests and deploys to GitHub Pages via
`.github/workflows/deploy.yml`. One-time repo setup: *Settings → Pages →
Source: GitHub Actions*. The Vite `base` path in `vite.config.ts` must match
the repository name.

## Ideas / possible next steps

- Direct AI integration (Claude API) instead of the copy-prompt workflow
- Favorites / ratings for speeches; weight the draw accordingly
- Optional cloud sync (would replace `localStorageRepository`)
- UI translation (currently English-only chrome; content is EN/DE)
