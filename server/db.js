/**
 * JSON database engine with concurrent-write protection and backup/restore.
 * Preserves the existing prepare()/run()/all()/get() API for compatibility.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcryptjs"
import { logger } from "./utils.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, "data")
const BACKUP_DIR = path.join(__dirname, "backups")

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

// -----------------------------------------------------------------------------
// Write queue (serialises all writes to avoid concurrent JSON corruption)
// -----------------------------------------------------------------------------
let writeQueue = Promise.resolve()

function enqueueWrite(fn) {
  writeQueue = writeQueue.then(fn).catch(err => {
    logger.error("Write queue error", { error: err.message })
    throw err
  })
  return writeQueue
}

// -----------------------------------------------------------------------------
// Atomic file helpers
// -----------------------------------------------------------------------------
function loadTable(name) {
  const file = path.join(DATA_DIR, `${name}.json`)
  if (fs.existsSync(file)) {
    try { return JSON.parse(fs.readFileSync(file, "utf-8")) } catch { return [] }
  }
  return []
}

function saveTableAtomic(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`)
  const tmp = file + ".tmp"
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
  fs.renameSync(tmp, file)
}

function saveAllTables(tables) {
  for (const [name, data] of Object.entries(tables)) {
    saveTableAtomic(name, data)
  }
}

// -----------------------------------------------------------------------------
// WHERE-clause filter
// -----------------------------------------------------------------------------
function applyWhere(rows, wherePart, params) {
  let pi = 0

  const splitByAnd = (str) => {
    const parts = []
    let depth = 0, seg = "", i = 0
    while (i < str.length) {
      const ch = str[i]
      if (ch === "(") { depth++; seg += ch; i++ }
      else if (ch === ")") { depth--; seg += ch; i++ }
      else if (depth === 0 && /^AND\s/i.test(str.slice(i))) {
        parts.push(seg.trim()); seg = ""; i += 4
      } else { seg += ch; i++ }
    }
    if (seg.trim()) parts.push(seg.trim())
    return parts
  }

  const parsePrimitive = (cond) => {
    cond = cond.trim()
    const like = cond.match(/^(\w+)\s+LIKE\s+\?$/i)
    if (like) {
      const col = like[1]
      const raw = params[pi++] ?? ""
      const re = new RegExp(raw.replace(/%/g, ".*"), "i")
      return (row) => re.test(String(row[col] ?? ""))
    }
    const eq = cond.match(/^(\w+)\s*=\s*\?$/)
    if (eq) {
      const col = eq[1]
      const val = params[pi++]
      return (row) => String(row[col]) === String(val)
    }
    return () => true
  }

  const andSegs = splitByAnd(wherePart)

  const evaluators = andSegs.map(seg => {
    if (seg.startsWith("(") && seg.endsWith(")")) {
      const inner = seg.slice(1, -1)
      const orParts = inner.split(/\s+OR\s+/i)
      const fns = orParts.map(p => parsePrimitive(p))
      return (row) => fns.some(fn => fn(row))
    }
    if (/\sOR\s/i.test(seg)) {
      const fns = seg.split(/\s+OR\s+/i).map(p => parsePrimitive(p))
      return (row) => fns.some(fn => fn(row))
    }
    return parsePrimitive(seg)
  })

  return rows.filter(row => evaluators.every(fn => fn(row)))
}

// -----------------------------------------------------------------------------
// JSONDatabase
// -----------------------------------------------------------------------------
class JSONDatabase {
  constructor() {
    this.tables = {}
    this._init()
  }

  _init() {
    const tableNames = ["admin_users", "quotes", "collections", "customers", "smtp_logs", "settings"]
    for (const name of tableNames) {
      this.tables[name] = loadTable(name)
    }
    this._seedIfEmpty()
  }

  _seedIfEmpty() {
    if (this.tables.admin_users.length === 0) {
      const adminHash = bcrypt.hashSync("admin123", 10)
      this.tables.admin_users = [{
        id: 1, name: "Nasir Khan",
        email: "admin@mrkhanwasteremovallondon.co.uk",
        password: adminHash, role: "admin",
        created_at: new Date().toISOString(),
      }]

      this.tables.quotes = [
        { id: 1, quote_id: "QT-1001", customer: "James Wilson", service: "Furniture Removal", area: "South London", postcode: "SW19", price: "\u00A385", status: "completed", date: "Today, 10:30 AM", created_at: new Date().toISOString() },
        { id: 2, quote_id: "QT-1002", customer: "Sarah Ahmed", service: "House Clearance", area: "North London", postcode: "N1", price: "\u00A3240", status: "pending", date: "Today, 9:15 AM", created_at: new Date().toISOString() },
        { id: 3, quote_id: "QT-1003", customer: "Michael Chen", service: "Garden Waste", area: "East London", postcode: "E15", price: "\u00A365", status: "pending", date: "Yesterday, 4:20 PM", created_at: new Date().toISOString() },
        { id: 4, quote_id: "QT-1004", customer: "Emma Roberts", service: "Office Clearance", area: "Central London", postcode: "WC2H", price: "\u00A3320", status: "completed", date: "Yesterday, 2:00 PM", created_at: new Date().toISOString() },
        { id: 5, quote_id: "QT-1005", customer: "David O'Brien", service: "Garage Clearance", area: "West London", postcode: "W12", price: "\u00A3110", status: "pending", date: "2 days ago, 11:45 AM", created_at: new Date().toISOString() },
        { id: 6, quote_id: "QT-1006", customer: "Lisa Thompson", service: "General Rubbish", area: "South London", postcode: "SW4", price: "\u00A355", status: "completed", date: "3 days ago, 3:30 PM", created_at: new Date().toISOString() },
      ]

      this.tables.collections = [
        { id: 1, collection_id: "CL-2001", customer: "James Wilson", service: "Furniture Removal", area: "South London", address: "12 Wimbledon Park, SW19", driver: "Nasir Khan", status: "completed", date: "Today, 11:00 AM", created_at: new Date().toISOString() },
        { id: 2, collection_id: "CL-2002", customer: "Sarah Ahmed", service: "House Clearance", area: "North London", address: "45 Camden High St, N1", driver: "Ali Raza", status: "in_progress", date: "Today, 10:00 AM", created_at: new Date().toISOString() },
        { id: 3, collection_id: "CL-2003", customer: "Michael Chen", service: "Garden Waste", area: "East London", address: "78 Stratford Ave, E15", driver: "Nasir Khan", status: "scheduled", date: "Today, 2:00 PM", created_at: new Date().toISOString() },
        { id: 4, collection_id: "CL-2004", customer: "Emma Roberts", service: "Office Clearance", area: "Central London", address: "Covent Garden, WC2H", driver: "Ali Raza", status: "completed", date: "Yesterday, 3:00 PM", created_at: new Date().toISOString() },
        { id: 5, collection_id: "CL-2005", customer: "David O'Brien", service: "Garage Clearance", area: "West London", address: "Shepherd's Bush, W12", driver: "Nasir Khan", status: "pending", date: "Tomorrow, 9:00 AM", created_at: new Date().toISOString() },
      ]

      this.tables.customers = [
        { id: 1, customer_id: "CU-3001", name: "James Wilson", email: "james@example.com", phone: "07700 123456", area: "South London", total_spent: "\u00A3420", orders: 8, status: "active", created_at: new Date().toISOString() },
        { id: 2, customer_id: "CU-3002", name: "Sarah Ahmed", email: "sarah@example.com", phone: "07700 234567", area: "North London", total_spent: "\u00A3310", orders: 4, status: "active", created_at: new Date().toISOString() },
        { id: 3, customer_id: "CU-3003", name: "Michael Chen", email: "michael@example.com", phone: "07700 345678", area: "East London", total_spent: "\u00A3180", orders: 3, status: "active", created_at: new Date().toISOString() },
        { id: 4, customer_id: "CU-3004", name: "Emma Roberts", email: "emma@example.com", phone: "07700 456789", area: "Central London", total_spent: "\u00A3650", orders: 12, status: "vip", created_at: new Date().toISOString() },
        { id: 5, customer_id: "CU-3005", name: "David O'Brien", email: "david@example.com", phone: "07700 567890", area: "West London", total_spent: "\u00A395", orders: 2, status: "active", created_at: new Date().toISOString() },
        { id: 6, customer_id: "CU-3006", name: "Lisa Thompson", email: "lisa@example.com", phone: "07700 678901", area: "South London", total_spent: "\u00A30", orders: 1, status: "inactive", created_at: new Date().toISOString() },
      ]

      this.tables.smtp_logs = [
        { id: 1, log_id: "SM-4001", recipient: "james@example.com", type: "Quote Confirmation", status: "delivered", time: "Today, 10:35 AM", created_at: new Date().toISOString() },
        { id: 2, log_id: "SM-4002", recipient: "sarah@example.com", type: "Collection Reminder", status: "delivered", time: "Today, 10:10 AM", created_at: new Date().toISOString() },
        { id: 3, log_id: "SM-4003", recipient: "michael@example.com", type: "Quote Confirmation", status: "failed", time: "Yesterday, 4:25 PM", created_at: new Date().toISOString() },
        { id: 4, log_id: "SM-4004", recipient: "emma@example.com", type: "Collection Receipt", status: "delivered", time: "Yesterday, 3:05 PM", created_at: new Date().toISOString() },
        { id: 5, log_id: "SM-4005", recipient: "david@example.com", type: "Booking Confirmation", status: "pending", time: "2 days ago, 11:50 AM", created_at: new Date().toISOString() },
      ]

      this.tables.settings = [
        { id: 1, key: "business_name", value: "Mr Khan Waste Removal", updated_at: new Date().toISOString() },
        { id: 2, key: "owner", value: "Nasir Khan", updated_at: new Date().toISOString() },
        { id: 3, key: "phone", value: "07723 600218", updated_at: new Date().toISOString() },
        { id: 4, key: "email", value: "info@mrkhanwasteremovallondon.co.uk", updated_at: new Date().toISOString() },
        { id: 5, key: "smtp_host", value: "smtp.mrkhanwasteremovallondon.co.uk", updated_at: new Date().toISOString() },
        { id: 6, key: "smtp_port", value: "587", updated_at: new Date().toISOString() },
        { id: 7, key: "smtp_encryption", value: "STARTTLS", updated_at: new Date().toISOString() },
        { id: 8, key: "smtp_user", value: "", updated_at: new Date().toISOString() },
        { id: 9, key: "smtp_pass", value: "", updated_at: new Date().toISOString() },
      ]

      this.saveAll()
      logger.info("Database seeded successfully")
    }
  }

  saveAll() {
    return enqueueWrite(() => {
      saveAllTables(this.tables)
    })
  }

  // -------------------------------------------------------------------------
  // prepare(sql) – returns { run(...), all([]), get([]) }
  // -------------------------------------------------------------------------
  prepare(sql) {
    const db = this
    const trimmed = sql.trim()
    const upper = trimmed.toUpperCase()

    const tableMatch = trimmed.match(/(?:FROM|INTO|UPDATE|DELETE\s+FROM)\s+(\w+)/i)
    const table = tableMatch ? tableMatch[1] : null

    return {
      run(...params) {
        if (!table || !db.tables[table]) return { changes: 0 }
        const tableData = db.tables[table]

        if (upper.startsWith("INSERT")) {
          const colMatch = trimmed.match(/\(([^)]+)\)\s+VALUES/i)
          if (!colMatch) return { changes: 0 }
          const cols = colMatch[1].split(",").map(c => c.trim())
          const maxId = tableData.reduce((m, r) => Math.max(m, r.id || 0), 0)
          const newId = maxId + 1
          const row = { id: newId, created_at: new Date().toISOString() }
          cols.forEach((col, i) => { row[col] = params[i] !== undefined ? params[i] : null })

          // ON CONFLICT upsert (used by settings)
          if (upper.includes("ON CONFLICT")) {
            const pkCol = cols[0]
            const pkVal = params[0]
            const idx = tableData.findIndex(r => String(r[pkCol]) === String(pkVal))
            if (idx !== -1) {
              cols.forEach((col, i) => { tableData[idx][col] = params[i] })
              tableData[idx].updated_at = new Date().toISOString()
              db.saveAll()
              return { lastInsertRowid: tableData[idx].id, changes: 1 }
            }
          }

          tableData.push(row)
          db.saveAll()
          return { lastInsertRowid: newId, changes: 1 }
        }

        if (upper.startsWith("UPDATE")) {
          const setMatch = trimmed.match(/SET\s+(.+?)\s+WHERE\s+(.+)$/i)
          if (!setMatch) return { changes: 0 }
          const setPairs = setMatch[1].split(",").map(s => s.trim())
          const setCols = setPairs.map(p => p.split("=")[0].trim())
          const wherePart = setMatch[2].trim()
          const whereCol = wherePart.replace(/\s*=\s*\?.*$/, "").trim()
          const whereVal = params[setCols.length]

          let changes = 0
          for (const row of tableData) {
            if (String(row[whereCol]) === String(whereVal)) {
              setCols.forEach((col, i) => { row[col] = params[i] })
              row.updated_at = new Date().toISOString()
              changes++
            }
          }
          if (changes > 0) db.saveAll()
          return { changes }
        }

        if (upper.startsWith("DELETE")) {
          const whereMatch = trimmed.match(/WHERE\s+(\w+)\s*=\s*\?/i)
          if (!whereMatch) return { changes: 0 }
          const col = whereMatch[1]
          const val = params[0]
          const before = tableData.length
          db.tables[table] = tableData.filter(r => String(r[col]) !== String(val))
          const changes = before - db.tables[table].length
          if (changes > 0) db.saveAll()
          return { changes }
        }

        return { changes: 0 }
      },

      all(paramsArray = []) {
        if (!table || !db.tables[table]) return []
        let rows = [...db.tables[table]]

        const whereMatch = trimmed.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i)
        if (whereMatch) {
          rows = applyWhere(rows, whereMatch[1].trim(), paramsArray)
        }

        if (upper.includes("ORDER BY") && upper.includes("DESC")) {
          rows.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))
        }

        if (upper.includes("COUNT(*)")) return [{ c: rows.length }]

        const selMatch = trimmed.match(/^SELECT\s+(.+?)\s+FROM/i)
        if (selMatch && selMatch[1].trim() !== "*") {
          const selCols = selMatch[1].split(",").map(c => {
            const m = c.trim().match(/^(\w+)(?:\s+as\s+(\w+))?$/i)
            return m ? { col: m[1], alias: m[2] || m[1] } : { col: c.trim(), alias: c.trim() }
          })
          rows = rows.map(r => {
            const out = {}
            selCols.forEach(({ col, alias }) => { out[alias] = r[col] })
            return out
          })
        }

        const limitMatch = trimmed.match(/LIMIT\s+(\d+)/i)
        if (limitMatch) rows = rows.slice(0, parseInt(limitMatch[1], 10))

        return rows.map(r => ({ ...r }))
      },

      get(paramsArray = []) {
        return this.all(paramsArray)[0] || null
      },
    }
  }

  run(sql, params = []) {
    return this.prepare(sql).run(...params)
  }

  close() { this.saveAll() }

  // -------------------------------------------------------------------------
  // Backup / Restore
  // -------------------------------------------------------------------------
  backup(tag = "manual") {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupPath = path.join(BACKUP_DIR, `backup-${tag}-${timestamp}.json`)
    const snapshot = {
      timestamp: new Date().toISOString(),
      tables: {},
    }
    for (const [name, data] of Object.entries(this.tables)) {
      snapshot.tables[name] = JSON.parse(JSON.stringify(data))
    }
    fs.writeFileSync(backupPath, JSON.stringify(snapshot, null, 2))
    logger.info("Database backup created", { path: backupPath })
    return backupPath
  }

  restore(backupPath) {
    return enqueueWrite(() => {
      if (!fs.existsSync(backupPath)) throw new Error("Backup file not found")
      const raw = fs.readFileSync(backupPath, "utf-8")
      const snapshot = JSON.parse(raw)
      for (const [name, data] of Object.entries(snapshot.tables || {})) {
        if (this.tables[name]) {
          this.tables[name] = JSON.parse(JSON.stringify(data))
        }
      }
      saveAllTables(this.tables)
      logger.info("Database restored from backup", { path: backupPath })
    })
  }

  listBackups() {
    return fs.readdirSync(BACKUP_DIR)
      .filter(f => f.endsWith(".json"))
      .map(f => ({
        filename: f,
        path: path.join(BACKUP_DIR, f),
        mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtime.toISOString(),
      }))
  }
}

let dbInstance = null

export async function initDb() {
  if (!dbInstance) dbInstance = new JSONDatabase()
  return dbInstance
}

export function getDb() {
  if (!dbInstance) throw new Error("Database not initialized")
  return dbInstance
}

export function saveDb() {
  if (dbInstance) dbInstance.saveAll()
}
