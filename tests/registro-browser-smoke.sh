#!/usr/bin/env bash
set -euo pipefail

# Publicación de prueba SOLO local, sin desplegar ni capturar datos.
node scripts/build-public.mjs
python3 -m http.server 8795 --bind 127.0.0.1 --directory dist/public >/tmp/digifirma-registro-http.log 2>&1 &
pid=$!
trap 'kill "$pid" 2>/dev/null || true' EXIT

ready=false
for _ in $(seq 1 20); do
  if curl --silent --fail http://127.0.0.1:8795/registro/ >/dev/null; then
    ready=true
    break
  fi
  sleep 1
done
if [ "$ready" != true ]; then
  cat /tmp/digifirma-registro-http.log
  echo "Vista previa de registro no disponible localmente" >&2
  exit 1
fi

chrome="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
if [ -z "$chrome" ]; then
  echo "No hay Chromium/Chrome para validar el registro." >&2
  exit 1
fi

curl --silent --fail http://127.0.0.1:8795/assets/registro.css >/dev/null
"$chrome" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-extensions --no-first-run --virtual-time-budget=4000 --dump-dom http://127.0.0.1:8795/registro/ > /tmp/digifirma-registro-dom.html 2>/tmp/digifirma-registro-chrome.log
grep -q "REGISTRO NO DISPONIBLE" /tmp/digifirma-registro-dom.html
grep -q "Verificar correo" /tmp/digifirma-registro-dom.html
grep -q "disabled" /tmp/digifirma-registro-dom.html

mkdir -p artifacts
for width_and_height in "1440,900" "390,844" "320,680"; do
  width="${width_and_height%%,*}"
  "$chrome" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-extensions --no-first-run --hide-scrollbars --window-size="$width_and_height" --screenshot="artifacts/registro-${width}.png" http://127.0.0.1:8795/registro/ >/dev/null 2>>/tmp/digifirma-registro-chrome.log
  test -s "artifacts/registro-${width}.png"
done

# El paquete público estático no contiene endpoints ni un formulario de alta activo.
if grep -Eiq '<form|type="password"|type="submit"|<script' dist/public/registro/index.html; then
  echo "La vista previa no debe solicitar ni enviar credenciales." >&2
  exit 1
fi
echo "OK: ruta de registro estática, tres capturas, sin alta ni backend."
