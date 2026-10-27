#!/bin/zsh
# Generate sticker images for the match-one deck with the local image
# generator (Z-Image Turbo via ComfyUI, driven by ~/src/mac-studio-ai/bin/imagine).
#
#   scripts/generate-symbols.sh 156 "fire engine" "hovercraft"
#
# Numbers the new images from the first argument, uses seed 1000 + number,
# shrinks each to a 256 px WebP in public/symbols/, and appends its slug, name,
# seed, and prompt to docs/symbols-manifest.tsv. Review the images, then add
# them to public/symbols/manifest.json with their theme.
set -e
REPO=${0:a:h:h}
RAW=$(mktemp -d)
i=$(( $1 - 1 )); shift
for name in "$@"; do
  i=$((i + 1))
  slug=$(printf '%03d-%s' $i "${name// /-}")
  seed=$((1000 + i))
  prompt="a single cute cartoon $name, flat vector sticker icon, bold black outline, bright saturated colors, centered, isolated on a plain pure white background, no text, no shadow"
  out=$(cd ~/src/mac-studio-ai && bin/imagine -m z -s $seed --name $slug -o $RAW "$prompt" 2>&1 | grep '\.png$' | tail -1)
  [[ -n $out ]] || { echo "FAIL $slug"; continue; }
  sips -Z 256 "$out" --out $RAW/$slug-256.png >/dev/null
  cwebp -quiet -q 82 $RAW/$slug-256.png -o $REPO/public/symbols/$slug.webp
  printf '%s\t%s\t%s\t%s\n' "$slug" "$name" "$seed" "$prompt" >> $REPO/docs/symbols-manifest.tsv
  echo "ok $slug"
done
