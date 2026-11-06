import { useState } from "react"
import { Link } from "react-router-dom"
import {
  FileText,
  Truck,
  User,
  Search,
  Plus,
  Send,
  Mail,
} from "lucide-react"
import { motion } from "framer-motion"
import { Seo } from "@/components"
import { fadeUp, staggerItem } from "@/components/animations"

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

interface QuoteItem {
  id: string
  customer: string
  service: string
  area: string
  postcode: string
  price: string
  status: "completed" | "pending"
  date: string
}

interface CollectionItem {
  id: string
  customer: string
  service: string
  area: string
  address: string
  driver: string
  status: "completed" | "in_progress" | "scheduled" | "pending"
  date: string
}

interface CustomerItem {
  id: string
  name: string
  email: string
  phone: string
  area: string
  totalSpent: string
  orders: number
  status: "active" | "vip" | "inactive"
}

interface SmtpLogItem {
  id: string
  recipient: string
  type: string
  status: "delivered" | "failed" | "pending"
  time: string
}

const quotes: QuoteItem[] = [
  { id: "QT-1001", customer: "James Wilson", service: "Furniture Removal", area: "South London", postcode: "SW19", price: "£85", status: "completed", date: "Today, 10:30 AM" },
  { id: "QT-1002", customer: "Sarah Ahmed", service: "House Clearance", area: "North London", postcode: "N1", price: "£240", status: "pending", date: "Today, 9:15 AM" },
  { id: "QT-1003", customer: "Michael Chen", service: "Garden Waste", area: "East London", postcode: "E15", price: "£65", status: "pending", date: "Yesterday, 4:20 PM" },
  { id: "QT-1004", customer: "Emma Roberts", service: "Office Clearance", area: "Central London", postcode: "WC2H", price: "£320", status: "completed", date: "Yesterday, 2:00 PM" },
  { id: "QT-1005", customer: "David O'Brien", service: "Garage Clearance", area: "West London", postcode: "W12", price: "£110", status: "pending", date: "2 days ago, 11:45 AM" },
  { id: "QT-1006", customer: "Lisa Thompson", service: "General Rubbish", area: "South London", postcode: "SW4", price: "£55", status: "completed", date: "3 days ago, 3:30 PM" },
]

const collections: CollectionItem[] = [
  { id: "CL-2001", customer: "James Wilson", service: "Furniture Removal", area: "South London", address: "12 Wimbledon Park, SW19", driver: "Nasir Khan", status: "completed", date: "Today, 11:00 AM" },
  { id: "CL-2002", customer: "Sarah Ahmed", service: "House Clearance", area: "North London", address: "45 Camden High St, N1", driver: "Ali Raza", status: "in_progress", date: "Today, 10:00 AM" },
  { id: "CL-2003", customer: "Michael Chen", service: "Garden Waste", area: "East London", address: "78 Stratford Ave, E15", driver: "Nasir Khan", status: "scheduled", date: "Today, 2:00 PM" },
  { id: "CL-2004", customer: "Emma Roberts", service: "Office Clearance", area: "Central London", address: "Covent Garden, WC2H", driver: "Ali Raza", status: "completed", date: "Yesterday, 3:00 PM" },
  { id: "CL-2005", customer: "David O'Brien", service: "Garage Clearance", area: "West London", address: "Shepherd's Bush, W12", driver: "Nasir Khan", status: "pending", date: "Tomorrow, 9:00 AM" },
]

const customers: CustomerItem[] = [
  { id: "CU-3001", name: "James Wilson", email: "james@example.com", phone: "07700 123456", area: "South London", totalSpent: "£420", orders: 8, status: "active" },
  { id: "CU-3002", name: "Sarah Ahmed", email: "sarah@example.com", phone: "07700 234567", area: "North London", totalSpent: "£310", orders: 4, status: "active" },
  { id: "CU-3003", name: "Michael Chen", email: "michael@example.com", phone: "07700 345678", area: "East London", totalSpent: "£180", orders: 3, status: "active" },
  { id: "CU-3004", name: "Emma Roberts", email: "emma@example.com", phone: "07700 456789", area: "Central London", totalSpent: "£650", orders: 12, status: "vip" },
  { id: "CU-3005", name: "David O'Brien", email: "david@example.com", phone: "07700 567890", area: "West London", totalSpent: "£95", orders: 2, status: "active" },
  { id: "CU-3006", name: "Lisa Thompson", email: "lisa@example.com", phone: "07700 678901", area: "South London", totalSpent: "£0", orders: 1, status: "inactive" },
]

