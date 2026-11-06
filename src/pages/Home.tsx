import { Link } from "react-router-dom"
import { Clock, House, Leaf, ShieldCheck } from "lucide-react"
import { BeforeAfter, CTASection, FAQAccordion, QuoteForm, Seo } from "@/components"
import { business, faqs, homeServiceOrder, howItWorksHome, locations, reviews, services } from "@/data"

const trust = [
  { icon: ShieldCheck, title: "Licensed", detail: "Waste Carrier" },
  { icon: Clock, title: "Same-Day Collection", detail: "Available" },
  { icon: Leaf, title: "Eco-Friendly", detail: "Disposal" },
  { icon: House, title: "Domestic &", detail: "Commercial" },
]

const reasons = [
  "Fast & Reliable Service",
  "Affordable Prices",
  "Fully Licensed & Insured",
  "Friendly & Professional Team",
]

export function Home() {
  const cards = homeServiceOrder.map((slug) => services.find((service) => service.slug === slug)!)

  return (
    <>
      <Seo
        title="Waste Removal London | Mr Khan Waste Removal"
        description="Fast, reliable waste removal across London. Furniture, garden waste, house clearance and rubbish collection. Call 07723 600218 for a free quote."
      />

      <section className="relative overflow-hidden bg-[#102033] text-white">
        <img
          src="/images/hero.jpg"
          alt=""
          width={1600}
          height={1067}
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111f] via-[#07111f]/80 to-[#07111f]/25" />
        <div className="wrap relative grid items-center gap-8 py-10 lg:grid-cols-[1.15fr_.82fr] lg:py-14">
          <div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Fast, Reliable
              <span className="block">Waste Removal</span>
              <span className="mt-1 block text-yellow">Across London</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-white/85 sm:text-lg">
              Domestic and commercial rubbish clearance – quick, affordable and hassle-free.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className="rounded-full bg-yellow px-5 py-3 text-center text-sm font-extrabold text-navy">
                Get a Free Quote →
              </a>
              <a
                href={`tel:${business.phoneTel}`}
                className="rounded-full border border-white/70 px-5 py-3 text-center text-sm font-extrabold"
              >
                Call {business.phoneDisplay}
              </a>
            </div>
          </div>
          <QuoteForm />
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="wrap grid grid-cols-2 gap-4 py-5 lg:grid-cols-4">
          {trust.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <item.icon className="h-8 w-8 shrink-0 text-brand" />
              <p className="text-sm font-extrabold leading-tight text-navy">
                {item.title}
                <span className="block font-semibold text-muted">{item.detail}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="wrap">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-navy">Our Waste Removal Services</h2>
            <p className="mt-2 text-muted">No job is too big or small. We handle all types of waste removal.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="group relative h-44 overflow-hidden rounded-2xl"
              >
                <img src={service.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <h3 className="absolute inset-x-3 bottom-3 text-center text-sm font-extrabold text-white">
                  {service.homeTitle}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BeforeAfter />

      <section className="bg-white py-14">
        <div className="wrap">
          <h2 className="text-center text-3xl font-extrabold text-navy">How It Works</h2>
          <div className="mx-auto mt-2 h-1 w-16 rounded bg-brand" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {howItWorksHome.map((step, index) => (
              <div key={step.step} className="relative flex items-center gap-4 rounded-2xl bg-soft px-4 py-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-sm font-extrabold text-white">
                  {step.step}
                </span>
                <p className="font-extrabold text-navy">{step.title}</p>
                {index < howItWorksHome.length - 1 && (
                  <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-brand md:block">›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="wrap">
          <div className="grid overflow-hidden rounded-3xl bg-navy lg:grid-cols-2">
            <div className="p-8 text-white sm:p-10">
              <h2 className="text-3xl font-extrabold leading-tight">Why Choose Mr Khan Waste Removal?</h2>
              <ul className="mt-6 space-y-3">
                {reasons.map((reason) => (
                  <li key={reason} className="flex items-center gap-3 font-semibold">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-yellow text-sm text-navy">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
              <Link to="/contact#quote" className="mt-8 inline-flex rounded-full bg-yellow px-5 py-3 text-sm font-extrabold text-navy">
                Get a Free Quote →
              </Link>
            </div>
            <img src="/images/van.jpg" alt="Household items packed and ready for collection" loading="lazy" decoding="async" className="h-64 w-full object-cover lg:h-full" />
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="wrap text-center">
          <h2 className="text-3xl font-extrabold text-navy">Areas We Cover</h2>
          <p className="mt-2 text-muted">We provide waste removal services across London and surrounding areas.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {locations.map((location) => (
              <Link
                key={location.slug}
                to={`/areas/${location.slug}`}
                className="rounded-full border border-line px-4 py-2 text-sm font-bold text-navy hover:border-brand hover:bg-brand hover:text-white"
              >
                {location.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="bg-soft py-14">
        <div className="wrap">
          <h2 className="text-center text-3xl font-extrabold text-navy">What Our Customers Say</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.name} className="rounded-2xl border border-line bg-white p-5">
                <span className="text-4xl leading-none text-brand">“</span>
                <blockquote className="mt-2 text-sm leading-relaxed text-ink">{review.quote}</blockquote>
                <figcaption className="mt-4 text-sm font-bold text-muted">— {review.name}, {review.area}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <img
            src="/images/bins.webp"
            alt="Wheelie bins lined up for collection"
            loading="lazy"
            decoding="async"
            className="h-56 w-full rounded-3xl object-cover sm:h-72"
          />
          <div>
            <h2 className="mb-4 text-3xl font-extrabold text-navy">Frequently Asked Questions</h2>
            <FAQAccordion items={faqs.slice(0, 4)} />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
