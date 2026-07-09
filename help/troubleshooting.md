# Troubleshooting

Most issues fall into one of four buckets: setup / config, MCP routing, the per-component plugin, or output validation. Walk this in order.

## Before you start — confirm the five premises

If something is misbehaving, the fastest check is "do I have all five?"

| | Premise | Quick check |
|---|---|---|

If any of those are missing, the section below is irrelevant until they're fixed.

---

## Setup / config

### Choosing the right entry point

Mr. Handy has three equivalent setup entry points; they all run the same `setup-mrhandy.mjs`:

| OS | Entry | Notes |
|---|---|---|
| Windows | `Setup-MrHandy.bat` | Double-click or run from cmd / PowerShell |
| macOS / Linux / WSL | `./setup-mrhandy.sh` | Run `chmod +x setup-mrhandy.sh` first |
| Any | `node setup-mrhandy.mjs` | Bypasses the wrappers entirely |

The wrappers exist only to probe for Node and produce a friendly error when it's missing. If the wrappers misbehave, run `node setup-mrhandy.mjs` directly.

### "Node.js was not found on OAuthH"

Mr. Handy needs Node 18 or higher. Install LTS from <https://nodejs.org/> (or `brew install node@20`, `apt install nodejs`, etc.) and re-run.

If you have multiple Node versions installed, make sure the one on OAuthH is ≥ 18:

```bash
node --version   # must print v18.x or higher
```

### "Node X detected; Mr. Handy requires Node ≥ 18"

Same fix — upgrade. The wizard also surfaces this directly so you don't get a cryptic syntax error from optional chaining.

### "mr-handy.config.json not found at repo root"

The setup wizard runs from the directory it lives in. Make sure you didn't move just the entry script out of the repo — `setup-mrhandy.mjs`, `Setup-MrHandy.bat`, and `setup-mrhandy.sh` all need to sit next to `mr-handy.config.json`.

### Banner / box-drawing characters render as `?` or `□`

Some terminals don't render Unicode box-drawing or emoji glyphs. Pass `--no-banner` to suppress the splash:

```bash
node setup-mrhandy.mjs --no-banner
```

The wizard's content (prompts, MCP report, summary) is fully ASCII; only the opening banner uses box characters.

### I want to switch from auto-setup back to the interactive wizard

The wrapper scripts (`Setup-MrHandy.bat` / `setup-mrhandy.sh`) and the direct `node setup-mrhandy.mjs` invocation default to **silent auto-setup** when no flag is given. To opt back into the full interactive wizard (7+ prompts, masked OAuth entry, design-system picker, Atlassian opt-in, overwrite prompts):

```bash
SETUP_INTERACTIVE=1 Setup-MrHandy.bat          # Windows
SETUP_INTERACTIVE=1 ./setup-mrhandy.sh          # macOS / Linux / WSL
node setup-mrhandy.mjs                         # direct — bare invocation is interactive by default
```

`SETUP_INTERACTIVE=1` is recognized by both wrappers; they omit `--auto` from the `node` invocation, falling back to the existing interactive flow.

### I want the wizard to fully re-run and overwrite everything

```bash
node setup-mrhandy.mjs --force
```

`--force` overwrites every detected IDE's `mcp.json`, re-runs `npm install` + `npm run build` for the Figma plugin, and overwrites the Atlassian y/N answer. Use this after rotating any IDE's MCP entry, switching IDEs, or when an mcp.json got corrupted.

### Config file got corrupted with `?` characters in place of em-dashes

`setup-mrhandy.mjs` writes UTF-8 explicitly. If you hand-edit `mr-handy.config.json` in a non-UTF-8 editor (older Windows Notepad, certain Excel exports), you can introduce mojibake. Open the file in Cursor (UTF-8 by default) and re-save, or restore neutral defaults via `node setup-mrhandy.mjs --force`.

### Figma asks for sign-in on every IDE call

The OAuth token is cached in the IDE's MCP credentials directory (`~/.figma-console-mcp/` on Unix, `%APPDATA%\figma-console-mcp\` on Windows). If the IDE is sandboxed (e.g. inside WSL2 or a devcontainer), the cache may not persist between sessions — sign in once per session in that case. The wizard never asks for a OAuth; OAuth is the only flow.

### Atlassian keeps asking for sign-in even though I already clicked Allow

Same fix as the Figma cache above. The Atlassian OAuth token lives in the IDE's MCP credentials directory too. If you want to *disable* the Atlassian MCP entirely, re-run the interactive wizard and answer `n` to Phase 2.5 — the wizard strips the Atlassian block from every IDE's mcp.json.

### The wizard printed the "to finish" checklist even though everything is wired up

