import { useState } from "react"
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
} from "lucide-react"
import { motion } from "framer-motion"
import { Seo } from "@/components"
import { fadeUp, staggerItem } from "@/components/animations"

const navItems = [
  { name: "Dashboard", Icon: BarChart2, href: "/admin" },
  { name: "Quotes", Icon: MessageCircle, href: "/admin/quotes" },
  { name: "Collections", Icon: Truck, href: "/admin/collections" },
  { name: "Customers", Icon: User, href: "/admin/customers" },
  { name: "SMTP", Icon: Send, href: "/admin/smtp" },
  { name: "Settings", Icon: Settings, href: "/admin/settings" },
]

const statCards = [
  { label: "Total Quotes", value: "1,248", Icon: DollarSign, color: "bg-brand/10 text-brand", change: "+12%" },
  { label: "Pending", value: "86", Icon: Clock, color: "bg-yellow/10 text-yellow-dark", change: "+4%" },
  { label: "Completed", value: "1,012", Icon: ShieldCheck, color: "bg-emerald-500/10 text-emerald-600", change: "+8%" },
  { label: "SMTP Emails", value: "3,412", Icon: Send, color: "bg-brand/10 text-brand", change: "+15%" },
]

const smtpServers = [
  { name: "Primary SMTP", host: "smtp.mrkhanwasteremovallondon.co.uk", status: "active", delivered: 2845, failed: 12 },
  { name: "Backup SMTP", host: "smtp-backup.mrkhan.co.uk", status: "active", delivered: 567, failed: 3 },
  { name: "Transactional", host: "smtp-relay.co.uk", status: "warning", delivered: 0, failed: 0 },
]

const recentActivity = [
  { user: "Nasir Khan", action: "Created quote", target: "Furniture Removal - South London", time: "2 min ago", status: "success" },
  { user: "Admin", action: "SMTP email sent", target: "Quote confirmation - North London", time: "15 min ago", status: "success" },
  { user: "System", action: "Collection scheduled", target: "House Clearance - West London", time: "1 hr ago", status: "success" },
  { user: "Admin", action: "SMTP failure", target: "Delivery notification - East London", time: "3 hr ago", status: "error" },
  { user: "Nasir Khan", action: "Updated customer", target: "General Rubbish Removal - Central London", time: "5 hr ago", status: "success" },
]

function LineChart() {
  const width = 360
  const height = 160
  const data = [40, 65, 50, 85, 70, 100, 90, 120, 110, 140, 130, 160]
  const max = Math.max(...data)
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - (v / max) * height
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="w-full">
      <svg width={width} height={height} className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="grad-brand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f75f5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1f75f5" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke="url(#grad-brand)"
          strokeWidth="3"
          className="drop-shadow-lg"
        />
        <polyline points={points} fill="none" stroke="#1f75f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * width}
            cy={height - (v / max) * height}
            r="3"
            fill="#1f75f5"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-muted">
        <span>Jan</span>
        <span>Jun</span>
        <span>Dec</span>
      </div>
    </div>
  )
}

