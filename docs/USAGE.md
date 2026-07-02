# Storyteller's Guide

## Install on your phone

1. Open the app URL in Chrome (Android).
2. Menu (⋮) → **"Add to Home screen"** / **"Install app"**.
3. Done — it now works fully offline, like a normal app.

Your data (speeches, playgroups) lives only on the device. Export a backup
now and then: **Settings → Export backup**.

## During a game

The **Draw** tab is your home base:

1. Pick the content language (**EN/DE**) and your **playgroup**.
2. For execution/death stories, type the **player's name** and pick the
   pronoun (he/she/they) — the story adapts automatically.
3. Tap a category (e.g. *Execution*). A random story appears, big and
   readable.
   - **✓ Mark as heard** — tell this story; the playgroup will never get it
     again (not even its translation).
   - **🎲 Draw another** — not feeling it; draws a different one without
     marking anything.
4. The `12 / 20` badge on each category = unheard / total stories for the
   current playgroup and language.

If a category runs dry for a playgroup, you can draw repeats anyway, reset
the playgroup's memory (Groups tab), or add new speeches.

## Playgroups

Create one entry per group you host (Groups tab). The active playgroup
remembers every story it has heard — across languages. Rotating members?
Just keep using the same playgroup. Select **No playgroup** to draw without
tracking.

## Writing your own speeches

**Library tab → + New speech.** Placeholders:

| Placeholder | Effect |
|---|---|
| `$Name` | replaced by the player name typed on the draw screen |
| `{he\|she\|they}` | picks the variant by the selected pronoun (m\|f\|n). Works for any word: `{his\|her\|their}`, `{er\|sie}` (missing third form falls back to the first) |

Tips:

- Paste several speeches at once by separating them with a line containing
  only `---`.
- **"Translation of"** links a new speech to an existing story in the other
  language, so playgroups never hear the same story twice across languages.
- Categories can be added, renamed and deleted at the bottom of the Library.

## AI-assisted writing

In the speech form, tap **🪄 Copy AI prompt**. It copies a ready-made prompt —
including style examples from your own collection and the placeholder rules —
to your clipboard. Paste it into any AI chatbot (Claude, ChatGPT, …), then
paste the results back into the form (they arrive `---`-separated, so one
save adds them all).

## Sharing with friends

Send them the app URL — and optionally a backup file (Settings → Export)
which they can import with **Import (add missing)**.
