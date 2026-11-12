# Roadmap — Digi-Firma Venezuela

**Único mercado: Venezuela.** Todas las fases requieren pruebas y evidencia. Sin fechas de lanzamiento prometidas. Issues y PR son el seguimiento operativo.

| Etapa | Trabajo | Criterio de cierre |
| --- | --- | --- |
| 0 | Prototipo privado, jurisdicción VE, CI y documentación | PR revisada y verificada; ninguna firma real |
| 1 | Definir casos de uso, tipos documentales venezolanos y arquitectura | Alcance y amenazas aprobados; decisiones ADR |
| 2 | Registro obligatorio de personas, verificación de correo, sesiones, invitaciones de firmantes y organizaciones | Alta real validada, MFA admins, recuperación, denegación sin sesión y pruebas entre dos usuarios y dos organizaciones |
| 3 | PDF privado, versiones y solicitudes | Cifrado, validación, autorización y flujos verificables |
| 4 | Firma electrónica conforme al Decreto-Ley 1.204 | Evidencia, autoría, integridad y revisión legal por tipo de acto |
| 5 | Integración con PSC acreditado ante SUSCERTE cuando corresponda | Acreditación vigente y validación del certificado/cadena |
| 6 | Seguridad, derechos de privacidad y operación | Pentest, restauración, incident response y evaluación legal |
| 7 | Piloto venezolano controlado | Aprobación comercial, jurídica y técnica antes de operar |

## Seguimiento
- [Epic #1](https://github.com/medinacaj/app-web-digi-firma/issues/1)
- Producto, arquitectura y cumplimiento: #3, #4 y #10.
- Firma y certificación venezolana: #8 y #9.
- No completar una tarea porque exista una pantalla o documento: exigir pruebas y revisión.

## Próximos pasos
Revisar PR #12 y configuración privada/protección de ramas; después cerrar decisiones de producto, identidad y arquitectura. No desplegar públicamente en fase 0.

**Decisión actualizada (2026-11-12):** todo usuario de las funciones reales, incluso firmantes invitados, debe registrarse e iniciar sesión. El sitio de marketing y la demo sintética en Pages no necesitan cuenta. Diseño en [REGISTRO_USUARIOS.md](REGISTRO_USUARIOS.md) e implementación en [Issue #25](https://github.com/medinacaj/app-web-digi-firma/issues/25). La vista previa estática no permite alta real.
