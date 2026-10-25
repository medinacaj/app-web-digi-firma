# Registro de progreso — Digi-Firma

Última revisión: **2026-10-25**.
Repositorio: `medinacaj/app-web-digi-firma` (**privado**).
Rama de trabajo: `chore/inicio-auditoria-y-base`.

## Estado al iniciar
- [x] Repositorio privado identificado; solo existía un README y un commit inicial.
- [x] `main` no estaba protegida.
- [x] Sin issues ni pull requests previos.
- [x] Nombre comercial sin aprobar (`FirmaEnLínea` sigue siendo candidato, no marca seleccionada).

## Trabajo realizado
- [x] Prototipo estático con módulos navegables (sin backend, documentos ni firmas reales).
- [x] Documentos de producto, arquitectura, riesgos, normativa y roadmap.
- [x] Pruebas automáticas básicas y CI GitHub Actions.
- [x] CI finalizado correctamente en la revisión inicial: run `40222921602`, conclusión `success`, 2026-10-25. Las verificaciones comprenden sintaxis, tests unitarios de estado e inventario de archivos.
- [x] Creado plan maestro: https://github.com/medinacaj/app-web-digi-firma/issues/1
- [x] Registrados diez issues técnicos: #2 a #11, con aceptación documentada.
- [x] PR de arranque en borrador: https://github.com/medinacaj/app-web-digi-firma/pull/12
- [ ] PR revisada y fusionada en `main`.
- [ ] Reglas de protección de `main` configuradas.
- [ ] Arquitectura definitiva aprobada.
- [ ] Funciones de firma operativas, seguras y verificadas.
- [ ] Revisión manual de la experiencia en navegador y pruebas de seguridad.

## Problemas abiertos
- Gobernanza GitHub y protección de propiedad intelectual: #2.
- Validación de alcance/producto: #3.
- Decisiones de stack y amenazas: #4.
- Privacidad y legislación: #10.
- Backend, PDF, solicitudes, evidencias, FEA y seguridad: #5–#9, #11.

## Alcance de las pruebas realizadas
La CI comprueba la estructura y ciertas invariantes del prototipo, **no** certifica seguridad, validez jurídica, ausencia de vulnerabilidades, navegación cross-browser ni preparación para producción.

## Regla de veracidad
Cerrar issues únicamente con entregables reales, pruebas/evidencia y PR revisada. No presentar una interfaz de ejemplo como servicio de firma electrónica.

## Próxima intervención
1. Revisar y aprobar la PR #12 (sin auto-merge).
2. Evaluar protección de `main` y accesos sin romper despliegues ni alterar privacidad sin autorización.
3. Resolver #3 y #4 antes de integrar backend y almacenamiento.
4. Mantener este archivo sincronizado tras cada integración.
