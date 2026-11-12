# Registro obligatorio y autenticación — Digi-Firma Venezuela

**Decisión de producto:** 2026-11-12. **Estado técnico:** especificación y vista previa estática **sin captura de datos**, no existe un registro en producción.

## Principio obligatorio

**Toda persona que use Digi-Firma en un entorno real deberá registrarse y autenticarse.** Incluye cuentas individuales, miembros/administradores de organizaciones y firmantes invitados que deban ejecutar un acto dentro de un expediente. La página comercial y la **demo sintética** de GitHub Pages se pueden explorar sin cuenta; no dan acceso a documentos, firmas ni datos de clientes.

Un formulario visible o el almacenamiento de datos en `localStorage` no constituyen registro real. La identidad debe verificarse y autorizarse mediante un **backend y un proveedor de identidad** sujetos a revisión.

## Recorrido propuesto de una persona

1. **Crear cuenta:** correo electrónico, contraseña segura o método de autenticación aprobado; consentimiento explícito y versionado de términos y privacidad. No exigir cédula ni RIF para crear una cuenta de prueba o sólo explorar el producto.
2. **Verificar correo:** token de activación aleatorio, un solo uso, expiración breve, almacenamiento de hash y protección contra abuso. Hasta confirmar, sesión sin permisos para documentos ni solicitudes.
3. **Iniciar sesión:** verificación de credenciales a cargo del proveedor/servidor, rate limits, sesiones de duración limitada, revocación por cierre y cambio de contraseña, recuperación de acceso, notificación de cambios críticos.
4. **Elegir contexto:** persona natural con espacio personal o incorporación a organización por invitación. La cuenta de organización/empresa requiere permisos explícitos y verificación de representación según el acto.
5. **Completar datos legales cuando corresponda:** solo para operaciones que los requieran, mediante flujo separado; cédula/RIF como dato de referencia **no es verificación de identidad**.
6. **Operar:** el servidor deriva `userId`, organización y roles **de la sesión validada**, no de campos enviados por el cliente; aplica RLS y autorización por documento/solicitud. Firma y custodia reales permanecen deshabilitadas hasta validación legal y técnica.

## Registro de firmantes invitados

La invitación no da acceso al documento sin autenticación. El destinatario debe registrarse o iniciar sesión, confirmar la dirección asociada al enlace, completar identificación adicional exigida para el acto, aceptar el consentimiento requerido y acceder únicamente al expediente autorizado. El enlace ha de ser de un solo uso, con expiración, contexto de organización y protección contra reenvío no autorizado.

## Reglas de seguridad y privacidad

- **Jurisdicción:** servicio exclusivo para Venezuela. La elegibilidad del acto y su contexto se validan en backend. Ni país IP, ni un selector visual, ni formato de cédula/RIF prueban elegibilidad o identidad.
- **Contraseñas y sesiones:** proveedor de identidad auditado o implementación revisada, hashing resistente a fuerza bruta, MFA para administradores, bloqueo/reintentos contra abuso, cookies `HttpOnly`/`Secure`/`SameSite` cuando proceda. Nunca guardar credenciales en GitHub Pages, código frontend, logs o `localStorage`.
- **Recuperación y enumeración:** respuestas genéricas para registro/recuperación de emails ya existentes; tokens revocables, expirables y sin reuso; sesiones anteriores invalidadas según riesgo.
- **Aislamiento de datos:** pruebas con al menos dos usuarios, dos organizaciones y acceso cruzado denegado; cuentas sin verificación nunca ven recursos protegidos.
- **Datos mínimos:** registrar solo lo imprescindible al inicio; aviso de privacidad, retención, acceso/borrado y evaluación jurídica conforme al caso venezolano.
- **Despliegues:** nunca exponer API de identidad desde Pages; Pages solo publica HTML/CSS/JS. Backend y BD requieren infraestructura, permisos, protección, registros, auditoría y autorización específicos.
- **Legalidad:** la autenticación de usuario no equivale a firma electrónica válida ni a certificado. Aplican revisiones del régimen venezolano y de SUSCERTE según modalidad.

## Contratos de API planificados, NO implementados

| Operación | Descripción | Condiciones mínimas |
|---|---|---|
| Registro | `POST /api/v1/auth/register` | Validación, consentimiento, antiabuso, cuenta sin verificar, respuesta no enumerativa |
| Verificar correo | `POST /api/v1/auth/verify-email` | Token de un solo uso y con caducidad |
| Login | `POST /api/v1/auth/login` | Credenciales verificadas, MFA cuando corresponda, sesión segura |
| Sesión | `GET /api/v1/auth/session` | Solo estado seguro de la sesión y contexto autorizado |
| Logout | `POST /api/v1/auth/logout` | Revocar sesión/token del dispositivo |
| Recuperación | `POST /api/v1/auth/recovery` y confirmación | Respuesta genérica; tokens limitados y cambios auditados |
| Contexto de organización | `GET /api/v1/me/organizations` | Usuario verificado; organizaciones autorizadas |
| Invitación | Flujo de invitación vinculado al usuario | Token expirado/consumido se rechaza, permisos mínimos |

**Advertencia:** son contratos de producto y no endpoints disponibles. La forma exacta (incluyendo protección CSRF, cookies/tokens y límites) se ajustará al proveedor y al análisis de amenazas.

## Fases y evidencias

| Fase | Entregable | Condición para avanzar |
|---|---|---|
| 0 — Vista previa | `registro/index.html` sin `<form>`, inputs deshabilitados, sin JS ni APIs, visible **solo tras publicación revisada** | Build estático allowlist + tests CI + revisión visual |
| 1 — Identidad segura | Proveedor aprobado, backend, BD, email verificado, login/logout, recuperación, MFA admins | CI, pruebas de abuso/aislamiento/recuperación, revisión privacidad |
| 2 — Acceso obligatorio | Gating real de la aplicación, autorizaciones por organización, invitación de firmantes registrados | E2E con cuentas sintéticas y denegación cross-tenant |
| 3 — Piloto | Hosting, monitorización, backups, restauración, políticas y soporte | Autorización específica y validación jurídica/de seguridad |

## Criterios de aceptación de producto

- [ ] El marketing y el recorrido DEMO siguen disponibles sin registrar usuarios reales.
- [ ] El sistema productivo rechaza operaciones y documentos sin sesión validada.
- [ ] Usuario nuevo verifica correo antes de entrar.
- [ ] Inicio/cierre/recuperación, MFA administrativo y revocación probados.
- [ ] Usuarios individuales, organización y firmantes invitados tienen acceso solo a lo autorizado.
- [ ] Cédula/RIF y representación se recaban solo cuando resulten necesarios, en backend protegido.
- [ ] No introducir datos reales en Pages, tests, issues, commits ni demostración.
- [ ] El propietario aprueba servicio de identidad, infraestructura, términos y despliegue antes de habilitar registro real.

Seguimiento: [registro obligatorio #25](https://github.com/medinacaj/app-web-digi-firma/issues/25), [identidad #5](https://github.com/medinacaj/app-web-digi-firma/issues/5), [SaaS #22](https://github.com/medinacaj/app-web-digi-firma/issues/22), [VE #13](https://github.com/medinacaj/app-web-digi-firma/issues/13).
