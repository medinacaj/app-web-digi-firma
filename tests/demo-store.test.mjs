import test from "node:test";
import assert from "node:assert/strict";
import { DemoStore, DemoError, assertVenezuela } from "../server/demo-store.mjs";

test("VE es requisito de cada mutación, no un filtro visual", () => {
  assert.doesNotThrow(() => assertVenezuela("VE"));
  for (const invalid of ["ve", "CL", "CO", "US", "", null, undefined, 58]) {
    assert.throws(() => assertVenezuela(invalid), (e) => e.code === "JURISDICTION_NOT_ALLOWED");
  }
});

test("solo se crean borradores de plantillas ficticias sin datos personales", () => {
  const db = new DemoStore({ now: () => "2026-10-25T12:00:00.000Z", id: () => "draft-1" });
  assert.throws(() => db.create({countryCode:"CO",templateId:"acuerdo-demo"}), DemoError);
  assert.throws(() => db.create({countryCode:"VE",templateId:"personal-data"}), DemoError);
  const data = db.create({countryCode:"VE",templateId:"acuerdo-demo"});
  assert.equal(data.drafts[0].status, "draft");
  assert.equal(data.countryCode, "VE");
  assert.equal(data.simulated, true);
  assert.equal(data.events.length, 1);
  assert.equal(data.auditIntegrityValid, true);
  assert.equal(JSON.stringify(data).includes("signer"), false);
});

test("no permite cancelar fuera de VE, ni cancelar dos veces", () => {
  const db = new DemoStore({ id: () => "demo-123" });
  db.create({ countryCode: "VE", templateId: "solicitud-demo" });
  assert.throws(() => db.cancel({ countryCode: "US", id: "demo-123" }), DemoError);
  const state = db.cancel({ countryCode: "VE", id: "demo-123" });
  assert.equal(state.drafts[0].status, "cancelled");
  assert.equal(state.events.length, 2);
  assert.equal(state.events[1].previous, state.events[0].hash);
  assert.ok(state.auditIntegrityValid);
  assert.throws(() => db.cancel({ countryCode: "VE", id: "demo-123" }), (e) => e.status === 409);
  assert.throws(() => db.cancel({ countryCode: "VE", id: "../demo" }), (e) => e.status === 400);
});

test("el estado no es mutable desde el consumidor", () => {
  const db = new DemoStore({ id: () => "demo-123" });
  const state = db.create({ countryCode: "VE", templateId: "acuerdo-demo" });
  state.drafts[0].status = "alterado";
  state.events[0].hash = "tampered";
  const fresh = db.state();
  assert.equal(fresh.drafts[0].status, "draft");
  assert.ok(fresh.auditIntegrityValid);
});

test("límite de borradores sintéticos por sesión del proceso", () => {
  let seq = 0;
  const db = new DemoStore({ id: () => "d-" + ++seq });
  for (let i = 0; i < 30; i++) db.create({ countryCode: "VE", templateId: "acuerdo-demo" });
  assert.throws(() => db.create({ countryCode: "VE", templateId: "acuerdo-demo" }), (e) => e.status === 429);
});
