interface ServiceCardProps {
  id: string
  title: string
  description: string
  priceFrom: string
}

export function ServiceCard({ id, title, description, priceFrom }: ServiceCardProps) {
  return (
    <article className="card group">
      <div className="p-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
          <span className="text-lg" aria-hidden="true">{getIcon(id)}</span>
        </div>
        <h3 className="text-lg font-bold text-navy mb-2">{title}</h3>
        <p className="text-slate-600 text-sm mb-4">{description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{priceFrom}</span>
          <span className="text-slate-500 text-xs">per clearance</span>
        </div>
      </div>
      <a
        href={`/services/${id}`}
        className="block h-full w-full"
        aria-hidden="true"
      >
        <div className="absolute inset-0" />
      </a>
    </article>
  )
}

function getIcon(id: string): string {
  const icons: Record<string, string> = {
    "furniture-removal": "🛋️",
    "garden-waste-removal": "🍃",
    "house-clearance": "🏠",
    "office-clearance": "🏢",
    "garage-clearance": "🚗",
    "loft-clearance": "🔝",
    "general-rubbish-removal": "🗑️",
    "weee-electrical-waste": "🔌",
  }
  return icons[id] || "📦"
}
