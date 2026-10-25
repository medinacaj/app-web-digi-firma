import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { DemoStore, DemoError } from "./demo-store.mjs";

const staticFiles = Object.freeze({
  "/": ["../index.html", "text/html; charset=utf-8"],
  "/index.html": ["../index.html", "text/html; charset=utf-8"],
  "/app/": ["../app/index.html", "text/html; charset=utf-8"],
  "/app/index.html": ["../app/index.html", "text/html; charset=utf-8"],
  "/assets/site.css": ["../assets/site.css", "text/css; charset=utf-8"],
  "/assets/site.js": ["../assets/site.js", "text/javascript; charset=utf-8"],
  "/assets/app.js": ["../assets/app.js", "text/javascript; charset=utf-8"],
  "/assets/app.css": ["../assets/app.css", "text/css; charset=utf-8"],
  "/src/project.mjs": ["../src/project.mjs", "text/javascript; charset=utf-8"],
  "/src/local-pdf.mjs": ["../src/local-pdf.mjs", "text/javascript; charset=utf-8"],
  "/src/identity-format.mjs": ["../src/identity-format.mjs", "text/javascript; charset=utf-8"]
});

function securityHeaders() {
  return {
    "Cache-Control": "no-store, max-age=0",
    "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Demo-Only": "true"
  };
}
function writeJson(res, status, value) {
  res.writeHead(status, { ...securityHeaders(), "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(value));
}

async function readJson(req) {
  if (!/^application\/json(?:\s*;|\s*$)/i.test(req.headers["content-type"] || "")) {
    throw new DemoError(415, "JSON_REQUIRED", "Solo se admite application/json.");
  }
  let text = "";
  for await (const chunk of req) {
    text += chunk.toString("utf8");
    if (Buffer.byteLength(text) > 1024) throw new DemoError(413, "TOO_LARGE", "La solicitud excede el límite.");
  }
  let data;
  try { data = JSON.parse(text); } catch { throw new DemoError(400, "INVALID_JSON", "JSON inválido."); }
  if (data === null || Array.isArray(data) || typeof data !== "object") {
    throw new DemoError(400, "INVALID_BODY", "Se requiere un objeto JSON.");
  }
  return data;
}

export function createDemoServer({ store = new DemoStore() } = {}) {
  return createServer(async (req, res) => {
    const host = req.headers.host || "";
    const expectedHost = req.socket.localPort ? "127.0.0.1:" + req.socket.localPort : "127.0.0.1";
    // No ofrecer el laboratorio a servidores externos o dominios falsificados.
    if (host !== expectedHost || req.socket.localAddress !== "127.0.0.1") {
      writeJson(res, 403, { error: "Servidor local exclusivamente." });
      return;
    }
    const origin = req.headers.origin;
    if (origin && origin !== "http://" + expectedHost) {
      writeJson(res, 403, { error: "Origen no permitido." });
      return;
    }
    try {
      const { pathname, search } = new URL(req.url, "http://" + expectedHost);
      if (search) throw new DemoError(400, "INVALID_QUERY", "El laboratorio no admite parámetros.");
      if (req.method === "GET" && pathname === "/api/demo/state") {
        writeJson(res, 200, store.state());
        return;
      }
      if (req.method === "POST" && pathname === "/api/demo/drafts") {
        const body = await readJson(req);
        if (Object.keys(body).sort().join(",") !== "countryCode,templateId") {
          throw new DemoError(400, "INVALID_FIELDS", "Campos no permitidos.");
        }
        writeJson(res, 201, store.create(body));
        return;
      }
      const cancel = /^\/api\/demo\/drafts\/([a-zA-Z0-9-]{1,80})\/cancel$/.exec(pathname);
      if (req.method === "POST" && cancel) {
        const body = await readJson(req);
        if (Object.keys(body).join(",") !== "countryCode") {
          throw new DemoError(400, "INVALID_FIELDS", "Campos no permitidos.");
        }
        writeJson(res, 200, store.cancel({ id: cancel[1], ...body }));
        return;
      }
      if (req.method === "GET" && Object.hasOwn(staticFiles, pathname)) {
        const [path, contentType] = staticFiles[pathname];
        const file = await readFile(fileURLToPath(new URL(path, import.meta.url)));
        res.writeHead(200, { ...securityHeaders(), "Content-Type": contentType });
        res.end(file);
        return;
      }
      // Los demás métodos/rutas no procesan archivos ni operaciones de firma.
      throw new DemoError(404, "NOT_FOUND", "Ruta inexistente.");
    } catch (error) {
      const status = error instanceof DemoError ? error.status : 500;
      writeJson(res, status, {
        error: error instanceof DemoError ? error.message : "Error interno del laboratorio.",
        code: error instanceof DemoError ? error.code : "INTERNAL_ERROR"
      });
    }
  });
}
