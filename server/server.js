import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { v4 as uuidv4 } from "uuid"
import { initDb, getDb } from "./db.js"
import {
  logger,
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizePostcode,
  isValidEmail,
  isValidPostcode,
  isValidDate,
  validateEnv,
  asyncHandler,
  parsePagination,
  paginateResult,
} from "./utils.js"

dotenv.config()

validateEnv()

const app = express()
const PORT = Number(process.env.PORT) || 5000
const JWT_SECRET = process.env.JWT_SECRET
const FRONTEND_URL = process.env.FRONTEND_URL

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))

const allowedOrigins = FRONTEND_URL ? [FRONTEND_URL, "http://localhost:5173"] : ["http://localhost:5173"]
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json({ limit: "10mb" }))

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
})

let db
initDb().then((database) => {
  db = database
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`)
  })
}).catch((err) => {
  logger.error("Failed to initialize database", { error: err.message })
  process.exit(1)
})

setInterval(() => { if (db) db.saveAll() }, 30000)

const getOne = (stmt, ...params) => {
  const rows = stmt.all(params)
  return rows[0] || null
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Access denied" })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" })
    req.user = user
    next()
  })
}

function getSmtpTransport() {
  const settings = db.tables.settings || []
  const getSetting = (key) => (settings.find(s => s.key === key) || {}).value || ""

  const smtpHost = getSetting("smtp_host")
  const smtpPort = parseInt(getSetting("smtp_port") || "587", 10)
  const smtpEnc = getSetting("smtp_encryption")
  const smtpUser = getSetting("smtp_user")
  const smtpPass = getSetting("smtp_pass")

  if (!smtpHost) {
    return nodemailer.createTransport({ host: "localhost", port: 1025 })
  }

  const transportConfig = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpEnc === "SSL/TLS",
    requireTLS: smtpEnc === "STARTTLS",
    tls: { rejectUnauthorized: true },
  }
  if (smtpUser && smtpPass) {
    transportConfig.auth = { user: smtpUser, pass: smtpPass }
  }
  return nodemailer.createTransport(transportConfig)
}

function getFromEmail() {
  const settings = db.tables.settings || []
  const getSetting = (key) => (settings.find(s => s.key === key) || {}).value || ""
  return `Mr Khan Waste Removal <${getSetting("email") || "info@mrkhanwasteremovallondon.co.uk"}>`
}

async function sendEmailWithLog(to, subject, text, html, type = "notification") {
  const logId = "SM-" + Date.now()
  const time = new Date().toLocaleString("en-GB", { hour12: false })
  try {
    const transporter = getSmtpTransport()
    const info = await transporter.sendMail({
      from: getFromEmail(),
      to,
      subject,
      text,
      html,
    })
    db.prepare(
      "INSERT INTO smtp_logs (log_id, recipient, type, status, time) VALUES (?, ?, ?, ?, ?)"
    ).run(logId, to, type, "delivered", time)
    logger.info("Email sent", { recipient: to, subject, messageId: info.messageId })
    return { success: true, messageId: info.messageId, logId }
  } catch (err) {
    logger.error("Email failed", { recipient: to, subject, error: err.message })
    try {
      db.prepare(
        "INSERT INTO smtp_logs (log_id, recipient, type, status, time) VALUES (?, ?, ?, ?, ?)"
      ).run(logId, to, type, "failed", time)
    } catch {}
    return { success: false, error: err.message, logId }
  }
}

async function notifyAdminNewQuote(quoteData) {
  const settings = db.tables.settings || []
  const getSetting = (key) => (settings.find(s => s.key === key) || {}).value || ""
  const adminEmail = getSetting("email") || "info@mrkhanwasteremovallondon.co.uk"
  const subject = `New Quote Request: ${quoteData.quote_id}`
  const text = `
New quote request received:

Quote ID: ${quoteData.quote_id}
Customer: ${quoteData.customer}
Service: ${quoteData.service}
Area: ${quoteData.area}
Postcode: ${quoteData.postcode}
Phone: ${quoteData.phone}
Email: ${quoteData.email || "Not provided"}
Message: ${quoteData.message || "None"}
Date: ${quoteData.date}

View in admin panel.
  `.trim()
  const html = `<p>New quote request received:</p><ul>` +
    `<li><strong>Quote ID:</strong> ${quoteData.quote_id}</li>` +
    `<li><strong>Customer:</strong> ${quoteData.customer}</li>` +
    `<li><strong>Service:</strong> ${quoteData.service}</li>` +
    `<li><strong>Area:</strong> ${quoteData.area}</li>` +
    `<li><strong>Postcode:</strong> ${quoteData.postcode}</li>` +
    `<li><strong>Phone:</strong> ${quoteData.phone}</li>` +
    `<li><strong>Email:</strong> ${quoteData.email || "Not provided"}</li>` +
    `<li><strong>Message:</strong> ${quoteData.message || "None"}</li>` +
    `<li><strong>Date:</strong> ${quoteData.date}</li>` +
    `</ul><p>View in admin panel.</p>`
  return sendEmailWithLog(adminEmail, subject, text, html, "admin_notification_quote")
}

async function notifyAdminNewContact(contactData) {
  const settings = db.tables.settings || []
  const getSetting = (key) => (settings.find(s => s.key === key) || {}).value || ""
  const adminEmail = getSetting("email") || "info@mrkhanwasteremovallondon.co.uk"
  const subject = `New Contact Message: ${contactData.quote_id}`
  const text = `
New contact message received:

Quote ID: ${contactData.quote_id}
Name: ${contactData.customer}
Email: ${contactData.email}
Phone: ${contactData.phone}
Address: ${contactData.area}
Message: ${contactData.message || contactData.postcode}
Date: ${contactData.date}

View in admin panel.
  `.trim()
  const html = `<p>New contact message received:</p><ul>` +
    `<li><strong>Quote ID:</strong> ${contactData.quote_id}</li>` +
    `<li><strong>Name:</strong> ${contactData.customer}</li>` +
    `<li><strong>Email:</strong> ${contactData.email}</li>` +
    `<li><strong>Phone:</strong> ${contactData.phone}</li>` +
    `<li><strong>Address:</strong> ${contactData.area}</li>` +
    `<li><strong>Message:</strong> ${contactData.message || contactData.postcode}</li>` +
    `<li><strong>Date:</strong> ${contactData.date}</li>` +
    `</ul><p>View in admin panel.</p>`
  return sendEmailWithLog(adminEmail, subject, text, html, "admin_notification_contact")
}

app.post("/api/public/quote", publicLimiter, asyncHandler(async (req, res) => {
  const {
    name, phone, email, address, postcode, service, date, message, area
  } = req.body

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required" })
  }

  const customerName = sanitizeString(name, 100)
  const phoneSanitized = sanitizePhone(phone)
  const emailSanitized = email ? sanitizeEmail(email) : ""
  const addressSanitized = sanitizeString(address, 255)
  const postcodeSanitized = postcode ? sanitizePostcode(postcode) : ""
  const serviceData = sanitizeString(service || "General Enquiry", 100)
  const areaData = sanitizeString(area || postcode || "London", 100)
  const priceData = "Pending quote"
  const dateData = date ? (isValidDate(date) ? date : new Date().toLocaleDateString("en-GB")) : new Date().toLocaleDateString("en-GB")
  const messageSanitized = sanitizeString(message, 1000)

  if (!phoneSanitized) {
    return res.status(400).json({ error: "Invalid phone number" })
  }

  const quote_id = `QT-${Date.now().toString().slice(-6)}`

  const info = db.prepare(
    "INSERT INTO quotes (quote_id, customer, service, area, postcode, price, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(quote_id, customerName, serviceData, areaData, postcodeSanitized, priceData, "pending", dateData)

  if (emailSanitized) {
    const customer_id = `CU-${Date.now().toString().slice(-6)}`
    try {
      const existingCustomer = db.prepare("SELECT * FROM customers WHERE email = ?").all([emailSanitized])[0]
      if (!existingCustomer) {
        db.prepare(
          "INSERT INTO customers (customer_id, name, email, phone, area, total_spent, orders, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).run(customer_id, customerName, emailSanitized, phoneSanitized, areaData, "£0", 1, "active")
      }
    } catch (e) {
      logger.error("Customer insert failed", { error: e.message })
    }
  }

  notifyAdminNewQuote({
    quote_id, customer: customerName, service: serviceData, area: areaData,
    postcode: postcodeSanitized, phone: phoneSanitized, email: emailSanitized,
    message: messageSanitized, date: dateData,
  }).catch(err => logger.error("Admin quote notification failed", { error: err.message }))

  if (emailSanitized && isValidEmail(emailSanitized)) {
    const settings = db.tables.settings || []
    const getSetting = (key) => (settings.find(s => s.key === key) || {}).value || ""
    const businessName = getSetting("business_name") || "Mr Khan Waste Removal"
    const subject = `Quote Confirmation - ${quote_id}`
    const text = `
Dear ${customerName},

Thank you for your quote request with ${businessName}.

Quote ID: ${quote_id}
Service: ${serviceData}
Area: ${areaData}
Date: ${dateData}

We will contact you shortly to confirm your booking.

Best regards,
${businessName} Team
    `.trim()
    const html = `<p>Dear ${customerName},</p><p>Thank you for your quote request with <strong>${businessName}</strong>.</p><ul>` +
      `<li><strong>Quote ID:</strong> ${quote_id}</li>` +
      `<li><strong>Service:</strong> ${serviceData}</li>` +
      `<li><strong>Area:</strong> ${areaData}</li>` +
      `<li><strong>Date:</strong> ${dateData}</li>` +
      `</ul><p>We will contact you shortly to confirm your booking.</p><p>Best regards,<br>${businessName} Team</p>`
    sendEmailWithLog(emailSanitized, subject, text, html, "customer_confirmation").catch(err =>
      logger.error("Customer confirmation email failed", { error: err.message })
    )
  }

  logger.info("New public quote", { quote_id, customer: customerName, phone: phoneSanitized })

  res.status(201).json({
    success: true,
    quote_id,
    message: "Quote request received. We'll contact you within 24 hours."
  })
}))

app.post("/api/public/contact", publicLimiter, asyncHandler(async (req, res) => {
  const { name, phone, email, address, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required" })
  }

  const customerName = sanitizeString(name, 100)
  const emailSanitized = sanitizeEmail(email)
  const phoneSanitized = sanitizePhone(phone || "")
  const addressSanitized = sanitizeString(address || "Not specified", 255)
  const messageSanitized = sanitizeString(message, 1000)

  if (!emailSanitized) {
    return res.status(400).json({ error: "Invalid email address" })
  }

  const quote_id = `CT-${Date.now().toString().slice(-6)}`
  const serviceData = "Contact Form"
  const areaData = sanitizeString(address || "Not specified", 100)
  const dateData = new Date().toLocaleString("en-GB", { hour12: false })

  db.prepare(
    "INSERT INTO quotes (quote_id, customer, service, area, postcode, price, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(quote_id, customerName, serviceData, areaData, `Phone: ${phoneSanitized} | ${messageSanitized}`, "Pending quote", "pending", dateData)

  const customer_id = `CU-${Date.now().toString().slice(-6)}`
  try {
    const existingCustomer = db.prepare("SELECT * FROM customers WHERE email = ?").all([emailSanitized])[0]
    if (!existingCustomer) {
      db.prepare(
        "INSERT INTO customers (customer_id, name, email, phone, area, total_spent, orders, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(customer_id, customerName, emailSanitized, phoneSanitized, areaData, "£0", 1, "active")
    }
  } catch (e) {
    logger.error("Customer insert failed", { error: e.message })
  }

  notifyAdminNewContact({
    quote_id, customer: customerName, email: emailSanitized, phone: phoneSanitized,
    area: areaData, message: messageSanitized, postcode: messageSanitized, date: dateData,
  }).catch(err => logger.error("Admin contact notification failed", { error: err.message }))

  const settings = db.tables.settings || []
  const getSetting = (key) => (settings.find(s => s.key === key) || {}).value || ""
  const businessName = getSetting("business_name") || "Mr Khan Waste Removal"
  const subject = `Message Received - ${businessName}`
  const text = `
Dear ${customerName},

Thank you for contacting ${businessName}.

We have received your message and will respond within 24 hours.

Best regards,
${businessName} Team
  `.trim()
  const html = `<p>Dear ${customerName},</p><p>Thank you for contacting <strong>${businessName}</strong>.</p><p>We have received your message and will respond within 24 hours.</p><p>Best regards,<br>${businessName} Team</p>`
  sendEmailWithLog(emailSanitized, subject, text, html, "customer_confirmation").catch(err =>
    logger.error("Customer confirmation email failed", { error: err.message })
  )

  logger.info("New contact message", { quote_id, customer: customerName, email: emailSanitized })

  res.status(201).json({
    success: true,
    message: "Message received. We'll respond within 24 hours."
  })
}))

app.post("/api/auth/login", authLimiter, asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" })
  }

  const row = getOne(db.prepare("SELECT * FROM admin_users WHERE email = ?"), email)
  if (!row) {
    return res.status(401).json({ error: "Invalid email or password" })
  }

  const valid = await bcrypt.compare(password, row.password)
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" })
  }

  const token = jwt.sign(
    { id: row.id, email: row.email, name: row.name, role: row.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  )

  logger.info("Admin login", { userId: row.id, email: row.email })

  res.json({
    token,
    user: { id: row.id, name: row.name, email: row.email, role: row.role }
  })
}))

app.post("/api/auth/change-password", authenticateToken, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required" })
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" })
  }

  const row = getOne(db.prepare("SELECT * FROM admin_users WHERE id = ?"), req.user.id)
  if (!row) {
    return res.status(404).json({ error: "Admin user not found" })
  }

  const valid = await bcrypt.compare(currentPassword, row.password)
  if (!valid) {
    return res.status(401).json({ error: "Current password is incorrect" })
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  db.prepare("UPDATE admin_users SET password = ? WHERE id = ?").run(newHash, row.id)

  logger.info("Password changed", { userId: row.id })

  res.json({ message: "Password changed successfully" })
}))

app.post("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user })
})

app.get("/api/quotes", authenticateToken, asyncHandler(async (req, res) => {
  const { search, status } = req.query
  const { page: p, limit: l, offset } = parsePagination(req.query)

  let sql = "SELECT * FROM quotes"
  const params = []
  const conditions = []

  if (search) {
    conditions.push("(customer LIKE ? OR service LIKE ? OR area LIKE ?)")
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  if (status) {
    conditions.push("status = ?")
    params.push(status)
  }

  if (conditions.length) sql += " WHERE " + conditions.join(" AND ")
  sql += " ORDER BY created_at DESC"

  const allRows = db.prepare(sql).all(params)
  const total = allRows.length
  const rows = allRows.slice(offset, offset + l)

  res.json(paginateResult(rows, total, p, l))
}))

app.get("/api/quotes/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const row = getOne(db.prepare("SELECT * FROM quotes WHERE id = ?"), id)
  if (!row) return res.status(404).json({ error: "Quote not found" })
  res.json(row)
}))

app.post("/api/quotes", authenticateToken, asyncHandler(async (req, res) => {
  const { quote_id, customer, service, area, postcode, price, status, date } = req.body
  if (!quote_id || !customer || !service || !area || !price || !date) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  const info = db.prepare(
    "INSERT INTO quotes (quote_id, customer, service, area, postcode, price, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(quote_id, sanitizeString(customer), sanitizeString(service), sanitizeString(area),
    sanitizeString(postcode || ""), sanitizeString(price), sanitizeString(status || "pending"), sanitizeString(date))

  const row = getOne(db.prepare("SELECT * FROM quotes WHERE id = ?"), info.lastInsertRowid)
  res.status(201).json(row)
}))

app.put("/api/quotes/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const { customer, service, area, postcode, price, status, date } = req.body

  db.prepare(
    "UPDATE quotes SET customer = ?, service = ?, area = ?, postcode = ?, price = ?, status = ?, date = ? WHERE id = ?"
  ).run(sanitizeString(customer), sanitizeString(service), sanitizeString(area),
    sanitizeString(postcode || ""), sanitizeString(price), sanitizeString(status), sanitizeString(date), id)

  const row = db.prepare("SELECT * FROM quotes WHERE id = ?").all([id])[0] || null
  if (!row) return res.status(404).json({ error: "Quote not found" })
  res.json(row)
}))

app.delete("/api/quotes/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const info = db.prepare("DELETE FROM quotes WHERE id = ?").run(id)
  if (info.changes === 0) return res.status(404).json({ error: "Quote not found" })
  res.json({ message: "Quote deleted" })
}))

const VALID_STATUSES = ["pending", "scheduled", "in_progress", "completed"]
const STATUS_TRANSITIONS = {
  "pending": ["scheduled", "completed"],
  "scheduled": ["in_progress", "completed"],
  "in_progress": ["completed"],
  "completed": [],
}

app.get("/api/collections", authenticateToken, asyncHandler(async (req, res) => {
  const { search, status } = req.query
  const { page: p, limit: l, offset } = parsePagination(req.query)

  let sql = "SELECT * FROM collections"
  const params = []
  const conditions = []

  if (search) {
    conditions.push("(customer LIKE ? OR service LIKE ? OR area LIKE ?)")
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  if (status) {
    conditions.push("status = ?")
    params.push(status)
  }

  if (conditions.length) sql += " WHERE " + conditions.join(" AND ")
  sql += " ORDER BY created_at DESC"

  const allRows = db.prepare(sql).all(params)
  const total = allRows.length
  const rows = allRows.slice(offset, offset + l)

  res.json(paginateResult(rows, total, p, l))
}))

app.get("/api/collections/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const row = getOne(db.prepare("SELECT * FROM collections WHERE id = ?"), id)
  if (!row) return res.status(404).json({ error: "Collection not found" })
  res.json(row)
}))

app.post("/api/collections", authenticateToken, asyncHandler(async (req, res) => {
  const { collection_id, customer, service, area, address, driver, status, date } = req.body
  if (!collection_id || !customer || !service || !area || !address || !driver || !date) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  const statusValue = status && VALID_STATUSES.includes(status) ? status : "scheduled"

  const info = db.prepare(
    "INSERT INTO collections (collection_id, customer, service, area, address, driver, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(collection_id, sanitizeString(customer), sanitizeString(service), sanitizeString(area),
    sanitizeString(address), sanitizeString(driver), statusValue, sanitizeString(date))

  const row = db.prepare("SELECT * FROM collections WHERE id = ?").all([info.lastInsertRowid])[0]
  res.status(201).json(row)
}))

app.put("/api/collections/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const { customer, service, area, address, driver, status, date } = req.body

  const existing = getOne(db.prepare("SELECT * FROM collections WHERE id = ?"), id)
  if (!existing) return res.status(404).json({ error: "Collection not found" })

  let finalStatus = existing.status
  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }
    const allowed = STATUS_TRANSITIONS[existing.status] || []
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Cannot transition from ${existing.status} to ${status}` })
    }
    finalStatus = status
  }

  db.prepare(
    "UPDATE collections SET customer = ?, service = ?, area = ?, address = ?, driver = ?, status = ?, date = ? WHERE id = ?"
  ).run(sanitizeString(customer), sanitizeString(service), sanitizeString(area),
    sanitizeString(address), sanitizeString(driver), finalStatus, sanitizeString(date), id)

  const row = db.prepare("SELECT * FROM collections WHERE id = ?").all([id])[0] || null
  if (!row) return res.status(404).json({ error: "Collection not found" })
  res.json(row)
}))

