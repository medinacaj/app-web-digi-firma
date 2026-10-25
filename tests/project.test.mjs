import test from "node:test";
import assert from "node:assert/strict";
import { milestones, capabilities, projectProgress } from "../src/project.mjs";

test("todos los hitos poseen identificador único", () => {
  assert.equal(new Set(milestones.map((m) => m.id)).size, milestones.length);
});

test("prototipo no declara servicios de firma activos", () => {
  assert.ok(Object.values(capabilities).every((value) => value === false));
});

test("avance no cuenta tareas en progreso como completadas", () => {
  assert.deepEqual(projectProgress(), { total: 8, complete: 0, percent: 0 });
});

test("cálculo de progreso contempla lista vacía y resultado parcial", () => {
  assert.deepEqual(projectProgress([]), { total: 0, complete: 0, percent: 0 });
  assert.deepEqual(projectProgress([{ status: "done" }, { status: "pending" }]), { total: 2, complete: 1, percent: 50 });
});
