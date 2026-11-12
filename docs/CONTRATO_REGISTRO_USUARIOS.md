# Registro obligatorio: contrato de identidad (sin despliegue)

**Estado 2026-11-12:** capa técnica implementada con pruebas; **no es un servicio de registro público**. No hay proveedor configurado, entregador de email, sesión HTTP ni cuenta comercial real. No expone rutas desde Pages. El usuario confirmó que todos los operadores y firmantes deben **registrarse** antes de usar un expediente real.

## Implementado en esta fase

`server/registration-contract.mjs` ofrece el **adaptador puro de servidor** `createRegistrationContract({ identityGateway, termsVersion, abuseGuard })`. Al no recibir las tres dependencias **falla durante la inicialización**, evitando el registro inseguro por defecto.

| Acción de contrato | Comportamiento de la capa | Lo que sigue faltando |
|---|---|---|
| `POST /api/v1/auth/register` | Valida `email`, `password` (12 a 1024), `countryCode='VE'`, aceptación de términos y versión esperada; rechaza claves extra como `role` y `tenantId` | Proveedor de identidad aprobado, entrega de confirmación, tratamiento de datos y persistencia segura |
| `POST /api/v1/auth/verify-email` | Valida la forma del token y delega verificación al proveedor | Token aleatorio de un solo uso, hash en servidor, caducidad, revocación y límites de reintentos |
| Antienumeración | Responde con `202 CHECK_EMAIL` ante alta aceptada, sin devolver existencia de cuenta ni email | El proveedor también debe ocultar resultados duplicados y coordinar políticas de reintentos |
| Antiautomación | Requiere `abuseGuard` inyectado y deniega al rechazarlo | Aplicar límites **persistentes**, rate limit por IP/cuenta y protección ante bots en infraestructura |
| Errores de proveedor | Devuelve error genérico `IDENTITY_UNAVAILABLE` sin detalles SQL o contraseñas | Observabilidad segura, métricas anonimizadas y alertas |

**Importante:** el contrato recibe `trustedSource` del futuro adaptador HTTP de confianza, nunca de campos libres del JSON ni de cabeceras proxy sin validar. El código no crea cookies ni emite JWT. Está prohibido conectar directo este objeto a navegador o GitHub Pages; el backend productivo debe seleccionar tecnología, definir protección CSRF/Origin/CORS, sesión `HttpOnly`/`Secure`/SameSite según arquitectura, y perfiles de seguridad.

## Pruebas disponibles

`tests/registration-contract.test.mjs` valida registro no enumerativo, rechazo de registros con país incorrecto, datos extra y contraseñas débiles, ausencia de llamadas al proveedor ante solicitudes inválidas, bloqueo de abuso, error genérico y verificación de correo. Usar `node --test tests/registration-contract.test.mjs` y la suite del repositorio.

## Siguientes pasos para ser funcional

1. Elegir proveedor: condiciones de datos, disponibilidad y residencia pertinentes a Venezuela, costes y soporte de MFA. No elegir sin autorización.
2. Backend HTTPS con controles de abuse, email delivery, recuperación/revocación y sesión segura. El proveedor debe gestionar hashing y no guardar contraseñas en SQL de producto ni en logs.
3. Alinear usuarios con `digi.memberships`, impedir elevación entre empresas y probar 2 usuarios/2 organizaciones mediante conexión runtime sin `BYPASSRLS`.
4. Implementar login, logout, recovery, invitación a firmantes y MFA para administradores; cada acción debe ser revisada contra el modelo de amenazas.
5. Probar E2E, privacidad, legalidad y aprobar publicación por separado. **No habilitar firma real ni certificados por añadir autenticación.**

Referencias: [Issue #25 — Registro obligatorio](https://github.com/medinacaj/app-web-digi-firma/issues/25), [Issue #5 — Identidad](https://github.com/medinacaj/app-web-digi-firma/issues/5), [PR #26 — Vista previa de registro](https://github.com/medinacaj/app-web-digi-firma/pull/26).