app.delete("/api/collections/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const info = db.prepare("DELETE FROM collections WHERE id = ?").run(id)
  if (info.changes === 0) return res.status(404).json({ error: "Collection not found" })
  res.json({ message: "Collection deleted" })
}))

app.get("/api/customers", authenticateToken, asyncHandler(async (req, res) => {
  const { search, status } = req.query
  const { page: p, limit: l, offset } = parsePagination(req.query)

  let sql = "SELECT * FROM customers"
  const params = []
  const conditions = []

  if (search) {
    conditions.push("(name LIKE ? OR email LIKE ? OR area LIKE ?)")
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  if (status) {
    conditions.push("status = ?")
    params.push(status)
  }

  if (conditions.length) sql += " WHERE " + conditions.join(" AND ")
  sql += " ORDER BY created_at DESC"

  const allRows = db.prepare(sql).all(params)
  const total = allRows.length
  const rows = allRows.slice(offset, offset + l)

  res.json(paginateResult(rows, total, p, l))
}))

app.get("/api/customers/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const row = getOne(db.prepare("SELECT * FROM customers WHERE id = ?"), id)
  if (!row) return res.status(404).json({ error: "Customer not found" })
  res.json(row)
}))

app.post("/api/customers", authenticateToken, asyncHandler(async (req, res) => {
  const { customer_id, name, email, phone, area, total_spent, orders, status } = req.body
  if (!customer_id || !name || !email || !phone || !area) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  const info = db.prepare(
    "INSERT INTO customers (customer_id, name, email, phone, area, total_spent, orders, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(customer_id, sanitizeString(name), sanitizeEmail(email), sanitizeString(phone),
    sanitizeString(area), sanitizeString(total_spent || "£0"), Number(orders || 0), sanitizeString(status || "active"))

  const row = db.prepare("SELECT * FROM customers WHERE id = ?").all([info.lastInsertRowid])[0]
  res.status(201).json(row)
}))

