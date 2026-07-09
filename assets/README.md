# assets/

Static assets shipped with the Mr. Handy repo.

| File | Purpose |
|---|---|
| `mr-handy-banner.png` | Hero image used in the docs site. |
| `mr-handy-floating.gif` | Animated robot loop for marketing pages. |
| `setup-banner-reference.txt` | Plain-text capture of the current `node setup-mrhandy.mjs --doctor` output. Used as the visual reference for the Amazon-Q-style CLI restyle (block logo + load-status table + status footer). Regenerate after any change to the banner code. |
| `setup-banner-reference.png` | (Optional) Screenshot of the same output rendered in a real terminal. Drop your own PNG here when verifying the restyle on macOS / Windows / Linux. The build does not require it; the `.txt` capture is the source of truth for layout. |

## Regenerating the text reference

```bash
node setup-mrhandy.mjs --doctor > assets/setup-banner-reference.txt
```

## Banner flags

| Flag | Effect |
|---|---|
| (default) | New ASCII `MR HANDY` block logo plus tagline. |
| `--classic-banner` | Legacy floating Mr. Handy art (sphere, three eyestalks, antenna, thruster ring). |
| `--no-banner` | Suppress all decoration. Status checklists still render — they are content, not chrome. Use in CI. |
