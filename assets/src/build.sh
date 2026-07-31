#!/usr/bin/env bash
# Renders the Chrome Web Store assets from frames.html into ../
# Usage: assets/src/build.sh   (needs Google Chrome installed)
set -euo pipefail

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
SRC="$(cd "$(dirname "$0")" && pwd)"
OUT="$(cd "$SRC/.." && pwd)"

# Served over http:// so the page can load the sibling CSS/JS without
# file:// origin restrictions.
PORT="${PORT:-8791}"
ROOT="$(cd "$SRC/../.." && pwd)"
python3 -m http.server "$PORT" --directory "$ROOT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
sleep 1

shoot() { # frame-id  width  height  output-name
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-first-run \
    --force-device-scale-factor=1 --window-size="$2,$3" --virtual-time-budget=3000 \
    --screenshot="$OUT/$4.png" \
    "http://localhost:$PORT/assets/src/frames.html?f=$1" 2>/dev/null
  echo "  $4.png  (${2}x${3})"
}

echo "Rendering store assets…"
shoot hero         1280 800 screenshot-1-hero
shoot themes       1280 800 screenshot-2-themes
shoot selfhosted   1280 800 screenshot-3-self-hosted
shoot control      1280 800 screenshot-4-control
shoot tile-small    440 280 promo-tile-small-440x280
shoot tile-marquee 1400 560 promo-tile-marquee-1400x560
echo "Done → $OUT"
