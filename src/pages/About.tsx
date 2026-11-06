import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { CalendarCheck, Check, Leaf, Recycle, ShieldCheck, Users } from "lucide-react"
import { CTASection, MotionLink, ScrollReveal, Stagger, Seo } from "@/components"
import { fadeUp, staggerItem, hoverScale, buttonPress, iconPulse } from "@/components/animations"
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
          <Stagger className="space-y-4">
            <motion.p variants={staggerItem} className="text-sm font-bold text-yellow">About Us</motion.p>
            <motion.h1 variants={staggerItem} className="mt-2 max-w-xl text-4xl font-extrabold sm:text-5xl">
              London’s trusted waste removal team
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-4 max-w-xl text-white/85">
              Fast, reliable clearance for homes and businesses across London. {business.legalName} is led by {business.owner}.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <MotionLink {...buttonPress} to="/contact#quote" className="rounded-full bg-yellow px-5 py-3 text-center text-sm font-extrabold text-navy">
                Get a Free Quote →
              </MotionLink>
              <motion.a {...buttonPress} href={`tel:${business.phoneTel}`} className="rounded-full border border-white px-5 py-3 text-center text-sm font-extrabold">
                Call {business.phoneDisplay}
              </motion.a>
            </motion.div>
          </Stagger>
        </div>
      </section>

      <ScrollReveal variant={fadeUp} delay={0.1}>
        <section className="border-b border-line bg-white">
          <div className="wrap grid gap-4 py-5 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: "Fully licensed collections" },
              { icon: CalendarCheck, label: "Same-day collection" },
              { icon: Leaf, label: "Eco-friendly disposal" },
            ].map((item) => {
              const MotionIcon = motion(item.icon)
              return (
                <p key={item.label} className="flex items-center justify-center gap-2 text-sm font-bold">
                  <MotionIcon {...iconPulse} className="h-5 w-5 text-brand" /> {item.label}
                </p>
              )
            })}
          </div>
        </section>
      </ScrollReveal>

      <section className="bg-white py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <div>
              <h2 className="text-3xl font-extrabold text-navy">Our Story</h2>
              <p className="mt-4 leading-relaxed text-muted">
                {business.legalName} started in {business.started}. The work is simple: collect unwanted waste quickly, quote it clearly, and dispose of it responsibly. {business.owner} runs the service for households, landlords and businesses across London.
              </p>
              <p className="mt-3 leading-relaxed text-muted">
                From a single bulky item to a house, office, garage or loft clearance, the crew collects the agreed load and leaves the space ready for whatever comes next. The phone number for quotes is {business.phoneDisplay}.
              </p>
            </div>
          </ScrollReveal>
          <motion.img {...hoverScale} src="/images/why-crew.jpg" alt="The collection van and a member of the crew" className="h-80 w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="bg-soft py-12">
        <div className="wrap">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <h2 className="text-center text-3xl font-extrabold text-navy">What Matters to Us</h2>
          </ScrollReveal>
          <Stagger className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <motion.article key={value.title} variants={staggerItem} className="rounded-2xl bg-white p-5 shadow-sm">
                <value.icon className="h-8 w-8 text-brand" />
                <h3 className="mt-3 font-extrabold text-navy">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{value.text}</p>
              </motion.article>
            ))}
          </Stagger>
        </div>
      </section>

      <ScrollReveal variant={fadeUp} delay={0.1}>
        <section className="bg-navy py-8 text-white">
          <div className="wrap grid gap-6 text-center sm:grid-cols-3">
            <p className="text-xl font-extrabold text-yellow">London-wide coverage</p>
            <p className="text-xl font-extrabold text-yellow">Same-day available</p>
            <p className="text-xl font-extrabold text-yellow">Careful customer service</p>
          </div>
        </section>
      </ScrollReveal>

      <section className="bg-white py-12">
        <div className="wrap grid overflow-hidden rounded-3xl bg-[#10284f] text-white lg:grid-cols-2">
          <ScrollReveal variant={fadeUp} delay={0.1}>
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
          </ScrollReveal>
          <motion.img {...hoverScale} src="/images/hero-crew.jpg" alt="" className="h-64 w-full object-cover lg:h-auto" />
        </div>
      </section>

      <section className="bg-soft py-12 text-center">
        <div className="wrap">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <h2 className="text-3xl font-extrabold text-navy">Proud to serve London</h2>
            <p className="mt-2 text-muted">Collections across the city and the surrounding area.</p>
          </ScrollReveal>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {locations.map((location) => (
              <MotionLink
                key={location.slug}
                {...buttonPress}
                to={`/areas/${location.slug}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold hover:border-brand hover:bg-brand hover:text-navy"
              >
                {location.name}
              </MotionLink>
            ))}
          </div>
        </div>
      </section>
      <ScrollReveal variant={fadeUp} delay={0.1}>
        <CTASection text="Speak to the team today for a free quote." />
      </ScrollReveal>
    </>
  )
}
