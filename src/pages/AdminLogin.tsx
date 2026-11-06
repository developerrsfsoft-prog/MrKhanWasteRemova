import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, ShieldCheck, User, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Seo, MotionLink, Stagger } from "@/components"
import { fadeUp, buttonPress } from "@/components/animations"
import { useAuth } from "@/context/AuthContext"

export function AdminLogin() {
  const { login, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [apiError, setApiError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // If already logged in, redirect
  if (user && !authLoading) {
    navigate("/admin", { replace: true })
    return null
  }

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues(current => ({ ...current, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
    setApiError("")
  }

  function validate() {
    const next: { email?: string; password?: string } = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email"
    if (values.password.length < 6) next.password = "Password must be at least 6 characters"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setApiError("")
    try {
      await login(values.email, values.password)
      navigate("/admin", { replace: true })
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="wrap py-16 lg:py-24 text-center">
      <Seo title="Admin Login | Mr Khan Waste Removal" description="Sign in to the Mr Khan Waste Removal admin panel." />
      <div className="mx-auto max-w-md">
        <Stagger className="space-y-4">
          <motion.div variants={fadeUp} className="text-sm font-bold text-yellow tracking-[0.1em]">
            Admin panel
          </motion.div>
          <motion.h1 variants={fadeUp} className="mt-2 text-4xl font-extrabold text-navy">
            Admin Login
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-3 text-sm text-muted max-w-xs mx-auto">
            Sign in to manage your waste removal bookings.
          </motion.p>
        </Stagger>

        <div className="mt-8 mx-auto max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm text-left">
          {apiError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold text-navy mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand shrink-0" />
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10"
                placeholder="admin@example.com"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={e => set("email", e.target.value)}
              />
              {errors.email && <span className="mt-1 block text-xs font-medium text-red-500">{errors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-navy mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                Password <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                value={values.password}
                onChange={e => set("password", e.target.value)}
              />
              {errors.password && <span className="mt-1 block text-xs font-medium text-red-500">{errors.password}</span>}
            </div>

            <motion.button
              {...buttonPress}
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-brand px-6 py-3 text-sm font-extrabold text-white transition-all hover:bg-brand-dark hover:shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-1.5">
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                  : <><ShieldCheck className="w-4 h-4" /> Sign in</>
                }
              </span>
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Not an admin?{" "}
            <MotionLink to="/" className="font-bold text-brand">
              Return to homepage
            </MotionLink>
          </p>
        </div>
      </div>
    </section>
  )
}
