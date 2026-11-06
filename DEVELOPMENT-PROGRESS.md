# Development progress

## Done

- Reference folder inspected (txt, desktop screenshots, mobile screenshots). Reference files were not modified.
- Homepage built to `Homepage.png`: blue header, hero, quote form, trust row, service cards, before/after compare, how it works, why choose us, area pills, reviews, FAQ, CTA, footer.
- All 8 service pages and the services index.
- All 6 location pages and the areas index.
- About and Contact.
- Shared header, footer, quote form, FAQ, CTA, breadcrumbs.
- Responsive nav with mobile menu.
- Client-side validation only.
- `npm run build` succeeds.
- **Fixed mobile responsive spacing across all subpages:**
  - `src/index.css` — replaced `.wrap` `width: calc(100% - Nrem)` with robust `width: 100%; max-width: 1180px; padding-inline: 1rem` (16px on small mobile) and `padding-inline: 1.5rem` at min-width: 640px (24px on larger mobile/tablet). Added `box-sizing: border-box` on `html`/`*` and `max-width: 100%` on `img`/`iframe`/`video`/`object`/`embed` to prevent edge overflow. Added `overflow-x: hidden` on `html` as a safety net (removed from `body`). Removed the `overflow-x: hidden` band-aid from `body` (root cause fixed via containers).
  - Every page (Home, About, Contact, Areas, Services, ServiceDetail, LocationDetail, Legal/Privacy/Terms/Sitemap/NotFound) and shared components (Header, Footer, QuoteForm, CTASection, BeforeAfter, ServiceCard, LocationCard, ReviewCard, FAQAccordion) use `.wrap`, so they all inherit consistent left/right spacing with no content touching viewport edges.
- **Fixed mobile responsive spacing across all subpages:**
  - `src/index.css` — replaced `.wrap` `width: calc(100% - Nrem)` with robust `width: 100%; max-width: 1180px; padding-inline: 1rem` (16px on small mobile) and `padding-inline: 1.5rem` at min-width: 640px (24px on larger mobile/tablet). Added `box-sizing: border-box` on `html`/`*` and `max-width: 100%` on `img`/`iframe`/`video`/`object`/`embed` to prevent edge overflow. Removed the `overflow-x: hidden` band-aid on `body` (root cause fixed via containers).
  - Every page (Home, About, Contact, Areas, Services, ServiceDetail, LocationDetail, Legal/Privacy/Terms/Sitemap/NotFound) and shared components (Header, Footer, QuoteForm, CTASection, BeforeAfter, ServiceCard, LocationCard, ReviewCard, FAQAccordion) use `.wrap`, so they all inherit consistent left/right spacing with no content touching viewport edges.
- **Added premium, subtle animations across the site using Framer Motion (already installed):**
  - `src/components/animations.tsx` — shared ScrollReveal, Stagger, MotionLink, hoverLift/hoverScale/buttonPress/iconPulse variants, mobileMenu, accordionContent; professional easing curves; respects prefers-reduced-motion.
  - `src/index.css` — reduced-motion media query disabling transitions/animations.
  - Home: hero fade-up + staggered heading/CTA/form, scroll reveals on sections, cards, reviews, FAQ, CTA; hover lift/scale on cards/images/buttons.
  - ServiceCard/LocationCard/ReviewCard: translateY(-5px) lift + shadow on hover.
  - FAQAccordion: smooth open/close with AnimatePresence.
  - Header: smooth mobile menu open/close, ChevronDown rotate, nav-link underline transitions.
  - BeforeAfter: smooth slider clip-path transition.
  - CTASection: button press/scale on hover.
  - About, Areas, Contact, Services, ServiceDetail, LocationDetail: scroll reveals on headings/cards/reviews/CTAs; button/icon hover polish.

## Not published (not in the reference facts)

- Street address
- Waste carrier registration number
- Fixed prices
- Review counts, years trading, or customer totals
- Social profile URLs

## Routes

- `/`
- `/services`
- `/services/furniture-removal`
- `/services/garden-waste-removal`
- `/services/house-clearance`
- `/services/office-clearance`
- `/services/garage-clearance`
- `/services/loft-clearance`
- `/services/general-rubbish-removal`
- `/services/weee-electrical-waste`
- `/areas`
- `/areas/central-london`
- `/areas/north-london`
- `/areas/east-london`
- `/areas/west-london`
- `/areas/south-london`
- `/areas/greater-london`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/sitemap`