app.put("/api/customers/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, email, phone, area, total_spent, orders, status } = req.body

  db.prepare(
    "UPDATE customers SET name = ?, email = ?, phone = ?, area = ?, total_spent = ?, orders = ?, status = ? WHERE id = ?"
  ).run(sanitizeString(name), sanitizeEmail(email), sanitizeString(phone), sanitizeString(area),
    sanitizeString(total_spent), Number(orders || 0), sanitizeString(status), id)

  const row = db.prepare("SELECT * FROM customers WHERE id = ?").all([id])[0] || null
  if (!row) return res.status(404).json({ error: "Customer not found" })
  res.json(row)
}))

app.delete("/api/customers/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const info = db.prepare("DELETE FROM customers WHERE id = ?").run(id)
  if (info.changes === 0) return res.status(404).json({ error: "Customer not found" })
  res.json({ message: "Customer deleted" })
}))

app.get("/api/smtp", authenticateToken, asyncHandler(async (req, res) => {
  const rows = db.prepare("SELECT * FROM smtp_logs ORDER BY created_at DESC").all()
  res.json(rows)
}))

app.post("/api/smtp", authenticateToken, asyncHandler(async (req, res) => {
  const { log_id, recipient, type, status, time } = req.body
  if (!log_id || !recipient || !type || !time) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  const info = db.prepare(
    "INSERT INTO smtp_logs (log_id, recipient, type, status, time) VALUES (?, ?, ?, ?, ?)"
  ).run(log_id, sanitizeString(recipient), sanitizeString(type), sanitizeString(status || "pending"), sanitizeString(time))

  const row = db.prepare("SELECT * FROM smtp_logs WHERE id = ?").all([info.lastInsertRowid])[0]
  res.status(201).json(row)
}))

