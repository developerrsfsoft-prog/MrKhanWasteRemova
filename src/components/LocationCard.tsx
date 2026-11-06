import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { hoverLift } from "./animations"

interface LocationCardProps {
  id: string
  name: string
  description: string
}

export function LocationCard({ id, name, description }: LocationCardProps) {
  return (
    <motion.article {...hoverLift} className="card group p-6 transition duration-300 hover:shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-yellow/20 text-yellow flex items-center justify-center font-bold group-hover:bg-yellow group-hover:text-navy transition-colors">
          {name.charAt(0)}
        </div>
        <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors">
          {name}
        </h3>
      </div>
      <p className="text-slate-600 text-sm mb-5">{description}</p>
      <Link
        to={`/areas/${id}`}
        className="flex items-center gap-1 text-primary font-medium text-sm hover:underline"
      >
        View area <span aria-hidden="true">→</span>
      </Link>
    </motion.article>
  )
}
