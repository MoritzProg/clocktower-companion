# Agent notes — Clocktower Companion

Offline-first PWA for Blood on the Clocktower storytellers: draws random
atmospheric speeches (intro / execution / morning-death) with placeholder
resolution and per-playgroup no-repeat tracking. Owner: Moritz (hobby
project, Android phone is the target device, WSL2 is the dev machine).

## Guardrails from the owner

- **Simple beats enterprise.** No heavy edge-case handling, no security
  theater. Prefer deleting a requirement over complicating the code.
- Keep the layer boundaries (domain / data / services / ui) — he wants to
  swap parts later for learning.
- Owner explicitly granted freedom to change/scrap requirements that hurt
  the experience.

## Architecture in 30 seconds

- `src/domain` — pure logic (placeholders, selection). Unit-tested.
- `src/data` — `AppRepository` interface; localStorage impl; seed import
  (tracks imported IDs so user deletions survive app updates);
  export/import JSON backups.
- `src/services` — `SpeechService` (content, drawing, AI prompt),
  `SessionService` (settings, playgroups, heard tracking).
- `src/ui` — vanilla-DOM views, full re-render via `ctx.rerender()`;
  module-level view state. Tab bar in `app.ts`.
- Cross-language no-repeat: speeches share a `groupId` when they are the
  same story; playgroups store heard `groupId`s.

## Workflow

- Node via nvm (`~/.nvm/versions/node/v22.23.0/bin` — not on fish PATH by
  default, export it in Bash calls).
- `npm test` (vitest; UI smoke tests run in happy-dom), `npm run build`
  (tsc + vite), `npm run dev`.
- Deploy: push to `main` → GitHub Actions → GitHub Pages. Vite `base` =
  `/clocktower-companion/` must match repo name.
- Icons: edit `public/icons/icon.svg`, run `node scripts/generateIcons.mjs`.

## Content conventions

- Seed speeches live in `src/data/seedContent.ts`; IDs `{group}-{lang}`,
  stable, never reuse. New seed content ships automatically to existing
  installs on next load.
- Placeholders: `$Name`, `{m|f|n}` gender variants (missing third form →
  falls back to first). German pairs usually `{er|sie}`.
- Tone: gothic-atmospheric (intros) or darkly comic (executions/mornings),
  Ravenswood Bluff setting, short enough to read aloud in under a minute.

## Open ideas (not commitments)

Direct Claude API integration for speech writing; favorites/weighted draw;
UI language German; replace localStorage backend (owner may experiment).
