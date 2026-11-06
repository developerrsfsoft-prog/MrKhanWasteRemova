export const business = {
  name: "Mr Khan Waste Removal",
  legalName: "Mr Khan Movers",
  owner: "Nasir",
  phoneDisplay: "07723 600218",
  phoneTel: "+447723600218",
  email: "info@mrkhanwasteremovallondon.co.uk",
  area: "London, United Kingdom",
  website: "https://mrkhanwasteremovallondon.co.uk/",
  hours: "Mon – Sun: 7:00 AM – 8:00 PM",
  started: "2026",
}

export type Service = {
  slug: string
  title: string
  homeTitle: string
  navTitle: string
  blurb: string
  image: string
  intro: string
  body: string
  bullets: string[]
  removes: string[]
  metaTitle: string
  metaDescription: string
}

export const services: Service[] = [
  {
    slug: "furniture-removal",
    title: "Furniture Removal",
    homeTitle: "Furniture & Sofa Removal",
    navTitle: "Furniture Removal",
    blurb:
      "We remove all types of furniture including sofas, beds, wardrobes and more.",
    image: "/images/furniture.jpg",
    intro:
      "Safe, reliable extraction and responsible disposal of sofas, bed frames, mattresses, dining tables, desks and heavy domestic furniture.",
    body: "Mr Khan Waste Removal collects bulky furniture from houses, flats and commercial premises across London. Tell us what needs to go, where it is, and whether it must be dismantled on site. The crew loads the items and takes them away for responsible disposal.",
    bullets: [
      "Sofas, armchairs and dining furniture",
      "Beds, mattresses and bed frames",
      "Wardrobes, desks and tables",
      "Single items or a full room",
      "Careful handling through hallways and stairs",
      "Domestic and commercial collections",
    ],
    removes: ["Sofas", "Beds", "Wardrobes", "Tables", "Desks", "Mattresses"],
    metaTitle: "Furniture Removal London | Mr Khan Waste Removal",
    metaDescription:
      "Furniture and sofa removal across London. Sofas, beds, wardrobes and heavy furniture collected by Mr Khan Waste Removal. Call 07723 600218.",
  },
  {
    slug: "garden-waste-removal",
    title: "Garden Waste Removal",
    homeTitle: "Garden Waste Removal",
    navTitle: "Garden Waste Removal",
    blurb:
      "Clear your garden waste, branches, soil, fencing and green waste quickly and responsibly.",
    image: "/images/garden.jpg",
    intro:
      "Collection and recycling of organic green waste, branches, soil, hedge trimmings and yard debris.",
    body: "Garden waste removal covers green piles left after a tidy-up, a landscaping job or a seasonal cut-back. We collect branches, hedge trimmings, soil and other organic debris from London gardens and take them for recycling where the material allows.",
    bullets: [
      "Branches, hedge trimmings and cuttings",
      "Soil and organic green waste",
      "Bagged or loose garden debris",
      "Clearance after garden work",
      "Domestic gardens across London",
      "Recycling of suitable green waste",
    ],
    removes: ["Branches", "Hedge trimmings", "Soil", "Green waste", "Cuttings"],
    metaTitle: "Garden Waste Removal London | Mr Khan Waste Removal",
    metaDescription:
      "Garden waste collection in London for branches, soil, hedge trimmings and green debris. Request a quote from Mr Khan Waste Removal.",
  },
  {
    slug: "house-clearance",
    title: "House Clearance",
    homeTitle: "House Clearance",
    navTitle: "House Clearance",
    blurb:
      "Complete house clearances for probate, moving or general rubbish removal.",
    image: "/images/house.jpg",
    intro:
      "Full and partial residential clearances, including estate, probate, tenancy and end-of-lease cleanouts of mixed household items.",
    body: "House clearance is for properties that need more than a few items taken away. We empty rooms or a whole home, including furniture and mixed household goods, and leave the space ready for the next step. The service covers flats and houses across London.",
    bullets: [
      "Full and partial house clearance",
      "Estate and probate clearances",
      "End-of-tenancy cleanouts",
      "Mixed furniture and household goods",
      "Flats and houses",
      "Loading included",
    ],
    removes: ["Furniture", "Household goods", "Bagged rubbish", "Appliances"],
    metaTitle: "House Clearance London | Mr Khan Waste Removal",
    metaDescription:
      "House clearance in London for probate, moving and end-of-tenancy cleanouts. Mr Khan Waste Removal collects mixed household items.",
  },
  {
    slug: "office-clearance",
    title: "Office Clearance",
    homeTitle: "Office Clearance",
    navTitle: "Office Clearance",
    blurb:
      "Efficient office rubbish removal with minimal disruption to your business.",
    image: "/images/office.jpg",
    intro:
      "Commercial clearance of desks, seating, filing and office waste, arranged to limit disruption to the working day.",
    body: "Office clearance covers commercial fixtures and everyday office waste when a business is moving, closing a room or clearing stored equipment. We collect desks, seating, filing and mixed office items from premises across London.",
    bullets: [
      "Desks, chairs and meeting furniture",
      "Filing and storage furniture",
      "Mixed commercial waste",
      "Collections timed around your site",
      "Offices and commercial units",
      "IT equipment directed to the WEEE service",
    ],
    removes: ["Desks", "Office chairs", "Filing cabinets", "Commercial waste"],
    metaTitle: "Office Clearance London | Mr Khan Waste Removal",
    metaDescription:
      "Office clearance in London for desks, seating, filing and commercial waste. Book a collection with Mr Khan Waste Removal.",
  },
  {
    slug: "garage-clearance",
    title: "Garage Clearance",
    homeTitle: "Garage Clearance",
    navTitle: "Garage Clearance",
    blurb:
      "We clear garages, sheds and outbuildings, removing all unwanted items.",
    image: "/images/garage.jpg",
    intro:
      "Organised cleanout of disused equipment, unwanted tools, domestic excess, packaging and non-hazardous scrap.",
    body: "Garage clearance is for storage that has filled up with tools, packaging, old household goods and heavy bits of non-hazardous scrap. We sort the load on site, carry it out and clear the garage so the space can be used again.",
    bullets: [
      "Stored household goods",
      "Tools and disused equipment",
      "Packaging and bulky clutter",
      "Non-hazardous scrap",
      "Garages and outbuildings",
      "Single garages or packed units",
    ],
    removes: ["Stored goods", "Tools", "Packaging", "Non-hazardous scrap"],
    metaTitle: "Garage Clearance London | Mr Khan Waste Removal",
    metaDescription:
      "Garage clearance in London for stored goods, tools, packaging and non-hazardous scrap. Get a quote from Mr Khan Waste Removal.",
  },
  {
    slug: "loft-clearance",
    title: "Loft Clearance",
    homeTitle: "Shed & Loft Clearance",
    navTitle: "Loft Clearance",
    blurb:
      "Safe and efficient loft clearance services, creating more space in your home.",
    image: "/images/loft.webp",
    intro:
      "Methodical clearing of attic spaces, including stored boxes, old belongings and insulation remnants, plus shed clearances.",
    body: "Loft clearance means working in a tight roof space and bringing stored boxes, old furniture and leftover belongings down safely. Shed clearance is handled on the same service when a garden store needs emptying. Access, boarding and the type of load all affect the quote.",
    bullets: [
      "Boxed storage and old belongings",
      "Furniture left in the loft",
      "Insulation remnants and light debris",
      "Shed and outbuilding clearance",
      "Care taken on ladders and tight access",
      "The space left clear of the agreed items",
    ],
    removes: ["Storage boxes", "Old furniture", "Loft clutter", "Shed contents"],
    metaTitle: "Loft Clearance London | Mr Khan Waste Removal",
    metaDescription:
      "Loft and shed clearance in London. Stored boxes, old furniture and attic clutter collected by Mr Khan Waste Removal.",
  },
  {
    slug: "general-rubbish-removal",
    title: "General Rubbish Removal",
    homeTitle: "General Rubbish Removal",
    navTitle: "General Rubbish Removal",
    blurb:
      "From single items to full loads, we remove all types of household and commercial waste.",
    image: "/images/rubbish.webp",
    intro:
      "Flexible collection of everyday household clutter, domestic refuse and standard non-hazardous mixed loads.",
    body: "General rubbish removal is the right call for mixed household or light commercial waste that does not fit a single specialist job. We collect bagged rubbish, bulky oddments and mixed non-hazardous loads from homes and businesses across London.",
    bullets: [
      "Bagged household rubbish",
      "Mixed non-hazardous loads",
      "Single items through to larger clearances",
      "Homes and light commercial premises",
      "Same-day collection when the diary allows",
      "No hazardous waste on this service",
    ],
    removes: ["Bagged rubbish", "Mixed junk", "Bulky oddments", "Household clutter"],
    metaTitle: "Rubbish Removal London | Mr Khan Waste Removal",
    metaDescription:
      "General rubbish removal across London for household clutter and non-hazardous mixed loads. Call Mr Khan Waste Removal on 07723 600218.",
  },
  {
    slug: "weee-electrical-waste",
    title: "WEEE & Electrical Waste",
    homeTitle: "WEEE / Electrical Waste",
    navTitle: "WEEE & Electrical Waste",
    blurb:
      "We dispose of electrical items safely and in compliance with UK regulations.",
    image: "/images/weee.webp",
    intro:
      "Compliant recycling of waste electrical and electronic equipment, including appliances, monitors, cabling and IT hardware.",
    body: "WEEE collections cover waste electrical and electronic equipment that should not go into general rubbish. We take appliances, monitors, computers, cabling and similar items and pass them into a compliant recycling route.",
    bullets: [
      "Fridges, washers and small appliances",
      "Monitors, PCs and IT hardware",
      "Cabling and electronic accessories",
      "Separate from general rubbish",
      "Handled for compliant recycling",
      "Domestic and office electricals",
    ],
    removes: ["Appliances", "Monitors", "Computers", "Cabling", "IT hardware"],
    metaTitle: "WEEE & Electrical Waste Disposal London | Mr Khan",
    metaDescription:
      "WEEE and electrical waste collection in London for appliances, monitors and IT equipment. Mr Khan Waste Removal.",
  },
]

