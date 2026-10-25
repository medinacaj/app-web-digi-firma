# Digi-Firma Venezuela · aplicación web (proyecto en desarrollo)

> **País único y mercado exclusivo: Venezuela (VE).**
> **Estado:** base de desarrollo con laboratorio local y utilidades en navegador; no es un servicio operativo. NO genera firmas válidas ni emite certificados electrónicos.
> El repositorio debe permanecer **privado**. No activar un despliegue público sin autorización y revisión de seguridad.

Digi-Firma es el nombre interno de una plataforma web para preparar, solicitar, verificar y custodiar documentos y firmas electrónicas **para el mercado exclusivamente venezolano**, conforme al marco legal venezolano y tras la validación jurídica correspondiente.

La marca comercial aún no está aprobada. `FirmaEnLínea` continúa únicamente como candidato, no como nombre decidido.

## Principios no negociables

1. **VE exclusivo:** el alcance comercial, flujos, registros, reglas del backend, contratos y verificaciones se limitan a Venezuela. La constante `jurisdiction.countryCode = "VE"` es una protección declarativa del prototipo, no una validación de backend.
2. **Derecho venezolano:** Decreto-Ley N.º 1.204 de 2001, Reglamento Parcial y resoluciones pertinentes de SUSCERTE. No aplicar categorías ni requisitos jurídicos de otros países por analogía.
3. **Certificación:** diferenciar firma con requisitos del artículo 16 de la firma certificada por PSC conforme al artículo 18. Integraciones sujetas a acreditación vigente por SUSCERTE y revisión legal.
4. **Privacidad y propiedad intelectual:** no publicar código, documentos ni datos reales. No se almacena información de usuarios en la fase actual.
5. **Veracidad:** la interfaz no debe simular que una firma real está disponible.

## Ejecutar el prototipo

Se requiere servidor HTTP estático (los módulos ES no funcionan de forma fiable con `file://`).

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/`.

## Pruebas

Node.js 22 recomendado, sin instalar paquetes de terceros.

```bash
node --check assets/app.js
node --check src/project.mjs
node --test
```

El CI prueba sintaxis, reglas de alcance de jurisdicción y algunas invariantes de estado. **No es un pentest ni una certificación legal.**

## Documentación

- [Producto y alcance Venezuela](docs/PRODUCTO.md)
- [Arquitectura y control territorial](docs/ARQUITECTURA.md)
- [Seguridad y privacidad](docs/SEGURIDAD.md)
- [Normativa Venezuela](docs/LEGAL-VENEZUELA.md)
- [Roadmap](docs/ROADMAP.md)
- [Progreso verificable](docs/PROGRESO.md)

## Qué todavía no existe

No hay backend, registro de usuarios, validación de cédulas o RIF, custodia de archivos, firma electrónica real, certificado, prestador integrado, facturación ni despliegue. Cualquier operación real requiere controles, pruebas y aprobación legal.

## Seguimiento GitHub

- [Plan maestro](https://github.com/medinacaj/app-web-digi-firma/issues/1).
- [PR de inicio fusionada](https://github.com/medinacaj/app-web-digi-firma/pull/12).
- Actualizar `docs/PROGRESO.md` en cada cambio verificado. No fusionar cambios sin pruebas.

## Laboratorio local implementado

Se añadió un servidor HTTP de prueba, solo para uso local, **desactivado por defecto** y enlazado a `127.0.0.1`. No es un entorno de producción. Tiene dos plantillas ficticias y permite crear/cancelar borradores y visualizar eventos SHA-256 en memoria. **No sube archivos, no contiene autenticación real, no genera firmas, no certifica identidad y no custodia datos.**

Para iniciar únicamente este laboratorio (Node.js 22):
```bash
DIGIFIRMA_DEMO=1 node server/dev.mjs
```
En PowerShell:
```powershell
$env:DIGIFIRMA_DEMO = "1"
node server/dev.mjs
```
Abrir `http://127.0.0.1:8787/` y entrar a **Solicitudes** para generar borradores sintéticos. El estado se borra al reiniciar el proceso. No ingresar datos reales de personas o empresas. El servidor rechaza `NODE_ENV=production`, orígenes remotos, entradas fuera de VE y cualquier intento de firma real.

### Pruebas de laboratorio
```bash
node --test
```
Incluyen flujos de la API, límites, validaciones de cuerpo, control de origen y verificación de cadena de hashes, además de la UI/alcance. **La cadena de hashes en memoria no demuestra inviolabilidad ni equivale a una firma electrónica.**

### Bloqueos de lanzamiento
Para uso real faltan autenticación e identidad verificables, persistencia privada cifrada, subida/escaneo de PDFs, firmas ajustadas a ley venezolana, auditoría independiente y, cuando proceda, integración con PSC acreditado por SUSCERTE. La demo no reemplaza esos pasos.

## Comprobación de integridad de PDF en el navegador

