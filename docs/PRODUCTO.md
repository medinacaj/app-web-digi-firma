# Alcance de Digi-Firma — borrador para validación

## Visión
Plataforma web para preparar, enviar, suscribir, comprobar y custodiar documentos electrónicos con trazabilidad, orientada inicialmente a Chile. El producto comercial y las decisiones de marca siguen abiertos.

## Usuarios propuestos (hipótesis)
- Persona que crea y envía solicitudes de firma.
- Firmante externo que recibe y revisa un documento.
- Administrador de la organización con políticas y roles.
- Auditor/validador con acceso acotado a evidencias.

## MVP propuesto, NO aprobado todavía
1. Registro e inicio de sesión con verificación de correo y MFA para roles privilegiados.
2. Aislamiento de organizaciones y control de acceso granular por recurso.
3. Carga y almacenamiento privado de PDF, escaneo de archivos, tamaño/tipo y cifrado.
4. Solicitudes con destinatarios, secuencia, vigencia y revocación/cancelación.
5. Flujo de firma electrónica simple con identidad proporcional al riesgo, consentimiento explícito e integridad comprobable. Validación jurídica antes de producción.
6. Bitácora inmutable o resistente a alteraciones con sellos temporales, huellas y cadena de custodia.
7. Descarga controlada y validación de documento/evidencia sin exponer información personal.
8. Retención, eliminación, derechos del titular y observabilidad.

## Fuera del MVP
- Certificación propia de firma electrónica avanzada.
- Prometer validez legal universal o identidad fehaciente sin prestador y validación adecuados.
- Firmas reales en el prototipo estático de Fase 0.
- Mercado internacional sin estudio de legislación y jurisdicción.
- Facturación, planes y marca final (decisiones por definir).

## Criterios de aceptación generales
- Las operaciones privadas requieren usuario autenticado y autorización por documento/organización.
- Los enlaces de invitación tienen vencimiento, alcance mínimo, protección contra abuso y revocación.
- No se conservan documentos/credenciales en repositorio, frontend estático ni logs.
- Cada firma identifica documento exacto y consentimiento registrable; los cambios posteriores deben detectarse.
- Existe revocación/cancelación, pruebas de denegación de acceso cruzado, eliminación y recuperación.
- Política de privacidad, consentimiento, contratos y revisión jurídica antes de salir a producción.

## Pendiente de decisión del titular
Público objetivo (B2B/B2C), alcance país, monetización, tecnología definitiva, proveedor FEA, alojamiento y branding. No asumir decisiones inexistentes.
