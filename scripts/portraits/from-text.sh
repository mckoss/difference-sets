#!/bin/zsh
# Portrait from a text prompt with Z-Image Turbo (via ~/src/mac-studio-ai),
# numbered from <first number> with seed 1000 + number.
#
#   WORK=/tmp/portraits scripts/portraits/from-text.sh people.tsv 201 president
#
# people.tsv columns: name, title (e.g. "the 16th President of the United
# States"), and a short appearance hint. Results land in $WORK/webp.
S=${WORK:?set WORK to a scratch directory}; mkdir -p $S/raw $S/webp; TSV=$1; i=$(( $2 - 1 )); THEME=$3
cd ~/src/mac-studio-ai
while IFS=$'\t' read -r name title hint; do
  i=$((i+1)); slug=$(printf '%03d-%s' $i "$(echo $name | tr -d '.' | tr ' ' '-' | tr 'A-Z' 'a-z')"); seed=$((1000+i))
  prompt="a cute cartoon caricature portrait of $name, $title, head and shoulders, $hint, recognizable likeness, flat vector sticker icon, bold black outline, bright saturated colors, centered, isolated on a plain pure white background, no text, no shadow"
  if [[ ! -f $S/webp/$slug.webp ]]; then
    out=$(bin/imagine -m z -s $seed --name $slug -o $S/raw "$prompt" 2>&1 | grep '\.png$' | tail -1)
    [[ -n $out ]] || { echo "FAIL $slug"; continue; }
    sips -Z 256 "$out" --out $S/raw/$slug-256.png >/dev/null
    cwebp -quiet -q 82 $S/raw/$slug-256.png -o $S/webp/$slug.webp
  fi
  printf '%s\t%s\t%s\t%s\t%s\n' "$slug" "$name" "$seed" "$THEME" "$prompt" >> $S/manifest-$THEME.tsv
  echo "ok $slug"
done < $TSV
echo DONE
