import { Link } from "react-router-dom"
import { Seo } from "@/components"
import { business, locations, services } from "@/data"

export function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy | Mr Khan Waste Removal" description="How this website handles quote form details." />
      <article className="wrap max-w-3xl py-14">
        <h1 className="text-4xl font-extrabold text-navy">Privacy Policy</h1>
        <p className="mt-4 leading-relaxed text-muted">
          Quote and contact forms on this site run in your browser. They do not send your details to a server, database or email inbox. If you call {business.phoneDisplay} or email {business.email}, that contact is handled directly by {business.legalName}.
        </p>
      </article>
    </>
  )
}

export function Terms() {
  return (
    <>
      <Seo title="Terms & Conditions | Mr Khan Waste Removal" description="Website terms for Mr Khan Waste Removal." />
      <article className="wrap max-w-3xl py-14">
        <h1 className="text-4xl font-extrabold text-navy">Terms & Conditions</h1>
        <p className="mt-4 leading-relaxed text-muted">
          This website describes waste collection services offered by {business.legalName} across {business.area}. A collection is only agreed once you have a quote and confirm the job by phone or email. Prices are not listed because they depend on the waste, access and postcode.
        </p>
      </article>
    </>
  )
}

export function SitemapPage() {
  return (
    <>
      <Seo title="Sitemap | Mr Khan Waste Removal" description="All pages on the Mr Khan Waste Removal website." />
      <section className="wrap py-14">
        <h1 className="text-4xl font-extrabold text-navy">Sitemap</h1>
        <ul className="mt-6 space-y-2">
          <li><Link to="/" className="font-semibold text-brand">Home</Link></li>
          <li><Link to="/about" className="font-semibold text-brand">About</Link></li>
          <li><Link to="/services" className="font-semibold text-brand">Services</Link></li>
          {services.map((service) => (
            <li key={service.slug} className="pl-4">
              <Link to={`/services/${service.slug}`} className="text-brand">{service.title}</Link>
            </li>
          ))}
          <li><Link to="/areas" className="font-semibold text-brand">Areas</Link></li>
          {locations.map((location) => (
            <li key={location.slug} className="pl-4">
              <Link to={`/areas/${location.slug}`} className="text-brand">{location.name}</Link>
            </li>
          ))}
          <li><Link to="/contact" className="font-semibold text-brand">Contact</Link></li>
        </ul>
      </section>
    </>
  )
}

export function NotFound() {
  return (
    <section className="wrap py-20 text-center">
      <Seo title="Page not found | Mr Khan Waste Removal" description="This page is not on the Mr Khan Waste Removal website." />
      <h1 className="text-4xl font-extrabold">Page not found</h1>
      <Link to="/" className="mt-4 inline-flex font-bold text-brand">Back home</Link>
    </section>
  )
}
