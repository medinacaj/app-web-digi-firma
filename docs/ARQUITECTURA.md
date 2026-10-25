# Arquitectura de Digi-Firma Venezuela

## Fase 0 — estado implementado
Interfaz HTML/CSS/JavaScript con herramienta SHA-256 de PDF en el navegador, revisión local de estructura de identificadores VE y servidor de **demostración local** con borradores sintéticos (en memoria). No hay backend productivo, custodia documental, autenticación real ni proveedor de certificación. La configuración declarativa `countryCode: "VE"` y la validación del laboratorio **NO imponen límites en un servicio productivo**, que todavía no existe.

## Restricción de mercado
- **País único:** Venezuela (código ISO 3166-1 alpha-2 `VE`).
- Interfaz de referencia `es-VE`; no selector de países.
- Reglas comerciales y jurídicas: únicamente documentos y transacciones admitidos para uso en Venezuela.
- En producción: enforcement en API, tenant, organizaciones, flujos y proveedores; nunca solo en frontend o geolocalización.
- Rechazar explícitamente solicitudes fuera de alcance, sin exponer datos internos. Registrar decisiones sin almacenar documentación personal innecesaria.
- Firmantes fuera del territorio: no asumir elegibilidad automática; determinar cómo se comprueba jurisdicción del acto caso por caso.

## Arquitectura objetivo (propuesta; no aprobada)
1. Frontend web responsivo, accesible, localización `es-VE` y servicios autenticados.
2. API backend con autorización por usuario, organización, documento y caso de uso; política de mercado VE.
3. Persistencia relacional con aislamiento multi-tenant y auditoría.
4. Almacenamiento de PDFs privado, cifrado, scanner antimalware, control de tamaño, retención y recuperación.
5. Motor de estados de solicitudes, invitaciones temporales y verificación de identidad proporcional a riesgos.
6. Motor de integridad y evidencias: hash exacto del documento, atribución del signatario, consentimiento, tiempos, idempotencia y cadena de custodia.
7. Adaptador para PSC acreditado ante SUSCERTE, si el producto requiere certificados: validar vigencia y cadena de confianza, firma de webhooks, revocaciones y responsabilidades contractuales.
8. Colas, observabilidad sin datos sensibles, seguridad, cifrado y respaldos verificados.

## Modelo inicial (pendiente de aprobación)
`organizations`, `users`, `memberships`, `identity_evidence`, `documents`, `document_versions`, `signature_requests`, `recipients`, `signature_events`, `certificate_refs`, `evidence_artifacts`, `audit_events`, `retention_policies`.

Todo documento y solicitud deberá estar asociado a `jurisdiction_country = "VE"`; la restricción real será validada en backend y base de datos, con pruebas negativas.

## Principios
- En el cliente no se custodian claves privadas, tokens de prestadores ni certificados con material secreto.
- No confiar en RIF, cédula, encabezados, IP ni parámetros remitidos por navegador como prueba de identidad o jurisdicción.
- Denegar acceso cruzado entre organizaciones; auditar cada acción.
- Versiones de documento inmutables y huellas verificables.
- Webhooks firmados, protección contra replay y reintentos idempotentes.
- La integración con otras apps del titular solo por API autenticada, permisos mínimos y contratos separados.

## Decisiones todavía no aprobadas
Framework, plataforma de hosting, residencia legal de datos, base de datos, identidad y verificación, almacenamiento, proveedor PSC, integraciones y modelo de cobro. Abrir ADRs y validar con pruebas antes de producción.

## Implementación adicional — Laboratorio local (no productivo)
- `server/demo-store.mjs`: transiciones de borradores ficticios, restricción jurisdiccional **VE** en cada mutación y hashes SHA-256 enlazados de eventos en memoria (sin efecto jurídico).
- `server/demo-http.mjs`: servidor localhost con rutas estáticas de lista blanca, origen restringido, CSP, límite de cuerpo y validación estricta de entradas JSON.
- `server/dev.mjs`: proceso opt-in con `DIGIFIRMA_DEMO=1`, `NODE_ENV != production` y bind a `127.0.0.1`. No acepta PDF, datos de firmantes ni claves.
- `tests/demo-*.test.mjs`: pruebas de API y de dominio sin dependencias externas.

**No reutilizar este servidor como backend productivo:** carece de autenticación, sesiones reales, persistencia, rotación de claves, integridad respaldada externamente y garantías de custodia. La validación `VE` de laboratorio no acredita jurisdicción ni identidad de actores reales.

## Contratos para futuro backend (sin despliegue)
- Política central de autorización por actor verificado, rol y organización en `src/domain/authorization.mjs`.
- Estados seguros de solicitudes no firmadas en `src/domain/request-workflow.mjs`.
- Migración PostgreSQL y RLS propuestas en `db/migrations/001_base_ve.sql`; no se ha ejecutado ni validado contra una base real.
- Documentación de limitaciones y pruebas de infraestructura necesarias en `docs/BACKEND-PLAN.md`.
