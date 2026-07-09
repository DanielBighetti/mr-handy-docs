# Mr. Handy — Documentation

Local Markdown docs. Renders directly in Cursor and on GitHub. No build step, no MDX, no hosting required.

> **One-page, illustrated, scannable version:** open [`documentation-site.html`](./documentation-site.html) in any browser.

If you're brand-new, read in order:

1. [`index.md`](./index.md) — what Mr. Handy is, the before/after workflow, the value story, **and answers to "can I use this for my company?"**
2. [`getting-started.md`](./getting-started.md) — the five premises, the one-command wizard, the four-step recipe for **adjusting Mr. Handy for a new company**
3. [`how-it-works.md`](./how-it-works.md) — the per-screen flow and per-component pipeline explained

Then, depending on what you're producing:

**Per-screen handoffs** (multi-screen flows, dashboards, wizards, kanbans):

- The full per-screen flow lives in [`how-it-works.md`](./how-it-works.md). Phase reference, output validation, and gotchas for Mode A (Markdown + HTML + screenshots) and Mode B (Figma canvas).

**Per-component specs** (anatomy + API + properties + color + structure + screen reader + motion for one component):

- [`specs/component-md.md`](./specs/component-md.md) — the orchestrator and the `_base.json` plugin contract
- [`specs/anatomy.md`](./specs/anatomy.md)
- [`specs/api.md`](./specs/api.md)
- [`specs/property.md`](./specs/property.md)
- [`specs/color.md`](./specs/color.md)
- [`specs/structure.md`](./specs/structure.md)
- [`specs/screen-reader.md`](./specs/screen-reader.md)
- [`specs/motion.md`](./specs/motion.md)

**Operating Mr. Handy:**

- [`help/troubleshooting.md`](./help/troubleshooting.md) — Figma MCP, plugin, `.uspec-cache/`, encoding gotchas
- [`help/contribute.md`](./help/contribute.md) — how to add knowledge files, design systems, and rules
- [`help/changelog.md`](./help/changelog.md) — Mr. Handy release notes

The vendored uSpec components inside Mr. Handy correspond to a specific upstream version. The mirrored uSpec changelog lives at [`../Knowledge/uspec-changelog.md`](../Knowledge/uspec-changelog.md) and is reference-only.
