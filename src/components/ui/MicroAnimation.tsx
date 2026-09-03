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
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
