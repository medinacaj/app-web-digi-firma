# Roadmap preliminar

Los hitos son dependencias de trabajo, no fechas prometidas. El seguimiento ejecutable debe mantenerse en GitHub Issues y PRs; el resumen de estado debe reflejar únicamente verificaciones realizadas.

| Fase | Entregable | Criterio para cerrar |
| --- | --- | --- |
| 0 | Inspección, documentación y prototipo | PR revisada, controles de CI y backlog registrado |
| 1 | Contratos de producto y arquitectura | Alcance, decisiones y modelo de amenazas aprobados |
| 2 | Identidad, sesiones, organizaciones | Tests de permisos, MFA admin y aislamiento |
| 3 | PDF y solicitudes | Custodia cifrada, límites, escaneo y flujos testeados |
| 4 | Firma simple y evidencias | Consentimiento, identidad, hash, sello y auditoría |
| 5 | FEA mediante prestador acreditado | Integración y validación legal/técnica verificadas |
| 6 | Seguridad, operación y cumplimiento | Pentest, pruebas de restauración y plan de incidentes |
| 7 | Piloto controlado | Criterios de aceptación, soporte y decisión de lanzamiento |

## Forma de trabajo
1. Cada capacidad tiene un issue con aceptación explícita.
2. Los cambios se realizan en ramas, PR y CI; evitar pushes directos a main.
3. Un issue solo se cierra con evidencia revisada y documentación al día.
4. No se publica un despliegue hasta completar privacidad, identidad y autorizaciones.
5. Todo desarrollo posterior actualiza docs/PROGRESO.md, incorporando fecha, commit y resultados.

## Prioridad inmediata
Cerrar auditoría/configuración GitHub, confirmar alcance, seleccionar arquitectura definitiva y definir threat model; después implementar auth y storage. La UI no sustituye estos controles.
