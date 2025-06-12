'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Particle system for immersive background
interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number
  maxLife: number
  size: number
  color: string
  type: 'data' | 'energy' | 'neural'
}

// Neural network connection lines
interface Connection {
  start: { x: number; y: number }
  end: { x: number; y: number }
  strength: number
  pulse: number
}

export function ImmersiveBackground({ intensity = 0.5 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Initialize particle system
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Create particles
  const createParticle = (type: 'data' | 'energy' | 'neural'): Particle => {
    const colors = {
      data: 'rgba(0, 255, 255, 0.8)',
      energy: 'rgba(147, 51, 234, 0.8)', 
      neural: 'rgba(255, 215, 0, 0.8)'
    }

    return {
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      z: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      vz: (Math.random() - 0.5) * 0.2,
      life: 1,
      maxLife: Math.random() * 200 + 100,
      size: Math.random() * 3 + 1,
      color: colors[type],
      type
    }
  }

  // Create neural connections
  const createConnection = (): Connection => {
    return {
      start: {
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height
      },
      end: {
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height
      },
      strength: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2
    }
  }

  // Animation loop
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Initialize particles and connections
    particlesRef.current = Array.from({ length: 150 }, () => 
      createParticle(['data', 'energy', 'neural'][Math.floor(Math.random() * 3)] as any)
    )
    
    connectionsRef.current = Array.from({ length: 8 }, createConnection)

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw neural connections
      connectionsRef.current.forEach((connection, index) => {
        connection.pulse += 0.05
        
        const pulseAlpha = (Math.sin(connection.pulse) + 1) / 2
        const alpha = connection.strength * pulseAlpha * intensity

        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.3})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(connection.start.x, connection.start.y)
        ctx.lineTo(connection.end.x, connection.end.y)
        ctx.stroke()

        // Slowly move connection points
        connection.start.x += Math.sin(time * 0.001 + index) * 0.2
        connection.start.y += Math.cos(time * 0.001 + index) * 0.2
        connection.end.x += Math.sin(time * 0.0015 + index + Math.PI) * 0.2
        connection.end.y += Math.cos(time * 0.0015 + index + Math.PI) * 0.2

        // Keep connections within bounds
        if (connection.start.x < 0 || connection.start.x > canvas.width) {
          connection.start.x = Math.random() * canvas.width
        }
        if (connection.start.y < 0 || connection.start.y > canvas.height) {
          connection.start.y = Math.random() * canvas.height
        }
        if (connection.end.x < 0 || connection.end.x > canvas.width) {
          connection.end.x = Math.random() * canvas.width
        }
        if (connection.end.y < 0 || connection.end.y > canvas.height) {
          connection.end.y = Math.random() * canvas.height
        }
      })

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz

        // Update life
        particle.life -= 1
        if (particle.life <= 0) {
          particlesRef.current[index] = createParticle(particle.type)
          return
        }

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Calculate alpha based on life and depth
        const lifeAlpha = particle.life / particle.maxLife
        const depthAlpha = (particle.z + 50) / 150
        const alpha = lifeAlpha * depthAlpha * intensity

        // Draw particle based on type
        if (particle.type === 'data') {
          // Data stream particles - small moving dots
          ctx.fillStyle = particle.color.replace('0.8)', `${alpha})`)
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * depthAlpha, 0, Math.PI * 2)
          ctx.fill()

          // Add glow effect
          ctx.shadowColor = particle.color
          ctx.shadowBlur = 4 * alpha
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * depthAlpha * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0

        } else if (particle.type === 'energy') {
          // Energy pulses - expanding circles
          const pulseSize = particle.size * (1 + Math.sin(time * 0.01 + index) * 0.5)
          
          ctx.strokeStyle = particle.color.replace('0.8)', `${alpha * 0.6})`)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, pulseSize * depthAlpha, 0, Math.PI * 2)
          ctx.stroke()

        } else if (particle.type === 'neural') {
          // Neural nodes - star-like patterns
          const spikes = 6
          const outerRadius = particle.size * depthAlpha
          const innerRadius = outerRadius * 0.5

          ctx.fillStyle = particle.color.replace('0.8)', `${alpha})`)
          ctx.beginPath()
          
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius
            const angle = (i * Math.PI) / spikes
            const x = particle.x + Math.cos(angle) * radius
            const y = particle.y + Math.sin(angle) * radius
            
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          
          ctx.closePath()
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, intensity])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  )
}

// 3D Floating Orbs Component
export function FloatingOrbs({ count = 5 }: { count?: number }) {
  return (
    <div className="absolute inset-0" style={{ zIndex: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            background: `radial-gradient(circle, 
              rgba(0, 255, 255, 0.1) 0%, 
              rgba(0, 255, 255, 0.05) 50%, 
              transparent 100%
            )`,
            filter: 'blur(1px)',
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  )
}

// Environmental atmosphere effects
export function AtmosphereEffects() {
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      {/* Ambient fog layers */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 90%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
          `
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Moving light beams */}
      <motion.div
        className="absolute top-0 left-1/4 w-1 h-full opacity-20"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 255, 255, 0.3), transparent)',
          filter: 'blur(2px)'
        }}
        animate={{
          x: [0, 200, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-0 right-1/3 w-1 h-full opacity-20"
        style={{
          background: 'linear-gradient(to bottom, rgba(147, 51, 234, 0.3), transparent)',
          filter: 'blur(2px)'
        }}
        animate={{
          x: [0, -150, 0],
          opacity: [0.1, 0.25, 0.1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
    </div>
  )
}