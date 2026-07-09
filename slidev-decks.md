# SlideV executive decks

Mr. Handy can turn a completed per-screen handoff into an Apple-keynote-style SlideV deck. The deck is a narrative summary for stakeholders — not a replacement for the handoff Markdown.

## Quick start

After you have a handoff:

```
/handoff-deck
```

Or in Claude Code:

> Use $mr-handy-handoff to create a deck from the handoff we just built.

Mr. Handy will ask which handoff to use, then emit:

- `presentations/{project-slug}/slides.md`
- `presentations/{project-slug}/style.css`
- `presentations/{project-slug}/package.json`
- Optional screenshots under `presentations/{project-slug}/assets/`
- Optional PDF/PPTX exports under `presentations/{project-slug}/dist/`

## The template

The starter lives at `templates/slidev-apple-keynote/`:

| File | Purpose |
|---|---|
| `README.md` | Copy/brand instructions for humans |
| `slides.md` | Sample 9-slide deck |
| `style.css` | Apple-keynote theme with brand-token `:root` variables |
| `package.json` | SlideV CLI and export scripts |

The default look is cinematic dark with Noto Serif headlines, Noto Sans body, and a single bright accent color.

## Branding

Brand colors come from `mr-handy.config.json` → `presentation.brandPalette`:

```json
{
  "presentation": {
    "template": "slidev-apple-keynote",
    "brandPalette": {
      "background": "#050511",
      "text": "#F5F5F7",
      "accent": "#2997FF",
      "muted": "#86868B"
    },
    "exportFormats": ["pdf", "pptx"]
  }
}
```

The deck creator binds these into `style.css` `:root`. If you change the palette after the deck exists, update `style.css` directly or regenerate the deck.

## Slide structure

A default deck has 8-12 slides:

1. Black title card — project name only.
2. Pullquote / question — the single idea the deck answers.
3. Title + subtitle.
4. Context / problem — 1-2 sentences.
5. Solution — what the handoff provides.
6. Impact — 2-4 stats in `.stat-big` + `.stat-label`.
7. Architecture / flow — 3-step map of the flow.
8. Roadmap — what happens next.
9. Closing CTA.

## Content rules

- One idea per slide.
- Headlines are sentence case, no periods.
- Body text is 1-2 sentences or 2-4 bullets.
- No all-caps body text.
- No dense bullet walls.
- No implementation specs on slides (no token slugs, CSS classes, or component chips).
- Every numeric claim uses `.stat-big` + `.stat-label`.

## Export

Preview:

```bash
cd presentations/{project-slug}
npm install
npm run dev
```

Export:

```bash
npm run export:pdf
npm run export:pptx
```

## Customizing the template

If you want a different visual language, copy `templates/slidev-apple-keynote/` to a new folder under `templates/` (for example, `templates/slidev-corp-light/`), update the CSS and sample slides, and set `presentation.template` in `mr-handy.config.json`.

The deck creator always copies the configured template into `presentations/{project-slug}/`, so the original template stays reusable.
