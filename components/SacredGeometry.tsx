'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useMystery } from '@/lib/mystery-engine'

interface GeometryPattern {
  name: string
  points: number
  rotation: number
  scale: number
  color: string
}

const PHI = 1.618033988749895
const SACRED_PATTERNS: GeometryPattern[] = [
  { name: 'triangle', points: 3, rotation: 0, scale: 1, color: 'rgba(139, 92, 246, 0.3)' },
  { name: 'square', points: 4, rotation: 45, scale: 1, color: 'rgba(147, 51, 234, 0.3)' },
  { name: 'pentagon', points: 5, rotation: 0, scale: 1, color: 'rgba(124, 58, 237, 0.3)' },
  { name: 'hexagon', points: 6, rotation: 0, scale: 1, color: 'rgba(109, 40, 217, 0.3)' },
  { name: 'heptagon', points: 7, rotation: 0, scale: 1, color: 'rgba(91, 33, 182, 0.3)' },
  { name: 'octagon', points: 8, rotation: 22.5, scale: 1, color: 'rgba(76, 29, 149, 0.3)' },
  { name: 'enneagon', points: 9, rotation: 0, scale: 1, color: 'rgba(55, 48, 163, 0.3)' },
  { name: 'decagon', points: 10, rotation: 0, scale: 1, color: 'rgba(238, 130, 238, 0.3)' }
]

