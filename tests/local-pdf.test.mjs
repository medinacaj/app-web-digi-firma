import test from "node:test";
import assert from "node:assert/strict";
import { isPdfHeader, sha256LocalPdf, compareSha256, LocalPdfError, PDF_MAX_BYTES } from "../src/local-pdf.mjs";
import { createHash } from "node:crypto";

const demoBytes = new TextEncoder().encode("%PDF-1.7\n%archivo de prueba, no es un PDF válido\n");
test("SHA-256 local coincide con crypto de Node para mismos bytes", async () => {
  assert.ok(isPdfHeader(demoBytes));
  const expected = createHash("sha256").update(demoBytes).digest("hex");
  const actual = await sha256LocalPdf(demoBytes);
  assert.equal(actual, expected);
  assert.equal(compareSha256(actual, expected.toUpperCase()), true);
  assert.equal(compareSha256(actual, "a".repeat(64)), false);
});
test("se rechazan datos sin cabecera, vacío o tamaño excesivo", async () => {
  assert.equal(isPdfHeader(new TextEncoder().encode("HTML")), false);
  await assert.rejects(() => sha256LocalPdf(new Uint8Array()), LocalPdfError);
  await assert.rejects(() => sha256LocalPdf(new TextEncoder().encode("No PDF")), LocalPdfError);
  const big = new Uint8Array(PDF_MAX_BYTES + 1);
  big.set([37,80,68,70,45], 0);
  await assert.rejects(() => sha256LocalPdf(big), (e) => e.code === "LIMIT");
});
test("los hashes inválidos no se interpretan como comparación correcta", () => {
  assert.throws(() => compareSha256("a".repeat(64), "xyz"), LocalPdfError);
  assert.throws(() => compareSha256("", "a".repeat(64)), LocalPdfError);
});
