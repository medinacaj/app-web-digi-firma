# Arquitectura de Digi-Firma Venezuela

## Fase 0 — estado implementado
Sitio estático HTML, CSS y JavaScript. Sin backend, almacenamiento, autenticación ni proveedor de certificación. La configuración declarativa `countryCode: "VE"` **NO impone límites en un servicio real** porque ese servicio todavía no existe.

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
