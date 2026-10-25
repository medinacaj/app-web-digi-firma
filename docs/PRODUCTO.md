# Producto y alcance — Digi-Firma Venezuela

**Estado: borrador funcional.** Decisión confirmada por titular: operar **exclusivamente en Venezuela**. Ningún otro país forma parte del producto, su UI, onboarding ni catálogo de requisitos legales.

## Propósito

Plataforma web de gestión del ciclo de firma electrónica para particulares, profesionales y organizaciones con operaciones en Venezuela. No presupone certificación propia ni aptitud legal de todos los documentos.

## Audiencias previstas
- Persona natural venezolana o extranjera que realiza actos sujetos a jurisdicción venezolana, según condiciones del caso de uso.
- Empresas y organizaciones registradas o que operan legalmente en Venezuela.
- Firmantes invitados para actos documentales que se rigen por Venezuela (elegibilidad y representación por definir).
- Administradores y auditores autorizados.

**La residencia, nacionalidad, identidad y jurisdicción aplicable no se pueden inferir de un campo de país o IP.** La verificación real exige backend, pruebas documentales y revisión jurídica.

## Identidad y localización propuestas
- País fijo: Venezuela (`VE`), interfaz `es-VE`, zona horaria y formatos locales según necesidad.
- Identificadores según perfil: cédula de identidad, RIF, nombre legal/razón social y facultades de representación.
- La introducción de una cédula o RIF en un formulario **no acredita identidad ni facultades**. Definir los mecanismos de verificación con fuentes y prestadores adecuados.
- No mostrar listas de países ni ofrecer registro de organizaciones extranjeras fuera del alcance.
- Las APIs de producción deben denegar jurisdicciones distintas de VE; no confiar en restricciones visuales.
- No fijar proveedor de identidad, validación documental o residencia de datos sin investigación y contrato.

## MVP previsto (propuesta, sujeto a aprobación de fases)
1. Registro, inicio de sesión seguro, MFA para administradores.
2. Organizaciones, controles de autorización multi-tenant, roles, cédula y RIF cuando correspondan.
3. PDF en almacenamiento privado, control de versiones, cifrado, malware scanning y política de retención.
4. Creación, seguimiento y revocación de solicitudes con firmantes y consentimiento.
5. Mecanismo de firma electrónica sometido a examen jurídico conforme al artículo 16 del Decreto-Ley 1.204.
6. Evidencias de identidad, consentimiento, trazabilidad, hash criptográfico, validación e integridad.
7. Descarga/validación restringidas, bitácora, solicitudes de privacidad y soporte.
8. Estudio/integración con PSC acreditado por SUSCERTE cuando se requiera certificación (art. 18).

## No hacer
- No anunciar “firma electrónica certificada” ni homologación/autorización de SUSCERTE sin acreditación y pruebas.
- No trasladar las categorías jurídicas “firma electrónica simple/avanzada” de Chile al régimen venezolano.
- No asumir que firmar electrónicamente sustituye registro, notaría o formalidades de actos específicos.
- No registrar usuarios reales, cargar PDFs o recopilar cédulas/RIF en este prototipo.
- No abrir mercados internacionales por error de configuración, traducción o API.
- No anunciar facturación, moneda de cobro, marca o domicilio legal hasta decisión del titular.

## Criterios globales de aceptación
- Toda solicitud real verifica autorización y jurisdicción VE **en backend** con evidencia pertinente.
- Identificación, consentimiento y documento quedan vinculados mediante un mecanismo técnicamente verificable.
- Documentos nunca son públicos por defecto.
- Procesos de certificación se separan de funciones del producto y se sustentan en PSC acreditado.
- Política de privacidad, mapa de datos, retención, respuesta a incidentes y revisión jurídica completadas.
- Acciones de firma en UI siguen bloqueadas hasta que todos los controles relevantes estén listos.
