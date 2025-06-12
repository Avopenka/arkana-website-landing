'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface SectionRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  yOffset?: number
}

export const SectionReveal = ({
  children,
  delay = 0,
  className = '',
  yOffset = 20
}: SectionRevealProps) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
