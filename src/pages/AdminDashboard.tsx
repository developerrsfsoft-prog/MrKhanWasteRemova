import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Truck,
  Clock,
  DollarSign,
  BarChart2,
  PieChart,
  Activity,
  ShieldCheck,
  User,
  LogOut,
  Send,
  Settings,
  MessageCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import { Seo } from "@/components"
import { fadeUp, staggerItem } from "@/components/animations"
import { useAuth } from "@/context/AuthContext"
import {
  getDashboardStats,
  getRecentActivity,
  type DashboardStats,
  type ActivityItem,
} from "@/services/api"

const navItems = [
  { name: "Dashboard", Icon: BarChart2, href: "/admin" },
  { name: "Quotes", Icon: MessageCircle, href: "/admin/quotes" },
  { name: "Collections", Icon: Truck, href: "/admin/collections" },
  { name: "Customers", Icon: User, href: "/admin/customers" },
  { name: "SMTP", Icon: Send, href: "/admin/smtp" },
  { name: "Settings", Icon: Settings, href: "/admin/settings" },
]

function LineChart() {
  const width = 360, height = 160
  const data = [40, 65, 50, 85, 70, 100, 90, 120, 110, 140, 130, 160]
  const max = Math.max(...data)
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`).join(" ")
  return (
    <div className="w-full">
      <svg width={width} height={height} className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="grad-brand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f75f5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1f75f5" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polyline points={points} fill="none" stroke="url(#grad-brand)" strokeWidth="3" className="drop-shadow-lg" />
        <polyline points={points} fill="none" stroke="#1f75f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - (v / max) * height} r="3" fill="#1f75f5" />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-muted"><span>Jan</span><span>Jun</span><span>Dec</span></div>
    </div>
  )
}

function DonutChart({ completed, total }: { completed: number; total: number }) {
  const cx = 90, cy = 90, r = 70, sw = 14
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const pending = total - completed
  const completedEnd = (completed / (total || 1)) * 2 * Math.PI
  const pendingEnd = completedEnd + (pending / (total || 1)) * 2 * Math.PI
  const arc = (s: number, e: number) => {
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s)
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e)
    return `M ${x1} ${y1} A ${r} ${r} 0 ${e - s > Math.PI ? 1 : 0} 1 ${x2} ${y2}`
  }
  return (
    <div className="w-full h-[200px] flex items-center justify-center">
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5edf6" strokeWidth={sw} />
        {total > 0 && <path d={arc(-Math.PI / 2, completedEnd - Math.PI / 2)} fill="none" stroke="#10b981" strokeWidth={sw} strokeLinecap="round" className="drop-shadow-md" />}
        {total > 0 && pending > 0 && <path d={arc(completedEnd - Math.PI / 2, pendingEnd - Math.PI / 2)} fill="none" stroke="#fbd11e" strokeWidth={sw} strokeLinecap="round" />}
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="22" fontWeight="800" fill="#0d2347">{pct}%</text>
        <text x={cx} y={cy + 28} textAnchor="middle" fontSize="11" fill="#5c6b82">Completion rate</text>
      </svg>
    </div>
  )
}

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<{ quotes: ActivityItem[]; collections: ActivityItem[]; smtp: ActivityItem[] } | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    setLoadingStats(true)
    setError("")
    try {
      const [s, a] = await Promise.all([getDashboardStats(), getRecentActivity()])
      setStats(s)
      setActivity(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data")
    } finally {
      setLoadingStats(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleLogout = () => {
    logout()
    navigate("/admin-login")
  }

  const recentItems: Array<{ user: string; action: string; target: string; time: string; status: string }> = [
    ...(activity?.quotes || []).map(q => ({
      user: "Admin", action: "New quote", target: `${q.service} – ${q.area}`, time: q.date, status: "success",
    })),
    ...(activity?.collections || []).map(c => ({
      user: "Admin", action: "Collection", target: `${c.service} – ${c.area}`, time: c.date, status: "success",
    })),
    ...(activity?.smtp || []).map(s => ({
      user: "System", action: "Email sent", target: `${s.service} → ${s.customer}`, time: s.date, status: "success",
    })),
  ].slice(0, 8)

  const pct = stats && stats.totalQuotes > 0 ? Math.round((stats.completedQuotes / stats.totalQuotes) * 100) : 0

  return (
    <section className="flex min-h-screen bg-soft">
      <Seo title="Admin Dashboard | Mr Khan Waste Removal" description="Admin dashboard for tracking quotes, collections and SMTP emails." />

      {/* Sidebar */}
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
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-muted hover:bg-white hover:text-navy transition-colors">
              <LogOut className="w-5 h-5" /><span className="text-sm font-semibold">Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-line">
          <div className="wrap flex items-center justify-between px-4 py-4 lg:px-0">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-muted hover:text-navy" onClick={() => setMobileOpen(p => !p)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h1 className="text-lg font-extrabold text-navy">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-brand/5 border border-brand/10 text-brand text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />System online
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-line text-navy text-sm font-bold">
                <User className="w-4 h-4" />{user?.name || "Admin"}
              </div>
            </div>
          </div>
        </header>

        <div className="wrap px-4 py-6 lg:px-0">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-navy mb-2">Welcome back, {user?.name?.split(" ")[0] || "Admin"}</h2>
            <p className="text-muted">Here's what's happening with your waste removal business today.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
              <button onClick={loadData} className="ml-auto text-brand font-bold hover:underline">Retry</button>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              { label: "Total Quotes", value: loadingStats ? "…" : String(stats?.totalQuotes ?? 0), Icon: DollarSign, color: "bg-brand/10 text-brand" },
              { label: "Pending", value: loadingStats ? "…" : String(stats?.pendingQuotes ?? 0), Icon: Clock, color: "bg-yellow/10 text-yellow-dark" },
              { label: "Completed", value: loadingStats ? "…" : String(stats?.completedQuotes ?? 0), Icon: ShieldCheck, color: "bg-emerald-500/10 text-emerald-600" },
              { label: "Total Customers", value: loadingStats ? "…" : String(stats?.totalCustomers ?? 0), Icon: User, color: "bg-brand/10 text-brand" },
            ].map(card => (
              <motion.div key={card.label} whileHover={{ y: -4 }} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-colors hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${card.color} w-10 h-10 rounded-xl flex items-center justify-center`}><card.Icon className="w-5 h-5" /></div>
                </div>
                <p className="text-sm text-muted mb-1">{card.label}</p>
                <p className="text-2xl font-extrabold text-navy">{card.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quote Completion */}
            <motion.div variants={fadeUp} className="lg:col-span-2 rounded-2xl border border-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-brand" />
                  <h3 className="text-lg font-extrabold text-navy">Quote Completion</h3>
                </div>
                <button onClick={loadData} disabled={loadingStats}>
                  <RefreshCw className={`w-4 h-4 text-muted hover:text-navy transition-colors ${loadingStats ? "animate-spin" : ""}`} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-brand/5 p-4 border border-brand/10">
                  <DonutChart completed={stats?.completedQuotes ?? 0} total={stats?.totalQuotes ?? 0} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-3xl font-extrabold text-navy">{pct}%</p>
                  <p className="text-sm text-muted">Quotes completed successfully</p>
                  <div className="mt-3 h-2 w-full rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                      <p className="text-lg font-extrabold text-emerald-600">{stats?.completedQuotes ?? 0}</p>
                      <p className="text-xs text-muted">Completed</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-center">
                      <p className="text-lg font-extrabold text-amber-600">{stats?.pendingQuotes ?? 0}</p>
                      <p className="text-xs text-muted">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 h-[160px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-extrabold text-navy">SMTP Delivery Trend</h3>
                  <span className="text-xs text-muted">Last 12 months</span>
                </div>
                <LineChart />
              </div>
            </motion.div>

            {/* SMTP Stats */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-navy">Email Stats</h3>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Live
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><Send className="w-4 h-4" /></div>
                    <div><p className="text-sm font-bold text-navy">Delivered</p><p className="text-xs text-muted">Successfully sent</p></div>
                  </div>
                  <p className="text-xl font-extrabold text-emerald-600">{loadingStats ? "…" : stats?.smtpSent ?? 0}</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center"><AlertCircle className="w-4 h-4" /></div>
                    <div><p className="text-sm font-bold text-navy">Failed</p><p className="text-xs text-muted">Delivery errors</p></div>
                  </div>
                  <p className="text-xl font-extrabold text-red-600">{loadingStats ? "…" : stats?.smtpFailed ?? 0}</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-brand/5 border border-brand/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand/10 text-brand flex items-center justify-center"><Truck className="w-4 h-4" /></div>
                    <div><p className="text-sm font-bold text-navy">Collections</p><p className="text-xs text-muted">Total scheduled</p></div>
                  </div>
                  <p className="text-xl font-extrabold text-brand">{loadingStats ? "…" : stats?.totalCollections ?? 0}</p>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-soft border border-line/50">
                <Link to="/admin/smtp" className="text-sm font-bold text-brand hover:underline">View SMTP logs →</Link>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div variants={fadeUp} className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand" />
                <h3 className="text-lg font-extrabold text-navy">Recent Activity</h3>
              </div>
              <Link to="/admin/quotes" className="text-sm font-bold text-brand hover:underline">View all →</Link>
            </div>
            {loadingStats ? (
              <div className="text-center py-8 text-muted text-sm">Loading activity…</div>
            ) : recentItems.length === 0 ? (
              <div className="text-center py-8 text-muted text-sm">No recent activity</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-line bg-soft">
                      <th className="px-4 py-3 text-xs font-bold text-muted uppercase">User</th>
                      <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Action</th>
                      <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Details</th>
                      <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {recentItems.map((item, i) => (
                      <motion.tr key={i} variants={staggerItem} className="hover:bg-soft/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-navy">{item.user}</td>
                        <td className="px-4 py-3 text-sm text-ink">{item.action}</td>
                        <td className="px-4 py-3 text-sm text-muted">{item.target}</td>
                        <td className="px-4 py-3 text-sm text-muted text-right">{item.time}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
