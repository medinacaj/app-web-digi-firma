// Simulación efímera: sin red, archivos, identidad ni almacenamiento persistente.
const templates = Object.freeze({
  'acuerdo-demo': 'Acuerdo simulado de servicios',
  'solicitud-demo': 'Solicitud administrativa ficticia'
});
async function hash(record) {
  const bytes = new TextEncoder().encode(JSON.stringify(record));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
function fields(input, expected) {
  if (!input || typeof input !== 'object' || Array.isArray(input) ||
      Object.keys(input).sort().join(',') !== expected || input.countryCode !== 'VE') {
    throw new Error('Solo se admiten datos sintéticos para Venezuela.');
  }
}
export function createBrowserDemoStore() {
  const drafts = [], events = [];
  let pending = Promise.resolve();
  const serialize = action => {
    const result = pending.then(action);
    pending = result.catch(() => {});
    return result;
  };
  async function snapshot() {
    let previous = 'GENESIS';
    let valid = true;
    for (const { hash: stored, ...record } of events) {
      if (record.previous !== previous || await hash(record) !== stored) valid = false;
      previous = stored;
    }
    return { simulated: true, countryCode: 'VE', drafts: drafts.map(d => ({...d})),
      events: events.map(e => ({...e})), auditIntegrityValid: valid };
  }
  async function event(action, draftId) {
    const record = { sequence: events.length + 1, action, draftId,
      time: new Date().toISOString(), previous: events.at(-1)?.hash ?? 'GENESIS' };
    return {...record, hash: await hash(record)};
  }
  return Object.freeze({
    state: () => serialize(snapshot),
    create: input => serialize(async () => {
      fields(input, 'countryCode,templateId');
      if (typeof input.templateId !== 'string' || !Object.hasOwn(templates, input.templateId)) throw new Error('Plantilla ficticia desconocida.');
      if (drafts.length >= 30) throw new Error('Límite de 30 borradores. Recarga la página para reiniciar.');
      const draft = { id: globalThis.crypto.randomUUID(), countryCode: 'VE',
        templateId: input.templateId, templateTitle: templates[input.templateId],
        status: 'draft', createdAt: new Date().toISOString() };
      const record = await event('draft-created', draft.id);
      drafts.unshift(draft); events.push(record);
      return snapshot();
    }),
    cancel: input => serialize(async () => {
      fields(input, 'countryCode,id');
      const index = drafts.findIndex(d => d.id === input.id);
      if (index < 0 || drafts[index].status !== 'draft') throw new Error('El borrador no existe o ya fue cancelado.');
      const record = await event('draft-cancelled', input.id);
      drafts[index] = {...drafts[index], status:'cancelled'}; events.push(record);
      return snapshot();
    })
  });
}
