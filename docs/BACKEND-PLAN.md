# Backend objetivo y reglas de implementación — Venezuela

**Estado:** arquitectura de referencia y esquema SQL propuesto, **no desplegados ni probados contra PostgreSQL**. No sustituir el laboratorio sintético por este código sin conectar un backend autenticado, auditar seguridad y completar los bloqueos legales.

## Contratos de dominio implementados
- `src/domain/authorization.mjs`: autorización por rol, actor de sesión verificada, organización y doble alcance VE, con denegación por defecto; las comprobaciones de sesión son *contratos*, no autentican al usuario por sí solas.
- `src/domain/request-workflow.mjs`: borradores sintéticos, participantes `demo_*`, configuración y cancelación. No envía invitaciones ni marca firmas.
- `db/migrations/001_base_ve.sql`: propuesta de tablas con restricción VE, claves compuestas para evitar referencias cruzadas y políticas Row Level Security (RLS). **No ejecutada**.

## Seguridad de identidad y sesiones pendiente
Elegir un proveedor de identidad compatible con la operación y privacidad venezolana. MFA para administradores, rotación/revocación de sesiones, rate limits, CSRF si se usan cookies, protección frente a sesiones robadas, recuperación de cuenta, verificación de facultades de representación y pruebas reales de acceso cruzado.

**Nunca** aceptar desde API `actor.role`, `actor.id`, `actor.tenantId`, `sessionVerified`, `digi.actor_id` o `digi.organization_id` como parámetros elegidos por el cliente. Deben derivarse del token/sesión verificada por el servidor y establecerse por transacción mediante una conexión sin `BYPASSRLS`. Un usuario con capacidad de ejecutar SQL arbitrario podría falsificar las GUC personalizadas; impedir SQL injection es indispensable. Las políticas RLS no eliminan necesidad de authorization server-side.

## Propuesta de almacenamiento
PostgreSQL 14+ con migraciones versionadas, usuarios de migración y runtime separados, RLS revisadas y testeadas. Storage de objetos privado con cifrado, validación de PDF y malware scanning. Los documentos **no** van a un bucket público. La migración no garantiza la seguridad ni la inmutabilidad de documentos o eventos.

## Pendientes para habilitar producción
1. Ejecutar migración contra un PostgreSQL de pruebas, añadir CI con un servicio de base de datos y comprobar cada política (incluida denegación sin contexto).
2. Diseñar grants mínimos para runtime: evitar acceso directo a tablas de evidencia, versiones y participantes.
3. Verificar que cada `created_by` provenga de sesión real; control transaccional y aislamiento entre organizaciones.
4. Implementar autenticación/roles/revocación y protección de usuarios.
5. Custodia cifrada, hash, versiones y antifraude; proteger material criptográfico en KMS/HSM.
6. Enlaces de firma con expiración, atribución y consentimiento verificables; integración con PSC acreditado ante SUSCERTE cuando sea pertinente.
7. Pruebas de seguridad, pentest, resiliencia, jurídico y autorización de despliegue.

La aplicación **continúa sin implementar firmas electrónicas reales**. No ampliar `signature_requests.status` a `signed` hasta aprobar el motor.
