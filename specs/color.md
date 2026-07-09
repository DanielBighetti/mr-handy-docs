# Color

Token bindings per layer. Where every fill / stroke / effect comes from in the design system.

## What it produces

A `## Color` section with:

- Per-element rows: element name, role (fill / stroke / effect), token reference, raw hex (when no token), opacity, blend mode
- Composite breakdown rows for paint styles with multiple visible fill layers (gradients, multi-layer fills, blended overlays)
- Sub-component token ownership decisions surfaced in `generalNotes`

## Token resolution priority

For every color binding, the specialist resolves the token source in this order:

1. **Paint / stroke style** (`fillStyleId`, `strokeStyleId`) — preferred if present
2. **Variable binding** (`boundVariables.color`) — fallback when no style is bound
3. **Raw value** — only when neither a style nor a variable is bound

The order matters because a layer can have both — paint styles often wrap a variable, and the wrapping name is more informative than the underlying variable's name.

## Composite styles

Paint styles with 2+ visible fill layers emit a `compositeDetail` object with:

- Layer stacking order
- Per-layer blend modes and opacities
- Gradient stops (when present)
- Image layers (when present)

Composite layers render as nested rows under the parent element, with hierarchy indicators (`#hierarchy-indicator` frames toggled per child row). The renderer supports `showIndicator` flags for middle / last-child visual connectors.

Both rendering strategies handle composites:

- **Strategy A (simple)** — flat per-layer rows
- **Strategy B (state-consolidated)** — composite rows grouped by interactive state

## Sub-component token ownership

The specialist decides for each sub-component instance whether its tokens belong in the parent's color spec or in the sub-component's own spec. Decision framework signals:

- Full component vs leaf instance
- Slot-hosted (default content vs preferred-instance fill)
- Parent override on the child

Worked examples (from the instruction file):

| Sub-component | Decision | Rationale |
|---|---|---|
| MicroButton inside a Card | Exclude — document in MicroButton's own spec | Full component |
| Chevron icon inside a Combobox | Include in parent | Leaf instance the parent owns |
| Divider inside a List | Include in parent | Leaf instance |
| IconButton inside a Toolbar | Exclude — document in IconButton's own spec | Full component |

Excluded sub-components get a one-line note in `generalNotes` pointing to the standalone spec.

## Element naming

Fill-bearing elements use a property qualifier:

- `Container fill` — not `Container` alone (because the same element may also have a stroke)
- `Background fill` — not `Background` alone
- `Container stroke` — for strokes on the same element

This removes ambiguity when a single element contributes multiple color tokens.

## Slot-aware extraction

`enableNestedBooleans` and `directUnhide` calls are wrapped with try-catch guards because slot-hosted instances can fail those mutations. The specialist falls back to documenting only the visible state when a hidden state can't be safely revealed.

## Validation

- Every visible layer is documented (no silent skips)
- Token names match the design system's actual variable / style names — no invented tokens
- Composite layers have layer order documented
- Sub-component decisions are surfaced in `generalNotes`
