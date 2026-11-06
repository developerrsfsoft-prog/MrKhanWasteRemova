import { Link } from "react-router-dom"
import { CalendarCheck, Check, Leaf, Recycle, ShieldCheck, Users } from "lucide-react"
import { CTASection, Seo } from "@/components"
import { business, locations } from "@/data"

const values = [
  { icon: ShieldCheck, title: "Reliable Service", text: "We turn up at the agreed time and clear the items we quoted." },
  { icon: CalendarCheck, title: "Clear Pricing", text: "The price is based on the load, access and postcode. No fixed menu of hidden extras." },
  { icon: Recycle, title: "Responsible Disposal", text: "Recyclable waste, including suitable green waste and WEEE, is kept out of general rubbish." },
  { icon: Users, title: "Friendly Team", text: "A straightforward crew for homes, landlords and businesses." },
]

export function About() {
  return (
    <>
      <Seo
        title="About Us | Mr Khan Waste Removal London"
        description="Mr Khan Movers, led by Nasir, provides waste collection and clearance across London. Started in 2026. Call 07723 600218."
      />
      <section className="relative overflow-hidden bg-navy text-white">
        <img src="/images/hero.jpg" alt="" decoding="async" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        <div className="wrap relative py-16">
          <p className="text-sm font-bold text-yellow">About Us</p>
          <h1 className="mt-2 max-w-xl text-4xl font-extrabold sm:text-5xl">London’s trusted waste removal team</h1>
          <p className="mt-4 max-w-xl text-white/85">
            Fast, reliable clearance for homes and businesses across London. {business.legalName} is led by {business.owner}.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact#quote" className="rounded-full bg-yellow px-5 py-3 text-center text-sm font-extrabold text-navy">
              Get a Free Quote →
            </Link>
            <a href={`tel:${business.phoneTel}`} className="rounded-full border border-white px-5 py-3 text-center text-sm font-extrabold">
              Call {business.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="wrap grid gap-4 py-5 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, label: "Fully licensed collections" },
            { icon: CalendarCheck, label: "Same-day collection" },
            { icon: Leaf, label: "Eco-friendly disposal" },
          ].map((item) => (
            <p key={item.label} className="flex items-center justify-center gap-2 text-sm font-bold">
              <item.icon className="h-5 w-5 text-brand" /> {item.label}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold text-navy">Our Story</h2>
            <p className="mt-4 leading-relaxed text-muted">
              {business.legalName} started in {business.started}. The work is simple: collect unwanted waste quickly, quote it clearly, and dispose of it responsibly. {business.owner} runs the service for households, landlords and businesses across London.
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              From a single bulky item to a house, office, garage or loft clearance, the crew collects the agreed load and leaves the space ready for whatever comes next. The phone number for quotes is {business.phoneDisplay}.
            </p>
          </div>
          <img src="/images/why-crew.jpg" alt="The collection van and a member of the crew" className="h-80 w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="bg-soft py-12">
        <div className="wrap">
          <h2 className="text-center text-3xl font-extrabold text-navy">What Matters to Us</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <article key={value.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <value.icon className="h-8 w-8 text-brand" />
                <h3 className="mt-3 font-extrabold text-navy">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-8 text-white">
        <div className="wrap grid gap-6 text-center sm:grid-cols-3">
          <p className="text-xl font-extrabold text-yellow">London-wide coverage</p>
          <p className="text-xl font-extrabold text-yellow">Same-day available</p>
          <p className="text-xl font-extrabold text-yellow">Careful customer service</p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="wrap grid overflow-hidden rounded-3xl bg-[#10284f] text-white lg:grid-cols-2">
          <div className="p-8">
            <h2 className="text-3xl font-extrabold">Why choose Mr Khan?</h2>
            <ul className="mt-5 space-y-3">
              {[
                "Licensed waste carrier collections",
                "Domestic and commercial clearances",
                "Fast and flexible collection times",
                "Careful, tidy and professional",
                "Responsible disposal, with recycling where the material allows",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 text-yellow" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/contact#quote" className="mt-6 inline-flex rounded-full bg-yellow px-5 py-3 text-sm font-extrabold text-navy">
              Get a Free Quote →
            </Link>
          </div>
          <img src="/images/hero-crew.jpg" alt="" className="h-64 w-full object-cover lg:h-auto" />
        </div>
      </section>

      <section className="bg-soft py-12 text-center">
        <div className="wrap">
          <h2 className="text-3xl font-extrabold text-navy">Proud to serve London</h2>
          <p className="mt-2 text-muted">Collections across the city and the surrounding area.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {locations.map((location) => (
              <Link key={location.slug} to={`/areas/${location.slug}`} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold">
                {location.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTASection text="Speak to the team today for a free quote." />
    </>
  )
}
