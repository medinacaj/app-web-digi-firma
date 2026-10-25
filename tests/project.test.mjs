import test from "node:test";
import assert from "node:assert/strict";
import { milestones, capabilities, projectProgress, jurisdiction, isSupportedJurisdiction } from "../src/project.mjs";

test("jurisdicción exclusiva de Venezuela", () => {
  assert.equal(jurisdiction.countryCode, "VE");
  assert.equal(jurisdiction.countryName, "Venezuela");
  assert.equal(jurisdiction.locale, "es-VE");
  assert.equal(jurisdiction.exclusive, true);
});

test("únicamente VE es país admitido en el dominio", () => {
  for (const code of ["VE", "ve", " VE "]) assert.equal(isSupportedJurisdiction(code), true);
  for (const code of ["CL", "CO", "US", "ES", "", null, undefined, 58, {}, []]) {
    assert.equal(isSupportedJurisdiction(code), false);
  }
});

test("todos los hitos poseen identificador único", () => {
  assert.equal(new Set(milestones.map((m) => m.id)).size, milestones.length);
});

test("el prototipo no declara servicios reales de firma activos", () => {
  assert.ok(Object.values(capabilities).every((value) => value === false));
});

test("avance no cuenta tareas en progreso como completadas", () => {
  assert.deepEqual(projectProgress(), { total: 8, complete: 0, percent: 0 });
});

test("cálculo de progreso contempla lista vacía y resultado parcial", () => {
  assert.deepEqual(projectProgress([]), { total: 0, complete: 0, percent: 0 });
  assert.deepEqual(projectProgress([{ status: "done" }, { status: "pending" }]), { total: 2, complete: 1, percent: 50 });
});