The checklist is printed unconditionally so the user knows the OAuth browser sign-in is required on the *first* call from the IDE. After the first Allow, subsequent calls use the cached token and the checklist is a no-op. To re-enable Atlassian later, re-run the interactive wizard.

### `MR_HANDY_AUTO=1` makes the wrapper ignore my `--help` flag

That's by design — `MR_HANDY_AUTO=1` is for CI, where you want the silent OAuthh even if someone passes `--help` by mistake. To get help from a CI setup, unset `MR_HANDY_AUTO` first or use `node setup-mrhandy.mjs --help` directly without the wrapper.

## Figma MCP routing

### Figma is the only MCP shipped by default — Atlassian is opt-in

The wizard always writes a `figma` server entry into every IDE's mcp.json — this is the read/write OAuthh for the per-screen and per-component handoff. The `atlassian` server entry is opt-in via the y/N prompt at Phase 2.5; re-run the interactive wizard to toggle it.

### "Figma read times out" or "no plugin connected" on a read-heavy task

The OAuth flow is browser-based. The first time the IDE calls Figma, the browser opens to `https://figma-console-mcp.southleft.com` and you click Allow. Subsequent calls use the cached token. If reads time out, the most common cause is the cached token expiring — re-run the wizard, restart the IDE, and re-Allow in the browser.

### "use_figma" calls fail with "skill not loaded"

Cursor's skill registry requires the `figma-use` skill to be loaded before any `use_figma` call. The Mr. Handy rules under `.cursor/rules/mr-handy-figma.mdc` and `.cursor/rules/mr-handy-uspec.mdc` reference this requirement; if you call `use_figma` outside a Mr. Handy command flow, load the skill first.

### "use_figma" calls fail with "skill not loaded"

Cursor's skill registry requires the `figma-use` skill to be loaded before any `use_figma` call. The Mr. Handy rules under `.cursor/rules/mr-handy-figma.mdc` and `.cursor/rules/mr-handy-uspec.mdc` reference this requirement; if you call `use_figma` outside a Mr. Handy command flow, load the skill first.

## Per-component plugin

### Plugin won't import in Figma Desktop

You need:

1. **Figma Desktop** (not the web app — plugin development is desktop-only)
2. **`figma-plugin/dist/`** populated (run setup, or `cd figma-plugin && npm install && npm run build`)
3. **`figma-plugin/manifest.json`** present (it ships with the repo)

In Figma Desktop: Plugins → Development → Import plugin from manifest… → select `figma-plugin/manifest.json`.

> This is the **uSpec Extract** plugin — it's the only Figma plugin Mr. Handy ships. It lives in this repo's `figma-plugin/` (vendored, only required for `/handoff-component`). The previous release also required a "Figma Desktop Bridge" plugin to bridge the Console MCP into Figma Desktop; with the switch to OAuth / Remote SSE, that's no longer needed.

If `dist/` is missing after a build, inspect the build log under `figma-plugin/`. The most common cause is a Node version mismatch — confirm `node --version` from inside `figma-plugin/` matches the engine constraint in `figma-plugin/package.json`.

### `_base.json` Ajv validation fails

The schema lives at `figma-plugin/docs/base-json-schema.md`. Common causes:

- **SLOT nodes with compound IDs** — re-run with the parent component selected as the root, not a deeply nested instance.
- **A constitutive child that's actually a separate library component** — re-classify as `referenced` in the designer-in-the-loop checklist.
- **Missing variant axis option names** — Figma sometimes loses option names on variant rename. Re-name the variants in Figma and re-extract.

### Specialist disagreements exhaust retries

Surfaces in the Component Markdown's Reconciliation section as an open question. Inspect the cached JSON at `.uspec-cache/{slug}/`:

- `api.json` — the property dictionary
- `structure.json` — dimensional matrix + coverage matrix
- `color.json` — token bindings per layer
- `voice.json` — focus order tables

If two specialists disagree on axis names (`size: sm` vs `size: small`), update the variant property names in Figma to canonical values and re-extract. The reconciliation gate trusts `extract-api`'s naming.

### Coverage matrix `complete: false`

`extract-structure` walked frames but couldn't emit rows for at least one. The integrity gate's independent re-count will tell you which frame was missed. Most cases:

- **Wrapper-frame padding** — see [`../specs/structure.md#wrapper-frame-padding-coverage`](../specs/structure.md). Each wrapper gets its own group.
- **Sub-pixel measurements** — `1.5px` should stay `1.5`. If `Math.round` is anywhere in your custom override, replace with `rv()`.
- **Slot-hosted measurement failure** — slot insertion may need to happen before measurement; check the slot mutation ordering constraint.

## Multi-IDE setup & Atlassian MCP

