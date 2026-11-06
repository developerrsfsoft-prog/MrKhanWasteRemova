import { useState, useEffect, type ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  FileText, Truck, User, Search, Plus, Send, Mail, Settings,
  BarChart2, MessageCircle, LogOut, Trash2, Pencil, X, AlertCircle,
  CheckCircle2, Loader2, RefreshCw,
} from "lucide-react"
import { motion } from "framer-motion"
import { Seo } from "@/components"
import { fadeUp, staggerItem } from "@/components/animations"
import { useAuth } from "@/context/AuthContext"
import {
  getQuotes, createQuote, updateQuote, deleteQuote, type Quote,
  getCollections, createCollection, updateCollection, deleteCollection, type Collection,
  getCustomers, createCustomer, updateCustomer, deleteCustomer, type Customer,
  getSmtpLogs, deleteSmtpLog, sendTestEmail, type SmtpLog,
  getSettings, updateSetting,
} from "@/services/api"
import type { Settings as SettingsData } from "@/services/api"

// ─────────────────────────────────────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────────────────────────────────────
const navItems = [
  { name: "Dashboard", Icon: BarChart2, href: "/admin" },
  { name: "Quotes", Icon: MessageCircle, href: "/admin/quotes" },
  { name: "Collections", Icon: Truck, href: "/admin/collections" },
  { name: "Customers", Icon: User, href: "/admin/customers" },
  { name: "SMTP", Icon: Send, href: "/admin/smtp" },
  { name: "Settings", Icon: Settings, href: "/admin/settings" },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    in_progress: "bg-brand/10 text-brand border-brand/20",
    scheduled: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    failed: "bg-red-500/10 text-red-600 border-red-500/20",
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    inactive: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    vip: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${styles[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
    </span>
  )
}

function AdminSidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <aside className={`flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-line z-50 h-screen transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:!translate-x-0`}>
      <div className="p-6 flex flex-col h-full">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-yellow flex items-center justify-center text-navy font-extrabold text-sm">M</div>
          <span className="font-extrabold text-navy tracking-tight">Mr Khan</span>
        </Link>
        <nav className="space-y-1 flex-1">
          {navItems.map(({ name, Icon, href }) => {
            const active = window.location.pathname === href
            return (
              <motion.div key={name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? "bg-brand text-white" : "text-muted hover:bg-white hover:text-navy"}`}
                onClick={() => { navigate(href); setMobileOpen(false) }}>
                <Icon className="w-5 h-5" /><span className="text-sm font-semibold">{name}</span>
              </motion.div>
            )
          })}
        </nav>
        <div className="pt-6 border-t border-line">
          <button onClick={() => { logout(); navigate("/admin-login") }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-muted hover:bg-white hover:text-navy transition-colors">
            <LogOut className="w-5 h-5" /><span className="text-sm font-semibold">Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

function AdminHeader({ title, mobileOpen, setMobileOpen }: { title: string; mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-line">
      <div className="wrap flex items-center justify-between px-4 py-4 lg:px-0">
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-muted hover:text-navy" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-lg font-extrabold text-navy">{title}</h1>
        </div>
        <Link to="/admin" className="text-sm font-bold text-brand hover:underline">← Dashboard</Link>
      </div>
    </header>
  )
}

function AdminShell({ title, seoTitle, children, mobileOpen, setMobileOpen }: {
  title: string; seoTitle: string; children: ReactNode
  mobileOpen: boolean; setMobileOpen: (v: boolean) => void
}) {
  return (
    <section className="flex min-h-screen bg-soft">
      <Seo title={seoTitle} description={`${title} – Mr Khan Waste Removal Admin`} />
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {mobileOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <div className="flex-1 lg:ml-64">
        <AdminHeader title={title} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="wrap px-4 py-6 lg:px-0">{children}</div>
      </div>
    </section>
  )
}

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold border ${type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
      {type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {msg}
    </div>
  )
}

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)
  const show = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }
  return { toast, show }
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-line">
          <h3 className="text-lg font-extrabold text-navy">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-navy"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
const selectCls = inputCls

// ─────────────────────────────────────────────────────────────────────────────
// QUOTES
// ─────────────────────────────────────────────────────────────────────────────
export function AdminQuotes() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Quote | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast, show } = useToast()

  const [form, setForm] = useState({ quote_id: "", customer: "", service: "", area: "", postcode: "", price: "", status: "pending" as "pending" | "completed", date: "" })

  const load = async () => {
    setLoading(true)
    try {
      const data = await getQuotes({ search: search || undefined, status: statusFilter || undefined })
      setQuotes(data)
    } catch (e) { show(e instanceof Error ? e.message : "Load failed", "error") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [search, statusFilter])

  const openAdd = () => {
    const now = new Date().toLocaleString("en-GB", { hour12: false })
    setForm({ quote_id: `QT-${Date.now().toString().slice(-6)}`, customer: "", service: "", area: "", postcode: "", price: "", status: "pending", date: now })
    setEditItem(null)
    setShowModal(true)
  }

  const openEdit = (q: Quote) => {
    setForm({ quote_id: q.quote_id, customer: q.customer, service: q.service, area: q.area, postcode: q.postcode, price: q.price, status: q.status, date: q.date })
    setEditItem(q)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.customer || !form.service || !form.area || !form.price) { show("Fill in all required fields", "error"); return }
    setSaving(true)
    try {
      if (editItem) {
        await updateQuote(editItem.id, form)
        show("Quote updated")
      } else {
        await createQuote(form)
        show("Quote created")
      }
      setShowModal(false)
      load()
    } catch (e) { show(e instanceof Error ? e.message : "Save failed", "error") }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    setSaving(true)
    try { await deleteQuote(deleteId); show("Quote deleted"); setDeleteId(null); load() }
    catch (e) { show(e instanceof Error ? e.message : "Delete failed", "error") }
    finally { setSaving(false) }
  }

  return (
    <AdminShell title="Quotes" seoTitle="Quotes | Admin | Mr Khan Waste Removal" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>
      {toast && <Toast {...toast} />}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <motion.div variants={fadeUp}>
          <h2 className="text-3xl font-extrabold text-navy">Manage Quotes</h2>
          <p className="text-muted">Track all customer quote requests.</p>
        </motion.div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input className="rounded-xl border border-line bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={load} className="p-2.5 rounded-xl border border-line bg-white text-muted hover:text-navy"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
            <Plus className="w-4 h-4" /> Add Quote
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="border-b border-line bg-soft">
                {["ID", "Customer", "Service", "Area", "Price", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className={`px-4 py-3 text-xs font-bold text-muted uppercase ${h === "Actions" || h === "Price" || h === "Status" || h === "Date" ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {quotes.map(q => (
                <motion.tr key={q.id} variants={staggerItem} className="hover:bg-soft/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-navy">{q.quote_id}</td>
                  <td className="px-4 py-3 text-sm text-ink">{q.customer}</td>
                  <td className="px-4 py-3 text-sm text-muted">{q.service}</td>
                  <td className="px-4 py-3 text-sm text-muted">{q.area}</td>
                  <td className="px-4 py-3 text-sm font-bold text-navy text-right">{q.price}</td>
                  <td className="px-4 py-3 text-right"><StatusBadge status={q.status} /></td>
                  <td className="px-4 py-3 text-sm text-muted text-right">{q.date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg text-muted hover:text-brand hover:bg-brand/5 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(q.id)} className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {quotes.length === 0 && <div className="text-center py-12 text-muted"><FileText className="w-8 h-8 mx-auto mb-2 opacity-50" /><p>No quotes found.</p></div>}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editItem ? "Edit Quote" : "Add Quote"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Quote ID"><input className={inputCls} value={form.quote_id} onChange={e => setForm(f => ({ ...f, quote_id: e.target.value }))} /></Field>
              <Field label="Customer *"><input className={inputCls} value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} /></Field>
            </div>
            <Field label="Service *"><input className={inputCls} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Area *"><input className={inputCls} value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} /></Field>
              <Field label="Postcode"><input className={inputCls} value={form.postcode} onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price *"><input className={inputCls} placeholder="£0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></Field>
              <Field label="Status">
                <select className={selectCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as "pending" | "completed" }))}>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
            </div>
            <Field label="Date"><input className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></Field>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-line text-sm font-bold text-muted hover:text-navy">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}{editItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteId !== null && (
        <Modal title="Delete Quote" onClose={() => setDeleteId(null)}>
          <p className="text-sm text-muted mb-6">Are you sure you want to delete this quote? This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-line text-sm font-bold text-muted hover:text-navy">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}Delete
            </button>
          </div>
        </Modal>
      )}
    </AdminShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTIONS
// ─────────────────────────────────────────────────────────────────────────────
export function AdminCollections() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [items, setItems] = useState<Collection[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Collection | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast, show } = useToast()

  const emptyForm = { collection_id: "", customer: "", service: "", area: "", address: "", driver: "", status: "scheduled" as Collection["status"], date: "" }
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    try { setItems(await getCollections({ search: search || undefined, status: statusFilter || undefined })) }
    catch (e) { show(e instanceof Error ? e.message : "Load failed", "error") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [search, statusFilter])

  const openAdd = () => {
    const now = new Date().toLocaleString("en-GB", { hour12: false })
    setForm({ ...emptyForm, collection_id: `CL-${Date.now().toString().slice(-6)}`, date: now })
    setEditItem(null); setShowModal(true)
  }

  const openEdit = (c: Collection) => {
    setForm({ collection_id: c.collection_id, customer: c.customer, service: c.service, area: c.area, address: c.address, driver: c.driver, status: c.status, date: c.date })
    setEditItem(c); setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.customer || !form.service || !form.area || !form.address || !form.driver) { show("Fill in all required fields", "error"); return }
    setSaving(true)
    try {
      if (editItem) { await updateCollection(editItem.id, form); show("Collection updated") }
      else { await createCollection(form); show("Collection created") }
      setShowModal(false); load()
    } catch (e) { show(e instanceof Error ? e.message : "Save failed", "error") }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (deleteId === null) return; setSaving(true)
    try { await deleteCollection(deleteId); show("Collection deleted"); setDeleteId(null); load() }
    catch (e) { show(e instanceof Error ? e.message : "Delete failed", "error") }
    finally { setSaving(false) }
  }

  return (
    <AdminShell title="Collections" seoTitle="Collections | Admin | Mr Khan Waste Removal" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>
      {toast && <Toast {...toast} />}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <motion.div variants={fadeUp}>
          <h2 className="text-3xl font-extrabold text-navy">Manage Collections</h2>
          <p className="text-muted">Track scheduled and completed collections.</p>
        </motion.div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input className="rounded-xl border border-line bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={load} className="p-2.5 rounded-xl border border-line bg-white text-muted hover:text-navy"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">
            <Plus className="w-4 h-4" /> Add Collection
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-line bg-soft">
                {["ID", "Customer", "Service", "Driver", "Area", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className={`px-4 py-3 text-xs font-bold text-muted uppercase ${["Status", "Date", "Actions"].includes(h) ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map(item => (
                <motion.tr key={item.id} variants={staggerItem} className="hover:bg-soft/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-navy">{item.collection_id}</td>
                  <td className="px-4 py-3 text-sm text-ink">{item.customer}</td>
                  <td className="px-4 py-3 text-sm text-muted">{item.service}</td>
                  <td className="px-4 py-3 text-sm text-muted">{item.driver}</td>
                  <td className="px-4 py-3 text-sm text-muted">{item.area}</td>
                  <td className="px-4 py-3 text-right"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-sm text-muted text-right">{item.date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-muted hover:text-brand hover:bg-brand/5"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="text-center py-12 text-muted"><Truck className="w-8 h-8 mx-auto mb-2 opacity-50" /><p>No collections found.</p></div>}
        </div>
      )}

      {showModal && (
        <Modal title={editItem ? "Edit Collection" : "Add Collection"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Collection ID"><input className={inputCls} value={form.collection_id} onChange={e => setForm(f => ({ ...f, collection_id: e.target.value }))} /></Field>
              <Field label="Customer *"><input className={inputCls} value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} /></Field>
            </div>
            <Field label="Service *"><input className={inputCls} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Area *"><input className={inputCls} value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} /></Field>
              <Field label="Driver *"><input className={inputCls} value={form.driver} onChange={e => setForm(f => ({ ...f, driver: e.target.value }))} /></Field>
            </div>
            <Field label="Address *"><input className={inputCls} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <select className={selectCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Collection["status"] }))}>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
              <Field label="Date"><input className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-line text-sm font-bold text-muted hover:text-navy">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}{editItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <Modal title="Delete Collection" onClose={() => setDeleteId(null)}>
          <p className="text-sm text-muted mb-6">Delete this collection? This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-line text-sm font-bold text-muted">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}Delete
            </button>
          </div>
        </Modal>
      )}
    </AdminShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────────────────────────────────────
export function AdminCustomers() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Customer | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast, show } = useToast()

  const emptyForm = { customer_id: "", name: "", email: "", phone: "", area: "", total_spent: "£0", orders: 0, status: "active" as Customer["status"] }
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    try { setCustomers(await getCustomers({ search: search || undefined, status: statusFilter || undefined })) }
    catch (e) { show(e instanceof Error ? e.message : "Load failed", "error") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [search, statusFilter])

  const openAdd = () => {
    setForm({ ...emptyForm, customer_id: `CU-${Date.now().toString().slice(-6)}` })
    setEditItem(null); setShowModal(true)
  }

  const openEdit = (c: Customer) => {
    setForm({ customer_id: c.customer_id, name: c.name, email: c.email, phone: c.phone, area: c.area, total_spent: c.total_spent, orders: c.orders, status: c.status })
    setEditItem(c); setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone || !form.area) { show("Fill in all required fields", "error"); return }
    setSaving(true)
    try {
      if (editItem) { await updateCustomer(editItem.id, form); show("Customer updated") }
      else { await createCustomer(form); show("Customer created") }
      setShowModal(false); load()
    } catch (e) { show(e instanceof Error ? e.message : "Save failed", "error") }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (deleteId === null) return; setSaving(true)
    try { await deleteCustomer(deleteId); show("Customer deleted"); setDeleteId(null); load() }
    catch (e) { show(e instanceof Error ? e.message : "Delete failed", "error") }
    finally { setSaving(false) }
  }

  return (
    <AdminShell title="Customers" seoTitle="Customers | Admin | Mr Khan Waste Removal" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>
      {toast && <Toast {...toast} />}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <motion.div variants={fadeUp}>
          <h2 className="text-3xl font-extrabold text-navy">Manage Customers</h2>
          <p className="text-muted">View customer details and order history.</p>
        </motion.div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input className="rounded-xl border border-line bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={load} className="p-2.5 rounded-xl border border-line bg-white text-muted hover:text-navy"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-line bg-soft">
                {["ID", "Name", "Email", "Phone", "Area", "Orders", "Total Spent", "Status", "Actions"].map(h => (
                  <th key={h} className={`px-4 py-3 text-xs font-bold text-muted uppercase ${["Orders", "Total Spent", "Status", "Actions"].includes(h) ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {customers.map(c => (
                <motion.tr key={c.id} variants={staggerItem} className="hover:bg-soft/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-navy">{c.customer_id}</td>
                  <td className="px-4 py-3 text-sm text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-muted">{c.email}</td>
                  <td className="px-4 py-3 text-sm text-muted">{c.phone}</td>
                  <td className="px-4 py-3 text-sm text-muted">{c.area}</td>
                  <td className="px-4 py-3 text-sm font-bold text-navy text-right">{c.orders}</td>
                  <td className="px-4 py-3 text-sm font-bold text-navy text-right">{c.total_spent}</td>
                  <td className="px-4 py-3 text-right"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-muted hover:text-brand hover:bg-brand/5"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && <div className="text-center py-12 text-muted"><User className="w-8 h-8 mx-auto mb-2 opacity-50" /><p>No customers found.</p></div>}
        </div>
      )}

      {showModal && (
        <Modal title={editItem ? "Edit Customer" : "Add Customer"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Customer ID"><input className={inputCls} value={form.customer_id} onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))} /></Field>
              <Field label="Name *"><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email *"><input className={inputCls} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
              <Field label="Phone *"><input className={inputCls} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Area *"><input className={inputCls} value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} /></Field>
              <Field label="Status">
                <select className={selectCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Customer["status"] }))}>
                  <option value="active">Active</option>
                  <option value="vip">VIP</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Total Spent"><input className={inputCls} placeholder="£0" value={form.total_spent} onChange={e => setForm(f => ({ ...f, total_spent: e.target.value }))} /></Field>
              <Field label="Orders"><input className={inputCls} type="number" min="0" value={form.orders} onChange={e => setForm(f => ({ ...f, orders: parseInt(e.target.value) || 0 }))} /></Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-line text-sm font-bold text-muted">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}{editItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <Modal title="Delete Customer" onClose={() => setDeleteId(null)}>
          <p className="text-sm text-muted mb-6">Delete this customer? This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-line text-sm font-bold text-muted">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}Delete
            </button>
          </div>
        </Modal>
      )}
    </AdminShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SMTP
// ─────────────────────────────────────────────────────────────────────────────
export function AdminSmtp() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logs, setLogs] = useState<SmtpLog[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [testTo, setTestTo] = useState("")
  const [testSubject, setTestSubject] = useState("Test Email from Mr Khan Admin")
  const [showTest, setShowTest] = useState(false)
  const { toast, show } = useToast()

  const load = async () => {
    setLoading(true)
    try { setLogs(await getSmtpLogs()) }
    catch (e) { show(e instanceof Error ? e.message : "Load failed", "error") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (deleteId === null) return; setSaving(true)
    try { await deleteSmtpLog(deleteId); show("Log deleted"); setDeleteId(null); load() }
    catch (e) { show(e instanceof Error ? e.message : "Delete failed", "error") }
    finally { setSaving(false) }
  }

  const handleTest = async () => {
    if (!testTo) { show("Enter a recipient email", "error"); return }
    setSaving(true)
    try {
      await sendTestEmail(testTo, testSubject)
      show("Test email sent")
      setShowTest(false)
      load()
    } catch (e) { show(e instanceof Error ? e.message : "Send failed — check SMTP settings", "error") }
    finally { setSaving(false) }
  }

  const delivered = logs.filter(l => l.status === "delivered").length
  const failed = logs.filter(l => l.status === "failed").length
  const total = logs.length
  const rate = total > 0 ? Math.round((delivered / total) * 100) : 0

  return (
    <AdminShell title="SMTP Monitor" seoTitle="SMTP | Admin | Mr Khan Waste Removal" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>
      {toast && <Toast {...toast} />}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <motion.div variants={fadeUp}>
          <h2 className="text-3xl font-extrabold text-navy">SMTP Email Tracking</h2>
          <p className="text-muted">Monitor delivery status of all system emails.</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2.5 rounded-xl border border-line bg-white text-muted hover:text-navy"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setShowTest(true)} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">
            <Send className="w-4 h-4" /> Send Test Email
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "Total Sent", value: total, cls: "text-navy" },
          { label: "Delivered", value: delivered, cls: "text-emerald-600" },
          { label: "Failed", value: failed, cls: "text-red-600" },
          { label: "Delivery Rate", value: `${rate}%`, cls: "text-brand" },
        ].map(c => (
          <div key={c.label} className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <p className="text-sm text-muted mb-1">{c.label}</p>
            <p className={`text-2xl font-extrabold ${c.cls}`}>{loading ? "…" : c.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-line bg-soft">
                {["ID", "Recipient", "Type", "Status", "Time", "Actions"].map(h => (
                  <th key={h} className={`px-4 py-3 text-xs font-bold text-muted uppercase ${["Status", "Time", "Actions"].includes(h) ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {logs.map(log => (
                <motion.tr key={log.id} variants={staggerItem} className="hover:bg-soft/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-navy">{log.log_id}</td>
                  <td className="px-4 py-3 text-sm text-ink">{log.recipient}</td>
                  <td className="px-4 py-3 text-sm text-muted">{log.type}</td>
                  <td className="px-4 py-3 text-right"><StatusBadge status={log.status} /></td>
                  <td className="px-4 py-3 text-sm text-muted text-right">{log.time}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteId(log.id)} className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && <div className="text-center py-12 text-muted"><Mail className="w-8 h-8 mx-auto mb-2 opacity-50" /><p>No email logs found.</p></div>}
        </div>
      )}

      {showTest && (
        <Modal title="Send Test Email" onClose={() => setShowTest(false)}>
          <div className="space-y-4">
            <Field label="Recipient email *"><input className={inputCls} type="email" placeholder="you@example.com" value={testTo} onChange={e => setTestTo(e.target.value)} /></Field>
            <Field label="Subject"><input className={inputCls} value={testSubject} onChange={e => setTestSubject(e.target.value)} /></Field>
            <p className="text-xs text-muted">This will use the SMTP credentials configured in Settings.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowTest(false)} className="px-4 py-2 rounded-xl border border-line text-sm font-bold text-muted">Cancel</button>
              <button onClick={handleTest} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}<Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <Modal title="Delete Log" onClose={() => setDeleteId(null)}>
          <p className="text-sm text-muted mb-6">Delete this log entry?</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-line text-sm font-bold text-muted">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}Delete
            </button>
          </div>
        </Modal>
      )}
    </AdminShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
export function AdminSettings() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [, setSettings] = useState<SettingsData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast, show } = useToast()

  // Local editable state
  const [biz, setBiz] = useState({ business_name: "", owner: "", phone: "", email: "" })
  const [smtp, setSmtp] = useState({ smtp_host: "", smtp_port: "", smtp_encryption: "STARTTLS", smtp_user: "", smtp_pass: "" })

  const load = async () => {
    setLoading(true)
    try {
      const s = await getSettings()
      setSettings(s)
      setBiz({ business_name: s.business_name || "", owner: s.owner || "", phone: s.phone || "", email: s.email || "" })
      setSmtp({ smtp_host: s.smtp_host || "", smtp_port: s.smtp_port || "587", smtp_encryption: s.smtp_encryption || "STARTTLS", smtp_user: s.smtp_user || "", smtp_pass: "" })
    } catch (e) { show(e instanceof Error ? e.message : "Load failed", "error") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const saveBiz = async () => {
    setSaving(true)
    try {
      await Promise.all(Object.entries(biz).map(([k, v]) => updateSetting(k, v)))
      show("Business settings saved")
    } catch (e) { show(e instanceof Error ? e.message : "Save failed", "error") }
    finally { setSaving(false) }
  }

  const saveSmtp = async () => {
    setSaving(true)
    try {
      const toSave = { smtp_host: smtp.smtp_host, smtp_port: smtp.smtp_port, smtp_encryption: smtp.smtp_encryption, smtp_user: smtp.smtp_user }
      if (smtp.smtp_pass) (toSave as Record<string, string>)["smtp_pass"] = smtp.smtp_pass
      await Promise.all(Object.entries(toSave).map(([k, v]) => updateSetting(k, v)))
      show("SMTP settings saved")
    } catch (e) { show(e instanceof Error ? e.message : "Save failed", "error") }
    finally { setSaving(false) }
  }

  return (
    <AdminShell title="Settings" seoTitle="Settings | Admin | Mr Khan Waste Removal" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>
      {toast && <Toast {...toast} />}
      <motion.div variants={fadeUp} className="mb-6">
        <h2 className="text-3xl font-extrabold text-navy mb-2">Admin Settings</h2>
        <p className="text-muted">Configure your business details and SMTP settings.</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Business Info */}
          <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-navy mb-5">Business Information</h3>
            <div className="space-y-4">
              <Field label="Business Name">
                <input className={inputCls} value={biz.business_name} onChange={e => setBiz(b => ({ ...b, business_name: e.target.value }))} />
              </Field>
              <Field label="Owner Name">
                <input className={inputCls} value={biz.owner} onChange={e => setBiz(b => ({ ...b, owner: e.target.value }))} />
              </Field>
              <Field label="Phone Number">
                <input className={inputCls} value={biz.phone} onChange={e => setBiz(b => ({ ...b, phone: e.target.value }))} />
              </Field>
              <Field label="Email Address">
                <input className={inputCls} type="email" value={biz.email} onChange={e => setBiz(b => ({ ...b, email: e.target.value }))} />
              </Field>
            </div>
            <button onClick={saveBiz} disabled={saving} className="mt-5 flex items-center gap-2 w-full justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}Save Business Settings
            </button>
          </div>

          {/* SMTP Config */}
          <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-navy mb-5">SMTP Configuration</h3>
            <div className="space-y-4">
              <Field label="SMTP Host">
                <input className={inputCls} placeholder="smtp.example.com" value={smtp.smtp_host} onChange={e => setSmtp(s => ({ ...s, smtp_host: e.target.value }))} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Port">
                  <input className={inputCls} placeholder="587" value={smtp.smtp_port} onChange={e => setSmtp(s => ({ ...s, smtp_port: e.target.value }))} />
                </Field>
                <Field label="Encryption">
                  <select className={selectCls} value={smtp.smtp_encryption} onChange={e => setSmtp(s => ({ ...s, smtp_encryption: e.target.value }))}>
                    <option value="STARTTLS">STARTTLS</option>
                    <option value="SSL/TLS">SSL/TLS</option>
                    <option value="None">None</option>
                  </select>
                </Field>
              </div>
              <Field label="SMTP Username">
                <input className={inputCls} placeholder="user@example.com" value={smtp.smtp_user} onChange={e => setSmtp(s => ({ ...s, smtp_user: e.target.value }))} />
              </Field>
              <Field label="SMTP Password">
                <input className={inputCls} type="password" placeholder="Leave blank to keep unchanged" value={smtp.smtp_pass} onChange={e => setSmtp(s => ({ ...s, smtp_pass: e.target.value }))} />
              </Field>
            </div>
            <p className="mt-3 text-xs text-muted">Passwords are stored on the server and never returned to the browser.</p>
            <button onClick={saveSmtp} disabled={saving} className="mt-4 flex items-center gap-2 w-full justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}Save SMTP Settings
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
