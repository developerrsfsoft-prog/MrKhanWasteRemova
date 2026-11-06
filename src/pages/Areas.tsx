import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { BadgeCheck, Clock, Phone, Recycle, ShieldCheck, Star, Users } from "lucide-react"
import { CTASection, FAQAccordion, ScrollReveal, Stagger, Seo, AnimatedIcon } from "@/components"
import { fadeUp, staggerItem, hoverScale, buttonPress, iconPulse } from "@/components/animations"
import { faqs, locations, reviews } from "@/data"

const reasons = [
  { icon: ShieldCheck, title: "Licensed Waste Carrier", text: "Domestic and commercial collections." },
  { icon: Clock, title: "Same-Day Collection", text: "When the day’s schedule allows." },
  { icon: BadgeCheck, title: "Affordable Prices", text: "A quote based on the load, not a hidden fee." },
  { icon: Users, title: "Friendly & Professional", text: "A crew that turns up and clears the agreed items." },
  { icon: Recycle, title: "Eco-Friendly Disposal", text: "Recyclable material is separated where it can be." },
  { icon: Star, title: "Straightforward Service", text: "Tell us the waste, the access and the postcode." },
]

export function Areas() {
  return (
    <>
      <Seo
        title="Areas We Cover | Mr Khan Waste Removal London"
        description="Waste removal across Central, North, East, West, South and Greater London. Same-day collection when available."
      />
      <section className="bg-white py-12">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          <Stagger className="space-y-4">
            <motion.p variants={staggerItem} className="text-sm font-bold text-brand">Areas We Cover</motion.p>
            <motion.h1 variants={staggerItem} className="mt-2 text-4xl font-extrabold text-navy sm:text-5xl">
              Waste Removal Across London
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-4 max-w-xl text-muted leading-relaxed">
              We collect rubbish and clear properties in Central, North, East, West and South London, and across Greater London including the outer boroughs and the commuter belt.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-navy">
              <span>6 main areas</span>
              <span>London postcodes</span>
              <span>Same-day collection</span>
            </motion.div>
          </Stagger>
          <div className="grid grid-cols-2 gap-3">
            {locations.slice(0, 4).map((location) => (
              <motion.img
                key={location.slug}
                {...hoverScale}
                src={location.image}
                alt={location.name}
                className="h-28 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-12">
        <div className="wrap">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <h2 className="text-3xl font-extrabold text-navy">Our Location Pages</h2>
            <p className="mt-2 text-muted">Find waste removal services in your area.</p>
          </ScrollReveal>
          <Stagger className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {locations.map((location, index) => (
              <ScrollReveal key={location.slug} variant={fadeUp} delay={index * 0.06}>
                <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="relative h-40">
                    <motion.img {...hoverScale} src={location.image} alt="" className="h-full w-full object-cover" />
                    <h3 className="absolute inset-x-0 bottom-0 bg-navy/85 px-4 py-2 font-extrabold text-white">{location.name}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted">{location.summary}</p>
                    <Link to={`/areas/${location.slug}`} className="mt-3 inline-flex text-sm font-extrabold text-brand">
                      View Page →
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="wrap grid gap-8 lg:grid-cols-2">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <div className="rounded-3xl bg-navy p-6 text-white">
              <h2 className="text-2xl font-extrabold">Why Choose Mr Khan Waste Removal?</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {reasons.map((reason) => (
                    <article key={reason.title} className="rounded-2xl bg-white/10 p-4">
                      <AnimatedIcon Component={reason.icon} {...iconPulse} className="h-5 w-5 text-yellow" />
                      <h3 className="mt-2 font-extrabold">{reason.title}</h3>
                      <p className="mt-1 text-sm text-white/75">{reason.text}</p>
                    </article>
                  ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal variant={fadeUp} delay={0.15}>
            <div>
              <h2 className="text-2xl font-extrabold text-navy">What Our Customers Say</h2>
              <div className="mt-4 space-y-3">
                {reviews.map((review) => (
                  <figure key={review.name} className="rounded-2xl border border-line p-4">
                    <blockquote className="text-sm">{review.quote}</blockquote>
                    <figcaption className="mt-2 text-sm font-bold text-muted">
                      {review.name}, {review.areaPage}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-soft py-12">
        <div className="wrap grid items-start gap-8 lg:grid-cols-2">
          <div>
            <ScrollReveal variant={fadeUp} delay={0.1}>
              <h2 className="text-3xl font-extrabold text-navy">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FAQAccordion items={faqs} />
              </div>
            </ScrollReveal>
          </div>
          <div className="overflow-hidden rounded-3xl bg-navy text-white">
            <motion.img {...hoverScale} src="/images/why-crew.jpg" alt="" className="h-52 w-full object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-extrabold">
                Ready to <span className="text-yellow">clear</span> your space?
              </h2>
              <p className="mt-2 text-sm text-white/80">Get a free quote today for waste removal across London.</p>
              <motion.a {...buttonPress} href="tel:+447723600218" className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow px-4 py-2.5 text-sm font-extrabold text-navy">
                <Phone className="h-4 w-4" /> 07723 600218
              </motion.a>
            </div>
          </div>
        </div>
      </section>
      <ScrollReveal variant={fadeUp} delay={0.1}>
        <CTASection title="Book a collection in your area" text="Send the postcode with the quote so we can confirm the run." />
      </ScrollReveal>
    </>
  )
}
