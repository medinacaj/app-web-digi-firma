#!/usr/bin/env node
// Exporta SOLAMENTE archivos públicos aprobados. No conecta el repositorio con el hosting.
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
const outputArg = process.argv[2] === "--out" && typeof process.argv[3] === "string"
  ? process.argv[3]
  : new URL("../dist/public/", import.meta.url).pathname;
const out = resolve(outputArg);
const root = resolve(sourceRoot);
if (out === root || out === resolve(root, "..") || out.length < 5) {
  throw new Error("Ruta de exportación inválida.");
}
const original = await readFile(resolve(root, "index.html"), "utf8");
let landing = original.replace(
  'content="noindex,nofollow,noarchive"',
  'content="index,follow"'
);
// La página pública no anuncia funciones todavía inexistentes como operativas.
landing = landing.replaceAll("Explorar el prototipo", "Probar el panel");
landing = landing.replaceAll("Conocer la demostración", "Probar el panel");
landing = landing.replaceAll("Ver interfaz de desarrollo", "Probar el panel");
landing = landing.replaceAll("Abrir prototipo", "Probar el panel");
landing = landing.replaceAll("Explorar Digi-Firma", "Probar el panel");
landing = landing.replaceAll(">Prototipo</a>", ">Panel de pruebas</a>");
landing = landing.replaceAll("crear borradores ficticios en un servidor local", "simular borradores ficticios en el navegador");
landing = landing.replace(
  "Ya existe una interfaz navegable y herramientas locales de demostración.",
  "Puedes probar las herramientas locales y simular borradores en el navegador. La aplicación comercial continúa en desarrollo."
);

if (!landing.includes('content="index,follow"') ||
    landing.includes("noindex,nofollow,noarchive") ||
    !landing.includes('<html lang="es-VE">')) {
  throw new Error("La versión pública no cumple su contrato de publicación.");
}
const publicApp = (await readFile(resolve(root, "app/index.html"), "utf8"))
  .replace('<html lang="es-VE">', '<html lang="es-VE" data-demo-mode="browser">')
  .replace("default-src 'self';", "default-src 'self'; connect-src 'none';")
  .replace("prototipo privado de gestión de firmas electrónicas", "panel de demostración de herramientas locales")
  .replace("Entorno de desarrollo", "Panel de pruebas")
  .replace(/<button type="button" class="primary-action" disabled[^>]*>[\s\S]*?<\/button>/,
    '<button type="button" class="primary-action" data-view="solicitudes">+ Borrador de prueba</button>')
  .replace("No hay usuarios autenticados ni backend.", "Demo en tu navegador: los borradores y eventos se pierden al recargar. No hay cuentas ni servidor de datos.")
  .replace("Laboratorio local de solicitudes", "Simulación de solicitudes en el navegador")
  .replace("ni guarda información al cerrar el servidor", "ni guarda información al recargar la página")
  .replace("El laboratorio requiere el servidor local de demostración.", "Iniciando simulación en tu navegador…")
  .replace("Proyecto privado en desarrollo", "Panel de pruebas · Datos ficticios");
const publicCss = await readFile(resolve(root, "assets/site.css"), "utf8");
const publicJs = await readFile(resolve(root, "assets/site.js"),"utf8");
const securityHeaders=[
  {
    source:"/(.*)",
    headers:[
      {key:"X-Content-Type-Options",value:"nosniff"},
      {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
      {key:"X-Frame-Options",value:"DENY"},
      {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"},
      {key:"Content-Security-Policy",value:"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"},
      {key:"Strict-Transport-Security",value:"max-age=31536000; includeSubDomains"}
    ]
  },
  {source:"/app/(.*)",headers:[{key:"X-Robots-Tag",value:"noindex, nofollow"}]}
];
// _headers se aplica en Netlify y Cloudflare Pages sin conectar el repositorio privado.
const staticHeaders = [
  "/*",
  "  X-Content-Type-Options: nosniff",
  "  Referrer-Policy: strict-origin-when-cross-origin",
  "  X-Frame-Options: DENY",
  "  Permissions-Policy: camera=(), microphone=(), geolocation=()",
  "  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "  Strict-Transport-Security: max-age=31536000; includeSubDomains",
  "",
  "/app/*",
  "  X-Robots-Tag: noindex, nofollow",
  ""
].join(String.fromCharCode(10));
const files = new Map([
 ["index.html",landing],
 ["app/index.html",publicApp],
 ["assets/site.css",publicCss],
 ["assets/site.js",publicJs],
 ["robots.txt","User-agent: *\nAllow: /\nDisallow: /app/\n"],
 ["_headers",staticHeaders],
 ["vercel.json",JSON.stringify({version:2,headers:securityHeaders},null,2)+"\n"]
]);
for (const name of ["assets/app.css", "assets/app.js", "src/project.mjs", "src/local-pdf.mjs", "src/identity-format.mjs", "src/browser-demo.mjs"]) {
  files.set(name, await readFile(resolve(root, name), "utf8"));
}
await rm(out,{recursive:true,force:true});
for (const [name,contents] of files) {
  const target=resolve(out,name);
  if (!target.startsWith(out+"/")) throw new Error("Ruta de exportación insegura.");
  await mkdir(dirname(target),{recursive:true});
  await writeFile(target,contents,"utf8");
}
console.log("Paquete público aislado creado: "+files.size+" archivos; sin backend, SQL ni datos privados; simulación solo en navegador.");
