import test from "node:test";
import assert from "node:assert/strict";
import { normalizeIdentifier, examineVenezuelanIdentifier } from "../src/identity-format.mjs";
test("normaliza ejemplos sin conservar separadores", () => {
  assert.equal(normalizeIdentifier(" v-01234567 "), "V01234567");
  assert.equal(normalizeIdentifier(" j-12345678-9 "), "J123456789");
  assert.equal(normalizeIdentifier(null), "");
});
test("cédula: evalúa solo estructura, jamás autentica", () => {
  const good = examineVenezuelanIdentifier("cedula", "V-1234567");
  assert.equal(good.formatMatches, true);
  assert.equal(good.verified, false);
  assert.equal(good.normalized, "V1234567");
  for (const sample of ["J-12345678", "V-123", "E-123456789", "ABC", ""]) {
    assert.equal(examineVenezuelanIdentifier("cedula", sample).formatMatches, false);
  }
});
test("RIF: verifica estructura, nunca dígito de control ni existencia", () => {
  const result = examineVenezuelanIdentifier("rif", "J-12345678-9");
  assert.equal(result.formatMatches, true);
  assert.equal(result.verified, false);
  assert.equal(result.recognizedPrefix, true);
  const rare = examineVenezuelanIdentifier("rif", "C123456789");
  assert.equal(rare.formatMatches, true);
  assert.equal(rare.recognizedPrefix, false);
  assert.equal(rare.verified, false);
  assert.equal(examineVenezuelanIdentifier("rif", "J-123").formatMatches, false);
});
test("no procesa tipos no previstos ni objetos", () => {
  assert.equal(examineVenezuelanIdentifier("pasaporte", "P123456789").formatMatches, false);
  assert.equal(examineVenezuelanIdentifier("rif", {}).formatMatches, false);
  assert.equal(examineVenezuelanIdentifier("cedula", "<script>").formatMatches, false);
});