export const homeServiceOrder = [
  "furniture-removal",
  "garden-waste-removal",
  "house-clearance",
  "general-rubbish-removal",
  "office-clearance",
  "weee-electrical-waste",
  "garage-clearance",
  "loft-clearance",
]

export type Location = {
  slug: string
  name: string
  image: string
  summary: string
  focus: string
  detail: string
  points: string[]
  places?: string[]
  metaTitle: string
  metaDescription: string
}

export const locations: Location[] = [
  {
    slug: "central-london",
    name: "Central London",
    image: "/images/central.jpg",
    summary: "Fast waste removal in Central London.",
    focus:
      "Fast-response, access-managed domestic and office collections for congestion-zone operations.",
    detail:
      "Central London collections are planned around tight access, waiting restrictions and busy streets. We collect household rubbish, furniture and office waste from properties inside the central area, and we agree a time that suits the building.",
    points: [
      "Domestic and office collections",
      "Access agreed before we arrive",
      "Furniture, rubbish and clearance loads",
      "Same-day visits when the schedule allows",
    ],
    metaTitle: "Waste Removal Central London | Mr Khan Waste Removal",
    metaDescription:
      "Waste removal in Central London for homes and offices, with access-managed collections. Call Mr Khan Waste Removal on 07723 600218.",
  },
  {
    slug: "north-london",
    name: "North London",
    image: "/images/north.jpg",
    summary: "Reliable clearance services in North London.",
    focus:
      "Clearance for private residences, apartments and commercial units across North London boroughs.",
    detail:
      "North London coverage takes in houses, apartments and commercial units across the northern boroughs. We collect furniture, garden waste, mixed rubbish and full clearances, and we quote from the load and the access.",
    points: [
      "Houses, apartments and commercial units",
      "North London boroughs",
      "House, garage and loft clearances",
      "Garden waste and general rubbish",
    ],
    metaTitle: "Waste Removal North London | Mr Khan Waste Removal",
    metaDescription:
      "Waste removal and clearance across North London boroughs for homes, apartments and commercial units.",
  },
  {
    slug: "east-london",
    name: "East London",
    image: "/images/east.webp",
    summary: "Trusted waste removal in East London.",
    focus:
      "Rubbish clearance for residential streets, urban apartments and light-industrial facilities.",
    detail:
      "East London jobs range from apartment loads on residential streets to light-industrial clearances. We remove household rubbish, furniture, garden waste and commercial items, and we work to the access the site actually has.",
    points: [
      "Residential streets and apartments",
      "Light-industrial premises",
      "Mixed household and commercial loads",
      "Furniture and general rubbish",
    ],
    metaTitle: "Waste Removal East London | Mr Khan Waste Removal",
    metaDescription:
      "Rubbish clearance in East London for homes, apartments and light-industrial sites. Mr Khan Waste Removal.",
  },
  {
    slug: "west-london",
    name: "West London",
    image: "/images/west.webp",
    summary: "Professional clearance in West London.",
    focus:
      "Clearance for residential estates, suburban homes and local commercial premises.",
    detail:
      "West London collections cover residential estates, suburban homes and local commercial premises, including Shepherd’s Bush, Hammersmith, Ealing and Acton. From household rubbish to a full clearance, the crew loads the agreed items and removes them the same visit.",
    points: [
      "Shepherd’s Bush, Hammersmith, Ealing and Acton",
      "Residential estates and suburban homes",
      "Local commercial premises",
      "Same-day and next-day visits when available",
    ],
    places: ["Shepherd’s Bush", "Hammersmith", "Ealing", "Acton"],
    metaTitle: "Waste Removal West London | Mr Khan Waste Removal",
    metaDescription:
      "Waste removal in West London, including Shepherd’s Bush, Hammersmith, Ealing and Acton. Quotes from Mr Khan Waste Removal.",
  },
  {
    slug: "south-london",
    name: "South London",
    image: "/images/south.jpg",
    summary: "Local waste removal in South London.",
    focus:
      "Collection routes covering South London domestic properties, private gardens and retail shops.",
    detail:
      "South London work covers domestic properties, private gardens and retail shops. We collect furniture, garden waste, shop waste and mixed household rubbish on routes across the southern boroughs.",
    points: [
      "Domestic properties",
      "Private gardens and green waste",
      "Retail shop clearances",
      "Furniture and general rubbish",
    ],
    metaTitle: "Waste Removal South London | Mr Khan Waste Removal",
    metaDescription:
      "Waste removal in South London for homes, private gardens and retail shops. Call Mr Khan Waste Removal.",
  },
  {
    slug: "greater-london",
    name: "Greater London",
    image: "/images/greater.jpg",
    summary: "Covering all London postcode areas.",
    focus:
      "Wide-radius collection across outer London boroughs, commuter belts and nearby arterial locations.",
    detail:
      "Greater London is the wide service area: outer boroughs, the commuter belt and locations on the main routes out of the city. If you are inside this area, send the postcode with your quote and we will confirm whether we can collect.",
    points: [
      "Outer London boroughs",
      "Commuter-belt collections",
      "Locations on the main routes",
      "All of our listed waste services",
    ],
    metaTitle: "Waste Removal Greater London | Mr Khan Waste Removal",
    metaDescription:
      "Waste collection across Greater London, the outer boroughs and the commuter belt. Request a quote from Mr Khan Waste Removal.",
  },
]

