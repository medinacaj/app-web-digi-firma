import { createDemoServer } from "./demo-http.mjs";

if (process.env.DIGIFIRMA_DEMO !== "1" || process.env.NODE_ENV === "production") {
  console.error("Servidor cerrado: definir DIGIFIRMA_DEMO=1 y no utilizar NODE_ENV=production.");
  process.exit(1);
}
const port = Number(process.env.PORT || 8787);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  console.error("PORT debe ser un entero de 1024 a 65535.");
  process.exit(1);
}

const server = createDemoServer();
server.listen(port, "127.0.0.1", () => {
  console.log("Digi-Firma Venezuela · DEMO LOCAL en http://127.0.0.1:" + port + "/");
  console.log("Prohibido ingresar datos personales o documentos reales; no existen firmas electrónicas.");
});
