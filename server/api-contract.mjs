import { canAccess } from "../src/domain/authorization.mjs";
import { createPreparedRequest } from "../src/domain/request-workflow.mjs";

// Adaptador de dominio HTTP, NO servidor ejecutable. Requiere verificador de identidad
// y repositorio confiables, inyectados desde infraestructura aún no implementada.
export function createApiContract({ verifyBearer, repository } = {}) {
  if (typeof verifyBearer !== "function" ||
      !repository || typeof repository.listDocuments !== "function" ||
      typeof repository.getDocument !== "function" ||
      typeof repository.savePreparedRequest !== "function") {
    throw new Error("Dependencias de identidad y persistencia obligatorias.");
  }

  const reply = (status, body) => Object.freeze({
    status,
    headers: Object.freeze({
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }),
    body: Object.freeze(body)
  });

  return async function handle({ method, path, authorization, body } = {}) {
    // No tomar nunca id de actor, rol, membresía o autenticación desde JSON/cliente.
    const capabilities = Object.freeze({
      countryCode: "VE", jurisdiction: "VE",
      acceptsRealDocuments: false,
      sendsSignatureRequests: false,
      producesSignatures: false,
      certifiedBySUSCERTE: false,
      authenticationConfigured: false
    });
    if (method === "GET" && path === "/api/v1/capabilities") {
      return reply(200, capabilities);
    }
    if (typeof path !== "string" || path.length > 250 || path.includes("?") ||
        typeof method !== "string" || !["GET", "POST"].includes(method)) {
      return reply(404, { code: "NOT_FOUND" });
    }
    if (path.startsWith("/api/v1/sign") || path.includes("/signatures")) {
      return reply(501, { code: "SIGNATURE_ENGINE_DISABLED" });
    }
    const segments = /^\/api\/v1\/organizations\/([0-9a-f-]{36})\/(documents|prepared-requests)$/.exec(path);
    if (!segments) return reply(404, { code: "NOT_FOUND" });
    const organizationId = segments[1];
    const resourceKind = segments[2];

    if (typeof authorization !== "string" || authorization.length > 4103 ||
        !authorization.startsWith("Bearer ") || authorization.length <= 8) {
      return reply(401, { code: "UNAUTHORIZED" });
    }

    let actor;
    try { actor = await verifyBearer(authorization.slice(7)); }
    catch { return reply(401, { code: "UNAUTHORIZED" }); }

    if (!actor || actor.sessionVerified !== true || actor.tenantId !== organizationId) {
      // No confirmar existencia de organizaciones ajenas.
      return reply(404, { code: "NOT_FOUND" });
    }

    try {
      if (method === "GET" && resourceKind === "documents") {
        const docs = await repository.listDocuments(organizationId);
        if (!Array.isArray(docs)) throw new Error("Invalid repository result");
        const visible = docs.filter((document) => canAccess({ actor, resource: document, action: "document:read" }));
        return reply(200, { countryCode: "VE", documents: visible.map((d) =>
          Object.freeze({ id: d.id, status: d.status, countryCode: "VE" })) });
      }
      if (method === "POST" && resourceKind === "prepared-requests") {
        if (!body || Array.isArray(body) || typeof body !== "object" ||
            Object.keys(body).sort().join(",") !== "countryCode,documentId" ||
            body.countryCode !== "VE" || typeof body.documentId !== "string" ||
            !/^[0-9a-f-]{36}$/.test(body.documentId)) {
          return reply(422, { code: "INVALID_REQUEST" });
        }
        const doc = await repository.getDocument({ organizationId, documentId: body.documentId });
        if (!doc || !canAccess({ actor, resource: doc, action: "request:create" })) {
          return reply(404, { code: "NOT_FOUND" });
        }
        const draft = createPreparedRequest({ actor, document: doc });
        await repository.savePreparedRequest(draft);
        return reply(201, {
          id: draft.id, status: draft.status, demoOnly: true,
          countryCode: "VE", documentId: draft.documentId
        });
      }
      return reply(405, { code: "METHOD_NOT_ALLOWED" });
    } catch {
      // No devolver detalles sobre SQL, tokens, documentos o sesiones.
      return reply(500, { code: "INTERNAL_ERROR" });
    }
  };
}