export const reviews = [
  {
    quote:
      "Excellent service! The team arrived on time, worked efficiently and left everything spotless.",
    name: "Sarah M.",
    area: "London",
    areaPage: "North London",
  },
  {
    quote:
      "Very professional and reasonably priced. Highly recommend Mr Khan Waste Removal.",
    name: "Ahmed R.",
    area: "London",
    areaPage: "East London",
  },
  {
    quote: "Great service from start to finish. Will definitely use again!",
    name: "Priya S.",
    area: "London",
    areaPage: "South London",
  },
]

export const faqs = [
  {
    question: "How quickly can you collect?",
    answer:
      "Same-day collection is available across London when the diary allows. Call 07723 600218 with your postcode and what needs collecting, and we will give you the next workable time.",
  },
  {
    question: "What types of waste do you remove?",
    answer:
      "Furniture, garden waste, house clearance, office clearance, garage clearance, loft and shed clearance, general non-hazardous rubbish, and WEEE electrical items. Hazardous waste is outside these services.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Collections are offered as a licensed waste carrier service and are insured for domestic and commercial work. A carrier registration number was not included in the project materials, so it is not published on this site. Ask us to send the paperwork before the visit if you need it.",
  },
  {
    question: "Do you offer same-day service?",
    answer:
      "Yes. Same-day rubbish removal is available subject to the day’s schedule and the size of the load. Phone 07723 600218 to check.",
  },
  {
    question: "How much does waste removal cost?",
    answer:
      "There is no fixed price list. The quote depends on the type of waste, the volume, access and the postcode. Ask for a free quote and we will price the job you describe.",
  },
  {
    question: "Which areas do you cover?",
    answer:
      "Central, North, East, West and South London, plus Greater London including outer boroughs and the commuter belt. Send your postcode with the quote request so we can confirm the run.",
  },
  {
    question: "Do you recycle the waste you collect?",
    answer:
      "Suitable materials are sent for recycling, including green waste and electrical items collected on the WEEE service. Mixed loads are sorted so recyclable material is separated where it can be.",
  },
]

export const howItWorksHome = [
  { step: "1", title: "Tell us what needs clearing", icon: "chat" },
  { step: "2", title: "Get your quote", icon: "calendar" },
  { step: "3", title: "We collect and clear", icon: "truck" },
]

export const howItWorksLong = [
  {
    step: "1",
    title: "Submit Your Request",
    text: "Tell us what you need cleared using the quote form or give us a call.",
  },
  {
    step: "2",
    title: "Receive a Quote",
    text: "Get a free, no-obligation quote with a transparent price.",
  },
  {
    step: "3",
    title: "We Collect Your Waste",
    text: "Our team arrives on time and clears everything you agreed.",
  },
  {
    step: "4",
    title: "Responsible Disposal",
    text: "We recycle as much as possible and dispose of the rest responsibly.",
  },
]

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug)
}
