# Digi-Firma Venezuela · aplicación web (proyecto en desarrollo)

> **País único y mercado exclusivo: Venezuela (VE).**
> **Estado:** fase 0, prototipo privado, no operativo. NO genera firmas válidas ni emite certificados electrónicos.
> El repositorio debe permanecer **privado**. No activar un despliegue público sin autorización y revisión de seguridad.

Digi-Firma es el nombre interno de una plataforma web para preparar, solicitar, verificar y custodiar documentos y firmas electrónicas **para el mercado exclusivamente venezolano**, conforme al marco legal venezolano y tras la validación jurídica correspondiente.

La marca comercial aún no está aprobada. `FirmaEnLínea` continúa únicamente como candidato, no como nombre decidido.

## Principios no negociables

1. **VE exclusivo:** el alcance comercial, flujos, registros, reglas del backend, contratos y verificaciones se limitan a Venezuela. La constante `jurisdiction.countryCode = "VE"` es una protección declarativa del prototipo, no una validación de backend.
2. **Derecho venezolano:** Decreto-Ley N.º 1.204 de 2001, Reglamento Parcial y resoluciones pertinentes de SUSCERTE. No aplicar categorías ni requisitos jurídicos de otros países por analogía.
3. **Certificación:** diferenciar firma con requisitos del artículo 16 de la firma certificada por PSC conforme al artículo 18. Integraciones sujetas a acreditación vigente por SUSCERTE y revisión legal.
4. **Privacidad y propiedad intelectual:** no publicar código, documentos ni datos reales. No se almacena información de usuarios en la fase actual.
5. **Veracidad:** la interfaz no debe simular que una firma real está disponible.

## Ejecutar el prototipo

Se requiere servidor HTTP estático (los módulos ES no funcionan de forma fiable con `file://`).

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/`.

## Pruebas

Node.js 22 recomendado, sin instalar paquetes de terceros.

```bash
node --check assets/app.js
node --check src/project.mjs
node --test
```

El CI prueba sintaxis, reglas de alcance de jurisdicción y algunas invariantes de estado. **No es un pentest ni una certificación legal.**

## Documentación

- [Producto y alcance Venezuela](docs/PRODUCTO.md)
- [Arquitectura y control territorial](docs/ARQUITECTURA.md)
- [Seguridad y privacidad](docs/SEGURIDAD.md)
- [Normativa Venezuela](docs/LEGAL-VENEZUELA.md)
- [Roadmap](docs/ROADMAP.md)
- [Progreso verificable](docs/PROGRESO.md)

## Qué todavía no existe

No hay backend, registro de usuarios, validación de cédulas o RIF, custodia de archivos, firma electrónica real, certificado, prestador integrado, facturación ni despliegue. Cualquier operación real requiere controles, pruebas y aprobación legal.

## Seguimiento GitHub

- [Plan maestro](https://github.com/medinacaj/app-web-digi-firma/issues/1).
- [PR de inicio en borrador](https://github.com/medinacaj/app-web-digi-firma/pull/12).
- Actualizar `docs/PROGRESO.md` en cada cambio verificado. No fusionar cambios sin pruebas.

## Laboratorio local implementado

Se añadió un servidor HTTP de prueba, solo para uso local, **desactivado por defecto** y enlazado a `127.0.0.1`. No es un entorno de producción. Tiene dos plantillas ficticias y permite crear/cancelar borradores y visualizar eventos SHA-256 en memoria. **No sube archivos, no contiene autenticación real, no genera firmas, no certifica identidad y no custodia datos.**

Para iniciar únicamente este laboratorio (Node.js 22):
```bash
DIGIFIRMA_DEMO=1 node server/dev.mjs
```
En PowerShell:
```powershell
$env:DIGIFIRMA_DEMO = "1"
node server/dev.mjs
```
Abrir `http://127.0.0.1:8787/` y entrar a **Solicitudes** para generar borradores sintéticos. El estado se borra al reiniciar el proceso. No ingresar datos reales de personas o empresas. El servidor rechaza `NODE_ENV=production`, orígenes remotos, entradas fuera de VE y cualquier intento de firma real.

### Pruebas de laboratorio
```bash
node --test
```
Incluyen flujos de la API, límites, validaciones de cuerpo, control de origen y verificación de cadena de hashes, además de la UI/alcance. **La cadena de hashes en memoria no demuestra inviolabilidad ni equivale a una firma electrónica.**

### Bloqueos de lanzamiento
Para uso real faltan autenticación e identidad verificables, persistencia privada cifrada, subida/escaneo de PDFs, firmas ajustadas a ley venezolana, auditoría independiente y, cuando proceda, integración con PSC acreditado por SUSCERTE. La demo no reemplaza esos pasos.
