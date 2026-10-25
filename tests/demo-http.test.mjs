import test from "node:test";
import assert from "node:assert/strict";
import { createDemoServer } from "../server/demo-http.mjs";

async function withDemo(run) {
  const server = createDemoServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = "http://127.0.0.1:" + server.address().port;
  try { await run(origin); } finally { await new Promise((resolve) => server.close(resolve)); }
}
const post = (body, other = {}) => ({
  method: "POST",
  headers: { "Content-Type": "application/json", ...other },
  body: JSON.stringify(body)
});

test("GET muestra la UI local y cabeceras de seguridad", async () => withDemo(async (origin) => {
  const response = await fetch(origin + "/");
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Venezuela exclusivamente/);
  const appResponse = await fetch(origin + "/app/");
  assert.equal(appResponse.status, 200);
  assert.match(await appResponse.text(), /Prototipo no operativo/);
  assert.equal((await fetch(origin + "/assets/site.css")).status, 200);
  assert.equal((await fetch(origin + "/assets/site.js")).status, 200);
  assert.equal((await fetch(origin + "/src/identity-format.mjs")).status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store, max-age=0");
  assert.match(response.headers.get("content-security-policy"), /connect-src 'self'/);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal((await fetch(origin + "/src/project.mjs")).status, 200);
  assert.equal((await fetch(origin + "/.git/config")).status, 404);
}));

test("API permite flujo ficticio VE y bloquea jurisdicción ajena", async () => withDemo(async (origin) => {
  const initial = await (await fetch(origin + "/api/demo/state")).json();
  assert.deepEqual(initial.drafts, []);
  assert.equal(initial.simulated, true);
  let response = await fetch(origin + "/api/demo/drafts", post({countryCode:"CL",templateId:"acuerdo-demo"}));
  assert.equal(response.status, 422);
  response = await fetch(origin + "/api/demo/drafts", post({countryCode:"VE",templateId:"acuerdo-demo"}));
  assert.equal(response.status, 201);
  const data = await response.json();
  assert.equal(data.drafts.length, 1);
  const cancel = await fetch(origin + "/api/demo/drafts/" + data.drafts[0].id + "/cancel", post({countryCode:"VE"}));
  assert.equal(cancel.status, 200);
  const result = await cancel.json();
  assert.equal(result.drafts[0].status, "cancelled");
  assert.equal(result.auditIntegrityValid, true);
}));

test("bloquea origen externo, payloads extra y campos inesperados", async () => withDemo(async (origin) => {
  assert.equal((await fetch(origin + "/api/demo/drafts", post({countryCode:"VE",templateId:"acuerdo-demo"}, { Origin: "https://evil.invalid" }))).status, 403);
  assert.equal((await fetch(origin + "/api/demo/drafts", post({countryCode:"VE",templateId:"acuerdo-demo",cedula:"V-123"}))).status, 400);
  assert.equal((await fetch(origin + "/api/demo/drafts", {method:"POST",body:"hi"})).status, 415);
  assert.equal((await fetch(origin + "/api/demo/drafts", {method:"POST",headers:{"Content-Type":"application/json"},body:"not-json"})).status, 400);
  assert.equal((await fetch(origin + "/api/demo/drafts", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({note:"a".repeat(1200)})})).status, 413);
  assert.equal((await fetch(origin + "/api/demo/sign")).status, 404);
}));
