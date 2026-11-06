import { useEffect, useState, type ReactNode } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { ChevronDown, Mail, MapPin, Menu, Phone, Star, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { business, locations, services } from "@/data"
import { Logo } from "./Logo"
import { mobileMenu } from "./animations"

function DesktopMenu({
  label,
  children,
  light,
}: {
  label: string
  children: ReactNode
  light: boolean
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className={`inline-flex items-center gap-1 text-sm font-semibold ${light ? "text-white" : "text-ink"}`}
      >
        {label}
        <ChevronDown className="h-4 w-4 transition duration-300" />
      </button>
      <div className="invisible absolute left-0 top-full z-40 w-64 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-2xl border border-line bg-white p-2 text-ink shadow-xl">{children}</div>
      </div>
    </div>
  )
}

export function Header() {
  const { pathname } = useLocation()
  const home = pathname === "/"
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState<"services" | "areas" | null>(null)

  useEffect(() => {
    setOpen(false)
    setPanel(null)
  }, [pathname])

  const link = home
    ? "text-sm font-semibold text-white/95 hover:text-white"
    : "text-sm font-semibold text-ink hover:text-brand"

  return (
    <header className="z-50 lg:sticky lg:top-0">
      <div className="hidden border-b border-line bg-white text-xs text-muted lg:block">
          <div className="wrap flex items-center justify-between py-2">
            <div className="flex items-center gap-5">
              <a href={`tel:${business.phoneTel}`} className="inline-flex items-center gap-1.5 font-semibold text-ink">
                <Phone className="h-3.5 w-3.5 text-brand" />
                {business.phoneDisplay}
              </a>
              <a href={`mailto:${business.email}`} className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-brand" />
                {business.email}
              </a>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand" />
                {business.area}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 font-semibold text-ink">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-3.5 w-3.5 fill-yellow text-yellow" />
              ))}
              Waste Removal Service
            </span>
          </div>
        </div>

      <div className={home ? "bg-brand shadow-sm" : "border-b border-line bg-white"}>
        <div className="wrap flex h-[72px] items-center justify-between gap-4">
          <Logo light={home} />
          <nav className="hidden items-center gap-6 lg:flex">
            <NavLink to="/" className={`${link} transition-colors duration-300 border-b-2 border-transparent hover:border-current pb-1`}>
              Home
            </NavLink>
            <DesktopMenu label="Services" light={home}>
              {services.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-soft hover:text-brand"
                >
                  {service.navTitle}
                </Link>
              ))}
              <Link to="/services" className="block rounded-lg px-3 py-2 text-sm font-bold text-brand">
                All services
              </Link>
            </DesktopMenu>
            <NavLink to="/about" className={`${link} transition-colors duration-300 border-b-2 border-transparent hover:border-current pb-1`}>
              About
            </NavLink>
            <DesktopMenu label="Areas We Cover" light={home}>
              {locations.map((location) => (
                <Link
                  key={location.slug}
                  to={`/areas/${location.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-soft hover:text-brand"
                >
                  {location.name}
                </Link>
              ))}
              <Link to="/areas" className="block rounded-lg px-3 py-2 text-sm font-bold text-brand">
                All areas
              </Link>
            </DesktopMenu>
            <NavLink to="/contact" className={`${link} transition-colors duration-300 border-b-2 border-transparent hover:border-current pb-1`}>
              Contact
            </NavLink>
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {!home && (
              <Link
                to="/contact#quote"
                className="rounded-full bg-yellow px-4 py-2.5 text-sm font-extrabold text-navy"
              >
                Get Quote →
              </Link>
            )}
            <a
              href={`tel:${business.phoneTel}`}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold ${
                home ? "bg-yellow text-navy" : "bg-brand text-white"
              }`}
            >
              <Phone className="h-4 w-4" />
              {home ? "Call Now" : "Call Now"}
            </a>
          </div>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${
              home ? "bg-white/15 text-white" : "bg-soft text-ink"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            variants={mobileMenu}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-white/30 bg-white/40 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-2 px-4 py-4">
              <a
                href={`tel:${business.phoneTel}`}
                className="flex items-center justify-center gap-2 rounded-full bg-yellow py-3 text-sm font-extrabold text-navy"
              >
                <Phone className="h-4 w-4" />
                {business.phoneDisplay}
              </a>
              <Link to="/contact#quote" className="block rounded-full bg-brand py-3 text-center text-sm font-extrabold text-white">
                Get a Free Quote
              </Link>
              <Link to="/" className="block py-3 font-bold text-navy">
                Home
              </Link>
              <button type="button" className="flex w-full items-center justify-between py-3 font-bold text-navy" onClick={() => setPanel(panel === "services" ? null : "services")}>
                Services <ChevronDown className={`h-4 w-4 transition duration-300 text-brand ${panel === "services" ? "rotate-180" : ""}`} />
              </button>
              {panel === "services" && (
                <>
                  {services.map((service) => (
                    <Link key={service.slug} to={`/services/${service.slug}`} className="block py-2 pl-3 text-sm text-ink">
                      {service.navTitle}
                    </Link>
                  ))}
                  <Link to="/services" className="block py-2 pl-3 text-sm font-bold text-brand">
                    All services
                  </Link>
                </>
              )}
              <Link to="/about" className="block py-3 font-bold text-navy">
                About
              </Link>
              <button type="button" className="flex w-full items-center justify-between py-3 font-bold text-navy" onClick={() => setPanel(panel === "areas" ? null : "areas")}>
                Areas We Cover <ChevronDown className={`h-4 w-4 transition duration-300 text-brand ${panel === "areas" ? "rotate-180" : ""}`} />
              </button>
              {panel === "areas" && (
                <>
                  {locations.map((location) => (
                    <Link key={location.slug} to={`/areas/${location.slug}`} className="block py-2 pl-3 text-sm text-ink">
                      {location.name}
                    </Link>
                  ))}
                  <Link to="/areas" className="block py-2 pl-3 text-sm font-bold text-brand">
                    All areas
                  </Link>
                </>
              )}
              <Link to="/contact" className="block py-3 font-bold text-navy">
                Contact
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
