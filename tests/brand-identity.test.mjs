import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const read=p=>readFileSync(fileURLToPath(new URL("../"+p,import.meta.url)),"utf8");
test("DigiFirma distingue su logotipo y favicon en portada, app y registro",()=>{
 const landing=read("index.html"),app=read("app/index.html"),registro=read("registro/index.html");
 for(const html of [landing,app,registro]) assert.match(html,/rel="icon"/);
 assert.match(landing,/digifirma-logo.svg/);
 assert.match(app,/digifirma-mark.svg/);
 assert.match(registro,/digifirma-mark.svg/);
 assert.match(landing,/Documentos claros/);
});
test("el sistema editorial usa paleta documental e icono vectorial legible",()=>{
 const css=read("assets/site.css"),appCss=read("assets/app.css"),logo=read("assets/brand/digifirma-logo.svg"),mark=read("assets/brand/digifirma-mark.svg");
 assert.match(css,/--df-ink:#0B2033/);
 assert.match(css,/--df-gold:#C79A4B/);
 assert.match(css,/Georgia/);
 assert.match(appCss,/--df-paper:#F6F4EE/);
 assert.match(logo,/DigiFirma/);
 assert.match(mark,/viewBox="0 0 64 64"/);
});
