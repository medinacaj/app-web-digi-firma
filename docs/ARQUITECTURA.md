# Arquitectura y decisiones de inicio

## Etapa 0 (implementada en la rama de trabajo)
Sitio estático HTML/CSS/JavaScript sin dependencias, sin conexiones externas y sin servicios backend. Objetivo: visualización del diseño, navegación y marco de trabajo. **No maneja documentos ni identidad**.

Este código NO pretende ser la arquitectura final de producción. El propósito es crear una base revisable sin escoger prematuramente proveedor de identidad, base de datos o custodia.

## Arquitectura objetivo (propuesta)
1. Frontend accesible y adaptable, con navegación autenticada.
2. Backend API validando sesiones, roles, organizaciones y autorización por documento.
3. Base de datos transaccional con políticas de aislamiento multi-tenant.
4. Almacenamiento privado de objetos con cifrado, antivirus, límites, URL temporales y política de retención.
5. Orquestador de solicitudes/firmantes; máquina de estados con idempotencia y concurrencia.
6. Servicio de evidencia que asocia hash del PDF exacto, identidad, consentimiento, eventos y sellos temporales.
7. Integración separada con prestador acreditado para firma avanzada; credenciales y certificados fuera del cliente.
8. Cola de tareas, correo transaccional, observabilidad, monitoreo de seguridad y backups probados.

## Modelo lógico preliminar
\`organizations\`, \`users\`, \`memberships\`, \`documents\`, \`document_versions\`, \`signature_requests\`, \`recipients\`, \`signature_events\`, \`evidence_artifacts\`, \`audit_events\`, \`retention_policies\`.

## Reglas arquitectónicas
- Nunca confiar en un identificador enviado por el cliente sin verificar acceso y pertenencia.
- El documento firmado debe ser inmutable y verificable contra su hash.
- Enlaces de firma de un solo alcance, temporalidad y anti-reutilización.
- Webhooks de proveedores con firma, control anti-replay y procesamiento idempotente.
- Ninguna clave de firma privada ni credencial de proveedor debe exponerse en navegador ni repositorio.
- Separar UI pública, API privada y verificadores de acceso acotado.
- Datos cifrados, logs redactados y auditoría protegida contra modificaciones.

## Integración con otras aplicaciones
Una eventual integración con otros productos del titular debe realizarse por contratos API/versiones, autenticación y scopes explícitos; no copiar bases de datos ni dar acceso transversal por defecto.

## Decisiones pendientes
Framework/backend, SSO/identidad, hosting, base de datos, storage, cifrado, correo y PSC/FEA. Registrar cada decisión en issues/ADR antes de producción.