app.post("/api/smtp/send", authenticateToken, asyncHandler(async (req, res) => {
  const { to, subject, text, html } = req.body
  if (!to || !subject) {
    return res.status(400).json({ error: "Recipient and subject required" })
  }

  const result = await sendEmailWithLog(to, subject, text, html, "admin_test")

  if (!result.success) {
    return res.status(500).json({ error: "Email delivery failed", logId: result.logId })
  }

  res.json({ success: true, messageId: result.messageId, logId: result.logId })
}))

app.put("/api/smtp/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const { recipient, type, status, time } = req.body

  db.prepare(
    "UPDATE smtp_logs SET recipient = ?, type = ?, status = ?, time = ? WHERE id = ?"
  ).run(sanitizeString(recipient), sanitizeString(type), sanitizeString(status), sanitizeString(time), id)

  const row = db.prepare("SELECT * FROM smtp_logs WHERE id = ?").all([id])[0] || null
  if (!row) return res.status(404).json({ error: "SMTP log not found" })
  res.json(row)
}))

app.delete("/api/smtp/:id", authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params
  const info = db.prepare("DELETE FROM smtp_logs WHERE id = ?").run(id)
  if (info.changes === 0) return res.status(404).json({ error: "SMTP log not found" })
  res.json({ message: "SMTP log deleted" })
}))

