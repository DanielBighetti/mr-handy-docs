# Component Markdown — `/handoff-component`

A single self-contained `components/{slug}.md` per component. All seven spec dimensions in one file: anatomy, properties, API, color, structure, screen reader, motion. Hand it to any LLM and they have everything they need to implement.

## When to use this path

Pick the Component Markdown path when:

- The output should live in your codebase (next to the component itself, in a doc site, in a PR description)
- You want to feed the spec back into another AI tool — the Markdown is a single concatenated source
- You're not actively designing inside Figma

Pick the Figma-native path instead when:

- The audience is design-side and reviews happen on the canvas
- You want anatomy markers visually overlaid on the component
- You're already building or tweaking the component in Figma

Both paths share the same extractor and specialist outputs — the difference is only in the render step.

## Pipeline at a glance

```
Figma component
  ↓ (Phase A — Figma plugin sandbox extraction)
_base.json  ←  validated against Ajv schema
  ↓ (Phase B — specialist interpretation, four cache files)
.uspec-cache/{slug}/api.json | structure.json | color.json | voice.json
  ↓ (Phase C — reconciliation gate)
serial re-dispatch of any specialist whose output disagrees with peers
  ↓ (Phase D — integrity gate)
axis consistency, coverage matrix complete
  ↓ (Phase E — render)
components/{slug}.md       ← Component Markdown path
                              OR
Figma annotation frames    ← Figma-native path
  ↓ (Phase F — provenance)
hash, model, plugin version, specialist versions, reconciliation verdict
```

## The `_base.json` contract

`_base.json` is the only input the specialists see. Spec at [`../../figma-plugin/docs/base-json-schema.md`](../../figma-plugin/docs/base-json-schema.md). Highlights:

- Every variant is captured. No default-variant sampling.
- Every variable binding includes `name`, `codeSyntax`, alias chain, and remote collection metadata.
- Inline font properties live alongside text style IDs (so we don't lose precision when a layer's typography deviates from its style).
- Sub-components classified as **constitutive** are walked across their own variant axes — a Button inside a Text Field is specified at every size and density, not just the parent's chosen configuration.
- Designer-in-the-loop classification: each top-level child is confirmed as constitutive / referenced / decorative before extraction completes.

## Specialist responsibilities

Defined in `.cursor/skills/uspec/extract-*` and detailed in their per-skill instruction files.

| Specialist | Owns | Output cache |
|---|---|---|
| `extract-api` | The typed property dictionary, evidence-based exposure decisions, override promotion (master booleans + sub-booleans → enums), nested-property grouping | `.uspec-cache/{slug}/api.json` |
| `extract-structure` | Dimensions, spacing, padding across density / size / shape variants. Coverage matrix. Pattern A (size-variant matrices) and Pattern B (composition maps). Wrapper-frame padding coverage. | `.uspec-cache/{slug}/structure.json` |
| `extract-color` | Token bindings per layer, composite paint detail (gradients, multi-layer fills), sub-component token ownership rules | `.uspec-cache/{slug}/color.json` |
| `extract-voice` | Focus order across VoiceOver / TalkBack / ARIA, slot-aware screen-reader behavior, preferred-instance vs default-slot-child resolution | `.uspec-cache/{slug}/voice.json` |

`extract-api` runs **first and serially** because every other specialist references its property dictionary.

## Reconciliation gate

Deterministic, not LLM-judged. Compares cache files for typed disagreements:

- Conflicting child classifications (one specialist treats a frame as a sub-component, another as a slot)
- Mismatched axis names (`size: sm/md/lg` vs `size: small/medium/large`)
- Missing states (Voice declares a `disabled` state, Structure has no measurements for it)

Each disagreement type maps to a single specialist that owns the resolution. The gate re-dispatches **only** that specialist; peers' caches stay intact. Retries cap at `mr-handy.config.json` → `uspec.reconciliation.maxRetriesPerSpecialist` (default 2).

If retries exhaust without convergence, the disagreement is surfaced in the Component Markdown's `## Reconciliation` section as an open question rather than auto-resolved.

## Integrity gate

Validates:

- All four cache files exist with valid shapes
- `coverageMatrix.complete === true` from `extract-structure`
- Axis name consistency across the four caches
- Voice state platform coverage (VoiceOver / TalkBack / ARIA all populated)
- Recursion manifest emitted for constitutive children

Any failure aborts before render.

## Component Markdown render

Single file. Section order:

1. **Overview** — component name, classification, parent/child relationships, summary one-liner
2. **API** — typed properties table, defaults, required flags, child-prop tables, configuration examples
3. **Structure** — Pattern A or B per the specialist's choice, padding/spacing/sizing tables per variant
4. **Color** — fill/stroke/effect token bindings per layer, composite layer breakdown when present
5. **Voice / Screen reader** — focus order tables per platform, ARIA contract, role / state / value
6. **Motion** — animation timeline + easing curves (only when motion data is present)
7. **Provenance** — `_base.json` SHA, plugin version, specialists, model used, reconciliation verdict

## Figma-native render

Each spec gets its own annotation frame placed next to the component:

- `Anatomy — {component}` — markers overlaid on a preview
- `Properties — {component}` — variant matrix, illustrated chapters, exhibit plan
- `API — {component}` — typed property table, sub-component tables, configuration examples
- `Color — {component}` — fill/stroke token annotations
- `Structure — {component}` — dimensional matrix per variant
- `Screen reader — {component}` — focus order overlay + state table
- `Motion — {component}` — timeline bars + easing detail (only if motion data exists)

All Figma-native renders go through Native Figma MCP per [`../../.cursor/rules/mr-handy-mcp.mdc`](../../.cursor/rules/mr-handy-mcp.mdc).

## Common failure modes

See [`../help/troubleshooting.md`](../help/troubleshooting.md) for fixes. Short list:

- **Plugin won't import** — Node version mismatch or missing build. Run `Setup-MrHandy.bat -Force`.
- **`_base.json` Ajv validation fails** — usually a SLOT node with compound IDs the plugin couldn't resolve. Re-run with the parent component selected as the root.
- **Specialist disagreements exhaust retries** — surfaces in the Markdown as an open question. Inspect the cached JSON files to understand the disagreement.
- **Coverage matrix incomplete** — `extract-structure` walked frames but couldn't emit rows. Likely a wrapper-frame padding case; the structure skill's "wrapper frame padding coverage" rule explains the fix.
