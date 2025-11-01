import DOMPurify from "dompurify";

/**
 * Sanitiza texto HTML para prevenir ataques XSS
 * @param {string} content - El contenido HTML a sanitizar
 * @returns {string} - El contenido sanitizado
 */
export const sanitizeHTML = (content) => {
  if (typeof content !== "string") {
    return content;
  }

  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [], // No permitir ninguna etiqueta HTML
    ALLOWED_ATTR: [], // No permitir atributos
    KEEP_CONTENT: true, // Mantener el contenido de texto
  });
};

/**
 * Sanitiza texto pero permite algunas etiquetas básicas seguras
 * @param {string} content - El contenido HTML a sanitizar
 * @returns {string} - El contenido sanitizado
 */
export const sanitizeHTMLBasic = (content) => {
  if (typeof content !== "string") {
    return content;
  }

  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "br", "p"], // Permitir etiquetas básicas de formato
    ALLOWED_ATTR: [], // No permitir atributos para mayor seguridad
    KEEP_CONTENT: true,
  });
};

/**
 * Sanitiza texto escapando caracteres especiales HTML
 * @param {string} content - El contenido a escapar
 * @returns {string} - El contenido con caracteres HTML escapados
 */
export const escapeHtml = (content) => {
  if (typeof content !== "string") {
    return content;
  }

  const div = document.createElement("div");
  div.textContent = content;
  return div.innerHTML;
};

/**
 * Función segura para mostrar texto que puede contener caracteres especiales
 * @param {string} content - El contenido a mostrar
 * @param {boolean} allowBasicFormatting - Si permitir formato básico (negrita, cursiva, etc.)
 * @returns {string} - El contenido sanitizado
 */
export const safeRender = (content, allowBasicFormatting = false) => {
  if (content === null || content === undefined) {
    return "";
  }

  if (allowBasicFormatting) {
    return sanitizeHTMLBasic(String(content));
  }

  return sanitizeHTML(String(content));
};

/**
 * Valida si un email tiene formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  // ReDoS-resistant regex: no nested quantifiers or catastrophic backtracking
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Valida si un teléfono tiene formato correcto
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - True si es válido
 */
