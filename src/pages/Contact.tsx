import { motion } from "framer-motion"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { CTASection, MotionLink, QuoteForm, ScrollReveal, Stagger, Seo } from "@/components"
import { fadeUp, staggerItem, buttonPress, iconPulse } from "@/components/animations"
import { business, locations } from "@/data"

const cards = [
  {
    icon: Phone,
    title: "Call now",
    text: business.phoneDisplay,
    href: `tel:${business.phoneTel}`,
  },
  {
    icon: Mail,
    title: "Email",
    text: business.email,
    href: `mailto:${business.email}`,
  },
  {
    icon: MapPin,
    title: "Area",
    text: business.area,
  },
  {
    icon: Clock,
    title: "Hours",
    text: business.hours,
  },
]

export function Contact() {
  return (
    <>
      <Seo
        title="Contact Us | Mr Khan Waste Removal London"
        description="Call 07723 600218 or email info@mrkhanwasteremovallondon.co.uk for a waste removal quote in London."
      />
      <section className="relative overflow-hidden bg-navy text-white">
        <img src="/images/hero-crew.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        <div className="wrap relative py-16">
          <Stagger className="space-y-4">
            <motion.p variants={staggerItem} className="text-sm font-bold text-yellow">Contact</motion.p>
            <motion.h1 variants={staggerItem} className="mt-2 max-w-xl text-4xl font-extrabold">
              Get a quote from Mr Khan Waste Removal
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-4 max-w-xl text-white/85">
              Call, email, or use the form. The form checks your details in the browser and does not send them to a server.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <motion.a {...buttonPress} href="#quote" className="rounded-full bg-yellow px-5 py-3 text-center text-sm font-extrabold text-navy">
                Get a Free Quote →
              </motion.a>
              <motion.a {...buttonPress} href={`tel:${business.phoneTel}`} className="rounded-full border border-white px-5 py-3 text-center text-sm font-extrabold">
                Call {business.phoneDisplay}
              </motion.a>
            </motion.div>
          </Stagger>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="wrap grid items-start gap-8 lg:grid-cols-2">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <div>
              <h2 className="text-3xl font-extrabold text-navy">Contact us</h2>
              <p className="mt-3 leading-relaxed text-muted">
                {business.legalName} collects waste across London. {business.owner} is the primary contact. A street address was not supplied, so the base is listed as {business.area}.
              </p>
              <ul className="mt-6 space-y-4">
                {cards.map((card) => {
                  const MotionIcon = motion(card.icon)
                  return (
                    <li key={card.title} className="flex items-start gap-3">
                      <MotionIcon {...iconPulse} className="mt-0.5 h-5 w-5 text-brand" />
                      <div>
                        <p className="text-sm font-extrabold">{card.title}</p>
                        {card.href ? (
                          <a href={card.href} className="text-sm text-brand">
                            {card.text}
                          </a>
                        ) : (
                          <p className="text-sm text-muted">{card.text}</p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </ScrollReveal>
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-line">
            <iframe
              title="Map of London"
              className="absolute inset-0 h-full w-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-0.55%2C51.28%2C0.35%2C51.70&layer=mapnik"
            />
            <div className="absolute inset-x-4 bottom-4 top-auto rounded-2xl bg-white p-4 shadow-xl sm:inset-x-auto sm:right-4 sm:top-4 sm:w-80">
              <p className="mb-2 text-sm font-extrabold text-navy">Send a message</p>
              <QuoteForm variant="message" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-soft py-12">
        <div className="wrap">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <h2 className="text-center text-3xl font-extrabold text-navy">Get in touch</h2>
          </ScrollReveal>
          <Stagger className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const MotionIcon = motion(card.icon)
              return (
                <motion.article key={card.title} variants={staggerItem} className="rounded-2xl bg-white p-5 text-center shadow-sm">
                  <MotionIcon {...iconPulse} className="mx-auto h-7 w-7 text-brand" />
                  <h3 className="mt-3 font-extrabold">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted">{card.text}</p>
                </motion.article>
              )
            })}
          </Stagger>
        </div>
      </section>

      <section className="bg-white py-10 text-center">
        <ScrollReveal variant={fadeUp} delay={0.1}>
          <div className="wrap">
            <h2 className="text-2xl font-extrabold">Where we collect</h2>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {locations.map((location) => (
                <MotionLink
                  key={location.slug}
                  {...buttonPress}
                  to={`/areas/${location.slug}`}
                  className="rounded-full border border-line px-4 py-2 text-sm font-bold hover:border-brand hover:bg-brand hover:text-navy"
                >
                  {location.name}
                </MotionLink>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>
      <ScrollReveal variant={fadeUp} delay={0.1}>
        <CTASection text="Call the team or leave your details for a quote." />
      </ScrollReveal>
    </>
  )
}
