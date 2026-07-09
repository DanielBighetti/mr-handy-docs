# How It Works

Mr. Handy is **two pipelines in one repo**, sharing identity, knowledge, and Figma access. This page is the map: what each pipeline does, what runs in parallel, where the gates are, and what comes out the other end.

---

## The processing loop (every chat turn)

Every user message goes through the same four-phase loop, defined in [`../.cursor/rules/mr-handy-core.mdc`](../.cursor/rules/mr-handy-core.mdc):

```
REASON  →  PLAN  →  GATHER + EXECUTE  →  CONTINUE
```

| Phase | What it does |
|---|---|
| **REASON** | What is the user asking? Continuation or new? What context do I already have? |
| **PLAN** | Which command/skill/agent? Sequential (1–2 screens) or parallel (3+)? |
| **GATHER + EXECUTE** | Spawn agents in parallel where it pays off. Checkpoint output quality. Reroute (max 2) if the first run is poor. |
| **CONTINUE** | Present results with a Scenario Coverage Matrix. Suggest 1–2 next steps. |

Phases never get skipped. Reroute caps prevent silent retries that hide bad output.

---

## Per-screen flow

A multi-screen handoff goes through six explicit phases. Specifics live in [`../Commands/Create-Handoff.md`](../Commands/Create-Handoff.md) and [`../Commands/_Handoff-Engine.md`](../Commands/_Handoff-Engine.md).

### The phase bar

![Per-screen phase bar — Greeting → Flow mapping → Screen analysis → Coverage matrix → Notes synth → Output gen → Validation](../assets/screenshots/pipeline-bar.svg)

> _Phase-bar composite is rendered as SVG by [`../scripts/capture-screenshots.mjs`](../scripts/capture-screenshots.mjs). To get a `.png` copy alongside the others, run `npm install --no-save playwright` once and re-run the script — it converts the SVG to PNG via headless Chromium._

### Phase 0 — Greeting & intake (Plan mode)

`mr-handy-greeting.mdc` runs. Mr. Handy asks (via `AskQuestion`):

- Per-screen handoff or per-component spec?
- Which Figma URL?
- Mode A (local files) or Mode B (Figma canvas)?
- Product type — `interactive` / `dataviz` / `marketing` / `crud` / `design-system`
- Brand / project context (read from `mr-handy.config.json` if not stated)
- Optional: linked Jira EPIC for source-of-truth reconciliation

### Phase 0.5 — Flow Mapping

Mr. Handy lists every frame in the Figma file scope, classifies each as in-scope vs out-of-scope, and asks the user to confirm. **No analysis runs without explicit scope confirmation** — this is a hard guardrail in `mr-handy-core.mdc`.

### Phase 1 — Screen analysis (parallel for 3+ screens)

For each in-scope screen, a `mr-handy-screen-analyzer` subagent:

- Downloads the screenshot via Figma Console MCP (read path)
- Resolves all token bindings via `get_variable_defs`
- Cross-checks layer names against the rendered image (mandatory — frame names alone are never authoritative)
- Emits a structured JSON block per screen with elements, SpecCards, Notes candidates, and uncovered gaps

Conflicts (frame name vs Jira EPIC vs spec markdown) are surfaced, never auto-resolved.

### Phase 2 — Scenario Coverage Matrix

`mr-handy-scenario-auditor` builds a matrix of all scenarios (states, edge cases, error variants) the handoff documents. Every uncovered gap becomes an open question Mr. Handy asks the user.

![Scenario Coverage Matrix — real worked example](../assets/screenshots/scenario-coverage-matrix.png)

### Phase 3 — Notes synthesis

Cross-screen rules — thresholds, role permissions, status mappings, business logic — get consolidated into the Notes section. The output style follows the Asset Library / Campaign Builder reference handoffs in `examples/handoffs/` (tables for thresholds; ≤6 bullets per note; no four-deep bullet trees). Anti-pattern: the Performance Dashboard reference, included to show what to avoid.

![Cross-screen rules & notes — real worked example](../assets/screenshots/cross-screen-rules-notes.png)

### Phase 4 — Output generation

Routes by mode:

- **Mode A** — `mr-handy-doc-generator` produces `Handoff-{Flow}.md`, `Handoff-{Flow}.html` (per `Knowledge/html-template.md`), and screenshots under `screenshots/`. The HTML uses the canonical Zoom card layout for SpecCards.

  ![Mode A output — Handoff-{Flow}.html in a browser](../assets/screenshots/mode-a-output.png)

- **Mode B** — `mr-handy-figma-builder` writes a Figma canvas page using the Page Layout Template in [`../.cursor/rules/mr-handy-figma.mdc`](../.cursor/rules/mr-handy-figma.mdc): five-band structure (Left Gutter / optional Nested Area Column / Screen Frame / Right Gutter / Notes Column), the canonical SpecCard component, indicator dots aligned to documented elements. All writes route through Native Figma MCP.

  ![Mode B canvas — SpecCards and Notes placed beside the frames](../assets/screenshots/mode-b-canvas.png)

  Both modes use the same canonical SpecCard component — five fields (Name, Value, Behavior, Description, States):

  ![SpecCard (five-field) — gold-standard render](../assets/screenshots/speccard-five-fields.png)

