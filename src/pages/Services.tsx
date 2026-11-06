import { Link } from "react-router-dom"
import { Briefcase, Home, Leaf, Recycle, Sofa, Trash2, Warehouse, Layers } from "lucide-react"
import { CTASection, Seo } from "@/components"
import { howItWorksLong, services } from "@/data"

const icons = [Sofa, Leaf, Home, Briefcase, Warehouse, Layers, Trash2, Recycle]

export function Services() {
  return (
    <>
      <Seo
        title="Waste Removal Services London | Mr Khan Waste Removal"
        description="Furniture removal, garden waste, house and office clearance, garage and loft clearance, rubbish removal and WEEE disposal across London."
      />
      <section className="bg-soft py-14">
        <div className="wrap">
          <p className="text-center text-xs font-extrabold tracking-[0.2em] text-brand">OUR SERVICES</p>
          <h1 className="mt-2 text-center text-4xl font-extrabold text-navy">
            Our Waste Removal <span className="text-brand">Services</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
            Professional, reliable and affordable rubbish clearance for homes and businesses across London.
          </p>
          <p className="mt-3 text-center text-lg font-bold text-brand">No job too big or too small.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => {
              const Icon = icons[index] ?? Trash2
              return (
                <article key={service.slug} className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                  <div className="relative h-40">
                    <img src={service.image} alt="" className="h-full w-full object-cover" />
                    <span className="absolute -bottom-5 left-4 grid h-11 w-11 place-items-center rounded-full bg-yellow text-navy shadow">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="px-4 pb-5 pt-8">
                    <h2 className="text-lg font-extrabold text-navy">{service.title}</h2>
                    <p className="mt-2 min-h-16 text-sm leading-relaxed text-muted">{service.blurb}</p>
                    <Link to={`/services/${service.slug}`} className="mt-3 inline-flex text-sm font-extrabold text-brand">
                      Learn More →
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="wrap grid gap-4 lg:grid-cols-[1fr_.9fr_1fr]">
          <div className="relative h-56 overflow-hidden rounded-2xl">
            <img src="/images/before.jpg" alt="Cluttered space before clearance" className="h-full w-full object-cover" />
            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-extrabold">Before</span>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-navy p-6 text-white">
            <p className="text-yellow">Transforming spaces, improving lives</p>
            <h2 className="mt-2 text-2xl font-extrabold">From cluttered and chaotic to clean and usable.</h2>
            <Link to="/contact#quote" className="mt-5 inline-flex w-fit rounded-full bg-yellow px-4 py-2.5 text-sm font-extrabold text-navy">
              Book Your Clearance →
            </Link>
          </div>
          <div className="relative h-56 overflow-hidden rounded-2xl">
            <img src="/images/after.jpg" alt="Clear space after the collection" className="h-full w-full object-cover" />
            <span className="absolute right-3 top-3 rounded-full bg-yellow px-3 py-1 text-xs font-extrabold text-navy">After</span>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="wrap">
          <h2 className="text-center text-3xl font-extrabold text-navy">How It Works</h2>
          <p className="mt-2 text-center text-muted">Getting your waste removed is quick, easy and hassle-free.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {howItWorksLong.map((step) => (
              <article key={step.step} className="text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-lg font-extrabold text-white">
                  {step.step}
                </span>
                <h3 className="mt-3 font-extrabold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-6">
        <div className="wrap overflow-hidden rounded-3xl bg-brand text-white lg:grid lg:grid-cols-[1.1fr_.9fr]">
          <div className="p-8 sm:p-10">
            <h2 className="text-3xl font-extrabold">Ready to clear your space?</h2>
            <p className="mt-2 max-w-md text-white/85">
              Get a free quote today and enjoy fast, reliable waste removal across London.
            </p>
            <Link to="/contact#quote" className="mt-6 inline-flex rounded-full bg-yellow px-5 py-3 text-sm font-extrabold text-navy">
              Get Free Quote →
            </Link>
          </div>
          <img src="/images/why-crew.jpg" alt="Crew member beside the collection van" className="h-56 w-full object-cover lg:h-full" />
        </div>
      </section>
      <CTASection />
    </>
  )
}
