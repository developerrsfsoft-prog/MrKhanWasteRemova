import { useReducedMotion, motion, type Variants, type MotionProps, type TargetAndTransition } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"

export const duration = 0.55
export const ease: [number, number, number, number] = [0.24, 1, 0.32, 1]

const MotionAnchor = motion.create(Link)

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0, ease },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
}

export const hoverLift: MotionProps = {
  whileHover: { y: -5 },
  whileTap: { y: 0 },
  transition: { type: "spring" as const, stiffness: 320, damping: 28 },
}

export const hoverScale: MotionProps = {
  whileHover: { scale: 1.03 },
  transition: { duration: 0.3, ease },
}

export const buttonPress: MotionProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.2, ease },
}

export const iconPulse: MotionProps = {
  whileHover: { scale: 1.12, rotate: 6 },
  transition: { duration: 0.3, ease },
}

export const mobileMenu: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.25, ease } },
}

export const accordionContent: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.35, ease } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.25, ease } },
}

export interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  once?: boolean
  delay?: number
  variant?: Variants
}

export function ScrollReveal({
  children,
  className,
  once = true,
  delay = 0,
  variant = fadeUp,
}: ScrollRevealProps) {
  const reduced = useReducedMotion()
  const visible = (variant.visible ?? {}) as TargetAndTransition
  return (
    <motion.div
      className={className}
      initial={reduced ? undefined : ((variant.hidden ?? {}) as TargetAndTransition)}
      whileInView={
        reduced
          ? undefined
          : {
              ...visible,
              transition: { ...(visible.transition ?? {}), delay },
            }
      }
      viewport={{ once: reduced ? false : once }}
    >
      {children}
    </motion.div>
  )
}

export interface StaggerProps {
  children: React.ReactNode
  className?: string
}

export function Stagger({ children, className }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export interface MotionLinkProps {
  to: string
  children: React.ReactNode
  className?: string
}

export function MotionLink({ to, children, className, ...props }: MotionLinkProps & Omit<MotionProps, "onClick">) {
  const navigate = useNavigate()
  return (
    <MotionAnchor
      {...props}
      className={className}
      onClick={(event) => {
        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </MotionAnchor>
  )
}
