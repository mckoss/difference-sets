# Symbol images

The 155 sticker images in `public/symbols/` (used by the match-one deck maker
and Lesson 18) were generated locally with the Z-Image Turbo model via
ComfyUI, one image per name with a fixed seed, then shrunk to 256 px WebP.

Every image used the prompt template

> a single cute cartoon NAME, flat vector sticker icon, bold black outline,
> bright saturated colors, centered, isolated on a plain pure white
> background, no text, no shadow

A few images were regenerated after review with an adjusted prompt or seed.
The exact slug, name, seed, and prompt for every image are in
[`symbols-manifest.tsv`](symbols-manifest.tsv). The site reads
`public/symbols/manifest.json` (slug, name, file, theme); the 32 images marked
`vehicle` make up the deck maker's Vehicles theme, enough for a 31-card deck
with 6 pictures per card (q = 5) using vehicles only.

[`scripts/generate-symbols.sh`](../scripts/generate-symbols.sh) generates more
images with the same prompt template and seed scheme.
