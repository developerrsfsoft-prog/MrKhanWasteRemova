import { Star } from "lucide-react"
import { motion } from "framer-motion"
import { hoverLift } from "./animations"

interface ReviewCardProps {
  name: string
  location: string
  rating: number
  text: string
}

export function ReviewCard({ name, location, rating, text }: ReviewCardProps) {
  return (
    <motion.article {...hoverLift} className="card p-6 transition duration-300 hover:shadow-md">
      <div className="flex items-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= rating ? "text-yellow" : "text-slate-200"}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed italic mb-4">
        "{text}"
      </p>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-navy">{name}</span>
        <span className="text-slate-500">, {location}</span>
      </div>
    </motion.article>
  )
}
