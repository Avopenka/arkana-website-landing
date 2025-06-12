'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface EnhancedParticleFieldProps {
  particleCount?: number
  interactive?: boolean
  className?: string
}

export default function EnhancedParticleField({
  particleCount = 3, // PERFORMANCE: Reduced from 150 to 3
  interactive = true,
  className = ''
}: EnhancedParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const particlesRef = useRef<any[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  const initializeParticles = (width: number, height: number) => {
    const particles: unknown[] = []
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        color: ['#00f5d4', '#8b5cf6', '#06b6d4', '#f59e0b'][Math.floor(Math.random() * 4)]
      })
    }
    
    particlesRef.current = particles
  }

  const updateParticles = (width: number, height: number) => {
    particlesRef.current.forEach(particle => {
      if (interactive) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx += (dx / distance) * force * 0.01
          particle.vy += (dy / distance) * force * 0.01
        }
      }
      
      particle.x += particle.vx
      particle.y += particle.vy
      
      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0
      
      particle.vx *= 0.99
      particle.vy *= 0.99
    })
  }

  const render = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    
    // Draw connections
    particlesRef.current.forEach((particle, i) => {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const other = particlesRef.current[j]
        const dx = particle.x - other.x
        const dy = particle.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.2
          ctx.strokeStyle = `rgba(0, 245, 212, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        }
      }
    })
    
    // Draw particles
    particlesRef.current.forEach(particle => {
      const hex = particle.color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      ctx.shadowBlur = particle.size * 2
      ctx.shadowColor = particle.color
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })
    
    ctx.shadowBlur = 0
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    updateParticles(rect.width, rect.height)
    render(ctx, rect.width, rect.height)

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === 'undefined') return

    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    initializeParticles(rect.width, rect.height)

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [interactive, particleCount])

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: 'transparent',
        mixBlendMode: 'screen',
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)' // GPU acceleration
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  )
}