const smtpLogs: SmtpLogItem[] = [
  { id: "SM-4001", recipient: "james@example.com", type: "Quote Confirmation", status: "delivered", time: "Today, 10:35 AM" },
  { id: "SM-4002", recipient: "sarah@example.com", type: "Collection Reminder", status: "delivered", time: "Today, 10:10 AM" },
  { id: "SM-4003", recipient: "michael@example.com", type: "Quote Confirmation", status: "failed", time: "Yesterday, 4:25 PM" },
  { id: "SM-4004", recipient: "emma@example.com", type: "Collection Receipt", status: "delivered", time: "Yesterday, 3:05 PM" },
  { id: "SM-4005", recipient: "david@example.com", type: "Booking Confirmation", status: "pending", time: "2 days ago, 11:50 AM" },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    completed: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    in_progress: "bg-brand/10 text-brand border border-brand/20",
    scheduled: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    delivered: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    failed: "bg-red-500/10 text-red-600 border border-red-500/20",
    active: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    inactive: "bg-slate-500/10 text-slate-600 border border-slate-500/20",
    vip: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </span>
  )
}

function AdminSidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  return (
    <aside
      className={`flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-line z-50 h-screen transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:!translate-x-0`}
    >
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-yellow flex items-center justify-center text-navy font-extrabold text-sm">
            M
          </div>
          <span className="font-extrabold text-navy tracking-tight">Mr Khan</span>
        </Link>
        <nav className="space-y-1">
          <NavItem name="Dashboard" Icon={FileText} href="/admin" />
          <NavItem name="Quotes" Icon={FileText} href="/admin/quotes" />
          <NavItem name="Collections" Icon={Truck} href="/admin/collections" />
          <NavItem name="Customers" Icon={User} href="/admin/customers" />
          <NavItem name="SMTP" Icon={Send} href="/admin/smtp" />
          <NavItem name="Settings" Icon={Mail} href="/admin/settings" />
        </nav>
        <div className="mt-auto pt-6 border-t border-line">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-muted hover:bg-white hover:text-navy transition-colors"
            onClick={() => {
              window.location.assign("/admin-login")
              setMobileOpen(false)
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ name, Icon, href }: { name: string; Icon: IconComponent; href: string }) {
  const active = window.location.pathname === href
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
        active ? "bg-brand text-white" : "text-muted hover:bg-white hover:text-navy"
      }`}
      onClick={() => window.location.assign(href)}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-semibold">{name}</span>
    </motion.div>
  )
}

function AdminHeader({ title, mobileOpen, setMobileOpen }: { title: string; mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-line">
      <div className="wrap flex items-center justify-between px-4 py-4 lg:px-0">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden text-muted hover:text-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-extrabold text-navy">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-sm font-bold text-brand hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </header>
  )
}

export function AdminQuotes() {
  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const filtered = quotes.filter((q) => q.customer.toLowerCase().includes(search.toLowerCase()) || q.service.toLowerCase().includes(search.toLowerCase()))

  return (
    <section className="flex min-h-screen bg-soft">
      <Seo title="Quotes | Admin Dashboard | Mr Khan Waste Removal" description="Manage customer quotes." />
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex-1 lg:ml-64">
        <AdminHeader title="Quotes" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="wrap px-4 py-6 lg:px-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl font-extrabold text-navy">Manage Quotes</h2>
              <p className="text-muted">Track all customer quote requests.</p>
            </motion.div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <input
                className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                placeholder="Search customer or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
                <Search className="w-4 h-4 mr-2" /> Search
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-line bg-soft">
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">ID</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Customer</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Service</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Area</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Price</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((quote) => (
                  <motion.tr key={quote.id} variants={staggerItem} className="hover:bg-white/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-navy">{quote.id}</td>
                    <td className="px-4 py-3 text-sm text-ink">{quote.customer}</td>
                    <td className="px-4 py-3 text-sm text-muted">{quote.service}</td>
                    <td className="px-4 py-3 text-sm text-muted">{quote.area}</td>
                    <td className="px-4 py-3 text-sm font-bold text-navy text-right">{quote.price}</td>
                    <td className="px-4 py-3 text-right"><StatusBadge status={quote.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted text-right">{quote.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="mt-6 text-center py-12 text-muted">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No quotes found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function AdminCollections() {
  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const filtered = collections.filter((c) => c.customer.toLowerCase().includes(search.toLowerCase()) || c.service.toLowerCase().includes(search.toLowerCase()))

  return (
    <section className="flex min-h-screen bg-soft">
      <Seo title="Collections | Admin Dashboard | Mr Khan Waste Removal" description="Manage scheduled collections." />
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex-1 lg:ml-64">
        <AdminHeader title="Collections" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="wrap px-4 py-6 lg:px-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl font-extrabold text-navy">Manage Collections</h2>
              <p className="text-muted">Track scheduled and completed collections.</p>
            </motion.div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <input
                className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                placeholder="Search customer or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
                <Plus className="w-4 h-4 mr-2" /> New Collection
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
            <table className="w-full text-left min-w-[650px]">
              <thead>
                <tr className="border-b border-line bg-soft">
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">ID</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Customer</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Service</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Driver</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((item) => (
                  <motion.tr key={item.id} variants={staggerItem} className="hover:bg-white/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-navy">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-ink">{item.customer}</td>
                    <td className="px-4 py-3 text-sm text-muted">{item.service}</td>
                    <td className="px-4 py-3 text-sm text-muted">{item.driver}</td>
                    <td className="px-4 py-3 text-right"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted text-right">{item.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="mt-6 text-center py-12 text-muted">
              <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No collections found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function AdminCustomers() {
  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.area.toLowerCase().includes(search.toLowerCase()))

  return (
    <section className="flex min-h-screen bg-soft">
      <Seo title="Customers | Admin Dashboard | Mr Khan Waste Removal" description="Manage customer records." />
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex-1 lg:ml-64">
        <AdminHeader title="Customers" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="wrap px-4 py-6 lg:px-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl font-extrabold text-navy">Manage Customers</h2>
              <p className="text-muted">View customer details and order history.</p>
            </motion.div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <input
                className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                placeholder="Search customer or area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
            <table className="w-full text-left min-w-[750px]">
              <thead>
                <tr className="border-b border-line bg-soft">
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">ID</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Email</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Phone</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Area</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Orders</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Total Spent</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((customer) => (
                  <motion.tr key={customer.id} variants={staggerItem} className="hover:bg-white/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-navy">{customer.id}</td>
                    <td className="px-4 py-3 text-sm text-ink">{customer.name}</td>
                    <td className="px-4 py-3 text-sm text-muted">{customer.email}</td>
                    <td className="px-4 py-3 text-sm text-muted">{customer.phone}</td>
                    <td className="px-4 py-3 text-sm text-muted">{customer.area}</td>
                    <td className="px-4 py-3 text-sm font-bold text-navy text-right">{customer.orders}</td>
                    <td className="px-4 py-3 text-sm font-bold text-navy text-right">{customer.totalSpent}</td>
                    <td className="px-4 py-3 text-right"><StatusBadge status={customer.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="mt-6 text-center py-12 text-muted">
              <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No customers found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function AdminSmtp() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <section className="flex min-h-screen bg-soft">
      <Seo title="SMTP | Admin Dashboard | Mr Khan Waste Removal" description="Monitor SMTP email delivery." />
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex-1 lg:ml-64">
        <AdminHeader title="SMTP Monitor" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="wrap px-4 py-6 lg:px-0">
          <motion.div variants={fadeUp}>
            <h2 className="text-3xl font-extrabold text-navy mb-2">SMTP Email Tracking</h2>
            <p className="text-muted">Monitor delivery status of all system emails.</p>
          </motion.div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
              <p className="text-sm text-muted mb-1">Total Sent</p>
              <p className="text-2xl font-extrabold text-navy">3,412</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
              <p className="text-sm text-muted mb-1">Delivered</p>
              <p className="text-2xl font-extrabold text-emerald-600">3,397</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
              <p className="text-sm text-muted mb-1">Failed</p>
              <p className="text-2xl font-extrabold text-red-600">15</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
              <p className="text-sm text-muted mb-1">Delivery Rate</p>
              <p className="text-2xl font-extrabold text-brand">99.6%</p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-line bg-soft">
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">ID</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Recipient</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Type</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {smtpLogs.map((log) => (
                  <motion.tr key={log.id} variants={staggerItem} className="hover:bg-white/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-navy">{log.id}</td>
                    <td className="px-4 py-3 text-sm text-ink">{log.recipient}</td>
                    <td className="px-4 py-3 text-sm text-muted">{log.type}</td>
                    <td className="px-4 py-3 text-right"><StatusBadge status={log.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted text-right">{log.time}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AdminSettings() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <section className="flex min-h-screen bg-soft">
      <Seo title="Settings | Admin Dashboard | Mr Khan Waste Removal" description="Admin settings page." />
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex-1 lg:ml-64">
        <AdminHeader title="Settings" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="wrap px-4 py-6 lg:px-0">
          <motion.div variants={fadeUp}>
            <h2 className="text-3xl font-extrabold text-navy mb-2">Admin Settings</h2>
            <p className="text-muted">Configure your admin panel preferences.</p>
          </motion.div>
          <div className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-navy mb-4">Business Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Business Name</span>
                  <span className="text-sm font-bold text-navy">Mr Khan Waste Removal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Owner</span>
                  <span className="text-sm font-bold text-navy">Nasir Khan</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Phone</span>
                  <span className="text-sm font-bold text-navy">07723 600218</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Email</span>
                  <span className="text-sm font-bold text-navy">info@mrkhanwasteremovallondon.co.uk</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-navy mb-4">SMTP Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">SMTP Host</span>
                  <span className="text-sm font-bold text-navy">smtp.mrkhanwasteremovallondon.co.uk</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Port</span>
                  <span className="text-sm font-bold text-navy">587</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Encryption</span>
                  <span className="text-sm font-bold text-navy">STARTTLS</span>
                </div>
              </div>
              <button className="mt-4 w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
