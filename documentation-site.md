> A Markdown source version of the HTML documentation site. Render with any static-site generator, or publish to Confluence as-is.

# Mr. Handy Documentation

A design-handoff documentation specialist that runs in both **Cursor** and **Claude Code / Codex**. It turns Figma source-of-truth into developer-ready Markdown, HTML, Figma canvas handoffs, per-component specs, and Apple-keynote-style SlideV decks.

> **White-label by design.** Project name, brand, active design system, Figma library key, font family, and deck palette are all read from `mr-handy.config.json` at runtime.

---

## Table of contents

1. [IDE support](#ide-support)
2. [Capabilities](#capabilities)
3. [Output tracks](#output-tracks)
4. [Prerequisites](#prerequisites)
5. [Install](#install)
6. [Cursor setup](#cursor-setup)
7. [Claude Code setup](#claude-code-setup)
8. [Figma &amp; Atlassian OAuth](#figma--atlassian-oauth)
9. [uSpec Extract plugin](#uspec-extract-plugin)
10. [Configuration](#configuration)
10. [Commands](#commands)
11. [First handoff](#first-handoff)
12. [Component spec](#component-spec)
13. [SlideV deck](#slidev-deck)
14. [Troubleshooting](#troubleshooting)
15. [Agents](#agents)
16. [Rules](#rules)
17. [Pipeline](#pipeline)
18. [Design systems](#design-systems)

---

## IDE support

Mr. Handy ships the same rules and agent specs, but the execution layer adapts to whichever IDE hosts the conversation.

| Capability | Cursor | Claude Code / Codex |
|---|---|---|
| Rules / guardrails | `.cursor/rules/*.mdc` | `skills/mr-handy-handoff/SKILL.md` + rule references |
| Figma read | Figma Console MCP (OAuth) | `figma.use_figma` native plugin |
| Figma write | Figma Console MCP (OAuth) | `figma.use_figma` native plugin |
| Browser / runtime verify | MCP screenshot tools | Browser plugin + Playwright + Node REPL |
| Subagent orchestration | `.cursor/agents/*.md` | Real `multi_agent` subagents |

---

## Capabilities

- **Figma reads** — design context, 1440px screenshots, variables, component search, icon export.
- **Figma writes** — Mode B canvas handoffs, SpecCard instances, annotation frames, per-component renders.
- **Structured analysis** — per-screen SpecCards, area specs, Note Cards, scenario coverage matrices.
- **Quality gates** — self-lint, humanizer pass, token-or-flag, coverage recomputation, open/resolved split.
- **Per-component specs** — vendored uSpec extractor + interpreter chain for anatomy, API, color, structure, voice, motion.
- **SlideV decks** — Apple-keynote-style decks from handoffs with brand palette binding and PDF/PPTX export.

---

## Output tracks

| Track | Artifact | Command | IDE |
|---|---|---|---|
| Per-screen flow | `Handoff-{Flow}.md` + `.html` + screenshots + optional Figma canvas | `/handoff-create` | Cursor + Claude Code |
| Per-component spec | `components/{slug}.md` + optional Figma-native frames | `/handoff-component` | Cursor + Claude Code |
| SlideV deck | `presentations/{slug}/slides.md` + `style.css` + export | `/handoff-deck` | Cursor + Claude Code |
| Self-audit | `Knowledge/run-log/audits/audit-{date}.md` | `/handoff-self-audit` | Cursor + Claude Code |

---

## Prerequisites

- **Cursor** (recent) *or* **Claude Code / Codex**
- **Node.js** ≥ 18
- **Figma account** (and optionally **Atlassian account**) — both use OAuth; the IDE opens a browser on first use, you click **Allow**, the token is cached. No PAT, no email, no API token.
- **Figma Desktop** — required only if you'll use `/handoff-component` (the uSpec Extract plugin is desktop-only).

---

## Install

Clone the repo and run the setup wizard.

```bash
# Clone
git clone <repo-url> mr-handy
cd mr-handy

# Windows
Setup-MrHandy.bat

# macOS / Linux / WSL
chmod +x setup-mrhandy.sh
./setup-mrhandy.sh

# Direct (any platform)
node setup-mrhandy.mjs
```

The wizard is idempotent. For headless / CI:

```bash
node setup-mrhandy.mjs --auto --force
```

The wizard runs silently by default — no readline prompts, placeholders are valid, re-runs overwrite. Figma and Atlassian use OAuth, so there's no PAT to set. Pass `SETUP_INTERACTIVE=1` (or run `node setup-mrhandy.mjs` with no flags) to walk the full menu instead.

---

## Cursor setup

1. Run the setup wizard so it writes `.cursor/mcp.json` with the Figma OAuth MCP entry.
2. Restart Cursor so the MCP servers boot from `.cursor/mcp.json` and the browser opens to Figma for OAuth sign-in.
3. Open the Mr. Handy repo in Cursor; the rules under `.cursor/rules/` auto-load.
4. (For `/handoff-component` only) Import the uSpec Extract plugin — see below.

---

## Claude Code setup

1. Run the same setup wizard so `mr-handy.config.json` and the Figma plugin are ready.
2. In Claude Code, point the conversation at the repo root.
3. Invoke the portable skill: `Use $mr-handy-handoff` and name the track (`flow`, `component`, `deck`, `compare`, `update`, `audit`).
4. The skill spawns real subagents and uses the native `figma.use_figma` plugin for reads and writes.

---

## Figma & Atlassian OAuth

Figma and Atlassian both use OAuth. The wizard wrote the OAuth MCP endpoints into every IDE's `mcp.json` for you — there is no PAT, no email, and no API token to paste. The IDE opens a browser the first time it calls each MCP and you sign in there.

- **Figma** — the browser opens to `https://figma-console-mcp.southleft.com`. Sign in with Figma and click **Allow**. Subsequent calls use the cached token.
- **Atlassian (opt-in)** — the browser opens to `https://mcp.atlassian.com`. Sign in with your Atlassian account and click **Allow**. Subsequent calls use the cached token.

To re-enable Atlassian later (or disable it), re-run the interactive wizard — Step 2.5 asks one y/N question and the rest is unchanged.

> **No Desktop Bridge plugin needed.** The previous Mr. Handy release shipped a separate "Figma Desktop Bridge" plugin to bridge the Console MCP into Figma Desktop. With the switch to OAuth / Remote SSE, the Figma Console MCP talks directly to Figma's cloud — that plugin is gone.

## uSpec Extract plugin (per-component path only)

The `/handoff-component` track runs Mr. Handy's vendored **uSpec Extract** plugin against the selected Figma component. The wizard builds it in Phase 4; this is the one-time manual import in Figma Desktop.

1. Open Figma Desktop (not the web app — plugin development is desktop-only) and any file.
2. Go to **Plugins → Development → Import plugin from manifest…**
3. Select `figma-plugin/manifest.json` from the repo root.
4. Run **uSpec Extract** on a `COMPONENT` or `COMPONENT_SET`.

---

## Configuration

All runtime settings live in `mr-handy.config.json`. The schema is in `mr-handy.config.schema.json`.

```json
{
  "$schema": "./mr-handy.config.schema.json",
  "project": {
    "name": "Your Project",
    "brand": "Your Brand"
  },
  "designSystem": {
    "name": "fluent-2",
    "chipPrefix": "@fluentui/react-components",
    "figmaLibraryKey": "REPLACE_WITH_LIBRARY_FILE_KEY"
  },
  "figmaTemplate": {
    "fileKey": "YOUR_TEMPLATE_FILE_KEY",
    "speccardComponentKey": "YOUR_COMPONENT_SET_KEY"
  },
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

Built-in design systems: `carbon`, `fluent-2`, `material`, `apple-hig`, and `custom`.

---

## Commands

| Command | Track | What it does |
|---|---|---|
| `/handoff-create` | Per-screen | New flow handoff from a Figma URL. |
| `/handoff-update` | Per-screen | Refresh an existing handoff after design changes. |
| `/handoff-compare` | Per-screen | Diff two versions and merge forward. |
| `/handoff-component` | Per-component | Generate `components/{slug}.md` from a `_base.json` extraction. |
| `/handoff-deck` | Deck | Generate a SlideV deck from a completed handoff. |
| `/handoff-self-audit` | Meta | Read the run-log corpus and propose rule edits. |

---

## First handoff

Paste a Figma frame URL and ask for a handoff.

**Cursor:**
```
Make me a handoff for this Figma file. Mode A, please — Markdown + HTML + screenshots.
```

**Claude Code:**
```
Use $mr-handy-handoff to run the flow track on <Figma URL>.
```

Mr. Handy will greet you, confirm scope, run Flow Mapping, spawn parallel screen analyzers, build the Scenario Coverage Matrix, and generate the artifacts.

---

## Component spec

1. Build the uSpec extractor plugin:
   ```bash
   cd figma-plugin
   npm install
   npm run build
   ```
2. In Figma Desktop, import `figma-plugin/manifest.json` as a development plugin.
3. Select a `COMPONENT` or `COMPONENT_SET` and run **uSpec Extract** to write `{slug}-_base.json`.
4. Run `/handoff-component` and provide the component link and the path to `_base.json`.

---

## SlideV deck

After a handoff is complete, generate a deck:

```
/handoff-deck
```

Or in Claude Code:

```
Use $mr-handy-handoff to create a deck from the handoff we just built.
```

Mr. Handy reads the source handoff, copies the Apple-keynote template, binds the brand palette, and emits a ready-to-export SlideV package.

```bash
cd presentations/{project-slug}
npm install
npm run dev        # preview
npm run export:pdf # PDF export
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Figma read times out / no plugin connected | Sign in to `figma-console-mcp.southleft.com` in the browser the first time the IDE calls Figma. Token is cached afterwards; re-Allow if it expires. |
| MCP servers don't appear | Restart Cursor after `setup-mrhandy.mjs` writes `.cursor/mcp.json`. |
| `node` not found | Install Node ≥ 18 and restart your terminal / IDE. |
| Config validation fails | Run `node setup-mrhandy.mjs --doctor` and fix schema errors. |
| Atlassian block is in my mcp.json but I don't use it | Re-run the interactive wizard (`SETUP_INTERACTIVE=1`) and answer `n` to Phase 2.5. |
| uSpec Extract won't build | Run `cd figma-plugin && npm install && npm run build`. |
| Deck export fails | Install dependencies with `npm install` inside the deck folder first. |

---

## Agents

| Agent | Role |
|---|---|
| `mr-handy-screen-analyzer` | Structured per-screen analysis JSON. |
| `mr-handy-scenario-auditor` | Coverage matrix + gap analysis. |
| `mr-handy-doc-generator` | DESIGN.md, Markdown, and HTML generation. |
| `mr-handy-figma-builder` | Sequential Mode B canvas construction. |
| `mr-handy-component-orchestrator` | Seven-phase per-component spec workflow. |
| `mr-handy-deck-creator` | SlideV deck generation from handoffs. |
| `mr-handy-self-auditor` | Run-log analysis + rule-edit proposals. |
| `mr-handy-atlassian-explorer` | Jira / Confluence context. |

---

## Rules

Rules live in `.cursor/rules/` and are the source of truth for both IDEs; the portable skill loads them as references.

- `mr-handy-core.mdc` — identity, loop, intent router, hard guardrails.
- `mr-handy-commands.mdc` — command flow and phases.
- `mr-handy-figma.mdc` — Mode B canvas rules.
- `mr-handy-deck.mdc` — SlideV deck rules.
- `mr-handy-output.mdc` — output modes and validation.
- `mr-handy-knowledge-md.mdc` — Markdown + DESIGN.md rules.
- `mr-handy-humanizer.mdc` — AI-writing-tell guardrails.
- `mr-handy-mcp.mdc` — Figma MCP routing.
- `mr-handy-uspec.mdc` — per-component generation rules.

---

## Pipeline

The portable orchestrator runs a 5-phase pipeline:

1. **Intake & pre-flight** — parse config, collect Figma URL, lock scope.
2. **Design baseline** — create/update DESIGN.md.
3. **Analysis** — screen analyzer reads every assigned screen.
4. **Audit & build** — scenario auditor + doc generator (+ optional figma builder).
5. **Review gate & delivery** — assert scope lock, gate stamps, recomputed coverage; specialist pass; run-log + delivery report.

See `skills/mr-handy-handoff/references/orchestrator-pipeline.md` for the full contract and retry policy.

---

## Design systems

| Name | System | Chip prefix |
|---|---|---|
| `carbon` | IBM Carbon | `@carbon/react` |
| `fluent-2` | Microsoft Fluent 2 | `@fluentui/react-components` |
| `material` | Material Design 3 | `@mui/material` |
| `apple-hig` | Apple Human Interface Guidelines | `@apple/SwiftUI` |
| `custom` | Bring your own | your prefix |

---

*Generated from the Mr. Handy repo. Source files: `docs/`, `.cursor/rules/`, `.cursor/agents/`, `Commands/`, `skills/mr-handy-handoff/`.*
