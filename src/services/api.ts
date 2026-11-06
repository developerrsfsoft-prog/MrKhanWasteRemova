/**
 * Centralised API service.
 * All requests go through /api (proxied to http://localhost:5000 in dev).
 */

const BASE = "/api"

function getToken(): string | null {
  return localStorage.getItem("admin_token")
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error || `HTTP ${res.status}`)
  return data as T
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("POST", "/auth/login", { email, password })
}

export async function verifyToken(): Promise<{ valid: boolean; user: AuthUser }> {
  return request<{ valid: boolean; user: AuthUser }>("POST", "/auth/verify", {})
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalQuotes: number
  pendingQuotes: number
  completedQuotes: number
  smtpSent: number
  smtpFailed: number
  totalCustomers: number
  totalCollections: number
}

export interface ActivityItem {
  customer: string
  service: string
  area: string
  date: string
  type: "quote" | "collection" | "smtp"
}

export interface RecentActivity {
  quotes: ActivityItem[]
  collections: ActivityItem[]
  smtp: ActivityItem[]
}

export const getDashboardStats = () => request<DashboardStats>("GET", "/dashboard/stats")
export const getRecentActivity = () => request<RecentActivity>("GET", "/dashboard/recent-activity")

// ── Quotes ────────────────────────────────────────────────────────────────────

export interface Quote {
  id: number
  quote_id: string
  customer: string
  service: string
  area: string
  postcode: string
  price: string
  status: "pending" | "completed"
  date: string
  created_at: string
}

export const getQuotes = (params?: { search?: string; status?: string }) => {
  const qs = new URLSearchParams()
  if (params?.search) qs.set("search", params.search)
  if (params?.status) qs.set("status", params.status)
  const q = qs.toString()
  return request<Quote[]>("GET", `/quotes${q ? `?${q}` : ""}`)
}
export const createQuote = (data: Omit<Quote, "id" | "created_at">) =>
  request<Quote>("POST", "/quotes", data)
export const updateQuote = (id: number, data: Partial<Quote>) =>
  request<Quote>("PUT", `/quotes/${id}`, data)
export const deleteQuote = (id: number) =>
  request<{ message: string }>("DELETE", `/quotes/${id}`)
export const getQuoteById = (id: number) =>
  request<Quote>("GET", `/quotes/${id}`)

// ── Collections ───────────────────────────────────────────────────────────────

export interface Collection {
  id: number
  collection_id: string
  customer: string
  service: string
  area: string
  address: string
  driver: string
  status: "pending" | "scheduled" | "in_progress" | "completed"
  date: string
  created_at: string
}

export const getCollections = (params?: { search?: string; status?: string }) => {
  const qs = new URLSearchParams()
  if (params?.search) qs.set("search", params.search)
  if (params?.status) qs.set("status", params.status)
  const q = qs.toString()
  return request<Collection[]>("GET", `/collections${q ? `?${q}` : ""}`)
}
export const createCollection = (data: Omit<Collection, "id" | "created_at">) =>
  request<Collection>("POST", "/collections", data)
export const updateCollection = (id: number, data: Partial<Collection>) =>
  request<Collection>("PUT", `/collections/${id}`, data)
export const deleteCollection = (id: number) =>
  request<{ message: string }>("DELETE", `/collections/${id}`)
export const getCollectionById = (id: number) =>
  request<Collection>("GET", `/collections/${id}`)

// ── Customers ─────────────────────────────────────────────────────────────────

export interface Customer {
  id: number
  customer_id: string
  name: string
  email: string
  phone: string
  area: string
  total_spent: string
  orders: number
  status: "active" | "vip" | "inactive"
  created_at: string
}

export const getCustomers = (params?: { search?: string; status?: string }) => {
  const qs = new URLSearchParams()
  if (params?.search) qs.set("search", params.search)
  if (params?.status) qs.set("status", params.status)
  const q = qs.toString()
  return request<Customer[]>("GET", `/customers${q ? `?${q}` : ""}`)
}
export const createCustomer = (data: Omit<Customer, "id" | "created_at">) =>
  request<Customer>("POST", "/customers", data)
export const updateCustomer = (id: number, data: Partial<Customer>) =>
  request<Customer>("PUT", `/customers/${id}`, data)
export const deleteCustomer = (id: number) =>
  request<{ message: string }>("DELETE", `/customers/${id}`)
export const getCustomerById = (id: number) =>
  request<Customer>("GET", `/customers/${id}`)

// ── Auth ──────────────────────────────────────────────────────────────────────

export const changePassword = (currentPassword: string, newPassword: string) =>
  request<{ message: string }>("POST", "/auth/change-password", { currentPassword, newPassword })

// ── Database Backup ───────────────────────────────────────────────────────────

export interface Backup {
  filename: string
  path: string
  mtime: string
}

export const listBackups = () =>
  request<{ backups: Backup[] }>("GET", "/db/backups")
export const createBackup = (tag?: string) =>
  request<{ success: boolean; path: string }>("POST", "/db/backup", { tag })
export const restoreBackup = (backupPath: string) =>
  request<{ success: boolean; message: string }>("POST", "/db/restore", { backupPath })

// ── SMTP ──────────────────────────────────────────────────────────────────────

export interface SmtpLog {
  id: number
  log_id: string
  recipient: string
  type: string
  status: "delivered" | "failed" | "pending"
  time: string
  created_at: string
}

export const getSmtpLogs = () => request<SmtpLog[]>("GET", "/smtp")
export const deleteSmtpLog = (id: number) =>
  request<{ message: string }>("DELETE", `/smtp/${id}`)
export const sendTestEmail = (to: string, subject: string) =>
  request<{ success: boolean; messageId?: string; logId?: string }>("POST", "/smtp/send", {
    to,
    subject,
    text: `Test email from Mr Khan Waste Removal admin panel. Sent at ${new Date().toLocaleString()}.`,
  })

// ── Settings ──────────────────────────────────────────────────────────────────

export type Settings = Record<string, string>

export const getSettings = () => request<Settings>("GET", "/settings")
export const updateSetting = (key: string, value: string) =>
  request<{ key: string; value: string }>("PUT", `/settings/${key}`, { value })

// ── Public Quote Submission ──────────────────────────────────────────────────

export interface PublicQuoteRequest {
  name: string
  phone: string
  email?: string
  address?: string
  postcode?: string
  service?: string
  date?: string
  message?: string
  area?: string
}

export interface PublicQuoteResponse {
  success: boolean
  quote_id?: string
  message: string
}

/**
 * Submit a public quote request (no authentication required)
 */
export async function submitPublicQuote(data: PublicQuoteRequest): Promise<PublicQuoteResponse> {
  const res = await fetch(`${BASE}/public/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((json as { error?: string }).error || `HTTP ${res.status}`)
  return json as PublicQuoteResponse
}

/**
 * Submit a public contact message (no authentication required)
 */
export async function submitContactMessage(data: PublicQuoteRequest): Promise<PublicQuoteResponse> {
  const res = await fetch(`${BASE}/public/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((json as { error?: string }).error || `HTTP ${res.status}`)
  return json as PublicQuoteResponse
}

