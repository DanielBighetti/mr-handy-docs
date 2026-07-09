# Structure

Dimensions, spacing, padding across density / size / shape variants. Plus the coverage matrix that proves nothing was silently dropped.

## What it produces

A `## Structure` section with one of two rendering patterns:

### Pattern A — Size-variant matrix

For components with a primary size axis: a matrix of `Spec | Size A | Size B | Size C | Notes`, where Spec is a structural property (height, padding, gap, icon size, font size) and the columns are the variant values.

### Pattern B — Composition map

For standalone components or components without a size axis (Section Heading with `leading slot + heading area + trailing slot`): a `Spec | Default | Notes` table organized as group rows for the host container and each structural zone. Replaces the need for a separate "container" section.

## Boundary rule

When a section says "See X spec", the structure document only describes the **hosting container** (sizing mode, padding, spacing, alignment). It never re-documents the referenced component's internals. Slot container properties (sizing mode, alignment, `clipsContent`) belong as group rows in the composition section, not repeated in each `slotContent` section.

## Coverage matrix artifact

`extract-structure` emits a `_extractionArtifacts.coverageMatrix` artifact listing every auto-layout frame walked, the non-zero layout properties found on it, and whether a corresponding row was emitted in the final spec. The orchestrator's integrity step asserts `coverageMatrix.complete === true` and **independently re-counts** frames walked to catch silent drops.

This catches the historical bug where inner wrapper frames with non-zero `horizontalPadding` or `itemSpacing` were measured but not emitted.

## Recursive nested container measurement

`measureChildren` recurses into nested auto-layout containers. Deeply nested wrapper frames (icon containers inside `trailingContent`) are fully measured and surfaced as `__children` entries in the cross-variant data. Intermediate auto-layout frames with their own padding are visible to the completeness check.

## Wrapper frame padding coverage

A new verification procedure: for each sub-component section, walk `__children` recursively. Every entry with non-zero padding is an auto-layout container that needs its own group with dedicated rows. Per-child padding can never be collapsed into a single note on the parent.

This catches content areas (`leadingContent`, `trailingContent`) whose children each have individual padding.

## Non-dimensional axis coverage

Step 4e measures root and direct children across every variant axis not already covered by size / density / shape extraction. Step 6 classifies each axis:

- **Structural** — children differ → separate sections per configuration
- **Property-variant** — dimensional properties differ → state-conditional section
- **Visual-only** — skip

Step 6b runs targeted follow-up extractions for structural axes, giving each configuration complete dimensional data across all sizes.

## Sub-pixel precision

All rounding uses `rv()` (`Math.round(v * 10) / 10`), preserving one decimal place. `1.5px` stays `1.5`, not `2`. Whole numbers stay whole.

## Boolean-toggled previews

Standalone components with booleans controlling structural elements (slots, accessories, subtext) get a preview type showing meaningful boolean combinations as labeled instances (Default, With subtext, Full). A `PROPERTY_OVERRIDES` array drives per-column boolean configurations.

## Section ID-based rendering

Step 11b returns the rendered section's node ID. Step 11c locates the section by ID instead of by name, eliminating name-collision issues when multiple sections share similar names.

## Common mistakes

The instruction file at `.cursor/skills/uspec/extract-structure/agent-structure-instruction.md` calls these out:

- **Collapsing wrapper frame padding into notes** — anti-pattern. Each wrapper gets its own group.
- **Skipping non-dimensional variant diffs** — Step 4e is mandatory.
- **Missing property-variant sections** — when a non-dimensional axis changes properties (not children), it still needs a state-conditional section.
- **Hardcoding HUG-sized dimensions** — for `widthMode: hug`, document the mode, not the measured pixel artifact of current content.

## Validation

- `coverageMatrix.complete === true` — independently re-counted by the integrity gate
- Every auto-layout frame walked is either represented in the spec or explicitly skipped with a recorded reason
- Sub-pixel values preserve one decimal place
- HUG-sized containers document the mode
- Group ownership: every row belongs to exactly one section
