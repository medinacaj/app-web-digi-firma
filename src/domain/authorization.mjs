// Dominios de autorización diseñados para actores derivados de una sesión verificada.
// NUNCA crear actor desde parámetros remitidos por un cliente web.
export const ROLES = Object.freeze(["owner", "admin", "member", "auditor"]);
const ROLE_SET = new Set(ROLES);
export const ACTIONS = Object.freeze([
  "tenant:read", "tenant:manage", "document:create", "document:read",
  "document:manage", "request:create", "request:read", "request:manage",
  "audit:read"
]);
const ACTION_SET = new Set(ACTIONS);

export class AccessDenied extends Error {
  constructor() { super("Acceso no autorizado."); this.code = "ACCESS_DENIED"; }
}

export function isVenezuelanScope(resource) {
  return !!resource &&
    resource.countryCode === "VE" &&
    resource.legalJurisdiction === "VE";
}

// Booleano sin detalles: evita revelar si una entidad o un tenant existe.
export function canAccess({ actor, resource, action } = {}) {
  if (!actor || actor.sessionVerified !== true ||
      typeof actor.id !== "string" || !actor.id.trim() ||
      typeof actor.tenantId !== "string" || !actor.tenantId.trim() ||
      !ROLE_SET.has(actor.role) ||
      !resource || typeof resource.tenantId !== "string" ||
      resource.tenantId !== actor.tenantId ||
      !isVenezuelanScope(resource) || !ACTION_SET.has(action)) return false;

  const manager = actor.role === "owner" || actor.role === "admin";
  const author = typeof resource.createdBy === "string" && resource.createdBy === actor.id;

  switch (action) {
    case "tenant:read": return true;
    case "tenant:manage": return manager;
    case "document:create": return manager || actor.role === "member";
    case "document:read": return manager || author || actor.role === "auditor";
    case "document:manage": return manager || (actor.role === "member" && author);
    case "request:create": return manager || actor.role === "member";
    case "request:read": return manager || author || actor.role === "auditor";
    case "request:manage": return manager || (actor.role === "member" && author);
    case "audit:read": return manager || actor.role === "auditor";
    default: return false;
  }
}

export function requireAccess(args) {
  if (!canAccess(args)) throw new AccessDenied();
  return true;
}
