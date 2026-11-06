import { Link, useParams } from "react-router-dom"
import { Check, Clock, Home, Recycle, ShieldCheck } from "lucide-react"
import { Breadcrumb, CTASection, QuoteForm, Seo } from "@/components"
import { getService, howItWorksLong, reviews, services } from "@/data"

export function ServiceDetail() {
  const { id } = useParams()
  const service = getService(id ?? "")

  if (!service) {
    return (
      <section className="wrap py-20 text-center">
        <h1 className="text-3xl font-extrabold text-navy">Service not found</h1>
        <Link to="/services" className="mt-4 inline-flex text-brand font-bold">
          Back to services
        </Link>
      </section>
    )
  }

  return (
    <>
      <Seo title={service.metaTitle} description={service.metaDescription} />
      <section className="relative overflow-hidden bg-navy text-white">
        <img src="/images/hero-crew.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
        <div className="wrap relative grid items-start gap-8 py-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <Breadcrumb
              items={[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: service.title },
              ]}
            />
            <p className="mt-4 text-sm font-bold text-yellow">Waste removal in London</p>
            <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{service.title}</h1>
            <p className="mt-3 max-w-xl text-lg text-white/85">{service.intro}</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">{service.body}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className="rounded-full bg-yellow px-5 py-3 text-center text-sm font-extrabold text-navy">
                Get a Free Quote →
              </a>
              <a href="tel:+447723600218" className="rounded-full border border-white px-5 py-3 text-center text-sm font-extrabold">
                Call 07723 600218
              </a>
            </div>
          </div>
          <QuoteForm />
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="wrap grid grid-cols-2 gap-4 py-5 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "Licensed Waste Carrier" },
            { icon: Clock, label: "Same-Day Collection" },
            { icon: Recycle, label: "Eco-Friendly Disposal" },
            { icon: Home, label: "Domestic & Commercial" },
          ].map((item) => (
            <p key={item.label} className="flex items-center gap-2 text-sm font-bold text-navy">
              <item.icon className="h-5 w-5 text-brand" />
              {item.label}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold text-brand">About this service</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy">Professional {service.title} across London</h2>
            <p className="mt-4 text-muted leading-relaxed">{service.body}</p>
            <ul className="mt-5 space-y-2">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-sm font-semibold text-navy">
                  <Check className="mt-0.5 h-4 w-4 text-brand" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <img src={service.image} alt="" className="h-72 w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="bg-soft py-12">
        <div className="wrap">
          <h2 className="text-center text-3xl font-extrabold text-navy">Other services in London</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {services
              .filter((item) => item.slug !== service.slug)
              .map((item) => (
                <Link key={item.slug} to={`/services/${item.slug}`} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <img src={item.image} alt="" className="h-28 w-full object-cover" />
                  <p className="px-3 py-3 text-sm font-extrabold text-navy">{item.title}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="wrap rounded-3xl bg-soft px-4 py-8">
          <div className="grid gap-6 md:grid-cols-4">
            {howItWorksLong.map((step) => (
              <article key={step.step} className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand font-extrabold text-white">
                  {step.step}
                </span>
                <h3 className="mt-3 font-extrabold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-12">
        <div className="wrap">
          <h2 className="text-center text-3xl font-extrabold text-navy">Trusted by London Residents</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.name} className="rounded-2xl border border-line p-5">
                <blockquote className="text-sm leading-relaxed">{review.quote}</blockquote>
                <figcaption className="mt-3 text-sm font-bold text-muted">
                  {review.name} — {review.area}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <CTASection title={`Need ${service.title.toLowerCase()}?`} text="Tell us the load and your postcode for a free quote." />
    </>
  )
}