export const isValidPhone = (phone) => {
  if (typeof phone !== "string") return false;
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Valida si un DPI tiene formato correcto (13 dígitos)
 * @param {string} dpi - DPI a validar
 * @returns {boolean} - True si es válido
 */
export const isValidDPI = (dpi) => {
  if (typeof dpi !== "string") return false;
  const dpiRegex = /^\d{13}$/;
  return dpiRegex.test(dpi);
};

/**
 * Valida si un número de colegiado tiene formato correcto
 * @param {string} numeroColegiado - Número de colegiado a validar
 * @returns {boolean} - True si es válido
 */
export const isValidNumeroColegiado = (numeroColegiado) => {
  if (typeof numeroColegiado !== "string") return false;
  const numeroRegex = /^\d{1,15}$/;
  return numeroRegex.test(numeroColegiado);
};

/**
 * Valida longitud de texto
 * @param {string} text - Texto a validar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {boolean} - True si es válido
 */
export const isValidLength = (text, maxLength = 255) => {
  if (typeof text !== "string") return false;
  return text.length <= maxLength;
};

/**
 * Valida si un campo requerido no está vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} - True si no está vacío
 */
export const isNotEmpty = (value) => {
  return (
    value !== null && value !== undefined && String(value).trim().length > 0
  );
};

/**
 * Valida si el texto contiene caracteres peligrosos (JavaScript, SQL, etc.)
 * @param {string} value - Valor a validar
 * @returns {boolean} - True si es seguro
 */
export const isSafeText = (value) => {
  if (typeof value !== "string") return false;

  // Patrones peligrosos a detectar
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi, // Etiquetas script
    /javascript:/gi, // Protocolos javascript:
    /on\w+\s*=/gi, // Event handlers (onclick, onload, etc.)
    /<iframe[^>]*>.*?<\/iframe>/gi, // Etiquetas iframe
    /<object[^>]*>.*?<\/object>/gi, // Etiquetas object
    /<embed[^>]*>/gi, // Etiquetas embed
    /expression\s*\(/gi, // CSS expressions
    /vbscript:/gi, // VBScript
    /data:text\/html/gi, // Data URLs con HTML
    /data:application\/javascript/gi, // Data URLs con JS
  ];

  return !dangerousPatterns.some((pattern) => {
    return pattern.test(value);
  });
};

/**
 * Valida si el texto contiene solo caracteres alfanuméricos y espacios básicos
 * @param {string} value - Valor a validar
 * @param {boolean} allowSpecialChars - Si permitir caracteres especiales comunes
 * @returns {boolean} - True si contiene solo caracteres seguros
 */
export const isAlphanumericText = (value, allowSpecialChars = true) => {
  if (typeof value !== "string") return false;

  if (allowSpecialChars) {
    // Permitir letras, números, espacios, y caracteres comunes seguros
    return /^[a-zA-Z0-9\s\-.,()áéíóúÁÉÍÓÚñÑüÜ¿?¡!]+$/.test(value);
  }
  // Solo letras, números y espacios
  return /^[a-zA-Z0-9\s]+$/.test(value);
};

/**
 * Valida el tipo de dato según la opción especificada
 * @param {string} value - Valor a validar
 * @param {string} type - Tipo de validación
 * @returns {Object} - {isValid: boolean, error: string}
 */
const validateType = (value, type) => {
  if (type === "email" && !isValidEmail(value)) {
    return { isValid: false, error: "Email inválido" };
  }

  if (type === "phone" && !isValidPhone(value)) {
    return { isValid: false, error: "Teléfono inválido" };
  }

  if (type === "dpi" && !isValidDPI(value)) {
    return { isValid: false, error: "DPI debe tener 13 dígitos" };
  }

  if (type === "numeroColegiado" && !isValidNumeroColegiado(value)) {
    return { isValid: false, error: "Número de colegiado inválido" };
  }

  return { isValid: true, error: "" };
};

/**
 * Valida seguridad estricta del valor
 * @param {string} value - Valor a validar
 * @param {boolean} allowSpecialChars - Si permitir caracteres especiales
 * @returns {Object} - {isValid: boolean, error: string}
 */
const validateStrictSecurity = (value, allowSpecialChars) => {
  if (!isSafeText(value)) {
    return { isValid: false, error: "Contenido no permitido (código JavaScript detectado)" };
  }

  if (!isAlphanumericText(value, allowSpecialChars)) {
    return { isValid: false, error: "Solo se permiten letras, números y espacios" };
  }

  return { isValid: true, error: "" };
};

/**
 * Función completa de validación y sanitización para formularios
 * @param {string} value - Valor a procesar
 * @param {Object} options - Opciones de validación
 * @returns {Object} - {isValid: boolean, sanitizedValue: string, error: string}
 */
export const validateAndSanitize = (value, options = {}) => {
  const {
    required = false,
    maxLength = 255,
    type = "text",
    customValidator = null,
    allowSpecialChars = true,
    strictSecurity = false,
  } = options;

  // Verificar si es requerido
  if (required && !isNotEmpty(value)) {
    return {
      isValid: false,
      sanitizedValue: "",
      error: "Este campo es requerido",
    };
  }

  // Si no es requerido y está vacío, devolver válido
  if (!isNotEmpty(value)) {
    return {
      isValid: true,
      sanitizedValue: "",
      error: "",
    };
  }

  // Validar longitud
  if (!isValidLength(value, maxLength)) {
    return {
      isValid: false,
      sanitizedValue: "",
      error: `Máximo ${maxLength} caracteres`,
    };
  }

  // Validación de seguridad estricta
  if (strictSecurity) {
    const securityValidation = validateStrictSecurity(value, allowSpecialChars);
    if (!securityValidation.isValid) {
      return {
        isValid: false,
        sanitizedValue: "",
        error: securityValidation.error,
      };
    }
  }

  // Validar según tipo
  const typeValidation = validateType(value, type);
  if (!typeValidation.isValid) {
    return {
      isValid: false,
      sanitizedValue: "",
      error: typeValidation.error,
    };
  }

  // Validación personalizada
  if (customValidator && !customValidator(value)) {
    return {
      isValid: false,
      sanitizedValue: "",
      error: "Valor inválido",
    };
  }

  // Sanitizar el valor
  const sanitizedValue = sanitizeHTML(value);

  return {
    isValid: true,
    sanitizedValue,
    error: "",
  };
};
