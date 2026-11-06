import { useState, type FormEvent } from "react"
import { Mail, ShieldCheck, User } from "lucide-react"
import { motion } from "framer-motion"
import { Seo, MotionLink, Stagger } from "@/components"
import { fadeUp, buttonPress } from "@/components/animations"
import { business } from "@/data"

export function AdminLogin() {
  const [done, setDone] = useState(false)
  const [values, setValues] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function validate() {
    const next: { email?: string; password?: string } = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email"
    if (values.password.length < 6) next.password = "Password must be at least 6 characters"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return
    setDone(true)
  }

  if (done) {
    return (
      <section className="wrap py-20 text-center">
        <Seo title="Admin Login | Mr Khan Waste Removal" description="Admin login for Mr Khan Waste Removal." />
        <div className="mx-auto max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand text-white mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-navy mb-2">Access granted</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Welcome back to the {business.legalName} admin panel.
          </p>
          <MotionLink
            {...buttonPress}
            to="/admin-login"
            className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-extrabold text-white hover:bg-brand-dark transition-colors"
          >
            Sign out
          </MotionLink>
        </div>
      </section>
    )
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
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <label className="block text-xs font-bold text-navy flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand shrink-0" />
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10"
              placeholder="you@example.com"
              type="email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
            />
            {errors.email && <span className="mt-1 block font-medium text-red-500">{errors.email}</span>}

            <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-4">
              <Mail className="w-4 h-4 text-brand shrink-0" />
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10"
              placeholder="••••••••"
              type="password"
              value={values.password}
              onChange={(event) => set("password", event.target.value)}
            />
            {errors.password && <span className="mt-1 block font-medium text-red-500">{errors.password}</span>}

            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-muted">
                <input type="checkbox" className="rounded border-slate-200 text-brand focus:ring-brand" />
                Remember me
              </label>
              <MotionLink to="/contact#quote" className="text-sm font-bold text-brand">
                Forgot password?
              </MotionLink>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-brand px-6 py-3 text-sm font-extrabold text-white transition-all hover:bg-brand-dark hover:shadow-xl active:scale-95"
            >
              <span className="flex items-center justify-center gap-1.5">
                Sign in <ShieldCheck className="w-4 h-4" />
              </span>
            </button>
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