El módulo **Documentos** permite calcular la huella SHA-256 de un PDF hasta 20 MiB con Web Crypto. El navegador lee el archivo localmente, valida solo su encabezado `%PDF-`, calcula el hash y permite compararlo con otro valor de 64 caracteres. **No transmite el contenido** ni lo guarda, pero tampoco valida que el PDF sea seguro, que tenga una firma válida o que su autor sea quien dice ser. No abrir documentos desconocidos con herramientas vulnerables.

La función opera en un contexto seguro (`http://127.0.0.1:8787` o HTTPS) y es independiente del backend de demostración; en modo estático puede funcionar si el navegador permite Web Crypto en ese origen.

## Control de cambios y seguridad
- [Política de seguridad y reporte privado](SECURITY.md)
- [Puertas antes de habilitar producción](docs/RELEASE-GATES.md)
- CODEOWNERS: `@medinacaj` (la revisión obligatoria requiere además configurar reglas de rama en GitHub).
- El entorno de demostración tiene bloqueo de arranque en producción y no debe estar accesible en Internet.

## Comprobación ilustrativa de formatos venezolanos

La sección Configuración contiene un validador **local de estructura**, sin almacenar cédulas o RIF. Cédula: ejemplo V/E + 6–8 dígitos; RIF: letra + 9 dígitos. Su conjunto de prefijos conocidos es preliminar y no excluye otros oficialmente registrados. No se valida dígito de control ni se consulta SAIME/SENIAT; **no se acredita identidad, registro, domicilio, capacidad ni representación**. Para producción se requiere verificación mediante fuente autorizada y confirmación legal. Ver `src/identity-format.mjs`.

## Sitio web y panel de trabajo

El repositorio ahora separa:
- **/**: sitio web informativo, diseño responsive, navegación accesible, FAQ, capacidades previstas y estado real. No recoge datos ni declara acreditaciones.
- **/app/**: espacio de trabajo experimental con herramientas locales y laboratorio de borradores sintéticos.

Para ejecutar ambos desde el laboratorio: `DIGIFIRMA_DEMO=1 node server/dev.mjs` y visitar `http://127.0.0.1:8787/` (sitio) o `http://127.0.0.1:8787/app/` (panel). También se pueden visualizar estáticamente con `python3 -m http.server 8000`, pero las operaciones del laboratorio requieren el servidor de desarrollo.

**Despliegue público: NO habilitado.** El sitio está preparado en código pero no autoriza publicar las funciones de firma o recopilar datos. Los metadatos tienen `noindex` durante desarrollo; retirar ese bloqueo requiere una decisión de lanzamiento independiente.

## Contratos de backend y esquema propuesto

Se incluyeron módulos de **autorización por rol/organización y política VE** con denegación por defecto, más una máquina de estados de solicitudes de prueba que **no permite firmar**. También existe un esquema PostgreSQL 14+ **probado en PostgreSQL 16 efímero de CI**, con controles `CHECK`, claves compuestas y RLS. No está desplegado ni integrado con una aplicación. No existen conexiones de base de datos, sesiones reales, autenticación ni despliegue de API de producción.

Ver [plan de backend](docs/BACKEND-PLAN.md) y [migración SQL](db/migrations/001_base_ve.sql). Los contratos requieren actores derivados de sesiones verificadas por servidor, nunca desde el navegador. No usar la migración en producción sin tests de PostgreSQL y revisión especializada.

## Contrato de API sin servidor productivo
El módulo `server/api-contract.mjs` añade un controlador preparado para conectar **posteriormente** un proveedor de identidad y un repositorio de datos. Incluye listado mínimo de metadatos y creación de solicitudes sintéticas con validación de permisos y país VE. Bloquea la firma explícitamente y no escucha red por sí solo. Ver `docs/API.md`; ningún token de demostración es una credencial de producción.

## Comprobación real de carga en navegador
`tests/browser-smoke.sh` arranca el laboratorio sintético en `127.0.0.1` y usa Chrome headless en CI para inspeccionar el DOM de `/` y `/app/`. Comprueba que la portada, el panel y el estado del laboratorio carguen sin exponer archivos privados. **Es smoke test de Chromium, no auditoría visual completa ni WCAG.**

## Destino comercial y publicación pública
**Decisión de negocio:** web abierta al público y futura app de clientes para Venezuela, con GitHub privado. `scripts/build-public.mjs` exporta únicamente seis archivos del sitio público a `dist/public`, excluyendo backend, demos, SQL y documentación. La página `/app/` del paquete público informa que el acceso aún no está operativo; el laboratorio sigue siendo solo local.

```bash
node scripts/build-public.mjs
node --test tests/public-build.test.mjs
```

**Ningún despliegue se ha activado:** el proveedor de hosting debe admitir uso comercial y la conexión Vercel actual está en plan Hobby no comercial. Ver `docs/PUBLICACION-COMERCIAL.md`.

El paquete también incluye `_headers` para Netlify/Cloudflare Pages. En Netlify Free es posible publicar un sitio comercial sin enlazar GitHub: generar `dist/public` y subir **únicamente esa carpeta** mediante Netlify Drop; el proyecto sigue necesitando revisión legal y el área `/app/` continúa deshabilitada. La publicación aún no se ha ejecutado.
