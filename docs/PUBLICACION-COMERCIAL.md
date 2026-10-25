# Modelo comercial y publicación web — Digi-Firma Venezuela

**Decisión de producto:** la web y la app deben ser accesibles por Internet para clientes venezolanos. El repositorio, el backend, credenciales y documentos de clientes continúan privados. **Sitio público no implica repositorio GitHub público.**

## Separación y fases
1. **Sitio público (marketing, informativo)**: dominio raíz, funciones previstas, preguntas, SEO, transparencia. Puede publicarse antes de que el motor esté operativo, siempre sin prometer firmas legales, sin recoger cédulas ni PDFs.
2. **Aplicación para clientes (`/app/`)**: ruta accesible desde Internet pero solo habilitar operaciones con autenticación real, sesiones revocables, RLS y controles de jurisdicción. El paquete actual muestra únicamente una pantalla de disponibilidad, sin demo privada ni formulario de registro.
3. **API y documentos**: nunca archivos estáticos públicos; acceso tras validación de usuario, organización, documento y acto VE. Secretos y material criptográfico fuera del repositorio y del cliente.

## Paquete de despliegue aislado
Ejecutar desde la raíz con Node.js 22:
```bash
node scripts/build-public.mjs
```
Se crea `dist/public` con **exactamente seis archivos permitidos**: `index.html`, `app/index.html`, `assets/site.css`, `assets/site.js`, `robots.txt`, `vercel.json`.

No se exportan `src/`, `server/`, `db/`, `docs/`, `tests/`, `.github/`, `README.md`, claves o archivos de configuración privada. La landing tiene `index,follow`; el acceso `/app/` conserva `noindex`; sin sitemap hasta elegir dominio definitivo. Se añaden cabeceras de seguridad para Vercel, sujetas a revisión tras desplegar. GitHub Actions publica **solo un artifact privado de CI**, no un website público.

`vercel.json` es específico de Vercel. Para otro hosting deben replicarse cabeceras en su configuración sin exponer contenido adicional.

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