const SENSITIVE_KEYS = ["smtp_pass", "smtp_user", "jwt_secret"]

app.get("/api/settings", authenticateToken, asyncHandler(async (req, res) => {
  const rows = db.prepare("SELECT key, value FROM settings").all()
  const settings = {}
  for (const row of rows) {
    if (SENSITIVE_KEYS.includes(row.key)) continue
    settings[row.key] = row.value
  }
  res.json(settings)
}))

app.put("/api/settings/:key", authenticateToken, asyncHandler(async (req, res) => {
  const { key } = req.params
  const { value } = req.body
  if (value === undefined) return res.status(400).json({ error: "Value required" })

  if (SENSITIVE_KEYS.includes(key)) {
    return res.status(403).json({ error: "Cannot modify sensitive setting via API" })
  }

  db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP"
  ).run(key, sanitizeString(value))

  res.json({ key, value })
}))

app.post("/api/db/backup", authenticateToken, asyncHandler(async (req, res) => {
  const { tag } = req.body
  const backupPath = db.backup(tag || "manual")
  res.json({ success: true, path: backupPath })
}))

app.get("/api/db/backups", authenticateToken, asyncHandler(async (req, res) => {
  const backups = db.listBackups()
  res.json({ backups })
}))

app.post("/api/db/restore", authenticateToken, asyncHandler(async (req, res) => {
  const { backupPath } = req.body
  if (!backupPath) {
    return res.status(400).json({ error: "Backup path required" })
  }
  await db.restore(backupPath)
  res.json({ success: true, message: "Database restored from backup" })
}))

