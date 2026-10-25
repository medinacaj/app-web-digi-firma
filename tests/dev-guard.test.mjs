import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const entry = fileURLToPath(new URL("../server/dev.mjs", import.meta.url));
function check(env) {
  const run = spawnSync(process.execPath, [entry], {
    env: { ...process.env, DIGIFIRMA_DEMO: "", NODE_ENV: "test", ...env },
    encoding: "utf8",
    timeout: 3000
  });
  assert.notEqual(run.status, 0, "El proceso no debe iniciar.");
  return run.stderr;
}

test("servidor no inicia sin consentimiento explícito de demostración", () => {
  assert.match(check({ DIGIFIRMA_DEMO: "" }), /Servidor cerrado/);
});
test("servidor no inicia en NODE_ENV=production incluso con opt-in", () => {
  assert.match(check({ DIGIFIRMA_DEMO: "1", NODE_ENV: "production" }), /Servidor cerrado/);
});
test("servidor rechaza puertos inválidos para el laboratorio", () => {
  assert.match(check({ DIGIFIRMA_DEMO: "1", PORT: "80" }), /PORT debe ser/);
});
