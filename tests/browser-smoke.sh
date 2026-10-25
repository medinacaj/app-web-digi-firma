#!/usr/bin/env bash
set -euo pipefail
export DIGIFIRMA_DEMO=1
export NODE_ENV=test
export PORT=8787
node server/dev.mjs > /tmp/digifirma-server.log 2>&1 &
pid=$!
trap 'kill "$pid" 2>/dev/null || true' EXIT

ready=false
for _ in $(seq 1 35); do
  if curl --silent --fail http://127.0.0.1:8787/ > /dev/null; then
    ready=true
    break
  fi
  sleep 1
done
if [ "$ready" != true ]; then
  cat /tmp/digifirma-server.log
  echo "El servidor de laboratorio no inició" >&2
  exit 1
fi

chrome="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
if [ -z "$chrome" ]; then
  echo "No está disponible Chrome/Chromium en el runner; no omitir la prueba" >&2
  exit 1
fi

chrome_args=(--headless --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-extensions --no-first-run --virtual-time-budget=5000 --dump-dom)
"$chrome" "${chrome_args[@]}" http://127.0.0.1:8787/ > /tmp/digifirma-site.html 2>/tmp/digifirma-chrome.log
grep -q "Los acuerdos" /tmp/digifirma-site.html
grep -q "Proyecto en desarrollo" /tmp/digifirma-site.html
grep -q "Explorar el prototipo" /tmp/digifirma-site.html
grep -q "noindex,nofollow" /tmp/digifirma-site.html
"$chrome" "${chrome_args[@]}" http://127.0.0.1:8787/app/ > /tmp/digifirma-app.html 2>>/tmp/digifirma-chrome.log
grep -q "Resumen general" /tmp/digifirma-app.html
grep -q "Laboratorio local activo" /tmp/digifirma-app.html
grep -q "Prototipo no operativo" /tmp/digifirma-app.html

# Verifica API y no publicación de archivos ajenos a whitelist
curl --silent --fail http://127.0.0.1:8787/api/demo/state | grep -q '"simulated":true'
test "$(curl --silent -o /dev/null -w '%{http_code}' http://127.0.0.1:8787/README.md)" = "404"

echo "OK: landing y panel renderizados con Chrome headless; servidor solo local."
