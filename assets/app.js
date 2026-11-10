import { createBrowserDemoStore } from "../src/browser-demo.mjs";
import { milestones, projectProgress, jurisdiction } from "../src/project.mjs";
import { sha256LocalPdf, compareSha256, LocalPdfError, PDF_MAX_BYTES } from "../src/local-pdf.mjs";
import { examineVenezuelanIdentifier } from "../src/identity-format.mjs";

if (jurisdiction.countryCode !== "VE" || jurisdiction.exclusive !== true) {
  throw new Error("Digi-Firma: configuración de jurisdicción inválida");
}

const views = Object.freeze({
  resumen: ["Resumen", "Resumen general", "La base inicial para una plataforma de firma electrónica destinada únicamente a Venezuela."],
  documentos: ["Documentos", "Documentos", "Custodia privada de documentos para el mercado venezolano: funcionalidad aún no implementada."],
  solicitudes: ["Solicitudes", "Solicitudes de firma", "El flujo de firmantes y consentimiento para Venezuela está planificado, no operativo."],
  auditoria: ["Auditoría", "Registro de auditoría", "Integridad y trazabilidad conforme al alcance venezolano: módulo pendiente."],
  configuracion: ["Configuración", "Configuración", "Organizaciones venezolanas, roles y controles todavía no disponibles."]
});

function navigate(nextView) {
  const view = Object.hasOwn(views, nextView) ? nextView : "resumen";
  for (const button of document.querySelectorAll("[data-view]")) {
    if (button.dataset.view === view) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  }
  for (const section of document.querySelectorAll(".view")) {
    section.hidden = section.id !== "view-" + view;
  }
  document.getElementById("crumb-title").textContent = views[view][0];
  document.getElementById("page-title").textContent = views[view][1];
  document.getElementById("page-summary").textContent = views[view][2];
  document.body.dataset.menuOpen = "false";
  document.getElementById("menu-toggle").setAttribute("aria-expanded", "false");
}

for (const button of document.querySelectorAll("[data-view]")) {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    window.location.hash = view;
    navigate(view);
  });
}

const menu = document.getElementById("menu-toggle");
menu.addEventListener("click", () => {
  const isOpen = document.body.dataset.menuOpen === "true";
  document.body.dataset.menuOpen = String(!isOpen);
  menu.setAttribute("aria-expanded", String(!isOpen));
});

window.addEventListener("hashchange", () => navigate(window.location.hash.slice(1)));
navigate(window.location.hash.slice(1));

const progress = projectProgress();
document.getElementById("progress-copy").textContent = String(progress.complete) + " de " + String(progress.total) + " hitos completados";
document.getElementById("progress-pct").textContent = String(progress.percent) + "%";
document.getElementById("progress-fill").style.width = String(progress.percent) + "%";
document.querySelector(".progress-track").setAttribute("aria-valuenow", String(progress.percent));

const statuses = Object.freeze({ "in-progress": "En progreso", pending: "Pendiente", done: "Completado" });
const list = document.getElementById("milestone-list");
for (const milestone of milestones) {
  const item = document.createElement("li");
  const title = document.createElement("span");
  title.textContent = milestone.title;
  const state = document.createElement("span");
  state.className = "status-chip " + (milestone.status === "in-progress" ? "active" : milestone.status === "done" ? "done" : "");
  state.textContent = statuses[milestone.status] || "Sin definir";
  item.append(title, state);
  list.append(item);
}


// Módulo de demostración estrictamente local: datos y plantillas sintéticos.
const demoTemplate = document.getElementById("demo-template");
const demoCreate = document.getElementById("demo-create");
const demoFeedback = document.getElementById("demo-feedback");
const demoDrafts = document.getElementById("demo-drafts");
const demoEvents = document.getElementById("demo-events");
const demoCount = document.getElementById("demo-count");
const demoIntegrity = document.getElementById("demo-integrity");
const browserMode = document.documentElement.dataset.demoMode === "browser";
const browserDemo = browserMode ? createBrowserDemoStore() : null;
let demoAvailable = false;

async function demoRequest(path, options) {
  if (browserDemo) {
    if (path === "/api/demo/state") return browserDemo.state();
    const input = JSON.parse(options.body);
    if (path === "/api/demo/drafts") return browserDemo.create(input);
    const cancel = /^\/api\/demo\/drafts\/([a-zA-Z0-9-]+)\/cancel$/.exec(path);
    if (cancel) return browserDemo.cancel({ ...input, id: cancel[1] });
    throw new Error("Operación de demostración desconocida.");
  }
  const response = await fetch(path, { cache: "no-store", credentials: "same-origin", ...options });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "No se pudo procesar el laboratorio.");
  if (result.simulated !== true || result.countryCode !== "VE") throw new Error("Respuesta del laboratorio no autorizada.");
  return result;
}

function element(tag, value) {
  const node = document.createElement(tag);
  node.textContent = String(value);
  return node;
}

