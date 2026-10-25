# Progreso verificable — Digi-Firma Venezuela

**Fecha de revisión:** 2026-10-25.
**Mercado confirmado:** Venezuela exclusivamente (`VE`). No se admiten otros países en el alcance del producto.
**Repositorio:** `medinacaj/app-web-digi-firma`, privado.
**Rama principal:** `main`, cambios de PR #12 y #14 fusionados.

## Confirmado por inspección
- [x] Existe el repositorio y es privado.
- [x] `main` existe y no está protegida en inspección.
- [x] Primera base del proyecto: UI estática, CI y documentos. Sin backend ni firmas operativas.
- [x] Usuario delimita el mercado y la normativa de producto a Venezuela.

## Trabajo registrado en esta intervención
- [x] Modelo de jurisdicción declarativa `VE` y chequeos de alcance en pruebas.
- [x] Interfaz e información de producto adaptadas a Venezuela.
- [x] Documentación legal venezolana y eliminación del archivo legal del país anterior.
- [x] Roadmap, arquitectura, seguridad y pruebas actualizadas para exclusividad venezolana.
- [x] GitHub Actions verificado tras adaptación a VE: run 40224843820, conclusión success, commit 54583a2 (9/9 tests pasados).
- [ ] Revisión de navegador y seguridad e2e.
- [x] PR #12 fusionada en `main` (commit `2da5318`).
- [ ] Configuración de reglas de protección para `main`.
- [ ] Backend capaz de impedir casos fuera de Venezuela.
- [ ] Integración operativa con PSC acreditado por SUSCERTE, si se aprueba.
- [ ] Firma electrónica real operativa.

