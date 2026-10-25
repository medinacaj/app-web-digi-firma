// Proyecto: estados declarativos. Ningún estado representa firmas reales.
export const milestones = Object.freeze([
  Object.freeze({ id: "scope", title: "Definición del alcance y riesgos", status: "in-progress" }),
  Object.freeze({ id: "foundation", title: "Base técnica y calidad", status: "in-progress" }),
  Object.freeze({ id: "identity", title: "Identidad, sesiones y organizaciones", status: "pending" }),
  Object.freeze({ id: "documents", title: "Custodia y flujo de documentos", status: "pending" }),
  Object.freeze({ id: "signatures", title: "Firma electrónica simple y consentimiento", status: "pending" }),
  Object.freeze({ id: "evidence", title: "Auditoría e integridad verificable", status: "pending" }),
  Object.freeze({ id: "compliance", title: "Cumplimiento y firma avanzada mediante PSC", status: "pending" }),
  Object.freeze({ id: "release", title: "Auditoría externa y lanzamiento", status: "pending" })
]);

export const capabilities = Object.freeze({
  uploadRealDocuments: false,
  issueSignatureRequests: false,
  produceElectronicSignatures: false,
  advancedSignature: false,
  identityVerification: false,
  auditTrail: false,
  productionReady: false
});

export function projectProgress(items = milestones) {
  const total = items.length;
  const complete = items.filter((item) => item.status === "done").length;
  return Object.freeze({ total, complete, percent: total ? Math.round(100 * complete / total) : 0 });
}
