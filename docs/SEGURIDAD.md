# Seguridad y privacidad — Digi-Firma Venezuela

Fecha de inspección de base: 2026-10-25.

## Estado verificado
- Repositorio `medinacaj/app-web-digi-firma`, visibilidad **private**.
- Rama `main` sin protección observada en inspección inicial.
- Prototipo de fase 0 sin dependencias externas ni operaciones reales de firma.
- CI cubre sintaxis y tests limitados. Sin pentest, verificación de identidad, secreto de firma, certificado, PDF ni auditoría operativa.
- El acceso exclusivo del titular a todos los servicios, aplicaciones autorizadas y tratamientos de datos **no está certificado** por tener repo privado: necesita auditoría de permisos y condiciones de GitHub.

## Amenazas y mitigaciones pendientes
| Riesgo | Criticidad | Control requerido |
| --- | --- | --- |
| Firma atribuida erróneamente | Crítica | Evidencia de identidad, signatario, autorización y vínculo al documento |
| Firma presentada como certificada sin respaldo | Crítica | Comprobación del PSC acreditado, certificación, cadena y revocación |
| Exposición de cédula, RIF, domicilio o PDFs | Crítica | Minimización, cifrado, acceso mínimo, secretos aislados y retención |
| Alta de organizaciones fuera de VE | Alta | Validación server-side de jurisdicción/actividad, auditoría y pruebas |
| IDOR entre organizaciones/documentos | Crítica | Control por recurso, aislamiento multi-tenant y pruebas negativas |
| Documentos alterados después del acto | Crítica | Hash sobre la versión exacta, firma verificable y evidencias resistentes a alteración |
| Invitaciones reenviadas o robadas | Alta | Expiración, scopes, revocación, antifraude, límites y autenticación |
| Código o secretos expuestos | Alta | Repo privado, CI mínimo, revisión, secret scanning y permisos auditados |
| Rama principal sin reglas de protección | Alta | Reglas de PR+CI y aprobación antes de fusionar |
| Retención excesiva de datos | Alta | Política por finalidad, borrado/control de acceso, revisión jurídica |

## Prácticas obligatorias antes de operación
- Modelo de amenazas, control de acceso por documento, tests de acceso y rate limiting.
- Validación segura de PDF (tamaño, MIME real, antivirus, parsers aislados).
- Cifrado en tránsito y reposo, llaves segregadas y acceso mínimo.
- Políticas de conservación, privacidad y derechos de las personas según legislación venezolana aplicable.
- Auditoría resistente a alteraciones, sellos temporales verificados, revocación y pruebas de recuperación.
- Revisión de requisitos específicos de la Ley de Infogobierno **solo para casos dentro de su ámbito**.
- Revisión legal independiente antes de afirmar efectos jurídicos de cada flujo documental.

## Protección del repositorio
Mantener el código privado. No activar GitHub Pages, dominios, CI de despliegue público ni herramientas externas con acceso al código sin autorización y análisis previo. No incluir datos personales reales ni credenciales en pruebas, incidencias o logs.

## Calculadora de huella PDF en el navegador (herramienta, no firma)
- Web Crypto calcula SHA-256 sobre bytes locales, sin transmitirlos al servidor.
- La validación `%PDF-` solo comprueba cabecera, no parser, integridad de estructura ni seguridad del contenido.
- Un hash coincidente solo permite afirmar igualdad de bytes en función de SHA-256; no prueba autoría, consentimiento, identidad, ni cumplimiento del Decreto-Ley 1.204.
- Límite de 20 MiB antes de lectura y después, sin persistencia; no habilita custodia documental.
