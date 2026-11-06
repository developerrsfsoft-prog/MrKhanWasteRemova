import { useState } from "react"
import { Plus } from "lucide-react"

export function FAQAccordion({
  items,
}: {
  items: { question: string; answer: string }[]
}) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {items.map((item, index) => {
        const active = open === index
        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-bold text-navy sm:text-base"
              aria-expanded={active}
              onClick={() => setOpen(active ? null : index)}
            >
              {item.question}
              <Plus className={`h-4 w-4 shrink-0 text-brand transition ${active ? "rotate-45" : ""}`} />
            </button>
            {active && <p className="px-4 pb-4 text-sm leading-relaxed text-muted">{item.answer}</p>}
          </div>
        )
      })}
    </div>
  )
}