## Backlog
- [Epic](https://github.com/medinacaj/app-web-digi-firma/issues/1).
- #2 gobernanza y protección GitHub; #3 producto; #4 arquitectura.
- #5 identidad; #6 PDFs; #7 solicitudes; #8 firma y evidencia.
- #9 certificación con PSC venezolano; #10 privacidad y legislación; #11 pruebas y lanzamiento.
- #13 aplicación del mercado único VE en backend, base de datos y pruebas de integración.

## Definición de verificado
Los tests actuales solo revisan estados, sintaxis y consistencia de jurisdicción en el prototipo; **no aseguran** que un backend inexistente excluya otras jurisdicciones ni que el servicio pueda firmar legalmente. Todas las funciones productivas siguen deshabilitadas hasta que exista identidad, documentos seguros, verificación y validación legal.

## Iteración de desarrollo posterior — 2026-10-25
- [x] Laboratorio local opt-in, limitado a loopback y deshabilitado en producción.
- [x] Borradores **ficticios** de plantillas predefinidas: alta, listado, cancelación.
- [x] Validación de país VE en cada operación del backend del laboratorio y denegación de otros países.
- [x] Historial SHA-256 enlazado en memoria (demostrativo, no prueba legal).
- [x] Navegación Solicitudes/Auditoría conectada a API local, sin archivos ni datos personales.
- [x] Pruebas automatizadas de API, validación, límite y seguridad básica añadidas.
- [ ] Confirmar CI del commit con el laboratorio e indicar su resultado.
- [ ] Backend productivo con autenticación, verificación de identidad, aislamiento multi-tenant y custodia.
- [ ] Integración jurídica y técnica con PSC cuando corresponda.

**Límite:** los ítems terminados solo atañen a una demostración local y no cierran issues #5–#9 ni #13. Ninguna capacidad de firma real se ha habilitado.

## Segunda iteración — Herramienta local de integridad
- [x] Cálculo SHA-256 de PDFs en navegador sin carga ni almacenamiento.
- [x] Comparación opcional con huella proporcionada por el usuario.
- [x] Control de tamaño (20 MiB), cabecera `%PDF-` y resultados que aclaran que no son firmas.
- [x] Pruebas unitarias de contenido y comparación.
- [x] Iteración de huella PDF verificada: GitHub Actions #40225892185, resultado success.
- [ ] Validación de formato PDF completo, firmas X.509, revocación y prestadores certificados: pendientes (fuera de la herramienta local).

## Tercera iteración — Gobernanza y puertas de salida
- [x] Política de seguridad y denuncia responsable por canal privado.
- [x] CODEOWNERS asignado al dueño del repositorio; requiere protección de rama para exigir aprobación.
- [x] Condiciones de liberación y lista de bloqueo productivo documentadas.
- [x] Tests de arranque: laboratorio requiere opt-in y no opera con NODE_ENV=production.
- [x] Iteración de gobernanza verificada: GitHub Actions #40226032035, resultado success.
- [ ] Activar protección real de rama `main` (no disponible en las herramientas de cambios conectadas).
- [ ] Revisión manual y auditoría independiente antes de despliegue.

## Integración de la base
- [x] PR #12 fusionada en `main` mediante squash: `2da5318f1931dc665f8d4704d6bba305414bfd0a`.
- [x] Verificada la visibilidad **private** después de la integración; no se activó un despliegue.
- [ ] No hay protección de `main` activa; issue #2 continúa.
- [ ] Falta identidad/persistencia/PSC y otros gates de producción.

## Iteración 4 — Formatos de identificación VE
- [x] Funciones de normalización/estructura de cédula y RIF, sin consulta de registro ni dígito verificador.
- [x] Interfaz demostrativa local y borrado inmediato del campo tras comprobarlo.
- [x] Pruebas unitarias de entradas válidas e inválidas.
- [x] GitHub Actions #40226355180 completado correctamente; PR #14 documenta cambios de formato local.
- [ ] Verificación oficial SAIME/SENIAT, autenticación y atribución de identidad siguen pendientes.

## Resumen consolidado después de PR #14
- [x] PR #12 fusionada: base web, demostración local, hash PDF en navegador y CI.
- [x] PR #14 fusionada: utilidad de formatos de cédula/RIF sin almacenar ni verificar identidades.
- [x] CI #40226399775 (último cambio de PR #14), conclusión success.
- [x] Repositorio confirmado como **private**.
- [ ] La rama `main` sigue sin protección real (issue #2).
- [ ] No se ha activado despliegue público.
- [ ] Faltan autenticación, custodia cifrada, firma, certificación, integración PSC, auditoría independiente y validación legal (#5–#10 y #13).

**Estado honesto:** la base web está en `main`, pero Digi-Firma NO es un servicio de firma electrónica operativo. Los `release gates` continúan bloqueantes.

## Iteración 5 — Sitio web + panel separado (en revisión)
- [x] Sitio institucional estático en la raíz, con hero, propuesta de valor, funciones previstas, proceso, transparencia, FAQ y CTA a demostración.
- [x] Interfaz existente conservada en `/app/`; herramientas sintéticas intactas.
- [x] Recursos locales y sin trackers ni proveedores de fuentes externas; `noindex` hasta autorización expresa de publicación.
- [x] Navegación móvil, skip-link, secciones semánticas y respeto de movimiento reducido.
- [x] Servidor de laboratorio sirve el sitio, los módulos y las rutas de panel desde lista explícita.
- [x] Pruebas HTTP/estructura actualizadas.
- [x] CI de sitio web #40228076144: success (PR #16).
- [ ] Revisión visual en navegadores y pruebas WCAG pendientes.
- [ ] Despliegue público deshabilitado; publicación sujeta a revisión y autorización.

## Iteración 6 — Dominio de autorización y contratos de backend
- [x] Control de organización y jurisdicción `VE` en biblioteca de dominio con denegación por defecto.
- [x] Política de permisos diferenciados owner/admin/member/auditor, con pruebas negativas.
- [x] Máquina de estados de solicitudes preparatorias sintéticas, sin firma real.
- [x] SQL propuesto con restricciones VE, claves compuestas y RLS. **No conectado ni ejecutado; no cuenta como backend de producción**.
- [x] Documento de arquitectura y lista de pruebas de seguridad PostgreSQL.
- [ ] Integrar proveedor de sesiones y almacenamiento cifrado productivo. La migración se prueba en PostgreSQL efímero CI, no en infraestructura real.
- [ ] CI de esta iteración pendiente de verificación.

## Iteración 6.1 — Validación SQL efímera
- [x] Añadido servicio PostgreSQL 16 de CI para ejecutar la migración SQL.
- [x] Casos de prueba de aislamiento multitenant y denegación fuera de VE.
- [x] GitHub Actions #40228703172: jobs `checks` y `database` aprobados; migración SQL y pruebas RLS en PostgreSQL 16.
- [ ] Auditar policies RLS y permisos de la identidad de runtime antes del primer despliegue.

## Iteración 7 — Contrato HTTP backend sin exposición
- [x] Controlador API inyectable y sin capacidad de escuchar red por sí mismo.
- [x] Endpoint de capacidades que declara firmas, almacenamiento y certificación deshabilitados.
- [x] Listado de metadatos con defensa en profundidad sobre recursos ajenos.
- [x] Alta de borrador sintético con alcance VE, autorización y whitelist de campos.
- [x] Bloqueo explícito de rutas de firma y errores sin datos privados.
- [x] Pruebas contra identidad y repositorio sintéticos.
- [ ] Verificar CI para integrar este commit.
- [ ] Elegir proveedor OIDC, conectar PostgreSQL persistente, tokens verificados y API real.