### Phase 5 — Validation & continuation

The output rules in [`../.cursor/rules/mr-handy-output.mdc`](../.cursor/rules/mr-handy-output.mdc) check:

- **Mode A**: Markdown / HTML present, screenshots resolve, coverage matrix complete, annotation counts consistent across artifacts, HTML follows the template
- **Mode B**: page exists, layout matches structure, SpecCards use the canonical component, all five fields populated, indicator dots align, post-build verification confirms required sections

Then Mr. Handy presents results with the matrix and proposes 1–2 next steps.

---

## Per-component pipeline (uSpec)

A single component end-to-end. Pipeline lives under `.cursor/skills/uspec/` and is orchestrated by `mr-handy-component-orchestrator`.

### The phase bar

```
  Phase A         Phase B                Phase C            Phase D          Phase E           Phase F
Extraction  →  Specialist interpretation  →  Reconciliation  →  Integrity  →  Render  →  Provenance
(Figma sandbox)  (1 serial + 3 parallel)     (typed gate)      (coverage)    (.md / Figma)   (audit footer)
```

### The fan-out

The four specialists all read from the same cached `_base.json`:

```
                          ┌─→  extract-structure
                ┌─→ cache  │
_base.json  ──→ ├─→ cache  ├─→  extract-color
                │          │
                │          └─→  extract-voice
                │
                └─→  extract-api   (runs first, produces shared property dict)
```

### Phase A — Extraction (Figma plugin sandbox)

The vendored `figma-plugin/` runs **inside** Figma's sandbox — no network access. It walks every variant (no default-variant sampling), resolves library-linked variables with `name`, `codeSyntax`, alias chains, and remote collection metadata, captures inline font properties and text-style IDs, and runs sub-component variant walks for constitutive children.

The designer confirms each top-level child's classification (constitutive / referenced / decorative) before the walk completes.

Output: `_base.json`, validated against the Ajv schema at [`../figma-plugin/docs/base-json-schema.md`](../figma-plugin/docs/base-json-schema.md). Non-zero exit aborts the run.

### Phase B — Specialist interpretation

Four specialists run against the cached `_base.json`:

1. **`extract-api`** (serial, first) — produces the shared property dictionary used by every other specialist
2. **`extract-structure`** + **`extract-color`** + **`extract-voice`** (parallel batch) — each produces a typed JSON output cached under `.uspec-cache/{slug}/`

### Phase C — Reconciliation

A deterministic gate compares the four cache files. Typed disagreements (conflicting child classifications, mismatched axes, missing states) trigger a serial re-dispatch of *only* the specialist that owns the mismatch. `reconciliation.maxRetriesPerSpecialist` in `mr-handy.config.json` caps the retries.

### Phase D — Integrity

Validates cache shapes, axis consistency, and structure coverage matrix completeness (`coverageMatrix.complete === true`).

### Phase E — Render

Two output paths, picked at `/handoff-component` time:

- **Component Markdown** (default) — single `components/{slug}.md` with sections: Overview, API, Structure, Color, Voice / Screen reader, Provenance.
- **Figma-native** — annotation frames placed next to the component, one per spec type (anatomy / property / color / structure / screen-reader / motion / API).

### Phase F — Provenance

The Markdown footer (or the Figma annotation header) records: `_base.json` hash, plugin version, model used, specialist versions, reconciliation verdict.

---

## SlideV deck pipeline

The `/handoff-deck` track turns a completed handoff into a narrative SlideV package.

1. **Intake** — the orchestrator identifies the source `Handoff-{Flow}.md` and reads `mr-handy.config.json` → `presentation`.
2. **Story extraction** — the `mr-handy-deck-creator` agent pulls the flow name, coverage headline, business-rule beats, and open questions into 3-5 story beats.
3. **Template setup** — `templates/slidev-apple-keynote/` is copied into `presentations/{project-slug}/` and the brand palette is bound into `style.css`.
4. **Slide generation** — the agent emits 8-12 Apple-keynote-style slides: title card, pullquote, context, solution, stats grid, flow map, roadmap, closing CTA.
5. **Export** — if requested, `npm install` and `npm run export:pdf` / `export:pptx` run inside the deck folder.

The deck is a story, not a spec: implementation detail stays in the handoff Markdown.

For a live example, see [`../presentations/ntt-brazil-roi/`](../presentations/ntt-brazil-roi/) — a 30-slide ROI deck built end-to-end from a Mr. Handy handoff.

![SlideV deck — Apple-keynote-style rendered example](../assets/screenshots/slidev-deck.png)

---

## Native orchestrator (every IDE)

Cursor runs Mr. Handy through `.cursor/rules/*.mdc` and `.cursor/agents/*.md`. Claude Code runs the same logic through the portable `$mr-handy-handoff` skill. Windsurf / Zed / Cline / Continue use the same shared rules; their only difference is the `mcp.json` shape, which the setup wizard already wrote correctly.

