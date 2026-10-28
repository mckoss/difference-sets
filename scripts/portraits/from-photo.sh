#!/bin/zsh
# Portrait from a freely licensed photo: fetch the Wikipedia lead image (or a
# named Commons file), keep it only if Commons marks it public domain or CC,
# crop to the head with SAM 3.1, then restyle it with Qwen-Image-Edit 2509
# (both via ~/src/mac-studio-ai). Results land in $WORK/final; each source
# URL, license, seed, and instruction is appended to $WORK/sources.tsv.
#
#   WORK=/tmp/portraits scripts/portraits/from-photo.sh list.tsv
#
# list.tsv columns: slug, Wikipedia title, optional hint, optional Commons file.
# SEED (default 7) picks the edit seed. Needs Python with Pillow as $PY.
D=${WORK:?set WORK to a scratch directory}; LIST=$1
PY=${PY:-python3}
HEADCROP=${0:a:h}/headcrop.py
UA="difference-sets-research/1.0 (https://mckoss.com/difference-sets/)"
mkdir -p $D/dl $D/crop $D/final $D/seg
while IFS=$'\t' read -r slug title hint cfile; do
  [[ -f $D/final/$slug.webp ]] && { echo "skip $slug"; continue; }
  if [[ -n $cfile ]]; then
    info="$cfile	$(curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&titles=File:$cfile" | python3 -I -c "import json,sys;p=list(json.load(sys.stdin)['query']['pages'].values())[0];print(p['imageinfo'][0]['url'].split('?')[0])")"
    file=${info%%$'\t'*}; url=${info##*$'\t'}
  else
    info=$(curl -s -A "$UA" "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original|name&redirects=1&titles=$title" \
      | python3 -I -c "import json,sys;p=list(json.load(sys.stdin)['query']['pages'].values())[0];print(p['pageimage']+'\t'+p['original']['source'].split('?')[0])" 2>/dev/null)
    [[ -n $info ]] || { echo "NOIMAGE $slug"; continue; }
    file=${info%%$'\t'*}; url=${info##*$'\t'}
  fi
  lic=$(curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=File:$file" \
    | python3 -I -c "import json,sys;p=list(json.load(sys.stdin)['query']['pages'].values())[0];m=p.get('imageinfo',[{}])[0].get('extmetadata',{});print(m.get('LicenseShortName',{}).get('value','unknown'))" 2>/dev/null)
  if [[ ! $lic =~ '^(Public domain|PD|CC0|CC BY|Attribution|No restrictions)' ]]; then echo "NOLICENSE $slug ($lic)"; continue; fi
  curl -s -A "$UA" -o $D/dl/$slug.src "$url"
  sips -s format jpeg -Z 1400 $D/dl/$slug.src --out $D/dl/$slug.jpg >/dev/null || { echo "BADIMAGE $slug"; continue; }
  bbox=$(cd ~/src/mac-studio-ai && bin/segment --mask-only -o $D/seg $D/dl/$slug.jpg "head" 2>&1 | grep -m1 -o '[0-9]*x[0-9]* at ([0-9]*, [0-9]*)')
  if [[ -n $bbox ]]; then $PY $HEADCROP $D/dl/$slug.jpg "$bbox" $D/crop/$slug.png; else cp $D/dl/$slug.jpg $D/crop/$slug.png; fi
  instr="Turn this photo into a polished cartoon caricature sticker of the same person, in the style of a detailed vector illustration: bold black outlines, bright saturated colors with soft cel shading, a detailed expressive face with shaded eyes and irises, eyebrows, nose, lips and cheeks. Keep the face, hairstyle and clothing exactly as in the photo. ${hint:+$hint. }Head-and-shoulders bust only, centered, the bust ending in a smooth rounded bottom edge like a die-cut sticker, fitting entirely inside the frame with a white margin. Plain pure white background, no text."
  out=$(cd ~/src/mac-studio-ai && bin/edit -q -s ${SEED:-7} --name $slug -o $D/out $D/crop/$slug.png "$instr" 2>&1 | grep '\.png$' | tail -1)
  [[ -n $out ]] || { echo "FAIL $slug"; continue; }
  sips -Z 256 "$out" --out $D/out/$slug-256.png >/dev/null
  cwebp -quiet -q 82 $D/out/$slug-256.png -o $D/final/$slug.webp
  printf '%s\t%s\t%s\t%s\t%s\n' "$slug" "https://commons.wikimedia.org/wiki/File:$file" "$lic" "${SEED:-7}" "$instr" >> $D/sources.tsv
  echo "ok $slug ($lic)"
done < $LIST
echo DONE
