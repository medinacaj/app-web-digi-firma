# Sistema de identidad propuesto · DigiFirma
**Versión:** propuesta 0.1 · 2026-11-12 · **No aprobado / no publicado**.

## Diagnóstico basado en código
La landing actual (`assets/site.css`) utiliza azules eléctricos, paneles blancos y tarjetas redondeadas; el dashboard (`assets/app.css`) repite monograma DF en degradado azul, navegación lateral y el mismo patrón de cards empleado en DigiCondominio. Ambos se perciben como variantes del mismo template. No existe en la revisión una identidad corporativa diferenciada y consistente a escala de landing, aplicación, registro y favicon.

## Posicionamiento
- **Nombre de trabajo:** DigiFirma. No se propone cambiar el nombre del repositorio ni hacer afirmaciones de marca registrada.
- **Categoría:** gestión y preparación de flujos documentales para Venezuela. Las funciones de firma electrónica real/certificada **no están operativas**.
- **Promesa de marca propuesta:** «Cada documento, con claridad y control». Nunca decir «firma certificada», «validación legal garantizada» ni insinuar aval de SUSCERTE.
- **Personalidad:** precisa, institucional, confiable, discreta; evitar el look fintech genérico, escudos de ciberseguridad y sellos oficiales ficticios.
- **Audiencia:** profesionales, pequeñas empresas y equipos que gestionan documentos bajo alcance VE, sujeto a revisión legal del servicio.

## Dirección visual A — Sello documental
**Idea de logo principal:** símbolo geométrico original, con una esquina doblada que evoca una hoja y un trazo continuo que forma una «F» abstracta / ruta de aprobación. Sin usar escudos oficiales ni una rúbrica de persona real. Debe funcionar separado del texto y a 16 px.
- **Firma horizontal:** símbolo a izquierda + wordmark «DigiFirma», peso semibold con separación óptica cuidada; descriptor «Documentos · Venezuela» en piezas corporativas, nunca en favicon.
- **Isotipo:** la hoja/trazo dentro de cuadrado de esquinas discretamente redondeadas; sin letras pequeñas en tamaños mínimos.
- **Monocromo:** 100 % tinta y 100 % blanco. No depender de sombras o degradados para reconocimiento.
- **Alternativa a contrastar:** monograma DF construido con líneas de archivo y trayectoria, **sin** competir con el isotipo residencial de DigiCondominio.
- **Reglas:** área libre ≥ altura de la diagonal del símbolo; tamaño horizontal mínimo sugerido 120 px y símbolo 20 px; confirmar después con prototipos.

### Paleta propuesta (tokens y roles)
| Token | HEX | Función |
|---|---|---|
| `--df-ink` | `#0B2033` | Texto principal y fondo institucional |
| `--df-metal` | `#C79A4B` | Acento de marca, detalles de sello e indicadores, no párrafos sobre blanco |
| `--df-paper` | `#F6F4EE` | Superficies de documentos y fondos cálidos |
| `--df-steel` | `#52788A` | Enlaces, acciones secundarias y elementos de interfaz |
| `--df-white` | `#FFFFFF` | Tarjetas y fondo de lectura |
| `--df-alert` | `#9D3D43` | Advertencias y errores; evaluar contrastes reales |

**Contrastado en pares preliminares (WCAG):** tinta/marfil 15.05:1; dorado/tinta 6.43:1; steel/blanco 4.76:1. Verificar todos los estados e iconos mediante pruebas de accesibilidad antes de aprobar; el dorado **no** se usará como texto pequeño sobre blanco.

