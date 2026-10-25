# Marco legal preliminar — Digi-Firma Venezuela

**Ámbito exclusivo: República Bolivariana de Venezuela.** Documento de requisitos de producto, **no es asesoría jurídica**, acreditación ni dictamen de cumplimiento. Revalidar textos normativos, reglamentos y acreditaciones antes de lanzar.

## Norma fundamental
**Decreto con Fuerza de Ley sobre Mensajes de Datos y Firmas Electrónicas**, Decreto N.º 1.204 del 10 de febrero de 2001, Gaceta Oficial N.º 37.148 del 28 de febrero de 2001.

Fuentes:
- SUSCERTE (regulador): https://www.suscerte.gob.ve/
- Texto legal accesible: https://venezuela.justia.com/federales/decretos/decreto-n-1-204/gdoc/
- Documento original difundido por SUSCERTE: https://www.suscerte.gob.ve/wp-content/uploads/2022/07/Ley-sobre-Mensajes-de-Datos-y-Firmas-Electronicas.pdf
- Reglamento parcial difundido por SUSCERTE: https://www.suscerte.gob.ve/wp-content/uploads/2024/02/Reglamento-Parcial-del-Decreto-Ley-sobre-Mensajes-de-Datos-y-Firmas-Electronicas.pdf

## Puntos de diseño de cumplimiento
1. **Artículo 1:** reconoce valor jurídico del mensaje de datos y firma electrónica; no elimina formalidades registrales o de autenticación exigibles a determinados actos.
2. **Artículo 16:** contempla vinculación con el signatario y atribución de autoría; exige entre otros protección de datos de generación, resistencia a falsificación e integridad del mensaje.
3. **Artículo 17:** cuando no se satisfacen los requisitos anteriores, puede existir valor de convicción sujeto a apreciación judicial, pero no atribuir automáticamente los mismos efectos del artículo 16.
4. **Artículo 18:** firma electrónica certificada por Proveedor de Servicios de Certificación (PSC) conforme al Decreto-Ley: presunción de cumplimiento de los requisitos del artículo 16.
5. **Artículos 20–22:** SUSCERTE es la autoridad competente para acreditar y supervisar PSC, conforme a ley y reglamentos.

**Terminología:** no importar etiquetas regulatorias de otros países para prometer “firma avanzada” como categoría venezolana. Debemos describir prestaciones verificables y condiciones concretas de certificación conforme a la normativa venezolana.

## Prestadores de certificación
SUSCERTE publica información sobre PSC y su acreditación. Comprobar al contratar la acreditación y vigencia del prestador, tipo de certificado, alcance contractual, APIs, cadena de confianza, revocación y restricciones. **Digi-Firma no es un PSC acreditado por el simple hecho de implementar una plataforma.**

## Otras normas y riesgos
- **Ley de Infogobierno:** revisar aplicabilidad cuando intervenga el sector público y su cadena de certificación; no universalizar reglas del sector público al privado.
- **Constitución:** protección de la vida privada, intimidad y acceso/rectificación de información personal según el ordenamiento aplicable.
- **Ley Especial contra los Delitos Informáticos:** evaluar obligaciones y controles pertinentes sobre acceso, integridad y privacidad.
- **Datos personales:** verificar las normas vigentes y sectoriales. No afirmar existencia ni ausencia definitiva de una ley general sin comprobación jurídica actual.
- **Identidad:** cédula y RIF se tratarán como datos personales potencialmente sensibles; el formato del identificador no constituye verificación real de identidad, capacidad o representación.

## Reglas antes de activar firma
- Análisis jurídico por tipo documental y formalidades específicas (notaría, registro, poderes, etc.).
- Definir régimen del servicio: orquestador vs. emisión de certificados por PSC; evitar ofertas no acreditadas.
- Contratos y procedimientos con PSC acreditados si la certificación es necesaria.
- Evidencia del consentimiento, atribución, documento exacto y no alteración.
- Política de privacidad, retención, derechos y medidas de seguridad.
- Revisión de anuncios comerciales para no confundir firma visual con firma electrónica de eficacia legal.

## Pendiente
Dictamen jurídico en Venezuela, revisión de gacetas/reglamentos vigentes, proveedor autorizado y alcance de documentos que admite el MVP. Registrar resultados en issues #9 y #10.
