# Auditoría inicial y plan de seguridad (2026-10-25)

## Inspección del repositorio
- GitHub: \`medinacaj/app-web-digi-firma\`.
- Visibilidad comprobada: \`private\`. No cambiar sin autorización.
- Rama principal: \`main\`; estado de \`protected\` observado: \`false\`.
- Antes del inicio técnico: solo README, un commit, sin issues ni PR.
- No se pudo realizar pentest ni análisis de dependencias reales, porque no existía aplicación.
- La rama de inicio añade prototipo sin dependencias de terceros, CI y controles documentales.
- La visibilidad privada no impide por sí sola acceso de colaboradores, integraciones autorizadas, GitHub o procesos de CI. Auditar permisos fuera del alcance de estas lecturas.

## Registro de riesgos inicial
| Riesgo | Severidad | Tratamiento |
| --- | --- | --- |
| Rama principal sin protección | Alta | Configurar reglas de protección/revisión y requerir CI; no alterar ajustes sin evaluar impacto |
| Uso de firma dibujada como FEA | Crítica | No habilitarla como FEA; integrar PSC acreditado y revisión legal |
| IDOR entre organizaciones/documentos | Crítica | Autorización backend por recurso, pruebas negativas y tenant isolation |
| Filtración de PDFs/datos personales | Crítica | Storage privado, cifrado, políticas y acceso mínimo |
| Falsificación o alteración de evidencia | Crítica | Hashes, evento verificable, sellos, custodia e idempotencia |
| Tokens de invitación filtrados o reenviados | Alta | TTL, revocación, scope, rate limiting y verificación de identidad |
| CI/CD y secretos de terceros | Alta | Permisos mínimos, revisión de dependencias y secretos aislados |
| Eliminación y retención inadecuadas | Alta | Ciclo de vida por finalidad, procedimientos y auditoría |
| Falta de autenticación real | Bloqueante | No procesar documentos ni permitir operaciones hasta disponer de auth |

## Controles mínimos antes de producción
- Modelado de amenazas y revisión de seguridad para toda ruta de documento/firma.
- Autenticación robusta, MFA para administradores, CSRF donde aplique, control de sesiones y rate limiting.
- SAST, análisis de dependencias, secret scanning, revisión de permisos del repo y CI con permisos mínimos.
- Control estricto MIME, tamaño, antivirus y aislamiento al procesar PDF; defensa frente a SSRF y parser exploits.
- Cifrado en tránsito/en reposo, claves administradas con rotación y principio de menor privilegio.
- Backups restaurables y pruebas de respuesta a incidentes.
- Auditoría de acceso y consentimiento, integridad verificable y políticas de retención.
- DPIA/análisis de impacto de privacidad cuando corresponda y revisión legal local.

## Privacidad intelectual
- Mantener repositorio privado; no activar Pages ni publicar artefactos o datos de producción.
- No introducir credenciales en prompts, código, archivos de ejemplo o comentarios de issues.
- Una PR o Action es actividad alojada en GitHub y su acceso se rige por configuración y permisos de la cuenta.
- No se ha certificado exclusividad absoluta ni restricciones contractuales de entrenamiento/retención por terceros; deben auditarse los términos y ajustes del servicio.
