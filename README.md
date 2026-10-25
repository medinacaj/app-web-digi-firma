# Digi-Firma · Aplicación web (en desarrollo)

> **Estado:** Fase 0 — inicio técnico. Repositorio **privado**.
> **Importante:** NO es un servicio operativo de firma electrónica ni genera firmas válidas.

Digi-Firma es el nombre interno del proyecto de una plataforma de gestión y firma de documentos electrónicos, orientada inicialmente al marco normativo chileno. La marca comercial no está decidida; "FirmaEnLínea" es únicamente un candidato en evaluación.

## Estado actual

- Prototipo de interfaz navegable, **sin backend, usuarios, documentos reales ni firmas**.
- Pruebas automáticas sin dependencias de terceros.
- Decisiones, requisitos y riesgos de inicio documentados.
- Desarrollo organizado en issues y cambios mediante pull requests.
- La rama principal no debe recibir trabajo directo: revisión previa por PR.

## Ejecutar el prototipo

Se requiere un servidor HTTP estático (ES modules no deben abrirse directamente con file://).

Ejemplo con Python 3:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/`.

## Ejecutar verificaciones

```bash
node --check assets/app.js
node --check src/project.mjs
node --test
```

Node.js 22 recomendado. Sin instalación de paquetes ni dependencias externas en Fase 0.

## Documentación

- [Alcance y criterios de aceptación](docs/PRODUCTO.md)
- [Arquitectura y fases](docs/ARQUITECTURA.md)
- [Modelo de amenazas y controles](docs/SEGURIDAD.md)
- [Marco normativo chileno](docs/LEGAL-CHILE.md)
- [Roadmap](docs/ROADMAP.md)
- [Estado verificable](docs/PROGRESO.md)

## Restricciones de seguridad

No introducir datos de clientes, documentos reales, credenciales, claves privadas ni tokens en Git. No activar GitHub Pages ni despliegues públicos sin revisión de exposición de datos y autorización expresa. No procesar documentos de producción en este prototipo.

## Definición de terminado

Una funcionalidad no está completa por tener interfaz; requiere flujo backend, autorización, persistencia segura, validaciones, pruebas y evidencia documentada según su riesgo. Para la firma electrónica avanzada se requiere integrar un prestador acreditado y validar el modelo jurídico/técnico antes de ofrecerla.

Propiedad del proyecto: repositorio bajo control de su titular. Fecha de inicio técnico: 2026-10-25.
