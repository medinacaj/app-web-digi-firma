// Herramientas de formato para Venezuela, NO comprobación de identidad ni de registros oficiales.
export function normalizeIdentifier(value) {
  if (typeof value !== "string" || value.length > 30) return "";
  return value.trim().toUpperCase().replace(/[.\s-]/g, "");
}

export function examineVenezuelanIdentifier(type, value) {
  const normalized = normalizeIdentifier(value);
  if (type === "cedula") {
    const match = /^([VE])(\d{6,8})$/.exec(normalized);
    return Object.freeze({
      type, formatMatches: Boolean(match), verified: false,
      normalized: match ? normalized : null,
      message: match ? "Estructura de cédula compatible. No acredita identidad." : "La cédula de ejemplo requiere V/E y entre 6 y 8 dígitos."
    });
  }
  if (type === "rif") {
    const match = /^([A-Z])(\d{9})$/.exec(normalized);
    const recognizedPrefix = Boolean(match && /^[VEJGP]$/.test(match[1]));
    return Object.freeze({
      type, formatMatches: Boolean(match), recognizedPrefix, verified: false,
      normalized: match ? normalized : null,
      message: !match
        ? "El RIF requiere una letra y 9 dígitos (estructura, no verificación)."
        : recognizedPrefix
          ? "Estructura de RIF compatible. No se comprobó registro ni dígito verificador."
          : "Estructura de RIF compatible, pero el prefijo requiere revisión normativa."
    });
  }
  return Object.freeze({
    type: "unknown", formatMatches: false, verified: false, normalized: null,
    message: "Tipo de identificación no admitido en la herramienta."
  });
}
