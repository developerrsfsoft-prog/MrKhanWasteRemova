import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, Clock, Home, Recycle, ShieldCheck } from "lucide-react"
import { Breadcrumb, CTASection, MotionLink, QuoteForm, ScrollReveal, Stagger, Seo, AnimatedIcon } from "@/components"
import { fadeUp, staggerItem, hoverScale, buttonPress, iconPulse } from "@/components/animations"
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
          <Stagger className="space-y-4">
            <Breadcrumb
              items={[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: service.title },
              ]}
            />
            <motion.p variants={staggerItem} className="mt-4 text-sm font-bold text-yellow">Waste removal in London</motion.p>
            <motion.h1 variants={staggerItem} className="mt-2 text-4xl font-extrabold sm:text-5xl">
              {service.title}
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-3 max-w-xl text-lg text-white/85">
              {service.intro}
            </motion.p>
            <motion.p variants={staggerItem} className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
              {service.body}
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
            <QuoteForm />
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
                <p key={item.label} className="flex items-center gap-2 text-sm font-bold text-navy">
                  <AnimatedIcon Component={item.icon} {...iconPulse} className="h-5 w-5 text-brand" />
                  {item.label}
                </p>
              ))}
          </div>
        </section>
      </ScrollReveal>

      <section className="bg-white py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2">
          <ScrollReveal variant={fadeUp} delay={0.1}>
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
          </ScrollReveal>
          <motion.img {...hoverScale} src={service.image} alt="" className="h-72 w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="bg-soft py-12">
        <div className="wrap">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <h2 className="text-center text-3xl font-extrabold text-navy">Other services in London</h2>
          </ScrollReveal>
          <Stagger className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {services
              .filter((item) => item.slug !== service.slug)
              .map((item) => (
                <MotionLink
                  key={item.slug}
                  variants={staggerItem}
                  to={`/services/${item.slug}`}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:shadow-md"
                >
                  <motion.img {...hoverScale} src={item.image} alt="" className="h-28 w-full object-cover" />
                  <p className="px-3 py-3 text-sm font-extrabold text-navy">{item.title}</p>
                </MotionLink>
              ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="wrap rounded-3xl bg-soft px-4 py-8">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <div className="grid gap-6 md:grid-cols-4">
              {howItWorksLong.map((step) => (
                <motion.article key={step.step} variants={staggerItem} className="text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand font-extrabold text-white">
                    {step.step}
                  </span>
                  <h3 className="mt-3 font-extrabold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.text}</p>
                </motion.article>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white pb-12">
        <div className="wrap">
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <h2 className="text-center text-3xl font-extrabold text-navy">Trusted by London Residents</h2>
          </ScrollReveal>
          <Stagger className="mt-6 grid gap-4 lg:grid-cols-3">
            {reviews.map((review) => (
              <motion.figure key={review.name} variants={staggerItem} className="rounded-2xl border border-line p-5">
                <blockquote className="text-sm leading-relaxed">{review.quote}</blockquote>
                <figcaption className="mt-3 text-sm font-bold text-muted">
                  {review.name} — {review.area}
                </figcaption>
              </motion.figure>
            ))}
          </Stagger>
        </div>
      </section>
      <ScrollReveal variant={fadeUp} delay={0.1}>
        <CTASection title={`Need ${service.title.toLowerCase()}?`} text="Tell us the load and your postcode for a free quote." />
      </ScrollReveal>
    </>
  )
}
