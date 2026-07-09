# Motion

Animation timeline + easing curves. Only emitted when the component has motion data (After Effects keyframes, motion-spec metadata, or recorded animation state changes).

## What it produces

A `## Motion` section with:

- A timeline bar per animated property (transform, opacity, color)
- Per-keyframe easing detail (function + duration)
- Per-state transition tables (idle → hover, idle → pressed, hover → focused, etc.)
- Total animation duration per transition

## When it appears

The motion specialist only runs when one of these conditions is met:

- The component has linked motion-spec metadata (a Figma file containing After Effects keyframe exports)
- The component declares motion explicitly (variant axis named `motion: enter | exit`, or motion-related variables like `motion.duration.fast`)
- The user explicitly asks for a motion spec

For static components with no animation, the motion section is omitted from the Component Markdown entirely (rather than rendered with "No motion" placeholder content).

## After Effects keyframe ingestion

When motion data comes from After Effects, the specialist parses keyframes for:

- Position (x, y, z)
- Scale (uniform and per-axis)
- Rotation
- Opacity
- Color (interpolated)
- Custom properties (anchor point, blend mode, mask offsets)

Each keyframe's easing function is captured (linear, ease-in, ease-out, cubic-bezier with control points, custom).

## Timeline bar rendering

Animation timeline bars use horizontal Auto Layout with proportional widths. Each segment shows:

- The eased duration (visually proportional to total)
- The property being animated
- The easing function as a label

## Easing detail tables

Below the timeline, an easing detail table:

| Property | Start | End | Duration | Easing |
|---|---|---|---|---|
| `transform.translateY` | `8px` | `0px` | `200ms` | `cubic-bezier(0.2, 0.0, 0, 1)` |
| `opacity` | `0` | `1` | `200ms` | `cubic-bezier(0.4, 0.0, 0.2, 1)` |

Token-bound durations and easings reference the design system's variables (`motion.duration.fast`, `motion.easing.standard`).

## Provenance

The motion section's provenance records:

- The After Effects file or Figma motion file the data came from
- Which specialist version processed it
- Any keyframes the parser couldn't interpret (surfaced as warnings, not silent drops)

## Validation

- Every animated property has at least two keyframes (start + end)
- Easing function is either a named function, a cubic-bezier with four numeric control points, or a recognized design-system token
- Transition durations match the design system's motion scale when token-bound
- Motion section is omitted (not blank-rendered) when the component has no motion data
