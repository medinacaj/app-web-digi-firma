// Digi-Firma: jurisdicción única (Venezuela). La política DEBE repetirse y validarse en backend.
export const jurisdiction = Object.freeze({
  countryCode: "VE",
  countryName: "Venezuela",
  locale: "es-VE",
  exclusive: true,
  legalFramework: "Decreto-Ley N.º 1.204 sobre Mensajes de Datos y Firmas Electrónicas",
  regulator: "SUSCERTE"
});

// Este chequeo de dominio no sustituye la autorización en backend ni prueba nacionalidad.
export function isSupportedJurisdiction(value) {
  return typeof value === "string" && value.trim().toUpperCase() === jurisdiction.countryCode;
}

// Estados declarativos: NUNCA representan documentos ni firmas reales.
export const milestones = Object.freeze([
  Object.freeze({ id: "scope", title: "Definición de alcance y normativa venezolana", status: "in-progress" }),
  Object.freeze({ id: "foundation", title: "Base técnica y calidad", status: "in-progress" }),
  Object.freeze({ id: "identity", title: "Identidad venezolana, sesiones y organizaciones", status: "pending" }),
  Object.freeze({ id: "documents", title: "Custodia y flujo de documentos", status: "pending" }),
  Object.freeze({ id: "signatures", title: "Firma electrónica y consentimiento verificable", status: "pending" }),
  Object.freeze({ id: "evidence", title: "Auditoría e integridad verificable", status: "pending" }),
  Object.freeze({ id: "compliance", title: "Integración con PSC acreditado por SUSCERTE", status: "pending" }),
  Object.freeze({ id: "release", title: "Auditoría jurídica/técnica y piloto venezolano", status: "pending" })
]);

export const capabilities = Object.freeze({
  uploadRealDocuments: false,
  issueSignatureRequests: false,
  produceElectronicSignatures: false,
  certifiedElectronicSignatures: false,
  identityVerification: false,
  auditTrail: false,
  productionReady: false
});

export function projectProgress(items = milestones) {
  const total = items.length;
  const complete = items.filter((item) => item.status === "done").length;
  return Object.freeze({ total, complete, percent: total ? Math.round(100 * complete / total) : 0 });
}
