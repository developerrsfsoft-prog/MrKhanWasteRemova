import { useState } from "react"

export function BeforeAfter() {
  const [position, setPosition] = useState(52)

  return (
    <section className="pb-4">
      <div className="wrap">
        <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80">
          <img src="/images/after.webp" alt="Garden after the waste was cleared" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)`, transition: "clip-path 0.3s ease" }}>
            <img src="/images/before.webp" alt="Garden before clearance, covered in soil and debris" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-navy/80 px-3 py-1 text-xs font-bold text-white">Before</span>
          <span className="absolute right-4 top-4 rounded-full bg-navy/80 px-3 py-1 text-xs font-bold text-white">After</span>
          <input
            aria-label="Compare before and after"
            type="range"
            min={8}
            max={92}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            className="absolute inset-x-6 bottom-4"
          />
          <div
            className="pointer-events-none absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-lg font-bold text-navy shadow-lg"
            style={{ left: `${position}%` }}
          >
            ›
          </div>
        </div>
      </div>
    </section>
  )
}
