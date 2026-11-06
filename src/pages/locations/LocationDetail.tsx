import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, Clock, Home, Recycle, ShieldCheck } from "lucide-react"
import { Breadcrumb, CTASection, MotionLink, QuoteForm, ScrollReveal, Stagger, Seo, AnimatedIcon } from "@/components"
import { fadeUp, staggerItem, hoverScale, buttonPress, iconPulse } from "@/components/animations"
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
          <Stagger className="space-y-4">
            <Breadcrumb
              items={[
                { label: "Home", to: "/" },
                { label: "Areas", to: "/areas" },
                { label: location.name },
              ]}
            />
            <motion.p variants={staggerItem} className="mt-4 text-sm font-bold text-yellow">Waste Removal in</motion.p>
            <motion.h1 variants={staggerItem} className="mt-1 text-4xl font-extrabold sm:text-5xl">
              {location.name}
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-3 text-lg text-white/90">
              Fast, reliable and affordable waste removal services
            </motion.p>
            <motion.p variants={staggerItem} className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
              {location.focus}
            </motion.p>
            <motion.div variants={staggerItem} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <motion.a {...buttonPress} href="#quote" className="rounded-full bg-yellow px-5 py-3 text-center text-sm font-extrabold text-navy">
                Get a Free Quote →
              </motion.a>
              <motion.a {...buttonPress} href="tel:+447723600218" className="rounded-full border border-white px-5 py-3 text-center text-sm font-extrabold">
                Call 07723 600218
              </motion.a>
            </motion.div>
          </Stagger>
          <ScrollReveal variant={fadeUp} delay={0.15}>
            <QuoteForm area={location.slug} />
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal variant={fadeUp} delay={0.1}>
        <section className="border-b border-line bg-white">
          <div className="wrap grid grid-cols-2 gap-4 py-5 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, label: "Licensed Waste Carrier" },
              { icon: Clock, label: "Same-Day Collection" },
              { icon: Recycle, label: "Eco-Friendly Disposal" },
              { icon: Home, label: "Domestic & Commercial" },
            ].map((item) => (
                <p key={item.label} className="flex items-center gap-2 text-sm font-bold">
                  <AnimatedIcon Component={item.icon} {...iconPulse} className="h-5 w-5 text-brand" /> {item.label}
                </p>
              ))}
          </div>
        </section>
      </ScrollReveal>

      <section className="bg-white py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2">
          <ScrollReveal variant={fadeUp} delay={0.1}>
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
          </ScrollReveal>
          <motion.img {...hoverScale} src={location.image} alt={location.name} className="h-72 w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="bg-soft py-12">
        <div className="wrap">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <h2 className="text-center text-3xl font-extrabold text-navy">Services in {location.name}</h2>
          </ScrollReveal>
          <Stagger className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {services.map((service) => (
              <MotionLink
                key={service.slug}
                variants={staggerItem}
                to={`/services/${service.slug}`}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:shadow-md"
              >
                <motion.img {...hoverScale} src={service.image} alt="" className="h-28 w-full object-cover" />
                <span className="block bg-navy px-3 py-2 text-sm font-bold text-white">{service.homeTitle}</span>
              </MotionLink>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2">
          <ScrollReveal variant={fadeUp} delay={0.1}>
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
          </ScrollReveal>
          <motion.img {...hoverScale} src="/images/van.jpg" alt="Collection crew and van" className="h-64 w-full rounded-3xl object-cover" />
        </div>
          <div className="wrap mt-10">
            <ScrollReveal variant={fadeUp} delay={0.1}>
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-2xl font-extrabold text-navy">Trusted by residents</h2>
                <span className="h-0.5 w-16 rounded-full bg-yellow" />
              </div>
            </ScrollReveal>
            <Stagger className="mt-8 grid gap-4 lg:grid-cols-3">
              {reviews.map((review) => (
                <motion.figure key={review.name} variants={staggerItem} className="relative group rounded-2xl border border-line bg-white p-6 hover:shadow-lg hover:border-brand/50 transition duration-300">
                  <div className="absolute top-4 right-4 text-yellow opacity-20 group-hover:opacity-40 transition-opacity">
                    <span className="text-3xl leading-none">“</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow mb-3">
                    {[1, 2, 3, 4, 5].map(() => (
                      <span key="star" className="h-4 w-4" aria-hidden="true">★</span>
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-ink italic mb-4">
                    {review.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-navy">{review.name}</span>
                    <span className="text-muted">— {review.area}</span>
                  </figcaption>
                </motion.figure>
              ))}
            </Stagger>
          </div>
      </section>

      <ScrollReveal variant={fadeUp} delay={0.1}>
        <CTASection
          title={`Ready to clear your space in ${location.name}?`}
          text="Call or send a quote with your postcode. There is no booking fee on this website."
        />
      </ScrollReveal>
    </>
  )
}
