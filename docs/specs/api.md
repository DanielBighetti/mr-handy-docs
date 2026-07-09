# API

The typed property dictionary. Property name, type, default, required flag, allowed values, sub-component tables, and configuration examples — everything a developer needs to instantiate the component without opening Figma.

## What it produces

An `## API` section with:

- Top-level property table: `name | type | default | required | description`
- Enum values listed inline for `enum`-typed properties
- Sub-component property tables for compound components (a Text Field's internal Button gets its own table)
- Configuration examples — each example renders the live component with the configured props as a preview

## Pipeline position

`extract-api` is the **first** specialist to run, serially. Its output is the shared property dictionary every other specialist references. Running it first prevents axis-name drift across the four caches.

## Evidence-based reasoning

The API specialist doesn't free-associate. Step 4c assembles a structured `ComponentEvidence` object from deterministic ownership cues — root properties, child overrides, text nodes, and variable collections — with each hint typed (`evidenceType`, `suggestedExposure`, `rationale`). Reasoning operates on that evidence, not on names alone.

## Override promotion

Master booleans + sub-booleans are merged into single enums. `leadingContent: none | icon | text | iconAndText` instead of three separate `showLeading`, `leadingType` properties. The override-promotion pass classifies every `composableChildren` override key as parent-owned, child-only, or shared.

## Slot-aware configuration examples

Configuration examples support:

- `textOverrides` — replace TEXT layer content by layer name (preview shows the example's actual text, not placeholders)
- `slotInsertions` — populate named SLOT nodes with fresh component instances, including `nestedOverrides` and `textOverrides` on the inserted child

The slot mutation ordering constraint applies: all mutations on a child instance must happen **before** `appendChild` into a SLOT, because adoption assigns compound IDs that block later access.

## Compound component ownership rules

Documented in `.cursor/skills/uspec/extract-api/agent-api-instruction.md`. Highlights:

- **Parent-owned** — properties that affect layout, sizing, or composition (parent decides)
- **Child-only** — properties intrinsic to the child that the parent never overrides (child controls)
- **Shared** — properties the parent can override on the child (both surface)

## Anti-patterns

- Burying parent-owned properties in sub-component tables
- Failing to decompose broad state axes (`state: idle | hover | pressed | disabled` may decompose into `disabled: bool` + per-interaction states)
- Exposing a master boolean and its sub-boolean as separate booleans when they are mutually exclusive (use an enum)

## Validation

- Every typed property has a default
- Every required flag is justified
- Sub-component tables only document properties the parent surfaces
- Configuration examples render successfully (no missing components, no font load failures)
