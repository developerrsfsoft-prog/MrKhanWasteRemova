import { useState, type FormEvent } from "react"
import { business, getLocation, services } from "@/data"
import { Mail, MapPin, Phone, Send, User, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { submitPublicQuote, submitContactMessage } from "@/services/api"

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
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10"

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
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")
  const [quoteId, setQuoteId] = useState("")

  const location = area ? getLocation(area) : undefined
  const addressOptions = location?.addresses ?? []

  function set<K extends keyof Fields>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) {
      setErrors(e => ({ ...e, [key]: undefined }))
    }
    setApiError("")
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

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setApiError("")

    try {
      if (variant === "hero") {
        // Submit quote request
        const result = await submitPublicQuote({
          name: values.name,
          phone: values.phone,
          address: values.address,
          postcode: values.postcode,
          service: values.service,
          date: values.date,
          area: area || undefined,
        })
        setQuoteId(result.quote_id || "")
        setDone(true)
      } else {
        // Submit contact message
        await submitContactMessage({
          name: values.name,
          phone: values.phone,
          email: values.email,
          address: values.address,
          message: values.message,
        })
        setDone(true)
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Submission failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-xl border border-line">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="text-lg font-extrabold text-navy mb-2">
          {variant === "hero" ? "Quote request received!" : "Message sent!"}
        </p>
        {quoteId && (
          <p className="text-sm font-bold text-brand mb-2">
            Reference: {quoteId}
          </p>
        )}
        <p className="mt-1 text-sm leading-relaxed text-muted max-w-xs mx-auto">
          {variant === "hero"
            ? `We'll contact you within 24 hours on ${values.phone} to provide your quote.`
            : `We'll respond to your message at ${values.email} within 24 hours.`
          }
        </p>
        <p className="mt-2 text-xs text-muted">
          Or call us now: <a href={`tel:${business.phoneTel}`} className="font-bold text-brand">{business.phoneDisplay}</a>
        </p>
        <button
          type="button"
          className="mt-3 rounded-full bg-brand px-6 py-2.5 text-sm font-extrabold text-white hover:bg-brand-dark transition-colors"
          onClick={() => {
            setDone(false)
            setValues(blank)
            setQuoteId("")
          }}
        >
          {variant === "hero" ? "Request another quote" : "Send another message"}
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
          : "space-y-2"
      }
      noValidate
    >
      {variant === "hero" && (
        <div className="bg-brand px-4 py-3 text-white">
          <h2 className="text-lg font-extrabold">Get a Free Quote</h2>
          {!compact && <p className="mt-1 text-xs text-white/80">Quick, easy, no obligation.</p>}
        </div>
      )}
      <div className={variant === "hero" ? "space-y-2 px-4 py-3" : "space-y-2"}>
        {apiError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {apiError}
          </div>
        )}

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
        {errors.name && <span className="mt-1 block text-xs font-medium text-red-500">{errors.name}</span>}

        <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-2">
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
        {errors.phone && <span className="mt-1 block text-xs font-medium text-red-500">{errors.phone}</span>}

        <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-2">
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
        {errors.address && <span className="mt-1 block text-xs font-medium text-red-500">{errors.address}</span>}

        {variant === "message" && (
          <>
            <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-2">
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
            {errors.email && <span className="mt-1 block text-xs font-medium text-red-500">{errors.email}</span>}
          </>
        )}

        {variant === "hero" && (
          <>
            <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-2">
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldClass}
              placeholder="Enter your postcode"
              value={values.postcode}
              onChange={(event) => set("postcode", event.target.value)}
            />
            {errors.postcode && <span className="mt-1 block text-xs font-medium text-red-500">{errors.postcode}</span>}

            <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-2">
              Waste Type <span className="text-red-500">*</span>
            </label>
            <select
              className={fieldClass}
              value={values.service}
              onChange={(event) => set("service", event.target.value)}
            >
              <option value="">Select waste type</option>
              {services.map((service) => (
                <option key={service.slug} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
            {errors.service && <span className="mt-1 block text-xs font-medium text-red-500">{errors.service}</span>}

            <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-2">
              Collection Date <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldClass}
              type="date"
              value={values.date}
              onChange={(event) => set("date", event.target.value)}
            />
            {errors.date && <span className="mt-1 block text-xs font-medium text-red-500">{errors.date}</span>}
          </>
        )}

        {variant === "message" && (
          <>
            <label className="block text-xs font-bold text-navy flex items-center gap-1.5 mt-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              className={fieldClass}
              rows={4}
              placeholder="What do you need collected?"
              value={values.message}
              onChange={(event) => set("message", event.target.value)}
            />
            {errors.message && <span className="mt-1 block text-xs font-medium text-red-500">{errors.message}</span>}
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`mt-3 w-full rounded-full bg-brand px-6 py-3 text-sm font-extrabold text-white transition-all hover:bg-brand-dark hover:shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <span className="flex items-center justify-center gap-1.5">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                {variant === "hero" ? "Get My Quote →" : "Send Message"}
                <Send className="w-4 h-4" />
              </>
            )}
          </span>
        </button>
        {variant === "hero" && !apiError && (
          <p className="mt-2 text-center text-[11px] text-muted">
            Your details are submitted securely to our server.
          </p>
        )}
      </div>
    </form>
  )
}