### Tipografía y composición
- Encabezados: **Manrope** 600–750 (sujeto a confirmar licencia/hosting y descarga permitida); alternativa `system-ui`.
- Acentos editoriales opcionales: **Source Serif 4** solo en citas/campañas institucionales; evitar serif en campos.
- Texto UI: `system-ui` / «Segoe UI», priorizando legibilidad y rendimiento.
- **Layout:** página editorial, márgenes amplios, jerarquías tipográficas, documentación como elemento central, timeline vertical de «Preparar → Revisar → Solicitar», bloques con líneas finas (no tarjetas flotantes en cada sección).
- **Dashboard:** barra superior con contexto de organización y navegación por expedientes/solicitudes; panel lateral solo si responde a arquitectura IA, no copiar el de la app residencial.
- **Componentes:** esquinas de 6–10 px, bordes finos, botones sólidos de tinta con acento metálico controlado, tablas y estados documentales con texto + icono.
- **Iconografía:** trazos lineales de documento, expediente, historial, revisión, sello abstracto; no manos firmando ni checkmarks que sugieran firma validada cuando no lo está.

### Tono de comunicación
Preciso, sobrio, claro y explícito sobre las limitaciones:
- Preferir: «Prepara y organiza documentos», «Ver demostración», «Registro de usuarios: próximamente».
- Evitar: «Firma ya con validez legal», «100 % protegido», «Certificación garantizada», «SUSCERTE aprobado».
- El flujo de alta futura debe alinearse con [registro obligatorio #25](https://github.com/medinacaj/app-web-digi-firma/issues/25); la demo pública nunca debe recoger correos, contraseñas, cédulas o archivos reales.

## Favicon y aplicaciones
- **Favicon final:** el isotipo hoja/trazo sin tipografía, trabajado y revisado específicamente a 16 × 16 y 32 × 32; fondo sólido `#0B2033`, forma clara o dorada con contraste suficiente.
- **Entregables tras aprobar dirección:** `assets/brand/digifirma-logo.svg`, `digifirma-mark.svg`, `favicon.svg`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png` (180 × 180), `social-card.png` (1200 × 630); registrar licencias y autoría. No convertir este documento en un logo realizado.
- **Integración:** tags `<link rel="icon">`, `apple-touch-icon`, `theme-color`, `og:image`, título, manifest si se desarrolla PWA; landing, demo `/app/`, vista previa `/registro/`, emails transaccionales y futuras pantallas autenticadas.
- **No introducir assets de marca en Pages** sin revisión de PR y validación de la allowlist de `scripts/build-public.mjs`.

## Diferenciación frente a DigiCondominio
| Atributo | DigiFirma | DigiCondominio |
|---|---|---|
| Símbolo | Documento/trazo de autorización abstracto | Edificios/patio/comunidad |
| Paleta | Azul tinta / bronce dorado / papel | Verde profundo / arena / terracota |
| Composición | Editorial, orden documental, líneas | Cálida, espacial, vida de comunidad |
| Widgets | Expedientes, timeline, auditoría | Propiedades, residentes, incidencias |
| Voz | Institucional, cautelosa | Cercana, resolutiva |

## Criterios de aceptación del branding (trabajo posterior)
- [ ] Propietario aprueba propuesta de nombre, paleta y una opción de logo y favicon.
- [ ] Crear logos **originales y distintos entre productos**, SVG editables y derivados PNG; revisar uso monocromo y tamaños mínimos.
- [ ] Verificar identidad en landing, panel de demostración y registro futuro, escritorio y móvil, sin perder navegación ni accesibilidad.
- [ ] Comprobar contraste WCAG AA en texto, foco, controles y estados.
- [ ] Comprobar favicon en navegador (claro/oscuro), 16/32 px, sin confusión con DigiCondominio.
- [ ] Validar CI de `scripts/build-public.mjs` y que el paquete Pages no incluya código ni datos sensibles.
- [ ] Confirmar uso legítimo de tipografías, marca y recursos antes de publicación.
- [ ] Aplicar diseño en PR de implementación **separado**, sin fusionar ni desplegar esta propuesta automáticamente.

**Esta PR solo propone identidad.** No incluye gráficos finales ni modifica CSS productivo, Pages, backend o visibilidad.
