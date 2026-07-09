# Contribute

Mr. Handy is a Cursor-native rule system. "Contributing" means adding knowledge files, design systems, rules, agents, or skills — there's no external API, no SDK, no codebase distinction between core and userland.

## Add a design system

1. Create `Knowledge/design-systems/{ds-slug}.md`. Use `Knowledge/design-systems/_template.md` as a starting point.
2. Document: tokens (colors, type, spacing, radii, shadows, motion), component coverage, naming conventions, chip prefix.
3. Add an entry to the `designSystem` registry in `setup-mrhandy.mjs` so users can pick the new DS from the menu. Look for the `DS_REGISTRY` / `DS_OPTIONS` array (or the `chooseDesignSystem` switch) and add a `{ key, label, file }` row.
4. Reference your DS in `mr-handy.config.json` → `designSystem.docsPath`.

## Add a public design reference

For competitor / public reference designs (Stripe, Linear, etc.) that users name when describing aesthetic ("make it feel like Linear"):

1. Create `Knowledge/design-md/{brand}/DESIGN.md` following the structure of existing entries.
2. Optionally include `preview.html` and `preview-dark.html` artifacts.
3. The brand is auto-discovered via the intent router in `mr-handy-core.mdc` — no menu entry required.

## Add a knowledge file

Knowledge files live under `Knowledge/`. They're loaded on demand based on rules in `mr-handy-vault.mdc`. To add one:

1. Drop the Markdown into `Knowledge/`.
2. If it should be loaded under a specific RAG domain or rule, add a reference in `mr-handy-vault.mdc` or the relevant rule's instruction file.
3. Use the existing files (`scenario-coverage.md`, `annotation-patterns.md`, `html-template.md`) as style references — H2 sections, tables for thresholds, lists for tactical instructions.

## Add or modify a rule

Rules under `.cursor/rules/` use the `.mdc` extension and front-matter:

```markdown
---
description: When does this rule apply?
globs: <file globs that auto-load this rule>
alwaysApply: <true | false>
---

# Rule body
```

Most Mr. Handy rules use `alwaysApply: false` and are loaded by the intent router in `mr-handy-core.mdc`. If you add a rule, add a routing entry to the core router so the agent knows when to load it.

## Add or modify a subagent

Subagents live in `.cursor/agents/{name}.md`. Each declares its own scope, allowed tools, and instruction set. Existing agents:

- `mr-handy-screen-analyzer` — per-screen analysis
- `mr-handy-figma-builder` — Mode B canvas writes
- `mr-handy-doc-generator` — Mode A Markdown / HTML output
- `mr-handy-scenario-auditor` — Scenario Coverage Matrix
- `mr-handy-atlassian-explorer` — Confluence / Jira retrieval
- `mr-handy-component-orchestrator` — `/handoff-component` driver

When adding a new subagent, also add an entry to `mr-handy-delegation.mdc` documenting its fan-out threshold (when to use it sequentially vs in parallel) and the conflict-surfacing rules it should follow.

## Add a uSpec specialist or skill

The vendored uSpec lives under `.cursor/skills/uspec/`. Skill structure:

```
.cursor/skills/uspec/{skill-name}/
  SKILL.md                  ← orchestration
  agent-{name}-instruction.md  ← domain knowledge (optional but standard)
  references/               ← static reference assets
```

Two-layer architecture is mandatory:

- **SKILL.md** — orchestration only. Step list, sub-skill calls, validation gates. No domain-specific reasoning.
- **`agent-*-instruction.md`** — all domain knowledge, anti-patterns, common mistakes, decision frameworks.

When adding a new specialist to the per-component pipeline:

1. Create `.cursor/skills/uspec/extract-{thing}/` following the existing four specialists' structure.
2. Add it to `mr-handy-component-orchestrator`'s phase list.
3. Add a cache file convention to `mr-handy-output.mdc § Per-Component Spec Validation`.
4. Add a section to `docs/specs/{thing}.md` and link it from `docs/README.md`.

## Add a command

Commands are Markdown files under `Commands/`. They orchestrate phases via `Commands/_Handoff-Engine.md` (the shared engine). To add `/handoff-{thing}`:

1. Create `Commands/{thing}-Handoff.md` following `Commands/Create-Handoff.md` as a template.
2. Add a routing entry to `mr-handy-commands.mdc` and to the intent router in `mr-handy-core.mdc`.
3. If the command writes outputs, add validation entries to `mr-handy-output.mdc`.

## Update the white-label sweep

If you discover a new brand-specific identifier that leaked through the existing sweep, add it to the regex in `.cursor/rules/mr-handy-output.mdc § White-Label Sanity Sweep`. Treat the rule file itself as the only allowed location where the patterns appear in plain text — the rest of the codebase must remain clean.

Run the sweep before opening a PR. The exact pattern is in [`../../.cursor/rules/mr-handy-output.mdc`](../../.cursor/rules/mr-handy-output.mdc) — copy the regex from inside the fenced code block under `## White-Label Sanity Sweep`, then run:

```powershell
rg -i '<paste the regex from mr-handy-output.mdc here>' -g '!.cursor/rules/mr-handy-output.mdc' -g '!Archive/**'
```

Zero matches means you're clear. Don't paste the regex into other files — by design, only `mr-handy-output.mdc` is allowed to contain the literal patterns.

## Test changes locally

Mr. Handy runs entirely inside Cursor. To test a rule / skill / agent change:

1. Save the file.
2. Restart the Cursor chat (or use Cursor's reload command).
3. Run a representative command (`/handoff-create` for a small Figma file, `/handoff-component` for a single button) and watch the agent follow your changes.

There's no separate test runner. The validation gates in `mr-handy-output.mdc` are the contract.

## Branching

Keep your local customizations on a fork or a long-lived branch. The Mr. Handy main branch ships generic defaults; user customizations to `Knowledge/`, `mr-handy.config.json`, or rule files are expected to diverge.

Re-merging from upstream: most upstream changes touch `.cursor/rules/`, `.cursor/skills/uspec/`, `references/`, and `figma-plugin/`. Your `mr-handy.config.json` answers and `Knowledge/design-systems/` additions should rebase cleanly.