function renderDemo(state) {
  demoDrafts.replaceChildren();
  demoEvents.replaceChildren();
  demoCount.textContent = String(state.drafts.length);
  demoIntegrity.textContent = state.auditIntegrityValid ? "Enlace de hashes consistente" : "Integridad no demostrada";
  for (const draft of state.drafts) {
    const item = document.createElement("li");
    const info = document.createElement("div");
    info.append(element("strong", draft.templateTitle), element("small", "Borrador sintético · " + draft.status + " · VE"));
    item.append(info);
    if (draft.status === "draft") {
      const cancel = element("button", "Cancelar borrador");
      cancel.type = "button";
      cancel.addEventListener("click", async () => {
        cancel.disabled = true;
        try {
          const updated = await demoRequest("/api/demo/drafts/" + encodeURIComponent(draft.id) + "/cancel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ countryCode: "VE" })
          });
          renderDemo(updated);
          demoFeedback.textContent = "Borrador sintético cancelado.";
        } catch {
          demoFeedback.textContent = "No se pudo cancelar el borrador de demostración.";
          demoFeedback.dataset.level = "error";
        } finally { cancel.disabled = false; }
      });
      item.append(cancel);
    }
    demoDrafts.append(item);
  }
  if (state.drafts.length === 0) demoDrafts.append(element("li", "No hay borradores de prueba."));
  for (const event of state.events) {
    const item = document.createElement("li");
    const info = document.createElement("div");
    info.append(element("strong", event.action === "draft-created" ? "Borrador creado" : "Borrador cancelado"));
    info.append(element("small", "Evento sintético · " + event.sequence + " · SHA-256 " + event.hash.slice(0, 12) + "…"));
    item.append(info);
    demoEvents.append(item);
  }
  if (state.events.length === 0) demoEvents.append(element("li", "No hay eventos simulados."));
}

async function initDemo() {
  try {
    const state = await demoRequest("/api/demo/state");
    demoAvailable = true;
    demoTemplate.disabled = false;
    demoCreate.disabled = false;
    demoFeedback.textContent = browserMode
      ? "Simulación activa en tu navegador. Los borradores y eventos se pierden al recargar. Usa solo datos ficticios."
      : "Laboratorio local activo. No ingresar datos personales ni documentos reales.";
    renderDemo(state);
  } catch {
    demoFeedback.textContent = browserMode
      ? "No se pudo iniciar la simulación. Recarga la página en un navegador actualizado con HTTPS."
      : "Servidor de demostración no detectado. Inicia con DIGIFIRMA_DEMO=1 node server/dev.mjs.";
    demoCreate.disabled = true;
  }
}
demoCreate.addEventListener("click", async () => {
  if (!demoAvailable) return;
  demoCreate.disabled = true;
  demoFeedback.dataset.level = "";
  try {
    const state = await demoRequest("/api/demo/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryCode: jurisdiction.countryCode, templateId: demoTemplate.value })
    });
    renderDemo(state);
    demoFeedback.textContent = "Borrador de prueba creado. No se ha firmado ni enviado nada.";
  } catch {
    demoFeedback.textContent = browserMode ? "No se pudo crear el borrador. El límite es 30 por página; recarga para reiniciar." : "No se pudo crear el borrador sintético.";
    demoFeedback.dataset.level = "error";
  } finally { demoCreate.disabled = !demoAvailable; }
});
initDemo();


// Calculadora de integridad local: no envia los datos al servidor.
const pdfLocal = document.getElementById("pdf-local");
const pdfHashButton = document.getElementById("pdf-hash");
const hashOutput = document.getElementById("hash-result");
const hashStatus = document.getElementById("hash-status");
const hashExpected = document.getElementById("hash-expected");
const hashCompare = document.getElementById("hash-compare");
const compareStatus = document.getElementById("hash-compare-status");
let currentPdfHash = null;
pdfLocal.addEventListener("change", () => {
  const file = pdfLocal.files?.[0];
  currentPdfHash = null;
  hashOutput.textContent = "Sin cálculo";
  hashCompare.disabled = true;
  pdfHashButton.disabled = !file;
  hashStatus.textContent = file ? "Archivo seleccionado. El cálculo será local." : "Selecciona un archivo.";
  compareStatus.textContent = "Compara huellas, no firmas electrónicas.";
});
pdfHashButton.addEventListener("click", async () => {
  const file = pdfLocal.files?.[0];
  if (!file) return;
  pdfHashButton.disabled = true;
  hashStatus.textContent = "Calculando en tu navegador…";
  try {
    if (file.size > PDF_MAX_BYTES) throw new LocalPdfError("LIMIT", "Máximo permitido: 20 MiB.");
    currentPdfHash = await sha256LocalPdf(new Uint8Array(await file.arrayBuffer()));
    hashOutput.textContent = currentPdfHash;
    hashStatus.textContent = "Huella calculada sin transmitir el archivo.";
    hashCompare.disabled = false;
  } catch (error) {
    currentPdfHash = null;
    hashOutput.textContent = "No disponible";
    hashStatus.textContent = error instanceof LocalPdfError ? error.message : "No se pudo procesar el archivo.";
  } finally {
    pdfLocal.value = "";
  }
});
hashCompare.addEventListener("click", () => {
  try {
    compareStatus.textContent = compareSha256(currentPdfHash, hashExpected.value)
      ? "Huellas iguales. Esto no prueba identidad ni firma electrónica."
      : "Huellas diferentes. Los archivos podrían no ser idénticos.";
  } catch (error) {
    compareStatus.textContent = error instanceof LocalPdfError ? error.message : "Error de comparación.";
  }
});

// Formato ilustrativo local: no se comunica con ninguna entidad ni servicio.
document.getElementById("identity-check").addEventListener("click", () => {
  const field = document.getElementById("identity-value");
  const status = document.getElementById("identity-status");
  const type = document.getElementById("identity-type").value;
  const result = examineVenezuelanIdentifier(type, field.value);
  field.value = ""; // Eliminar el dato inmediatamente después de la revisión
  status.textContent = result.message + " Ningún identificador se envió ni guardó.";
});
