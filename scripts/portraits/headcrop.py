"""Crop a portrait to a square around the head, given SAM's bbox line 'WxH at (X, Y)'."""
import re, sys
from PIL import Image
src, bbox, out = sys.argv[1:4]
w, h, x, y = map(int, re.search(r'(\d+)x(\d+) at \((\d+), (\d+)\)', bbox).groups())
im = Image.open(src).convert('RGB')
side = int(max(w, h) * 1.7)
cx, cy = x + w / 2, y + h / 2 + 0.18 * h  # a little below center: top of the shoulders
left, top = int(cx - side / 2), int(cy - side / 2)
canvas = Image.new('RGB', (side, side), 'white')
canvas.paste(im.crop((left, top, left + side, top + side)), (0, 0))
canvas.resize((768, 768)).save(out)
