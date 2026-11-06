/**
 * Shared utilities: structured logging, input validation & sanitization.
 */

// ── Structured Logger ─────────────────────────────────────────────────────────
const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 }
const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || "info"] ?? LOG_LEVELS.info

function fmt(level, message, meta = {}) {
  const ts = new Date().toISOString()
  const metaStr = Object.keys(meta).length ? " " + JSON.stringify(meta) : ""
  return `[${ts}] [${level.toUpperCase()}] ${message}${metaStr}`
}

export const logger = {
  error: (msg, meta) => { if (currentLevel >= LOG_LEVELS.error) console.error(fmt("error", msg, meta)) },
  warn: (msg, meta) => { if (currentLevel >= LOG_LEVELS.warn) console.warn(fmt("warn", msg, meta)) },
  info: (msg, meta) => { if (currentLevel >= LOG_LEVELS.info) console.log(fmt("info", msg, meta)) },
  debug: (msg, meta) => { if (currentLevel >= LOG_LEVELS.debug) console.debug(fmt("debug", msg, meta)) },
}

// ── Input Sanitisation ─────────────────────────────────────────────────────────

/** Strip HTML tags and trim whitespace */
export function sanitizeString(val, maxLen = 255) {
  if (typeof val !== "string") return ""
  return val
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
    .slice(0, maxLen)
}

/** Sanitise and validate an email address */
export function sanitizeEmail(val) {
  if (typeof val !== "string") return ""
  const cleaned = val.trim().toLowerCase().slice(0, 254)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) return ""
  return cleaned
}

/** Sanitise a UK phone number: digits + spaces + common punctuation only */
export function sanitizePhone(val) {
  if (typeof val !== "string") return ""
  return val.replace(/[^0-9+\s()\-]/g, "").trim().slice(0, 20)
}

/** Validate a UK postcode (very rough check) */
export function sanitizePostcode(val) {
  if (typeof val !== "string") return ""
  return val.trim().toUpperCase().replace(/\s+/g, " ").slice(0, 10)
}

/** Validate a UK postcode (very rough check) */
export function isValidPostcode(val) {
  if (typeof val !== "string") return false
  return /^[A-Z]{1,2}[0-9][A-Z0-9]?\s*[0-9][A-Z]{2}$/i.test(val.trim())
}

/** Validate a date string (YYYY-MM-DD or similar) */
export function isValidDate(val) {
  if (typeof val !== "string") return false
  const d = new Date(val)
  return !isNaN(d.getTime())
}

/** Validate a numeric string */
export function isValidNumber(val) {
  if (typeof val !== "string" && typeof val !== "number") return false
  const n = Number(val)
  return !isNaN(n) && isFinite(n)
}

// ── Environment Variable Validation ────────────────────────────────────────────

export function validateEnv() {
  const errors = []

  if (!process.env.JWT_SECRET) {
    errors.push("JWT_SECRET is required (set in .env)")
  } else if (process.env.JWT_SECRET.length < 32) {
    errors.push("JWT_SECRET must be at least 32 characters")
  }

  if (!process.env.PORT || isNaN(Number(process.env.PORT))) {
    errors.push("PORT must be a valid number")
  }

  if (!process.env.FRONTEND_URL) {
    errors.push("FRONTEND_URL is required (set in .env)")
  }

  if (errors.length > 0) {
    logger.error("Environment validation failed", { errors })
    throw new Error("Invalid environment configuration: " + errors.join("; "))
  }

  logger.info("Environment validated successfully")
}

// ── Error Handler Wrapper ──────────────────────────────────────────────────────

/** Wrap async route handlers so errors propagate to Express error handler */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

// ── Pagination Helper ──────────────────────────────────────────────────────────

export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20))
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

export function paginateResult(rows, total, page, limit) {
  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  }
}

// ── Email Helpers ──────────────────────────────────────────────────────────────

/** Check if an email address looks valid (already sanitized) */
export function isValidEmail(email) {
  if (typeof email !== "string") return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}