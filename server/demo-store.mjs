import { createHash, randomUUID } from "node:crypto";

// Solo datos ficticios. No almacenar documentos, identidades ni pruebas jurídicas.
export const DEMO_TEMPLATES = Object.freeze({
  "acuerdo-demo": "Acuerdo simulado de servicios",
  "solicitud-demo": "Solicitud administrativa ficticia"
});

export class DemoError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function assertVenezuela(countryCode) {
  if (countryCode !== "VE") throw new DemoError(422, "JURISDICTION_NOT_ALLOWED", "Solo se permiten demostraciones VE.");
}

export function hashEvent(payload) {
  return createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex");
}

export class DemoStore {
  #drafts = [];
  #events = [];
  #time;
  #id;
  constructor({ now = () => new Date().toISOString(), id = randomUUID } = {}) {
    this.#time = now;
    this.#id = id;
  }
  #log(action, draftId) {
    const previous = this.#events.at(-1)?.hash ?? "GENESIS";
    const record = Object.freeze({
      sequence: this.#events.length + 1,
      action,
      draftId,
      time: this.#time(),
      previous
    });
    this.#events.push(Object.freeze({ ...record, hash: hashEvent(record) }));
  }
  #validAudit() {
    let prev = "GENESIS";
    for (const { hash, ...record } of this.#events) {
      if (record.previous !== prev || hashEvent(record) !== hash) return false;
      prev = hash;
    }
    return true;
  }
  state() {
    return {
      simulated: true,
      countryCode: "VE",
      drafts: this.#drafts.map((draft) => ({ ...draft })),
      events: this.#events.map((event) => ({ ...event })),
      auditIntegrityValid: this.#validAudit()
    };
  }
  create({ countryCode, templateId } = {}) {
    assertVenezuela(countryCode);
    if (!Object.hasOwn(DEMO_TEMPLATES, templateId)) {
      throw new DemoError(422, "INVALID_TEMPLATE", "Plantilla ficticia desconocida.");
    }
    if (this.#drafts.length >= 30) {
      throw new DemoError(429, "DEMO_CAP", "Límite de 30 borradores sintéticos por ejecución.");
    }
    const draft = Object.freeze({
      id: this.#id(),
      countryCode: "VE",
      templateId,
      templateTitle: DEMO_TEMPLATES[templateId],
      status: "draft",
      createdAt: this.#time()
    });
    this.#drafts.unshift(draft);
    this.#log("draft-created", draft.id);
    return this.state();
  }
  cancel({ countryCode, id } = {}) {
    assertVenezuela(countryCode);
    if (typeof id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(id)) {
      throw new DemoError(400, "INVALID_ID", "Identificador incorrecto.");
    }
    const index = this.#drafts.findIndex((draft) => draft.id === id);
    if (index === -1) throw new DemoError(404, "NOT_FOUND", "Borrador no encontrado.");
    if (this.#drafts[index].status !== "draft") {
      throw new DemoError(409, "INVALID_STATE", "El borrador ya fue cancelado.");
    }
    this.#drafts[index] = Object.freeze({ ...this.#drafts[index], status: "cancelled" });
    this.#log("draft-cancelled", id);
    return this.state();
  }
}