app.get("/api/dashboard/stats", authenticateToken, asyncHandler(async (req, res) => {
  const quotes = db.tables.quotes || []
  const collections = db.tables.collections || []
  const customers = db.tables.customers || []
  const smtp = db.tables.smtp_logs || []

  res.json({
    totalQuotes: quotes.length,
    pendingQuotes: quotes.filter(q => q.status === "pending").length,
    completedQuotes: quotes.filter(q => q.status === "completed").length,
    smtpSent: smtp.filter(s => s.status === "delivered").length,
    smtpFailed: smtp.filter(s => s.status === "failed").length,
    totalCustomers: customers.length,
    totalCollections: collections.length,
  })
}))

app.get("/api/dashboard/recent-activity", authenticateToken, asyncHandler(async (req, res) => {
  const quotes = (db.tables.quotes || [])
    .slice().sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))
    .slice(0, 5)
    .map(q => ({ customer: q.customer, service: q.service, area: q.area, date: q.date, type: "quote" }))

  const collections = (db.tables.collections || [])
    .slice().sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))
    .slice(0, 5)
    .map(c => ({ customer: c.customer, service: c.service, area: c.area, date: c.date, type: "collection" }))

  const smtp = (db.tables.smtp_logs || [])
    .slice().sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))
    .slice(0, 5)
    .map(s => ({ customer: s.recipient, service: s.type, area: "", date: s.time, type: "smtp" }))

  res.json({ quotes, collections, smtp })
}))

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: db ? "connected" : "disconnected",
  })
})

app.use((err, req, res, next) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack })
  res.status(500).json({ error: "Internal server error" })
})

export default app