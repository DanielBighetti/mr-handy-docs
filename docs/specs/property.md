# Properties

Variant matrices, boolean toggles, variable mode exhibits, and child-component chapters. The visual side of the API.

## What it produces

A `## Properties` section with:

- Variant axis tables (one per variant axis: `size`, `density`, `shape`, custom)
- Boolean toggle examples (each boolean rendered in its on / off / mixed states)
- Variable mode exhibits (theme: light / dark, density: cozy / compact)
- Child-component chapters (compound components nest sub-component property docs here)
- A pre-render audit pass that validates the exhibit plan against the data before rendering

## Exhibit planning

`extract-property` runs an exhibit-planning phase that produces an `exhibitPlan` array routing each property to the correct rendering template:

- `6a` — context-axis grouping when one variant axis qualifies as a visual context
- `6a-ctx` / `6b-ctx` — context-axis variants for grouped chapters
- `6a-matrix` — sparse variant matrices with N/A placeholders for missing combinations

The plan is decided before any rendering happens. The audit pass re-reads the pre-render checklist before committing.

## Context axis

When a variant axis qualifies as a visual context (e.g., `variant: primary | subtle`), the renderer groups all other illustrated chapters by that axis's values. Each chapter shows its content rendered in every context value side-by-side.

## Sparse matrices

Components whose variant matrix isn't fully populated (e.g., only some `size × density` combinations exist) get the `6a-matrix` template — an absolute-positioned grid with N/A placeholders so missing combinations are explicit, plus standalone chapters for both axes.

## Blown-out child rendering

Composable slot components (button groups, tab bars, chip groups) get blown-out child renderings — each slot child rendered as if it were a top-level component, with its own variant matrix.

## Ownership

Owned by `create-property`. Instruction file at `.cursor/skills/uspec/create-property/agent-property-instruction.md`. The instruction file holds all data validation, exhibit planning, pre-render checklist, common mistakes, and do-not rules — SKILL.md is pure orchestration.

## Validation

- The exhibit plan covers every variant axis and every property exposed by `extract-api`
- N/A placeholders are explicit in sparse matrices
- Variable mode exhibits use the actual variable collection modes from `_base.json`, not invented modes
- Boolean exhibits show the true effect of the boolean (some booleans are pure visibility toggles, others change layout — render accordingly)
