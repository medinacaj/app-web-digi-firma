import { randomUUID } from "node:crypto";
import { AccessDenied, requireAccess, isVenezuelanScope } from "./authorization.mjs";

export class WorkflowError extends Error {
  constructor(code, message = "Operación no permitida.") {
    super(message);
    this.code = code;
  }
}

function safeReference(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{3,48}$/.test(value);
}

export function createPreparedRequest({ actor, document, id = randomUUID } = {}) {
  requireAccess({ actor, resource: document, action: "request:create" });
  if (!safeReference(document.id) || document.createdBy !== actor.id ||
      document.status !== "draft" || !isVenezuelanScope(document)) {
    throw new WorkflowError("INVALID_DOCUMENT");
  }
  // No incluye PDF, firmantes, correos, cédulas ni operaciones de firma.
  return Object.freeze({
    id: id(),
    tenantId: actor.tenantId,
    countryCode: "VE",
    legalJurisdiction: "VE",
    documentId: document.id,
    createdBy: actor.id,
    status: "draft",
    participants: Object.freeze([]),
    demoOnly: true
  });
}

export function addPreparedParticipant({ actor, request, reference } = {}) {
  requireAccess({ actor, resource: request, action: "request:manage" });
  if (request.demoOnly !== true || request.status !== "draft") {
    throw new WorkflowError("NOT_EDITABLE");
  }
  if (!safeReference(reference) || !reference.startsWith("demo_")) {
    throw new WorkflowError("SYNTHETIC_ONLY");
  }
  if (request.participants.length >= 8) throw new WorkflowError("MAX_PARTICIPANTS");
  if (request.participants.includes(reference)) throw new WorkflowError("DUPLICATE_PARTICIPANT");
  return Object.freeze({
    ...request,
    participants: Object.freeze([...request.participants, reference])
  });
}

export function configurePreparedRequest({ actor, request } = {}) {
  requireAccess({ actor, resource: request, action: "request:manage" });
  if (request.demoOnly !== true || request.status !== "draft" ||
      request.participants.length === 0) throw new WorkflowError("NOT_CONFIGURABLE");
  return Object.freeze({ ...request, status: "configured" });
}

export function cancelPreparedRequest({ actor, request } = {}) {
  requireAccess({ actor, resource: request, action: "request:manage" });
  if (request.demoOnly !== true || !["draft", "configured"].includes(request.status)) {
    throw new WorkflowError("NOT_CANCELLABLE");
  }
  return Object.freeze({ ...request, status: "cancelled" });
}

export function transitionToSigned() {
  // Requiere futura implementación de identidad/certificados/consentimiento.
  throw new WorkflowError("SIGNATURE_ENGINE_NOT_IMPLEMENTED");
}

export { AccessDenied };
