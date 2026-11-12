#!/usr/bin/env bash
set -euo pipefail
node scripts/build-public.mjs
python3 -m http.server 8796 --bind 127.0.0.1 --directory dist/public >/tmp/digifirma-brand-http.log 2>&1 &
pid=$!
trap 'kill "$pid" 2>/dev/null || true' EXIT
ready=false
for _ in $(seq 1 20); do
 if curl -fsS http://127.0.0.1:8796/ >/dev/null; then ready=true; break; fi
 sleep 1
done
if [ "$ready" != true ]; then cat /tmp/digifirma-brand-http.log; exit 1; fi
for asset in assets/brand/digifirma-logo.svg assets/brand/digifirma-mark.svg assets/site.css; do curl -fsS "http://127.0.0.1:8796/$asset" >/dev/null; done
chrome="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || true)"
if [ -z "$chrome" ]; then echo "Chrome/Chromium no disponible" >&2; exit 1; fi
"$chrome" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --no-first-run --virtual-time-budget=5000 --dump-dom http://127.0.0.1:8796/ >/tmp/digifirma-brand-site.html 2>/tmp/digifirma-brand-chrome.log
grep -q "Documentos claros" /tmp/digifirma-brand-site.html
grep -q "DigiFirma" /tmp/digifirma-brand-site.html
mkdir -p artifacts
for dimensions in "1440,900" "390,844" "320,680"; do
 width="${dimensions%%,*}"
 for page in landing app; do
  path="/"
  if [ "$page" = app ]; then path="/app/"; fi
  "$chrome" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --no-first-run --hide-scrollbars --virtual-time-budget=5000 --window-size="$dimensions" --screenshot="artifacts/digifirma-$page-$width.png" "http://127.0.0.1:8796$path" >/dev/null 2>>/tmp/digifirma-brand-chrome.log
  test -s "artifacts/digifirma-$page-$width.png"
 done
done
echo "OK: branded DigiFirma landing/app, 3 viewport widths, no public deployment"
