# Changelog

Mr. Handy release notes. The vendored uSpec changelog is mirrored separately at [`../../Knowledge/uspec-changelog.md`](../../Knowledge/uspec-changelog.md) and tracks the upstream specifications-pipeline component.

## 1.10 — 2026-04-30

The "white-label hardening + setup wizard + docs site" release.

### Setup in one command

- **`Setup-MrHandy.bat`** (Windows) and **`setup-mrhandy.sh`** (macOS / Linux / WSL) — thin wrappers around the cross-platform `setup-mrhandy.mjs`. Verify Node ≥ 18, populate `mr-handy.config.json`, detect every installed IDE (Cursor, Claude Code, Codex, Windsurf, Zed, Cline, Continue) and write the right `mcp.json` to each, build `figma-plugin/`, and print a "to finish" checklist. Idempotent: re-running preserves answers.
- A pre-populated MCP template at `.cursor/mcp.json.template` ships in git; the populated `.cursor/mcp.json` is gitignored. Per-IDE templates live under `templates/`.

### Both Figma MCPs

- **`.cursor/rules/mr-handy-mcp.mdc`** — explicit routing table for Figma Console MCP (reads — tokens, screenshots, FigJam, accessibility) vs Native Figma MCP (writes — Plugin API JavaScript, Mode B builds, Figma-native per-component renders).
- The intent router in `mr-handy-core.mdc` now loads `mr-handy-mcp.mdc` before any Figma tool call.

### Docs site

- Plain Markdown docs under `docs/` — readable directly in Cursor and on GitHub. No MDX, no Mintlify, no build step.
- Mirrors the structure of the upstream uSpec docs (`docs.uspec.design`) but is rewritten around the per-screen flow as the leading path.
- Files: `index.md`, `getting-started.md`, `how-it-works.md`, `specs/{anatomy,api,property,color,structure,screen-reader,motion,component-md}.md`, `help/{troubleshooting,contribute,changelog}.md`.

### White-label hardening

- All branded identifiers, branded font families (replaced with `Inter`), namespaces, config namespaces, and library component keys removed from the active codebase. The white-label sweep now also catches two forbidden three- and six-letter substrings called out in `.cursor/rules/mr-handy-output.mdc § White-Label Sanity Sweep`.
- The sweep regex is expanded; the rule file itself is the only location where the patterns are allowed to appear (it has to literally contain them to detect them).
- Removed: the legacy nested-product subtree (separate product whose name is one of the two forbidden substrings), the `uSpec-main/` subtree (vendored components remain under `.cursor/skills/uspec/`, `references/`, and `figma-plugin/`), branded `DESIGN.md` references, branded handoff outputs at the workspace root.
- The vendored uSpec changelog is now mirrored at `Knowledge/uspec-changelog.md` (read-only reference).

## 1.9 — 2026-04 (prior)

The "uSpec integration + white-labeling" release. Per-component specs (`/handoff-component`) ship as a vendored uSpec extractor + interpretation pipeline. Project / brand / design-system / Figma library all read from `mr-handy.config.json`. Public design systems (Fluent 2, Carbon, Material, Apple HIG) ship as DS reference docs under `Knowledge/design-systems/`.

## 1.8 and earlier

See [`../../Archive/`](../../Archive/) for historical handoff specialist versions. Pre-1.9 releases were not white-label.
