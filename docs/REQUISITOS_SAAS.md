# Requisitos de evolución a SaaS — Digi Firma

> Decisión del propietario confirmada en mediOS, 2026-11-09. Guía de producto y lista de aceptación; **no** asegura que estén implementados los puntos.

**Estado técnico de referencia (según README revisado):** Prototipo para Venezuela, web informativa, utilidades locales y laboratorio sin firma real, custodia, certificados ni usuarios; no comercial ni desplegado.

## Decisión de producto (aprobada)
El producto debe evolucionar hacia **Software as a Service (SaaS) comercializable** por clientes independientes. Esta es una **exigencia de desarrollo**, NO una afirmación de que ya existe o funciona. Se mantiene el estado técnico real documentado en el README y el resto de fuentes de verdad.

## Requisitos comunes obligatorios
1. **Multiempresa / multicliente:** cada cliente tiene espacio propio; autorización server-side y aislamiento de datos probado. No basta con filtros visuales ni con un solo usuario administrador.
2. **Gestión de usuarios:** identidad, invitaciones, roles/permisos, revocación de sesiones, recuperación segura y MFA acorde al riesgo.
3. **Modelo comercial:** planes de suscripción mensuales/anuales, límites claros, activación/suspensión/cancelación, cobro mediante proveedor autorizado cuando aplique y facturación del servicio. Precios y rentabilidad aún por validar.
4. **Administración:** panel del cliente y panel interno del operador SaaS, con separación de privilegios; métricas de uso, soporte y auditoría.
5. **Seguridad y operación:** cifrado, secretos fuera del repositorio, mínimo privilegio, protección de datos, backups y restauración probada, monitoreo, respuesta a incidentes, retención y exportación/cancelación de datos.
6. **Calidad y despliegue:** migraciones reproducibles, pruebas automáticas funcionales y de aislamiento entre dos clientes, CI y puertas de lanzamiento; no declarar 'listo para producción' por una demo.
7. **Ejecución responsable:** no publicar datos reales, activar cobros, conectarse a terceros ni desplegar públicamente sin autorización. Respetar privacidad, normativa aplicable, licencias e IP.

## Requisitos particulares de Digi Firma

1. **Alcance:** SaaS exclusivamente para Venezuela. Gestión de cuentas de empresas/equipos, documentos, plantillas, solicitudes, flujo de firmantes y estado de expedientes; primero prototipos con datos sintéticos.
2. **Tenancy y seguridad:** aislamiento estricto por cliente de documentos, firmas, evidencias y metadatos; cifrado en tránsito y reposo, permisos granulares, registro de auditoría y política de retención/borrado.
3. **Gestión de documentos:** almacenamiento privado, antivirus/escaneo de PDFs, límites, previsualización segura, firma por invitación, seguimiento y exportación verificable de evidencias; no exponer datos entre empresas.
4. **Régimen jurídico:** validar Decreto-Ley de Mensajes de Datos y Firmas Electrónicas y normativa SUSCERTE; diferenciar tipos de firma y eventual integración con prestadores acreditados (PSC) cuando corresponda; ninguna función se debe anunciar como firma válida o certificado sin sustento.
5. **Cobro SaaS:** planes por organización/usuarios/volumen de documentos o solicitudes; suscripción, pago por proveedor autorizado y recibos, solo después de validar la estructura legal y los costes.
6. **Separación de entornos:** el laboratorio local actual debe continuar bloqueado para producción; un eventual backend comercial nuevo requiere seguridad, auditoría, pruebas y aprobación específica.

## Criterios de aceptación para la salida comercial

- [ ] Validación legal venezolana documentada antes de habilitar funciones de firma reales o certificación; no crear credenciales/certificados propios sin habilitación.
- [ ] Pruebas con al menos dos organizaciones para verificar aislamiento de archivos, solicitudes, eventos, roles, y retención/descarga segura.
- [ ] No retirar los bloqueos de producción ni usar documentos reales hasta completar auditoría, pruebas, políticas y autorización explícita.

## Seguimiento

- Abrir o actualizar tareas de ingeniería por etapas. Documentar evidencia (commits, tests, migraciones, revisión de seguridad) antes de marcar algo como terminado.
- Respetar las fuentes de verdad y convenciones ya existentes en el repositorio.
- Toda característica enumerada se considera **prevista** hasta verificación individual.
- Relación de cartera: `medinacaj/MediOS/data/CARTERA_INVERSION_VENEZUELA.json`.
