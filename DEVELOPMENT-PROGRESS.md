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
- **Fixed blurry/dotted/pixelated typography across the site:**
  - `src/index.css` — added `-webkit-text-size-adjust: 100%` and `text-size-adjust: 100%` on `html`; added `font-weight: 400`, `text-rendering: optimizeLegibility`, `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, and `font-synthesis: none` on `body`. This prevents Chrome from synthesizing bold weights (which causes grainy/dotted text on high-DPI screens) and ensures sharp, natural font rendering across all browsers.
  - Font `Plus Jakarta Sans` (weights 400–800) loads correctly from Google Fonts via `index.html` with `display=swap`; no font files missing, no duplicate imports.
- **Fixed footer column overlapping on desktop/web screens:**
  - `src/components/Footer.tsx` — removed `sm:flex-row sm:items-start sm:gap-4` from first column so Logo + text stack vertically instead of side-by-side (was overflowing narrow grid columns); added `min-w-0` to all 4 grid columns so flex content can shrink properly instead of overflowing into adjacent columns; footer now uses clean `lg:grid-cols-4` with consistent `gap-10` spacing on desktop (1024px+).
- **Redesigned QuoteForm for premium/decent/attractive look:**
  - `src/components/QuoteForm.tsx` — added icon accents (User, Phone, MapPin, Mail, Send) next to field labels; upgraded field styling with rounded-xl borders, focus:ring-2 brand accent, and hover states; submit button now has gradient-scale hover effect with Send icon; done state shows Send icon card with premium typography; improved spacing, error message styling, and overall visual polish while preserving brand colours (blue, navy, white, yellow).
- **Made admin dashboard + all admin sub-pages mobile responsive:**
  - `src/pages/AdminDashboard.tsx` — mobile slide-out sidebar drawer (hamburger toggle + backdrop overlay) on `<lg`, responsive stat-card grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), responsive Quote Completion inner grid, horizontally scrollable Recent Activity table (`overflow-x-auto` + `min-w`).
  - `src/pages/AdminPages.tsx` — same mobile drawer pattern on `AdminSidebar` + `AdminHeader` (shared across Quotes/Collections/Customers/SMTP/Settings), hamburger toggle wired to `setMobileOpen`, responsive stat-card grid on AdminSmtp, responsive 2-col grid on AdminSettings, all tables scrollable on mobile (`overflow-x-auto` + `min-w`).
  - `src/pages/AdminLogin.tsx` (new) — admin login page matching existing site design (blue/navy/white/yellow brand colours), with email + password fields, client-side validation, premium submit button with ShieldCheck icon, success state with ShieldCheck card, and "Forgot password?" / "Return to homepage" links. Uses ScrollReveal, Stagger, MotionLink, and buttonPress animation utilities.
  - `src/routes/router.tsx` — added `{ path: "admin-login", element: <AdminLogin /> }` route.
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
- `/admin`
- `/admin/quotes`
- `/admin/collections`
- `/admin/customers`
- `/admin/smtp`
- `/admin/settings`
- `/admin-login`
- `/privacy`
- `/terms`
- `/sitemap`
