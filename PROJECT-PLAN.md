# Mr Khan Waste Removal — project plan

Reference folder (read only): `E:\MrkhanWasteRemovalLondon`
App: this Vite + React + Tailwind project.

## Source of truth

- `MRKhanMovers.txt` — business facts, services, areas.
- `Homepage.png` — home layout (blue header, hero quote form, services, before/after, how it works, why us, areas, reviews, FAQ, CTA).
- `services.png` — services index.
- `sub services.webp` — service detail pattern (furniture page).
- `Locations.png` — areas index and footer.
- `sub Location.png` — location detail pattern (West London).
- `About-Us.webp` — about page.
- `ContactUS.webp` — contact page. The mock heading is garbled; the live page uses a contact heading.
- Mobile screenshots — stacked hero, quote form under the hero, hamburger menu.

Photos were cropped from those screenshots. There were no separate asset files.

## Facts used

- Business: Mr Khan Movers, trading on the site as Mr Khan Waste Removal.
- Contact: Nasir. Phone 07723 600218. Email shown in the designs: info@mrkhanwasteremovallondon.co.uk.
- Area: London, United Kingdom. No street address was supplied, so none is published.
- Started: 2026.
- Hours on the location mock footer: Mon–Sun 7:00 AM – 8:00 PM.
- No waste-carrier registration number, insurance policy number, price list, or review volume was supplied. Those numbers are not published. Licence and insurance are described as offered, and the FAQ says paperwork can be requested.

## Pages

1. Home `/`
2. Services `/services` and eight service URLs
3. Areas `/areas` and six location URLs
4. About `/about`
5. Contact `/contact`
6. Privacy, terms, sitemap (footer links from the location mock)

## Build

`npm run build` (tsc + vite). Frontend only. Forms validate in the browser and do not send email.
