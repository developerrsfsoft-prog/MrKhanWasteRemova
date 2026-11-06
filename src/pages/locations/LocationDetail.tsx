import { Link, useParams } from "react-router-dom"
import { Check, Clock, Home, Recycle, ShieldCheck } from "lucide-react"
import { Breadcrumb, CTASection, QuoteForm, Seo } from "@/components"
import { getLocation, reviews, services } from "@/data"

export function LocationDetail() {
  const { id } = useParams()
  const location = getLocation(id ?? "")

  if (!location) {
    return (
      <section className="wrap py-20 text-center">
        <h1 className="text-3xl font-extrabold">Area not found</h1>
        <Link to="/areas" className="mt-4 inline-flex font-bold text-brand">All areas</Link>
      </section>
    )
  }

  return (
    <>
      <Seo title={location.metaTitle} description={location.metaDescription} />
      <section className="relative bg-navy text-white">
        <img src={location.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/35" />
        <div className="wrap relative grid items-start gap-8 py-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <Breadcrumb
              items={[
                { label: "Home", to: "/" },
                { label: "Areas", to: "/areas" },
                { label: location.name },
              ]}
            />
            <p className="mt-4 text-sm font-bold text-yellow">Waste Removal in</p>
            <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">{location.name}</h1>
            <p className="mt-3 text-lg text-white/90">Fast, reliable and affordable waste removal services</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">{location.focus}</p>
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
            <p key={item.label} className="flex items-center gap-2 text-sm font-bold">
              <item.icon className="h-5 w-5 text-brand" /> {item.label}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold text-brand">About waste removal in {location.name}</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy">Professional waste removal across {location.name}</h2>
            <p className="mt-4 leading-relaxed text-muted">{location.detail}</p>
            <ul className="mt-5 space-y-2">
              {location.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm font-semibold">
                  <Check className="mt-0.5 h-4 w-4 text-brand" />
                  {point}
                </li>
              ))}
            </ul>
            <Link to="/contact#quote" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white">
              Book Your Collection →
            </Link>
          </div>
          <img src={location.image} alt={location.name} className="h-72 w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="bg-soft py-12">
        <div className="wrap">
          <h2 className="text-center text-3xl font-extrabold text-navy">Services in {location.name}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {services.map((service) => (
              <Link key={service.slug} to={`/services/${service.slug}`} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <img src={service.image} alt="" className="h-28 w-full object-cover" />
                <span className="block bg-navy px-3 py-2 text-sm font-bold text-white">{service.homeTitle}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold text-navy">Your local waste removal team</h2>
            <p className="mt-3 text-muted">
              Mr Khan Waste Removal, run by Nasir, collects across {location.name}. {location.focus}
            </p>
            <ul className="mt-4 space-y-2 text-sm font-semibold">
              <li>Local collections across {location.name}</li>
              <li>Affordable prices quoted per job</li>
              <li>Insured domestic and commercial work</li>
              <li>Fast response when the diary allows</li>
            </ul>
          </div>
          <img src="/images/why-crew.jpg" alt="Collection crew and van" className="h-64 w-full rounded-3xl object-cover" />
        </div>
        <div className="wrap mt-10">
          <h2 className="text-center text-2xl font-extrabold">Trusted by residents</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.name} className="rounded-2xl border border-line p-4">
                <blockquote className="text-sm">{review.quote}</blockquote>
                <figcaption className="mt-2 text-sm font-bold text-muted">{review.name}, {review.area}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`Ready to clear your space in ${location.name}?`}
        text="Call or send a quote with your postcode. There is no booking fee on this website."
      />
    </>
  )
}
