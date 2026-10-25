# Seguridad de Digi-Firma Venezuela

**No utilizar este código para documentos, identidades o firmas reales.** El repositorio es privado y la aplicación sigue en desarrollo.

## Reporte de vulnerabilidades
No abrir issues públicos con tokens, cédulas, RIF, PDFs, credenciales, detalles de explotación o datos personales. Contactar privadamente al titular del repositorio mediante los canales internos de GitHub o el mecanismo de reporte privado que pueda habilitar.

## Alcance actual
- Prototipo web con calculadora de hashes PDF **solo local en navegador**.
- Laboratorio HTTP de borradores **sintéticos y efímeros**, disponible únicamente si se habilita la variable `DIGIFIRMA_DEMO=1`, en loopback y fuera de producción.
- No hay backend productivo, base de datos, firma o verificación de identidad.
- El país admitido por el prototipo es VE, pero aún no existe una validación legal de jurisdicción para casos reales.

## Condiciones de desarrollo
- Mantener visibilidad `private`, no agregar colaboradores/apps ni habilitar despliegues sin autorización.
- No introducir certificados, claves, secretos, documentos reales ni datos personales en Git, issues, pull requests, logs, pruebas o prompts.
- Verificar secretos y dependencias antes de cada despliegue.
- No publicar APIs del laboratorio ni crear túneles/reverse proxies que lo expongan.
- Usar ramas, CI y revisión; CODEOWNERS solo es una sugerencia de revisión hasta que exista protección de ramas.
- Evaluar formalidades del Decreto-Ley 1.204 y prestadores acreditados ante SUSCERTE antes de ofrecer firmas.

## Limitaciones explícitas
Los hashes locales prueban igualdad de bytes, no identidad ni validez legal. La cadena de eventos en memoria puede reconstruirse y **no es una evidencia auditada ni inmutable**. No prometer protección de propiedad intelectual absoluta: auditar licencias, políticas de GitHub, accesos y servicios de IA conectados.
