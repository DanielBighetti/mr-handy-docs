# Screen Reader

Focus order across VoiceOver / TalkBack / ARIA. State-by-state behavior. Slot-aware focus stops. The accessibility surface of the component documented for engineering, not just for compliance forms.

## What it produces

A `## Voice / Screen reader` section with:

- A focus order table per platform (VoiceOver, TalkBack, ARIA)
- Per-state behavior (idle / hover / focused / pressed / disabled — only the states the component actually has)
- Slot-aware focus stops (when a slot can host an interactive control, both the default and the preferred-instance scenario are documented)
- The component's role / state / value contract for AT
- Pre-render and post-render validation checks (slot-hosted focus stops verified, slot-populated previews actually rendered)

## Pipeline position

`extract-voice` runs in the parallel batch alongside `extract-structure` and `extract-color`, after `extract-api`.

## Slot resolution

`create-voice` resolves SLOT `preferredValues` to local components during extraction and records both:

- **Preferred instances** — the components a slot is meant to host
- **Default slot children** — the placeholder content shown when the slot is empty

Focus-order planning chooses between the default slot content and a representative preferred interactive fill when a slot-hosted control changes the traversal order. Slot metadata captures visibility bindings, descriptions, raw keys, and contextual child overrides so the agent can reason about conditional focus stops.

## Slot-aware artwork rendering

Screen reader previews support `slotInsertions` — populating slot content before marker resolution and bbox capture. The focus-order fallback logic reapplies slot insertions while searching for the richest preview state, improving marker placement for slot-hosted actions.

States with zero focus stops still render the component preview. States that depend on slot content render the slot-populated preview (showing the actual interactive control), not a default placeholder scenario.

## Slot-safe deep traversal

Voice extraction uses `findOne` deep traversal instead of shallow `children` lookup. Interactive elements inside slots appear as separate focus stop entries for merge analysis. The traversal uses a manual recursive collector with per-node try-catch (instead of `findAll`) to prevent crashes on SLOT nodes with compound IDs.

## Marker placement

Voice artwork uses the same nearest-edge marker placement as anatomy. Bounding boxes for focus stops are captured from the live instance **before** any `detachInstance()` call.

## State consolidation

States with identical accessibility semantics collapse into a single entry. `Hover` and `Focus-visible` typically merge unless they expose different ARIA state. The merge analysis is part of the specialist's standard output.

## Focus order framing

The instruction file frames focus order as a single top-level section. Validation guidance is split into:

- **Pre-render checks** — focus stops resolved, slot insertions valid, all preview states have corresponding bbox data
- **Post-render checks** — slot-hosted focus stops actually have markers, slot-populated previews show the inserted instance not the default placeholder

## Ownership

Owned by `create-voice` under `.cursor/skills/uspec/`. Instruction file at `.cursor/skills/uspec/create-voice/agent-voice-instruction.md`.

## Validation

- Every interactive element has a focus stop
- Each focus stop is captured per platform (VoiceOver / TalkBack / ARIA)
- Slot-hosted focus stops document both default and preferred scenarios when they differ
- ARIA role / state / value contract is concrete (no "TBD" entries)
- States without screen reader differences are explicitly noted as merged, not silently omitted
