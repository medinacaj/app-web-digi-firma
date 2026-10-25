import { milestones, projectProgress } from "../src/project.mjs";

const views = Object.freeze({
  resumen: ["Resumen", "Resumen general", "La base inicial para una experiencia de firma digital segura y trazable."],
  documentos: ["Documentos", "Documentos", "Custodia y acceso seguro: funcionalidad aún no implementada."],
  solicitudes: ["Solicitudes", "Solicitudes de firma", "El flujo de firmantes y consentimiento se encuentra planificado."],
  auditoria: ["Auditoría", "Registro de auditoría", "Integridad y trazabilidad verificable: módulo pendiente."],
  configuracion: ["Configuración", "Configuración", "Organizaciones, roles y controles todavía no disponibles."]
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
