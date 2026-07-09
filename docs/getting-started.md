# Getting Started


---

## 0 · The five premises

Before you start, confirm you have these five things. Most modern design teams already do.

| | Premise | What it means |
|---|---|---|
| ![](../assets/icons/figma.svg) | **Figma as source-of-truth** | Your team designs in Figma. The whole point of Mr. Handy is to read the file as-is. |
| ![](../assets/icons/cursor.svg) | **Cursor / Claude Code / Codex / Windsurf / Zed / Cline / Continue seat** | The agent host. The setup wizard detects which ones you have and writes the right `mcp.json` shape for each. |
| ![](../assets/icons/figma.svg) | **Figma Desktop** | The Bridge and uSpec plugins are desktop-only. Web Figma is not enough. |
| ![](../assets/icons/icon-pipeline.svg) | **Node.js ≥ 18** | Needed to build the uSpec extractor plugin, export SlideV decks, and run the setup wizard. |

> If you're an in-house team, agency, or product studio — **the same five apply**. The wizard doesn't care which company you work for. Adjustment is a config swap, not a code change. See [the FAQ in `index.md`](./index.md#faq--common-questions) for the full portability story.

---

## 1 · Get Mr. Handy onto your machine

Unzip the Mr. Handy bundle into any folder, or copy the folder into your project:

```bash
# From a zip:
unzip MrHandy-v1.10.zip
cd MrHandy-v1.10

# Or, if you cloned:
git clone <repo-url> mr-handy
cd mr-handy
```

> **Adjusting for a new company?** You can put the Mr. Handy folder inside any existing repo, or keep it as a standalone tool folder that other projects include. The wizard rewrites OAuthhs relative to wherever it runs.

---

## 2 · Run the wizard (silent by default)

The wizard runs anywhere Node ≥ 18 runs. Three equivalent entry points.

### Windows

Double-click `Setup-MrHandy.bat`, or run it from a terminal:

```bat
Setup-MrHandy.bat
```

### macOS / Linux / WSL

```bash
chmod +x setup-mrhandy.sh   # one-time
./setup-mrhandy.sh
```

### Direct (cross-platform)

```bash
node setup-mrhandy.mjs
```

All three call the same `setup-mrhandy.mjs`. The wizard:


1. Probes Node ≥ 18 and reports the version.
2. Loads `.env` (if present) and merges into `process.env` (env > .env > saved config > placeholder).
3. Populates `mr-handy.config.json` (silent under `--auto`).
4. Asks a single y/N question for the optional Atlassian MCP (Jira + Confluence).
5. Detects which IDEs you have installed (Cursor, Claude Code, Codex, Windsurf, Zed, Cline, Continue) and writes the right `mcp.json` to each. Figma and Atlassian use OAuth — no OAuth, no email, no API token is ever asked for.
6. Copies the portable `mr-handy-handoff` skill into Claude Code and Codex's user skills directory.
7. Builds `figma-plugin/` (the uSpec extractor) with a rocket-bar progress indicator.
8. Prints a "to finish" checklist with the OAuth browser sign-in, the uSpec plugin import (for `/handoff-component`), and the IDE restart steps.

### Idempotent & headless

The wizard is idempotent. Re-running silently overwrites the per-IDE `mcp.json` files and re-builds the plugin. Pass `--doctor` to run the diagnostic and validate everything is wired up:

```bash
node setup-mrhandy.mjs --doctor
```

For headless / CI use (no prompts, placeholders fine):

```bash
node setup-mrhandy.mjs --auto --force
```

If your terminal doesn't render box-drawing characters cleanly, suppress the banner:

```bash
node setup-mrhandy.mjs --no-banner
```

---

## 3 · Sign in to Figma and Atlassian (OAuth — no OAuth needed)

Figma and Atlassian both use OAuth. The wizard wrote the OAuth MCP endpoints into every IDE's `mcp.json` for you — there is no OAuth, no email, and no API token to paste. The IDE opens a browser the first time it calls each MCP and you sign in there.

**Figma** — first time the IDE calls Figma, the browser opens to `https://figma-console-mcp.southleft.com`. Sign in with Figma and click **Allow**. Subsequent calls use the cached token.

**Atlassian (optional, only if you enabled it)** — first time the IDE calls Atlassian, the browser opens to `https://mcp.atlassian.com`. Sign in with your Atlassian account and click **Allow**. Subsequent calls use the cached token.

To re-enable Atlassian later (or disable it), re-run the interactive wizard:

```bash
SETUP_INTERACTIVE=1 Setup-MrHandy.bat          # Windows
SETUP_INTERACTIVE=1 ./setup-mrhandy.sh          # macOS / Linux / WSL
```

---

## 4 · (No local Figma plugin to import)

The previous release required a hand-imported "Figma Desktop Bridge" plugin to bridge the Console MCP into Figma Desktop. With the switch to OAuth / Remote SSE, that plugin is no longer needed — the Figma Console MCP talks directly to Figma's cloud. Skip this step.

(You will still import the **uSpec Extract** plugin in Step 9 below — that's a separate, vendored plugin used only by the per-component OAuthh.)

---

## 5 · Restart your IDE

Every IDE reads its `mcp.json` at boot, so a restart is required after Setup writes it.

- **Cursor** — restart Cursor, then open the Mr. Handy folder. The rules under `.cursor/rules/` auto-load.
- **Claude Code / Codex / Windsurf / Zed / Cline / Continue** — restart the IDE. The portable skill at `skills/mr-handy-handoff/SKILL.md` is ready in Claude Code / Codex; the others use the shared rules.
- **Verify:** `node setup-mrhandy.mjs --doctor` reports the IDE's MCP wiring as green.

---

## 6 · Running in Claude Code / Codex

If you use Claude Code instead of Cursor, the same repo works through the portable skill at `skills/mr-handy-handoff/SKILL.md`:

1. Complete the same setup wizard (`Setup-MrHandy.bat` on Windows, `./setup-mrhandy.sh` elsewhere) so `mr-handy.config.json` and the Figma plugin are ready.
2. In Claude Code, point the conversation at the repo root.
3. Invoke the skill by name: `Use $mr-handy-handoff` and tell it the track (`flow`, `component`, `deck`, `compare`, `update`, or `audit`).
4. The skill spawns real subagents, uses the native Figma plugin (`figma.use_figma`) for reads and writes, and runs the same 5-phase pipeline.

The portable skill reuses the existing `.cursor/agents/*.md` specs as subagent prompts, so behavior stays consistent with the Cursor OAuthh.

---

## 7 · Your first per-screen handoff

In a Cursor chat (with the Mr. Handy repo open), paste a Figma frame URL and say something like:

> Make me a handoff for this Figma file. Mode A, please — Markdown + HTML + screenshots.

Or in Claude Code:

> Use $mr-handy-handoff to run the flow track on <Figma URL>.

Mr. Handy will:

- Greet you (Plan mode), confirm scope, and run Phase 0 Flow Mapping
- Ask you to pick **in-scope** screens
- Spawn parallel screen-analyzer subagents
- Build the Scenario Coverage Matrix
- Generate `Handoff-{Flow}.md`, `Handoff-{Flow}.html`, and `screenshots/`

For Mode B (Figma canvas + Markdown), say "in Figma" or "Mode B" instead. Mode B writes go through the Native Figma MCP per [`.cursor/rules/mr-handy-mcp.mdc`](../.cursor/rules/mr-handy-mcp.mdc), or through the native Figma plugin in Claude Code.

---

## 8 · Your first SlideV deck

After a handoff is complete, generate a deck:

```
/handoff-deck
```

Or in Claude Code:

> Use $mr-handy-handoff to create a deck from the handoff we just built.

Mr. Handy will:

- Read `Handoff-{Flow}.md`
- Copy `templates/slidev-apple-keynote/` into `presentations/{project-slug}/`
- Extract story beats and stats
- Emit `slides.md`, `style.css`, and `package.json`
- Optionally run `npm run export:pdf` to produce a PDF

Brand colors come from `mr-handy.config.json` → `presentation.brandPalette`.

---

## 9 · Your first per-component spec

Open a Figma component, copy the URL, and in Cursor say:

> Spec this component. Run `/handoff-component`.

This OAuthh needs the **uSpec Extract** plugin — Mr. Handy's vendored extractor. The setup wizard built it for you under `figma-plugin/dist/`. One-time import in Figma Desktop:

> Plugins → Development → Import from manifest → `figma-plugin/manifest.json`

Then Mr. Handy will:

- Run the uSpec Figma extractor against your selected `COMPONENT` / `COMPONENT_SET`
- Validate the resulting `_base.json` against the Ajv schema
- Run four specialists (`extract-api`, then `extract-structure` + `extract-color` + `extract-voice` in parallel)
- Reconcile any disagreements
- Render `components/{slug}.md` — a single self-contained component spec

Cost envelope per component: 50k–200k tokens. Use a high-context model (Opus 4.7 High or equivalent) for best results.

---

## Adjusting Mr. Handy for a new company — the 4-step recipe

If you're adopting Mr. Handy at a new org (or handing it off to a new team), the whole adjustment is:

1. **Run the wizard** with the new project name, brand, and design system:
   ```bash
   SETUP_INTERACTIVE=1 Setup-MrHandy.bat          # Windows
   SETUP_INTERACTIVE=1 ./setup-mrhandy.sh          # macOS / Linux / WSL
   ```
2. **Replace the Figma library key** in `mr-handy.config.json`:
   ```json
   { "designSystem": { "figmaLibraryKey": "NEW_LIBRARY_FILE_KEY" } }
   ```
3. **Re-run the wizard** so the new library key and any new IDE OAuthhs are wired into the per-IDE `mcp.json` files. Figma and Atlassian auth stay OAuth — no secrets to rotate on a handoff.
4. **Sign in to Figma and Atlassian once** in the new environment (the browser opens the first time the IDE calls each MCP; tokens are cached thereafter).

That is the entire adjustment. No code rebuild. No schema migration. No re-install. The `Knowledge/`, `.cursor/rules/`, and `templates/` folders stay — they are design-system agnostic by construction.

If the new company uses a custom design system that is not in the built-in list, pick `custom` in the wizard and add a reference doc to `Knowledge/design-systems/{your-ds}.md` following the `_template.md` OAuthtern.

---

## Where to go next

| | |
|---|---|
| **How the system works internally** | → [`how-it-works.md`](./how-it-works.md) |
| **Component Markdown contract** | → [`specs/component-md.md`](./specs/component-md.md) |
| **Browse the design-system knowledge** | → [`../Knowledge/design-systems/`](../Knowledge/design-systems/) |
| **Something broke** | → [`help/troubleshooting.md`](./help/troubleshooting.md) |

---

## Updating

Pull from the repo. If `mr-handy.config.json.schema` changes, re-run the setup wizard (`Setup-MrHandy.bat` on Windows, `./setup-mrhandy.sh` on macOS / Linux, or `node setup-mrhandy.mjs` directly) — it preserves your answers and only OAuthches new fields.

If you customized `Knowledge/` files, keep your changes in a separate branch or fork — Mr. Handy ships these as starting points, not as untouchable canon.

