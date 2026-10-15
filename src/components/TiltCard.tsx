import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { PropsWithChildren, ReactNode } from 'react'

type TiltCardProps = PropsWithChildren<{
  className?: string
  children: ReactNode
}>

export default function TiltCard({ children, className = '' }: TiltCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4.5, -4.5]), { stiffness: 190, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4.5, 4.5]), { stiffness: 190, damping: 18 })

  return (
    <motion.article
      className={`tilt-card ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - bounds.left) / bounds.width - 0.5)
        y.set((event.clientY - bounds.top) / bounds.height - 0.5)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
      whileHover={{ y: -5 }}
    >
      {children}
    </motion.article>
  )
}
