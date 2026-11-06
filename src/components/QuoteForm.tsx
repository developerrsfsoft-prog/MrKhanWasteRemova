import { useState, type FormEvent } from "react"
import { business, getLocation, services } from "@/data"
import { Mail, MapPin, Phone, Send, User } from "lucide-react"

type Variant = "hero" | "message"

type Fields = {
  name: string
  phone: string
  address: string
  postcode: string
  service: string
  date: string
  email: string
  message: string
}

const blank: Fields = {
  name: "",
  phone: "",
  address: "",
  postcode: "",
  service: "",
  date: "",
  email: "",
  message: "",
}

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10"

const iconStyle = "w-4 h-4 text-brand shrink-0"

export function QuoteForm({
  variant = "hero",
  compact = false,
  area,
}: {
  variant?: Variant
  compact?: boolean
  area?: string
}) {
  const [values, setValues] = useState<Fields>(blank)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [done, setDone] = useState(false)

  const location = area ? getLocation(area) : undefined
  const addressOptions = location?.addresses ?? []

  function set<K extends keyof Fields>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function validate() {
    const next: Partial<Record<keyof Fields, string>> = {}
    if (!values.name.trim()) next.name = "Enter your name"
    if (!/^[\d\s+()-]{10,}$/.test(values.phone)) next.phone = "Enter a valid phone number"
    if (addressOptions.length > 0) {
      if (!values.address) next.address = "Select your address"
    } else if (!values.address.trim()) {
      next.address = "Enter your address"
    }
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
      <div className="rounded-2xl bg-white p-6 text-center shadow-xl border border-line">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand text-white mx-auto mb-4">
          <Send className="w-6 h-6" />
        </div>
        <p className="text-lg font-extrabold text-navy mb-2">Quote request saved</p>
        <p className="mt-1 text-sm leading-relaxed text-muted max-w-xs mx-auto">
          This form does not send email. Call {business.phoneDisplay} and quote the details you entered.
        </p>
        <button
          type="button"
          className="mt-5 rounded-full bg-brand px-6 py-2.5 text-sm font-extrabold text-white hover:bg-brand-dark transition-colors"
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
          ? "overflow-hidden rounded-2xl bg-white text-ink shadow-xl border border-line"
          : "space-y-3"
      }
      noValidate
    >
      {variant === "hero" && (
        <div className="bg-brand px-6 py-5 text-white">
          <h2 className="text-lg font-extrabold">Get a Free Quote</h2>
          {!compact && <p className="mt-1 text-xs text-white/80">Quick, easy, no obligation.</p>}
        </div>
      )}
      <div className={variant === "hero" ? "space-y-3 px-6 py-5" : "space-y-3"}>
        <label className="block text-xs font-bold text-navy flex items-center gap-1.5">
          <User className={iconStyle} />
          Name <span className="text-red-500">*</span>
        </label>
        <input
          className={fieldClass}
          placeholder="Enter your name"
          value={values.name}
          onChange={(event) => set("name", event.target.value)}
        />
        {errors.name && <span className="mt-1 block font-medium text-red-500">{errors.name}</span>}

        <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-3">
          <Phone className={iconStyle} />
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          className={fieldClass}
          placeholder="Enter your phone number"
          inputMode="tel"
          value={values.phone}
          onChange={(event) => set("phone", event.target.value)}
        />
        {errors.phone && <span className="mt-1 block font-medium text-red-500">{errors.phone}</span>}

        <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-3">
          <MapPin className={iconStyle} />
          Address <span className="text-red-500">*</span>
        </label>
        {addressOptions.length > 0 ? (
          <select
            className={fieldClass}
            value={values.address}
            onChange={(event) => set("address", event.target.value)}
          >
            <option value="">Select your address</option>
            {addressOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={fieldClass}
            placeholder="Enter your address"
            value={values.address}
            onChange={(event) => set("address", event.target.value)}
          />
        )}
        {errors.address && <span className="mt-1 block font-medium text-red-500">{errors.address}</span>}

        {variant === "message" && (
          <>
            <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-3">
              <Mail className={iconStyle} />
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldClass}
              placeholder="Enter your email"
              type="email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
            />
            {errors.email && <span className="mt-1 block font-medium text-red-500">{errors.email}</span>}
          </>
        )}

        {variant === "hero" && (
          <>
            <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-3">
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldClass}
              placeholder="Enter your postcode"
              value={values.postcode}
              onChange={(event) => set("postcode", event.target.value)}
            />
            {errors.postcode && <span className="mt-1 block font-medium text-red-500">{errors.postcode}</span>}

            <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-3">
              Waste Type <span className="text-red-500">*</span>
            </label>
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
            {errors.service && <span className="mt-1 block font-medium text-red-500">{errors.service}</span>}

            <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-3">
              Collection Date <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldClass}
              type="date"
              value={values.date}
              onChange={(event) => set("date", event.target.value)}
            />
            {errors.date && <span className="mt-1 block font-medium text-red-500">{errors.date}</span>}
          </>
        )}

        {variant === "message" && (
          <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-3">
            Message <span className="text-red-500">*</span>
          </label>
        )}
        {variant === "message" && (
          <textarea
            className={fieldClass}
            rows={4}
            placeholder="What do you need collected?"
            value={values.message}
            onChange={(event) => set("message", event.target.value)}
          />
        )}
        {errors.message && <span className="mt-1 block font-medium text-red-500">{errors.message}</span>}

        <button
          type="submit"
          className={`mt-5 w-full rounded-full bg-brand px-6 py-3 text-sm font-extrabold text-white transition-all hover:bg-brand-dark hover:shadow-xl active:scale-95`}
        >
          <span className="flex items-center justify-center gap-1.5">
            {variant === "hero" ? "Get My Quote →" : "Send Message"}
            <Send className="w-4 h-4" />
          </span>
        </button>
        {variant === "hero" && (
          <p className="mt-4 text-center text-[11px] text-muted">Your details stay in this browser.</p>
        )}
      </div>
    </form>
  )
}
