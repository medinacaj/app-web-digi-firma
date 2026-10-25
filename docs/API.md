# Contrato de API para integrar identidad y almacenamiento

**No hay servicio en ejecución ni endpoint público.** `server/api-contract.mjs` expone un controlador puro que requiere dos implementaciones confiables: `verifyBearer(token)` y un repositorio de datos. Si faltan, falla al construirse.

## Contratos disponibles
- `GET /api/v1/capabilities`: sólo informa qué prestaciones están deshabilitadas.
- `GET /api/v1/organizations/{uuid}/documents`: requiere token verificado y mismo tenant; filtra resultados por permisos incluso si un repositorio devolviera datos ajenos. Solo devuelve id/estado/VE, jamás contenido de PDF.
- `POST /api/v1/organizations/{uuid}/prepared-requests`: acepta exclusivamente `{ "countryCode": "VE", "documentId": "<uuid>" }`. Requiere permiso sobre el documento; genera un borrador `demoOnly` sin envío ni firma.
- Rutas de firma: inhabilitadas con `SIGNATURE_ENGINE_DISABLED`.

## Seguridad
- El token debe verificarse criptográficamente por el futuro proveedor seleccionado (issuer, audience, expiración, firma, revocación y política de algoritmos). **La prueba automatizada utiliza un token sintético, no una implementación de autenticación**.
- `actor.id`, `tenantId`, roles y `sessionVerified` han de provenir de sesión verificada y consulta transaccional a membresías; jamás del JSON.
- Implementar manejo real de timeouts, rate limits, límites de tamaño y cabeceras/cookies/CORS según despliegue.
- Aplicar RLS dentro de una transacción PostgreSQL aislada, con principal runtime sin BYPASSRLS. Asegurar que el rol runtime no es propietario ni superusuario.
- La respuesta del contrato no retorna datos personales, documentos ni material criptográfico.
- El controlador puro no es un servidor escuchando puerto; nunca se activará en producción por haber sido fusionado.

## Requisitos para conectarlo
1. Definir/contratar proveedor de identidad compatible con el modelo venezolano y la privacidad.
2. Provisionar PostgreSQL y ejecutar migraciones/grants fuera de la cuenta de aplicación.
3. Implementar repositorio tipado/parametrizado, roles de runtime y transacciones con contexto RLS.
4. Validar IDs, scopes, jurisdicción legal del acto y representación mediante servicios autorizados.
5. Pruebas HTTP/e2e con identidad verificada y base real antes de permitir clientes.
6. Storage cifrado con control de acceso y posterior flujo de consentimiento/firma/PSC.