export default function SacredGeometry({ 
  className = '',
  interactive = true,
  autoAnimate = true 
}: {
  className?: string
  interactive?: boolean
  autoAnimate?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controls = useAnimation()
  const mysteryState = useMystery()
  const [activePattern, setActivePattern] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number }[]>([])
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = canvas.offsetWidth * 2 // Retina display
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Only show if user has some consciousness level
    if (mysteryState.level < 2) return
    
    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2
    const radius = Math.min(centerX, centerY) * 0.8
    
    // Draw active pattern
    const pattern = SACRED_PATTERNS[Math.min(activePattern, mysteryState.level)]
    drawSacredPattern(ctx, centerX, centerY, radius, pattern)
    
    // Draw Flower of Life at high consciousness
    if (mysteryState.level >= 5) {
      drawFlowerOfLife(ctx, centerX, centerY, radius * 0.6)
    }
    
    // Draw Metatron's Cube at max consciousness
    if (mysteryState.level >= 7) {
      drawMetatronsCube(ctx, centerX, centerY, radius * 0.5)
    }
    
    // Animate if enabled
    if (autoAnimate) {
      const animationFrame = requestAnimationFrame(() => animateGeometry())
    }
  }, [activePattern, mysteryState.level, autoAnimate])
  
  const drawSacredPattern = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    pattern: GeometryPattern
  ) => {
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((pattern.rotation * Math.PI) / 180)
    
    // Draw main shape
    ctx.beginPath()
    for (let i = 0; i < pattern.points; i++) {
      const angle = (i * 2 * Math.PI) / pattern.points - Math.PI / 2
      const x = radius * Math.cos(angle) * pattern.scale
      const y = radius * Math.sin(angle) * pattern.scale
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    
    ctx.strokeStyle = pattern.color
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Draw internal connections for pentagon (pentagram)
    if (pattern.points === 5 && mysteryState.level >= 4) {
      ctx.beginPath()
      for (let i = 0; i < pattern.points; i++) {
        const angle1 = (i * 2 * Math.PI) / pattern.points - Math.PI / 2
        const angle2 = ((i + 2) % pattern.points * 2 * Math.PI) / pattern.points - Math.PI / 2
        
        ctx.moveTo(radius * Math.cos(angle1), radius * Math.sin(angle1))
        ctx.lineTo(radius * Math.cos(angle2), radius * Math.sin(angle2))
      }
      ctx.strokeStyle = pattern.color.replace('0.3', '0.2')
      ctx.stroke()
    }
    
    // Add golden ratio spirals at high consciousness
    if (mysteryState.level >= 6) {
      drawGoldenSpiral(ctx, 0, 0, radius * 0.3)
    }
    
    ctx.restore()
  }
  
  const drawFlowerOfLife = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    const circleRadius = radius / 3
    
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
    ctx.lineWidth = 1
    
    // Center circle
    drawCircle(ctx, centerX, centerY, circleRadius)
    
    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3
      const x = centerX + circleRadius * Math.cos(angle)
      const y = centerY + circleRadius * Math.sin(angle)
      drawCircle(ctx, x, y, circleRadius)
      
      // Second layer
      for (let j = 0; j < 6; j++) {
        const angle2 = angle + (j * Math.PI) / 3
        const x2 = x + circleRadius * Math.cos(angle2)
        const y2 = y + circleRadius * Math.sin(angle2)
        
        // Check if circle already exists nearby
        const exists = isCircleDrawn(x2, y2, centerX, centerY, circleRadius)
        if (!exists) {
          drawCircle(ctx, x2, y2, circleRadius)
        }
      }
    }
  }
  
  const drawMetatronsCube = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    ctx.strokeStyle = 'rgba(238, 130, 238, 0.2)'
    ctx.lineWidth = 1
    
    // Calculate vertices
    const vertices: { x: number; y: number }[] = []
    
    // Center point
    vertices.push({ x: centerX, y: centerY })
    
    // Inner hexagon
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3
      vertices.push({
        x: centerX + radius * 0.5 * Math.cos(angle),
        y: centerY + radius * 0.5 * Math.sin(angle)
      })
    }
    
    // Outer hexagon
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + Math.PI / 6
      vertices.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      })
    }
    
    // Connect all vertices
    ctx.beginPath()
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        ctx.moveTo(vertices[i].x, vertices[i].y)
        ctx.lineTo(vertices[j].x, vertices[j].y)
      }
    }
    ctx.stroke()
  }
  
  const drawGoldenSpiral = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    initialRadius: number
  ) => {
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    
    let radius = initialRadius
    let angle = 0
    
    for (let i = 0; i < 200; i++) {
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      
      angle += 0.1
      radius *= 1.01 // Approximate golden ratio growth
    }
    
    ctx.stroke()
  }
  
  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) => {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.stroke()
  }
  
  const isCircleDrawn = (
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    radius: number
  ): boolean => {
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
    return distance < radius * 0.1
  }
  
  const animateGeometry = () => {
    if (mysteryState.level >= 3) {
      controls.start({
        rotate: 360,
        transition: {
          duration: 60,
          repeat: Infinity,
          ease: 'linear'
        }
      })
    }
  }
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || mysteryState.level < 3) return
    
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setDrawnPoints([...drawnPoints, { x, y }])
    
    // Check if user drew a sacred pattern
    if (drawnPoints.length >= 5) {
      if (detectSacredPattern(drawnPoints)) {
        setActivePattern((prev) => (prev + 1) % SACRED_PATTERNS.length)
        setDrawnPoints([])
      }
    }
  }
  
  const detectSacredPattern = (points: { x: number; y: number }[]): boolean => {
    // Simple pattern detection - check if points form a rough circle
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length
    
    const distances = points.map(p => 
      Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2)
    )
    
    const avgDistance = distances.reduce((a, b) => a + b) / distances.length
    const variance = distances.reduce((sum, d) => sum + Math.abs(d - avgDistance), 0) / distances.length
    
    return variance < avgDistance * 0.3
  }
  
  return (
    <motion.div
      animate={controls}
      className={`relative ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        className="w-full h-full"
        style={{ 
          cursor: interactive && mysteryState.level >= 3 ? 'crosshair' : 'default',
          opacity: mysteryState.level >= 2 ? 0.5 : 0
        }}
      />
      
      {/* Pattern name display */}
      {mysteryState.level >= 3 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-purple-400">
          {SACRED_PATTERNS[Math.min(activePattern, mysteryState.level)].name}
        </div>
      )}
      
      {/* Instructions for drawing */}
      {interactive && mysteryState.level >= 3 && mysteryState.level < 5 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-purple-300 text-center">
          Click to draw sacred patterns
        </div>
      )}
    </motion.div>
  )
}