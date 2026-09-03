'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface MicroAnimationProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
}

export function MicroAnimation({ children, className = "", ...props }: MicroAnimationProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
