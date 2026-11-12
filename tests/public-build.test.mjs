import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const build=fileURLToPath(new URL("../scripts/build-public.mjs",import.meta.url));
async function collect(directory,base="") {
  const entries=await readdir(directory,{withFileTypes:true});
  const paths=[];
  for (const entry of entries) {
    const p=base?base+"/"+entry.name:entry.name;
    if (entry.isDirectory()) paths.push(...await collect(join(directory,entry.name),p));
    else paths.push(p);
  }
  return paths.sort();
}
test("paquete público expone solo assets aprobados sin backend ni repositorio",async()=>{
  const temp=await mkdtemp(join(tmpdir(),"digifirma-public-"));
  try{
    const proc=spawnSync(process.execPath,[build,"--out",temp],{encoding:"utf8",timeout:15000});
    assert.equal(proc.status,0,proc.stderr);
    const paths=await collect(temp);
    assert.deepEqual(paths.sort(),[
      "_headers","app/index.html","assets/site.css","assets/site.js","index.html","robots.txt","vercel.json",
      "assets/app.css","assets/app.js","src/project.mjs","src/local-pdf.mjs","src/identity-format.mjs","src/browser-demo.mjs",
      "registro/index.html","assets/registro.css"
    ].sort());
    const html=await readFile(join(temp,"index.html"),"utf8");
    assert.match(html, /<html lang="es-VE">/);
    assert.match(html, /content="index,follow"/);
    assert.match(html, /Plataforma exclusiva para Venezuela/);
    assert.match(html, /no permite realizar firmas electrónicas reales/i);
    assert.doesNotMatch(html, /noindex,nofollow,noarchive/);
    const gate=await readFile(join(temp,"app","index.html"),"utf8");
    assert.match(gate,/noindex,nofollow/);
    assert.match(gate,/data-demo-mode="browser"/);
    assert.match(gate, /class="primary-action" data-view="solicitudes"/);
    assert.match(gate,/Crear borrador de prueba/);
    assert.match(gate,/se pierden al recargar/);
    assert.match(gate,/connect-src 'none'/);
    assert.doesNotMatch(gate,/input.+type="password"|api\/v1/);
    assert.match(gate,/id="pdf-local"/);
    const register=await readFile(join(temp,"registro","index.html"),"utf8");
    assert.match(register,/REGISTRO NO DISPONIBLE/);
    assert.match(register,/sin cuenta/i);
    assert.match(register,/form-action 'none'/);
    assert.doesNotMatch(register,/<form\\b|type="password"|type="submit"|<script\\b/i);
    assert.match(html,/href="\\.\\/registro\\/"/);
    const json=JSON.parse(await readFile(join(temp,"vercel.json"),"utf8"));
    assert.ok(json.headers.some(row=>row.headers.some(h=>h.key==="Content-Security-Policy")));
    const headers=await readFile(join(temp,"_headers"),"utf8");
    assert.match(headers,/X-Content-Type-Options: nosniff/);
    assert.match(headers,/X-Robots-Tag: noindex, nofollow/);
    const script=await readFile(join(temp,"assets/site.js"),"utf8");
    assert.doesNotMatch(script,/api\/demo|api\/v1|Bearer |localStorage|analytics/);
  } finally {await rm(temp,{recursive:true,force:true});}
});
