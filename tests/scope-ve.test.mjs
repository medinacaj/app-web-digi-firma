import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("no se conserva documentación de jurisdicción chilena en el producto", () => {
  assert.equal(existsSync(new URL("../docs/LEGAL-CHILE.md", import.meta.url)), false);
  for (const path of ["README.md", "docs/PRODUCTO.md", "docs/ARQUITECTURA.md", "docs/LEGAL-VENEZUELA.md", "index.html"]) {
    assert.doesNotMatch(read(path), /Chile|19\.799|21\.719|entidadacreditadora\.gob\.cl/i, path);
  }
});

test("la interfaz indica el carácter exclusivo venezolano y el estado no operativo", () => {
  const html = read("index.html");
  assert.match(html, /<html lang="es-VE">/);
  assert.match(html, /exclusiva para Venezuela|exclusivamente en Venezuela/i);
  assert.match(html, /no permite realizar firmas electrónicas reales/i);
  const app = read("app/index.html");
  assert.match(app, /Prototipo no operativo/);
  assert.match(app, /disabled title="Se habilitará/);
});

test("el README identifica jurisdicción y regulación venezolana", () => {
  const readme = read("README.md");
  assert.match(readme, /mercado exclusivamente venezolano/i);
  assert.match(readme, /SUSCERTE/);
  assert.match(readme, /no genera firmas válidas/i);
});
