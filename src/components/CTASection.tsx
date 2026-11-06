import { Link } from "react-router-dom"
import { Phone } from "lucide-react"
import { business } from "@/data"

export function CTASection({
  title,
  text = "Get in touch today for a free quote or call us.",
}: {
  title?: string
  text?: string
}) {
  return (
    <section className="pb-14">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-8 text-white shadow-lg sm:px-10">
          <svg
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-white/15"
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M0 80V48h40l20-28 18 28h30l16-36 22 36h50l14-22 16 22h80l24-40 20 40h70l18-30 16 30h90l12-18 14 18h120l20-32 18 32h80l22-26 20 26h160l18-24 16 24h90V80H0Z"
            />
          </svg>
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                {title ?? (
                  <>
                    Ready to <span className="text-yellow">clear</span> your space?
                  </>
                )}
              </h2>
              <p className="mt-1 text-sm text-white/85">{text}</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href={`tel:${business.phoneTel}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#12315f] px-5 py-3 text-sm font-extrabold"
              >
                <Phone className="h-4 w-4" />
                Call {business.phoneDisplay}
              </a>
              <Link
                to="/contact#quote"
                className="inline-flex items-center justify-center rounded-full bg-yellow px-5 py-3 text-sm font-extrabold text-navy"
              >
                Get a Free Quote →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