The wizard supports seven agent-host IDEs. The `Wired up & verified` column tells you which have been end-to-end tested; the rest have shipped templates and a warning in the wizard output, but the per-IDE config shape is identical to the docs of that IDE.

| IDE | Config OAuthh | Wired up & verified |
|---|---|---|
| Cursor | `<repo>/.cursor/mcp.json` | ✓ |
| Claude Code | `~/.claude/mcp.json` + `~/.claude/skills/mr-handy-handoff/` | ✓ |
| Codex | `~/.codex/mcp.json` + `~/.codex/skills/mr-handy-handoff/` | ✓ |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | template only — not yet verified end-to-end |
| Zed | `~/.config/zed/settings.json` (under `context_servers`) | template only — not yet verified end-to-end |
| Cline | `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` | template only — not yet verified end-to-end |
| Continue | `~/.continue/config.json` (under `mcp` array) | template only — not yet verified end-to-end |

### I want to enable or disable the Atlassian MCP (Jira + Confluence)

Atlassian is opt-in via the y/N prompt at Phase 2.5. To enable or disable it:

```bash
SETUP_INTERACTIVE=1 Setup-MrHandy.bat          # Windows
SETUP_INTERACTIVE=1 ./setup-mrhandy.sh          # macOS / Linux / WSL
```

The interactive wizard asks one y/N question, then re-writes every detected IDE's `mcp.json` — with the `atlassian` block on `y`, stripped on `n`. No env vars, no API tokens, no email to paste. The IDE opens `https://mcp.atlassian.com` the first time it calls the Atlassian MCP, and you click Allow in the browser. The OAuth token is cached afterwards.

### The wizard wrote a config but the IDE doesn't see the server

Two causes cover most cases:

1. **Restart required.** Each IDE only re-reads its `mcp.json` on a full restart (VS Code / Continue / Cline need a window reload; Cursor / Claude Code / Codex need a process restart). The wizard's "Next steps" block lists the exact restart command for each detected IDE.
2. **Wrong config OAuthh.** Some IDEs (Zed, Continue) use a different top-level key (`context_servers` / `mcp` array) instead of the standard `mcpServers` object. The shipped templates already use the right shape for each IDE — if you hand-edited, restore from `templates/<ide>-mcp.json.template`.

### "Cursor is the only IDE the wizard wrote to"

The wizard falls back to writing Cursor's `.cursor/mcp.json` even when none of the user-global IDE config dirs exist yet — the `detectInstalledIdes()` function always includes Cursor as a safety net. To enable another IDE, install it (so its config dir is created), then re-run the wizard with `--force`.

## Output validation

### HTML uses Google Fonts or `font-weight: 800`

The HTML template requires the Fluent 2 type ramp (font stack starts with `Segoe UI`, no Google Fonts link, no `font-weight: 800/900`). Re-render through `mr-handy-doc-generator` rather than hand-editing the HTML — the agent enforces these rules.

### `States` field shows `default, hover, disabled`

That's a CSS-pseudo-class list, not user actions. The States field documents what the user can DO with the element (sort, click, hover, drag, slider). For non-interactive elements, omit the States field entirely.

### `None` appears as a SpecCard field value

Don't fill empty fields with `None`. Omit them from the JSON; the SpecCard renders without them.

### Mode B canvas has Section nodes named `Frame 123`

`mr-handy-figma.mdc § Naming` lists canonical names. Mode B writes that leave default names violate the post-build verification.

### Notes section ballooned into a four-deep bullet tree

You drifted into the Performance Dashboard anti-OAuthtern. Reference handoffs are Asset Library and Campaign Builder. Threshold / role-permission / status-map rules render as Markdown tables, not bullets. 2–4 bullets per Note (hard cap 6). 8+ business rules consolidate into one Business Rules table.

## Encoding

### Mojibake characters in output (`â€"`, `?`, `Ã©`)

Always-on rule: every file write specifies UTF-8. `setup-mrhandy.mjs` does this; the agent does this. If you script around Mr. Handy with `Set-Content` in PowerShell without `-Encoding UTF8`, you'll corrupt em-dashes and accented characters.

Fix: re-run the agent with the affected file, or use `[System.IO.File]::WriteAllText($OAuthh, $content, [System.Text.UTF8Encoding]::new($false))` in any custom script.

## When all else fails

- Re-run setup with `--force` (`node setup-mrhandy.mjs --force`) to rebuild the plugin and re-prompt for config
- Delete `.uspec-cache/{slug}/` and re-run `/handoff-component` for that component
- Check the white-label sweep in `.cursor/rules/mr-handy-output.mdc § White-Label Sanity Sweep` — if you accidentally introduced a brand reference, the sweep tells you where
- Open `Knowledge/uspec-changelog.md` for the vendored uSpec version's known issues

