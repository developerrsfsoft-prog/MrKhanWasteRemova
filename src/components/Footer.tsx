import { Link } from "react-router-dom"
import { Mail, MapPin, Phone } from "lucide-react"
import { business, locations, services } from "@/data"
import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="bg-[#071833] text-white">
      <div className="wrap grid gap-10 py-12 text-center sm:text-left md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Logo light />
          <p className="mt-0 max-w-xs text-sm leading-relaxed text-white/70">
            Fast, reliable waste removal for homes and businesses across London.
          </p>
          <p className="mt-0 text-sm font-semibold text-white/80">Fast. Reliable. Responsible.</p>
        </div>
        <div>
          <h2 className="text-sm font-extrabold">Quick Links</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/areas" className="hover:text-white">Areas We Cover</Link></li>
            <li><Link to="/#reviews" className="hover:text-white">Reviews</Link></li>
            <li><Link to="/#faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-extrabold">Our Services</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`} className="hover:text-white">
                  {service.navTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-extrabold">Get in Touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li>
              <a href={`tel:${business.phoneTel}`} className="inline-flex items-start gap-2 hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 text-yellow" />
                {business.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="inline-flex items-start gap-2 hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 text-yellow" />
                {business.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-yellow" />
              {business.area}
            </li>
            <li>{business.hours}</li>
          </ul>
          <div className="mt-5 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 19a5 5 0 0 1 1-9.9A6 6 0 0 1 20 11a4 4 0 0 1-1 7.9H7Z" />
                <path d="M12 12v6M9.5 15.5 12 18l2.5-2.5" />
              </svg>
            </span>
            <p className="text-sm font-bold leading-snug">
              A Cleaner London
              <span className="block font-medium text-white/70">A Greener Tomorrow</span>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center gap-3 py-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} {business.legalName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
        <p className="wrap pb-4 text-xs text-white/40">
          Areas: {locations.map((location) => location.name).join(" · ")}
        </p>
      </div>
    </footer>
  )
}
