export const PDF_MAX_BYTES = 20 * 1024 * 1024;
export class LocalPdfError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
export function isPdfHeader(bytes) {
  return bytes instanceof Uint8Array &&
    bytes.length >= 5 &&
    [37, 80, 68, 70, 45].every((number, i) => bytes[i] === number);
}
export async function sha256LocalPdf(bytes, cryptoProvider = globalThis.crypto) {
  if (!(bytes instanceof Uint8Array) || !bytes.byteLength) throw new LocalPdfError("EMPTY", "Selecciona un PDF.");
  if (bytes.byteLength > PDF_MAX_BYTES) throw new LocalPdfError("LIMIT", "Máximo permitido: 20 MiB.");
  if (!isPdfHeader(bytes)) throw new LocalPdfError("HEADER", "La cabecera no corresponde a un PDF.");
  if (!cryptoProvider?.subtle?.digest) throw new LocalPdfError("CRYPTO", "Web Crypto no está disponible.");
  // Validación mínima de cabecera, no de estructura PDF ni de firmas.
  const result = await cryptoProvider.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(result)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export function compareSha256(actual, expected) {
  const normalized = typeof expected === "string" ? expected.trim().toLowerCase() : "";
  if (!/^[a-f0-9]{64}$/.test(normalized)) throw new LocalPdfError("EXPECTED", "Se esperan 64 caracteres hexadecimales.");
  if (typeof actual !== "string" || !/^[a-f0-9]{64}$/.test(actual)) throw new LocalPdfError("ACTUAL", "Calcula la huella primero.");
  return actual === normalized;
}
