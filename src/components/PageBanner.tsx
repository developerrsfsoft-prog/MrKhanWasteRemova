interface PageBannerProps {
  title: string
  subtitle?: string
}

export function PageBanner({ title, subtitle }: PageBannerProps) {
  return (
    <section className="py-16 bg-light border-b border-slate-200">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">{title}</h1>
        {subtitle && (
          <p className="text-slate-600 text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