### Same brain, different hands

| Capability | Cursor | Claude Code / Codex | Windsurf / Zed / Cline / Continue |
|---|---|---|---|
| Rules / guardrails | `.cursor/rules/*.mdc` | `skills/mr-handy-handoff/SKILL.md` + rule refs | shared rules |
| Figma read | Figma Console MCP (OAuth) | `figma.use_figma` native plugin | Figma Console MCP (OAuth) |
| Figma write | Figma Console MCP (OAuth) | `figma.use_figma` native plugin | Figma Console MCP (OAuth) |
| Browser / runtime verify | MCP screenshot tools | Browser plugin + Playwright + Node REPL | MCP screenshot tools (when supported) |
| Subagent orchestration | `.cursor/agents/*.md` | Real `multi_agent` subagents | shared rules |
| Pipeline length | 6 phases (per-screen) | 5 phases, 3 sequential senior workers, 2 gates, 1 specialist | same as Cursor |

The portable skill reuses the existing `.cursor/agents/*.md` specs as subagent role prompts, so the screen analysis, scenario audit, doc generation, and deck generation logic does not fork.

See `skills/mr-handy-handoff/SKILL.md` and `skills/mr-handy-handoff/references/orchestrator-pipeline.md` for the full contract and phase map.

---

## Knowledge files

Mr. Handy reads from `Knowledge/` at runtime. Core files:

- `design-systems/{name}.md` — DS-specific reference loaded based on `mr-handy.config.json` → `designSystem.docsPath`. Ships with Fluent 2, Carbon, Material, Apple HIG, plus a `_template.md` for custom systems.
- `design-md/{brand}/DESIGN.md` — public competitor design references. Used when the user says "make it feel like Stripe / Linear / Apple". Many brands included.
- `scenario-coverage.md` — how to build the Scenario Coverage Matrix.
- `annotation-patterns.md` — three SpecCard / Note Card patterns and when to use each.
- `html-template.md` — the HTML output template (Mode A).
- `speccard-examples.md` + `figma-handoff-template.md` — Figma Mode B reference and example SpecCards.
- `product-types.md` — variant guidance per product type.
- `ui-fundamentals.md` + `content-guidelines.md` — universal UX baseline.
- `uspec-changelog.md` — mirrored uSpec changelog (read-only reference for the vendored uSpec version).

---

## Configuration files

- [`../mr-handy.config.json`](../mr-handy.config.json) — runtime config (project, brand, design system, Figma library key, font family, uspec settings)
- [`../mr-handy.config.schema.json`](../mr-handy.config.schema.json) — JSON schema for the config
- [`../.cursor/mcp.json.template`](../.cursor/mcp.json.template) — MCP template (committed). Setup writes `.cursor/mcp.json` from this (gitignored)

---

## Rules

Always-on rules in `.cursor/rules/`:

- `mr-handy-core.mdc` — identity, processing loop, intent router, hard don'ts
- `mr-handy-greeting.mdc` — Phase 0 intake
- `mr-handy-commands.mdc` — command router
- `mr-handy-delegation.mdc` — fan-out thresholds and conflict surfacing
- `mr-handy-design-system.mdc` — DS resolution from `mr-handy.config.json`
- `mr-handy-figma.mdc` — Mode B layout, naming, SpecCard component, page template
- `mr-handy-knowledge-md.mdc` — SpecCard field caps, Notes section style
- `mr-handy-mcp.mdc` — Figma MCP routing (read vs write)
- `mr-handy-output.mdc` — validation, file naming, white-label sweep
- `mr-handy-uspec.mdc` — per-component vendored uSpec pipeline
- `mr-handy-vault.mdc` — RAG knowledge query

---

## Subagents

- `mr-handy-screen-analyzer` — per-screen analysis, parallelized
- `mr-handy-scenario-auditor` — Scenario Coverage Matrix
- `mr-handy-figma-builder` — Mode B canvas writes
- `mr-handy-doc-generator` — Mode A Markdown / HTML output
- `mr-handy-atlassian-explorer` — Confluence / Jira retrieval
- `mr-handy-component-orchestrator` — `/handoff-component` end-to-end driver

---

## Where the lines fall

| Concern | Lives in |
|---|---|
| Identity, brand, DS choice | `mr-handy.config.json` |
| Figma access (OAuth) | `.cursor/mcp.json` (gitignored) |
| Subagent behavior | `.cursor/agents/*.md` |
| Pipeline behavior | `.cursor/rules/*.mdc` and `.cursor/skills/uspec/*` |
| Knowledge | `Knowledge/*.md` and `Knowledge/design-systems/*.md` |
| Examples to copy | `examples/handoffs/{slug}/DESIGN.md` |
| Output | `Handoff-*.md/.html`, `screenshots/`, `components/*.md`, or Figma canvas |

White-label is enforced by the regex sweep in `mr-handy-output.mdc § White-Label Sanity Sweep`. Any branded leak in the active codebase (outside `Archive/`) is a release blocker.
