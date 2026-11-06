import { Link } from "react-router-dom"
import mark from "@/assets/logo-mark.svg"

export function Logo({ light = false }: { light?: boolean }) {
  const word = light ? "#ffffff" : "#0d2347"
  const line = light ? "#fbd11e" : "#1f75f5"
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Mr Khan Movers home">
      <img src={mark} alt="" width={44} height={44} className="h-11 w-11 shrink-0" />
      <span className="leading-none">
        <span className="block text-[15px] font-extrabold tracking-[0.06em]" style={{ color: word }}>
          MR KHAN
        </span>
        <span className="mt-1 block text-[10px] font-extrabold tracking-[0.22em]" style={{ color: line }}>
          MOVERS
        </span>
      </span>
    </Link>
  )
}
