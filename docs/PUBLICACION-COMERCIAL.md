# Modelo comercial y publicación web — Digi-Firma Venezuela

**Decisión de producto:** la web y la app deben ser accesibles por Internet para clientes venezolanos. El repositorio, el backend, credenciales y documentos de clientes continúan privados. **Sitio público no implica repositorio GitHub público.**

## Demo estática autorizada — 2026-11-10

El sitio y `/app/` se publican en GitHub Pages por autorización explícita del propietario. El panel permite herramientas locales de PDF/formato y una simulación de borradores y eventos con datos ficticios en memoria; se reinicia al recargar. No autentica, almacena documentos, envía solicitudes ni firma. El laboratorio HTTP permanece limitado a loopback.

Esta actualización sustituye las referencias históricas siguientes a `/app/` como pantalla de disponibilidad y a un paquete de siete archivos. La whitelist actual contiene trece: los siete originales más assets/app.css, assets/app.js, src/project.mjs, src/local-pdf.mjs, src/identity-format.mjs y src/browser-demo.mjs. El build no exporta server/, db/, tests/ ni documentación. GitHub Pages añade `.nojekyll` en la rama de publicación. Pages no aplica `_headers` ni `vercel.json`; el panel incorpora una CSP meta con `connect-src 'none'`.

## Separación y fases
1. **Sitio público (marketing, informativo)**: dominio raíz, funciones previstas, preguntas, SEO, transparencia. Puede publicarse antes de que el motor esté operativo, siempre sin prometer firmas legales, sin recoger cédulas ni PDFs.
2. **Aplicación para clientes (`/app/`)**: ruta accesible desde Internet pero solo habilitar operaciones con autenticación real, sesiones revocables, RLS y controles de jurisdicción. El paquete actual muestra únicamente una pantalla de disponibilidad, sin demo privada ni formulario de registro.
3. **API y documentos**: nunca archivos estáticos públicos; acceso tras validación de usuario, organización, documento y acto VE. Secretos y material criptográfico fuera del repositorio y del cliente.

## Paquete de despliegue aislado
Ejecutar desde la raíz con Node.js 22:
```bash
node scripts/build-public.mjs
```
Se crea `dist/public` con **exactamente siete archivos permitidos**: `index.html`, `app/index.html`, `assets/site.css`, `assets/site.js`, `robots.txt`, `vercel.json`, `_headers`.

No se exportan `src/`, `server/`, `db/`, `docs/`, `tests/`, `.github/`, `README.md`, claves o archivos de configuración privada. La landing tiene `index,follow`; el acceso `/app/` conserva `noindex`; sin sitemap hasta elegir dominio definitivo. Se añaden cabeceras de seguridad para Vercel, Netlify y Cloudflare Pages, sujetas a verificación HTTP tras desplegar. GitHub Actions publica **solo un artifact privado de CI**, no un website público.

`vercel.json` es específico de Vercel; `_headers` es compatible con Netlify y Cloudflare Pages. Netlify ofrece un plan Free que admite proyectos comerciales y permite publicar la carpeta precompilada mediante [Netlify Drop](https://app.netlify.com/drop), sin conectar GitHub. El operador debe crear o conectar su cuenta y revisar términos, créditos/límites y visibilidad antes de publicar. Para otros hostings deben replicarse cabeceras sin exponer contenido adicional.

## Hosting y contrato comercial
La cuenta Vercel conectada aparece con plan **Hobby** (consulta del 25-10-2026). Sus condiciones restringen el uso a proyectos no comerciales. La oferta comercial exige otro plan/hosting: Vercel Pro o proveedor alternativo que permita actividad comercial. **No se contrató, actualizó ni desplegó nada**, porque iniciar Pro supone gastos y el usuario no ha elegido proveedor ni aprobado una compra.

Para máxima propiedad intelectual, desplegar exclusivamente la carpeta `dist/public`, sin conectar el repositorio privado completo al proveedor cuando no haga falta. Los assets del frontend serán públicos por naturaleza; código fuente privado, backend y claves no.

## Requisitos antes de operación real
- Hosting/compliance comercial autorizado, dominio, TLS/HSTS y monitoreo.
- Login seguro, MFA admins, recuperación de contraseña, sesiones, antifraude.
- Base de datos persistente y RLS comprobadas bajo identidad real, almacenamiento privado cifrado y backups.
- Custodia, consentimiento, certificados y PSC acreditado por SUSCERTE según caso de uso.
- Privacidad, condiciones comerciales, términos y validación jurídica local.
- Auditoría independiente y aprobación de `docs/RELEASE-GATES.md`.

**Estado:** paquete marketing preparado, sin despliegue público; app comercial aún no disponible.
