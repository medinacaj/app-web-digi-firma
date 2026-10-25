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
landing = landing.replaceAll("Explorar el prototipo", "Acceso a la plataforma");
landing = landing.replaceAll("Conocer la demostración", "Acceso a la plataforma");
landing = landing.replaceAll("Ver interfaz de desarrollo", "Conocer el acceso");
landing = landing.replaceAll("Abrir prototipo", "Ver acceso");
landing = landing.replaceAll("Explorar Digi-Firma", "Acceso a Digi-Firma");
landing = landing.replaceAll(">Prototipo</a>", ">Acceso</a>");
landing = landing.replace(
  "Ya existe una interfaz navegable y herramientas locales de demostración.",
  "El sitio público está preparado y la aplicación comercial continúa en desarrollo."
);

if (!landing.includes('content="index,follow"') ||
    landing.includes("noindex,nofollow,noarchive") ||
    !landing.includes('<html lang="es-VE">')) {
  throw new Error("La versión pública no cumple su contrato de publicación.");
}
const publicApp=`<!doctype html>
<html lang="es-VE">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="description" content="Acceso a Digi-Firma Venezuela. Plataforma en desarrollo; aún no disponible para operar firmas electrónicas.">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self'; script-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'">
  <title>Acceso a la plataforma · Digi-Firma Venezuela</title>
  <link rel="stylesheet" href="../assets/site.css">
</head>
<body>
  <header class="header"><div class="wrap nav">
    <a class="brand" href="../"><span class="brand-symbol" aria-hidden="true"><span>DF</span></span><span>Digi-Firma<small>VENEZUELA</small></span></a>
    <a href="../" class="button button-plain">Volver al sitio</a>
  </div></header>
  <main id="principal" class="wrap public-access" aria-labelledby="access-title">
    <span class="section-kicker">ACCESO A DIGI-FIRMA VENEZUELA</span>
    <h1 id="access-title">La plataforma para clientes está en preparación.</h1>
    <p>El registro, inicio de sesión y firma de documentos todavía no están habilitados. Estamos implementando identidad verificable, permisos de acceso, custodia privada de PDFs y validación jurídica venezolana.</p>
    <div class="status-pill"><i></i> Sin recepción de documentos ni datos personales</div>
    <p>Cuando el servicio esté operativo, este será el acceso de los usuarios autorizados. No introduzcas datos de identidad ni archivos en demostraciones no verificadas.</p>
    <a href="../" class="button button-primary">Volver al sitio principal</a>
  </main>
  <footer class="footer"><div class="wrap footer-bottom"><span>Digi-Firma Venezuela · Producto en desarrollo</span><span>Sin servicio de firma electrónica operativo</span></div></footer>
</body></html>`;

const publicCss=(await readFile(resolve(root, "assets/site.css"),"utf8")) +
`
/* Pantalla de acceso no operativo: parte del paquete público, no de la demo. */
.public-access{min-height:calc(100svh - 220px);display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding-top:70px;padding-bottom:95px}
.public-access h1{font-size:clamp(34px,5vw,57px);max-width:780px;line-height:1.12;letter-spacing:-2px;margin:18px 0 20px}
.public-access>p{max-width:720px;color:#6b7e9a;line-height:1.85;font-size:15px}
.public-access .status-pill{margin:16px 0}
.public-access>.button{margin-top:15px}
`;
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
await rm(out,{recursive:true,force:true});
for (const [name,contents] of files) {
  const target=resolve(out,name);
  if (!target.startsWith(out+"/")) throw new Error("Ruta de exportación insegura.");
  await mkdir(dirname(target),{recursive:true});
  await writeFile(target,contents,"utf8");
}
console.log("Paquete público aislado creado: "+files.size+" archivos; sin backend, demos, SQL ni datos privados.");
