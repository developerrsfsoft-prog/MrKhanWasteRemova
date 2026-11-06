import { useState, type FormEvent } from "react"
import { business, services } from "@/data"

type Variant = "hero" | "message"

type Fields = {
  name: string
  phone: string
  postcode: string
  service: string
  date: string
  email: string
  message: string
}

const blank: Fields = {
  name: "",
  phone: "",
  postcode: "",
  service: "",
  date: "",
  email: "",
  message: "",
}

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"

export function QuoteForm({
  variant = "hero",
  compact = false,
}: {
  variant?: Variant
  compact?: boolean
}) {
  const [values, setValues] = useState<Fields>(blank)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [done, setDone] = useState(false)

  function set<K extends keyof Fields>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function validate() {
    const next: Partial<Record<keyof Fields, string>> = {}
    if (!values.name.trim()) next.name = "Enter your name"
    if (!/^[\d\s+()-]{10,}$/.test(values.phone)) next.phone = "Enter a valid phone number"
    if (variant === "hero") {
      if (!/^[A-Za-z]{1,2}\d/.test(values.postcode.trim())) next.postcode = "Enter your postcode"
      if (!values.service) next.service = "Select a waste type"
      if (!values.date) next.date = "Select a date"
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email"
      if (values.message.trim().length < 10) next.message = "Tell us a little more"
    }
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
      <div className="rounded-2xl bg-white p-6 text-center shadow-xl">
        <p className="text-lg font-extrabold text-navy">Quote request saved on this page</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          This form does not send email. Call {business.phoneDisplay} and quote the details you entered.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white"
          onClick={() => {
            setDone(false)
            setValues(blank)
          }}
        >
          Enter another request
        </button>
      </div>
    )
  }

  return (
    <form
      id="quote"
      onSubmit={onSubmit}
      className={
        variant === "hero"
          ? "overflow-hidden rounded-2xl bg-white text-ink shadow-2xl"
          : "space-y-3"
      }
      noValidate
    >
      {variant === "hero" && (
        <div className="bg-brand px-5 py-4 text-white">
          <h2 className="text-lg font-extrabold">Get a Free Quote</h2>
          {!compact && <p className="text-xs text-white/80">Quick, easy, no obligation.</p>}
        </div>
      )}
      <div className={variant === "hero" ? "space-y-3 px-5 py-4" : "space-y-3"}>
        <label className="block text-xs font-bold text-navy">
          Name <span className="text-red-500">*</span>
          <input
            className={fieldClass}
            placeholder="Enter your name"
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
          />
          {errors.name && <span className="mt-1 block font-medium text-red-500">{errors.name}</span>}
        </label>
        <label className="block text-xs font-bold text-navy">
          Phone <span className="text-red-500">*</span>
          <input
            className={fieldClass}
            placeholder="Enter your phone number"
            inputMode="tel"
            value={values.phone}
            onChange={(event) => set("phone", event.target.value)}
          />
          {errors.phone && <span className="mt-1 block font-medium text-red-500">{errors.phone}</span>}
        </label>
        {variant === "message" && (
          <label className="block text-xs font-bold text-navy">
            Email <span className="text-red-500">*</span>
            <input
              className={fieldClass}
              placeholder="Enter your email"
              type="email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
            />
            {errors.email && <span className="mt-1 block font-medium text-red-500">{errors.email}</span>}
          </label>
        )}
        {variant === "hero" && (
          <>
            <label className="block text-xs font-bold text-navy">
              Postcode <span className="text-red-500">*</span>
              <input
                className={fieldClass}
                placeholder="Enter your postcode"
                value={values.postcode}
                onChange={(event) => set("postcode", event.target.value)}
              />
              {errors.postcode && (
                <span className="mt-1 block font-medium text-red-500">{errors.postcode}</span>
              )}
            </label>
            <label className="block text-xs font-bold text-navy">
              Waste Type <span className="text-red-500">*</span>
              <select
                className={fieldClass}
                value={values.service}
                onChange={(event) => set("service", event.target.value)}
              >
                <option value="">Select waste type</option>
                {services.map((service) => (
                  <option key={service.slug} value={service.slug}>
                    {service.title}
                  </option>
                ))}
              </select>
              {errors.service && (
                <span className="mt-1 block font-medium text-red-500">{errors.service}</span>
              )}
            </label>
            <label className="block text-xs font-bold text-navy">
              Collection Date <span className="text-red-500">*</span>
              <input
                className={fieldClass}
                type="date"
                value={values.date}
                onChange={(event) => set("date", event.target.value)}
              />
              {errors.date && <span className="mt-1 block font-medium text-red-500">{errors.date}</span>}
            </label>
          </>
        )}
        {variant === "message" && (
          <label className="block text-xs font-bold text-navy">
            Message <span className="text-red-500">*</span>
            <textarea
              className={fieldClass}
              rows={4}
              placeholder="What do you need collected?"
              value={values.message}
              onChange={(event) => set("message", event.target.value)}
            />
            {errors.message && (
              <span className="mt-1 block font-medium text-red-500">{errors.message}</span>
            )}
          </label>
        )}
        <button
          type="submit"
          className={`w-full rounded-xl py-3 text-sm font-extrabold transition ${
            variant === "hero"
              ? "bg-brand text-white hover:bg-brand-dark"
              : "bg-navy text-white hover:bg-ink"
          }`}
        >
          {variant === "hero" ? "Get My Quote →" : "Send Message"}
        </button>
        {variant === "hero" && (
          <p className="text-center text-[11px] text-muted">Your details stay in this browser.</p>
        )}
      </div>
    </form>
  )
}
