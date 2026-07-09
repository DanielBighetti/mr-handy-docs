# Anatomy

Numbered markers + an attribute table. Says what every visible part of the component is and what role it plays.

## What it produces

In the Component Markdown path: an `## Anatomy` section with:

- A textual breakdown of constitutive elements (each numbered)
- A table per element: name, role, fill / stroke (token names), text style, container vs leaf, parent context

In the Figma-native path: an `Anatomy — {component}` frame placed next to the component, with numbered marker overlays on a preview and a structured attribute table beside it.

## Behavior

Anatomy uses concentric placement for round components (checkbox, radio, toggle), three-strategy placement (clockwise / left-stagger / alternating) for complex layouts, and a nearest-edge algorithm with collision avoidance for adjacent annotations. Inline markers get a short stub line for nested elements rather than a perimeter marker.

When a component's default variant yields fewer than two anatomy elements, the extractor automatically tries variant axes whose names suggest a richer alternative (`states: empty/filled`, `density: comfortable/compact`, etc.) and re-runs.

## Frame-classified node types

- **Component** — top-level instance
- **Container** — auto-layout frame with structural role
- **Text** — TEXT node (frame-wrapped TEXT nodes get a frame indicator and the text content for reference)
- **Slot** — Figma SLOT node
- **Statelayer / Backplate** — synthetic elements derived from root variant fills
- **Icon / Image** — vector or image node
- **Shape** — non-content geometric element

## Effect styles

When a node has an `effectStyleId`, anatomy emits a single `"effect style"` entry with the style name as the token. Individual shadow layers are not iterated.

## Ownership

Owned by the `create-anatomy` skill under `.cursor/skills/uspec/`. Detailed instruction file at `.cursor/skills/uspec/create-anatomy/agent-anatomy-instruction.md`.

## Validation

- Every anatomy element renders in the preview (the live instance, not a detached copy)
- Markers don't overlap (8 px minimum gap)
- Synthetic elements (statelayer / backplate) are documented when present
- Each element's name is the designer-facing layer name, not an auto-generated identifier
