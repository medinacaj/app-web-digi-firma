# Puertas para activar Digi-Firma Venezuela en producción

**Estado actual: BLOQUEADO.** No desplegar servicio público como plataforma de firma. Este checklist es un criterio de aceptación, no una certificación ni un permiso automático.

## Gate 0 — Gobernanza
- [ ] Repositorio privado y accesos de usuarios/terceros auditados.
- [ ] Protección de main: PR obligatoria, CI requerida, code review y sin pushes directos.
- [ ] Workflows y dependencias bajo permisos mínimos, suministro y secretos auditados.
- [ ] Backups del código y continuidad de suministro revisados.

## Gate 1 — Definición legal venezolana
- [ ] Catálogo de tipos de actos; exclusiones y formalidades (registro/autenticación/notaría).
- [ ] Dictamen venezolano conforme al Decreto-Ley 1.204, reglamentos y normas sectoriales.
- [ ] Cuando aplique, contrato y verificación de acreditación del PSC ante SUSCERTE.
- [ ] Revisión de mensajes comerciales: no confundir representación gráfica con firma electrónica válida.
- [ ] Política de privacidad, conservación y derechos de los titulares aprobada.

## Gate 2 — Identidad y autorización
- [ ] Verificación técnica de persona y representación, no solo formato cédula/RIF.
- [ ] MFA admins, sesiones, políticas de contraseña y protección antiabuso.
- [ ] Autorización por usuario/documento/organización; tests de acceso cruzado (IDOR).
- [ ] Jurisdicción de operaciones/documentos exclusivamente VE verificada en backend, sin confiar en un país del cliente o geolocalización.
- [ ] Pruebas para agentes extranjeros que intervengan en actos venezolanos con control jurídico específico.

## Gate 3 — Custodia y firma
- [ ] Validación/escaneo de PDF, almacenamiento privado cifrado y rotación de claves.
- [ ] Versionado, hash de documento exacto, trazabilidad, consentimiento y sello temporal verificable.
- [ ] Algoritmos y material criptográfico revisados; certificados y revocación según prestador.
- [ ] Evidencia resistente a alteración e integración segura con prestador certificado (si es requerido).
- [ ] Retención, eliminación, derechos de acceso y restauración probados.

## Gate 4 — Operación
- [ ] Pruebas unitarias, integración, e2e, accesibilidad, cargas y seguridad.
- [ ] Pentest independiente, mitigación de hallazgos críticos y plan de respuesta a incidentes.
- [ ] Observabilidad sin datos privados, backups restaurables y soporte.
- [ ] Revisión humana de experiencia de firma y consentimiento.
- [ ] Autorización explícita del titular para publicación y política de lanzamiento.

**CI verde en el prototipo no implica cumplimiento de estos gates.** Las pruebas del laboratorio siguen ejecutándose pero no sustituyen validaciones de un servicio real.

Seguimiento: issues #2–#11 y #13, epic #1.

## Gate público separado del gate de firma
Es admisible publicar **solo la página comercial informativa**, siempre que no contenga datos reales, formularios de identificación, firmas ni afirmaciones de acreditación inexistente. El paquete `dist/public` ofrece `/app/` únicamente como pantalla informativa.
- [x] Separación de archivos públicos y código interno.
- [ ] Hosting autorizado para uso comercial; **no** Vercel Hobby.
- [ ] Validación de dominio final, privacidad, contenido legal y SEO.
- [ ] Despliegue y revisión de cabeceras/rutas en entorno público.
La apertura del sitio informativo **no** implica abrir la plataforma transaccional.