function DonutChart() {
  const cx = 90
  const cy = 90
  const r = 70
  const strokeWidth = 14
  const total = 1248
  const completed = 1012
  const pending = 86

  const arc = (start: number, end: number) => {
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const largeArc = end - start > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  const completedEnd = (completed / total) * 2 * Math.PI
  const pendingEnd = completedEnd + (pending / total) * 2 * Math.PI

  return (
    <div className="w-full h-[200px] flex items-center justify-center">
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5edf6" strokeWidth={strokeWidth} />
        <path
          d={arc(-Math.PI / 2, completedEnd - Math.PI / 2)}
          fill="none"
          stroke="#10b981"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="drop-shadow-md"
        />
        <path
          d={arc(completedEnd - Math.PI / 2, pendingEnd - Math.PI / 2)}
          fill="none"
          stroke="#fbd11e"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="22" fontWeight="800" fill="#0d2347">
          81%
        </text>
        <text x={cx} y={cy + 28} textAnchor="middle" fontSize="11" fill="#5c6b82">
          Completion rate
        </text>
      </svg>
    </div>
  )
}

export function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("/admin")

  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <section className="flex min-h-screen bg-soft">
      <Seo title="Admin Dashboard | Mr Khan Waste Removal" description="Admin dashboard for tracking quotes, collections and SMTP emails." />

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
            {navItems.map((item) => {
              const active = activeNav === item.href
              const Icon = item.Icon
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                    active ? "bg-brand text-white" : "text-muted hover:bg-white hover:text-navy"
                  }`}
                  onClick={() => {
                    setActiveNav(item.href)
                    navigate(item.href)
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{item.name}</span>
                </motion.div>
              )
            })}
          </nav>
          <div className="mt-auto pt-6 border-t border-line">
            <button
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-muted hover:bg-white hover:text-navy transition-colors"
              onClick={() => navigate("/admin-login")}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-semibold">Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-line">
          <div className="wrap flex items-center justify-between px-4 py-4 lg:px-0">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-muted hover:text-navy"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-extrabold text-navy">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-brand/5 border border-brand/10 text-brand text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                System online
              </div>
              <div className="flex items-center gap-2 pl-4 py-2 rounded-full bg-white border border-line text-navy text-sm font-bold">
                <User className="w-4 h-4" />
                Nasir Khan
              </div>
            </div>
          </div>
        </header>

        <div className="wrap px-4 py-6 lg:px-0">
          <motion.div variants={staggerItem} className="mb-6">
            <h2 className="text-3xl font-extrabold text-navy mb-2">Welcome back, Nasir</h2>
            <p className="text-muted">Here's what's happening with your waste removal business today.</p>
          </motion.div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((card) => (
              <motion.div
                key={card.label}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-colors hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${card.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                    <card.Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold">{card.change}</span>
                </div>
                <p className="text-sm text-muted mb-1">{card.label}</p>
                <p className="text-2xl font-extrabold text-navy">{card.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div variants={fadeUp} className="lg:col-span-2 rounded-2xl border border-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-brand" />
                  <h3 className="text-lg font-extrabold text-navy">Quote Completion</h3>
                </div>
                <RefreshCw className="w-4 h-4 text-muted cursor-pointer hover:text-navy transition-colors" />
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-brand/5 p-4 border border-brand/10">
                  <DonutChart />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-3xl font-extrabold text-navy">81%</p>
                  <p className="text-sm text-muted">Quotes completed successfully</p>
                  <div className="mt-3 h-2 w-full rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-brand" style={{ width: "81%" }} />
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

            <motion.div variants={fadeUp} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-navy">SMTP Server Status</h3>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  System healthy
                </span>
              </div>
              <div className="space-y-3">
                {smtpServers.map((server) => {
                  const active = server.status === "active"
                  return (
                    <motion.div
                      key={server.name}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 rounded-xl border border-line bg-white/50 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"}`}>
                          <Send className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy">{server.name}</p>
                          <p className="text-xs text-muted">{server.host}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-navy">{server.delivered}</p>
                        <p className="text-xs text-muted">delivered</p>
                        {server.failed > 0 && (
                          <p className="text-xs font-bold text-red-600">{server.failed} failed</p>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-line border border-line/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Delivery rate</span>
                  <span className="font-bold text-navy">99.6%</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted">Failed deliveries</span>
                  <span className="font-bold text-red-600">15</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-line overflow-hidden">
                  <div className="h-full bg-brand" style={{ width: "99.6%" }} />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand" />
                <h3 className="text-lg font-extrabold text-navy">Recent Activity</h3>
              </div>
              <Link to="/admin/quotes" className="text-sm font-bold text-brand hover:underline">
                View all activity →
              </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-line bg-soft">
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase">User</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Action</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase">Target</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Time</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentActivity.map((item, index) => (
                    <motion.tr
                      key={index}
                      variants={staggerItem}
                      className="hover:bg-white/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-semibold text-navy">{item.user}</td>
                      <td className="px-4 py-3 text-sm text-ink">{item.action}</td>
                      <td className="px-4 py-3 text-sm text-muted">{item.target}</td>
                      <td className="px-4 py-3 text-sm text-muted text-right">{item.time}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            item.status === "success"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-600 border border-red-500/20"
                          }`}
                        >
                          {item.status === "success" ? "Delivered" : "Failed"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
