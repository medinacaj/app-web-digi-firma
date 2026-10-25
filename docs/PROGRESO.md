# Progreso verificable — Digi-Firma Venezuela

**Fecha de revisión:** 2026-10-25.
**Mercado confirmado:** Venezuela exclusivamente (`VE`). No se admiten otros países en el alcance del producto.
**Repositorio:** `medinacaj/app-web-digi-firma`, privado.
**Rama de desarrollo:** `chore/inicio-auditoria-y-base`; PR #12 (borrador).

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
- [ ] Aprobación/fusión de PR #12.
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
