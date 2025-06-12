'use client';

import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: 'sand' | 'data' | 'void' | 'spice';
}

interface ParticleFieldProps {
  type?: 'sand' | 'data' | 'void' | 'spice';
  density?: number;
  speed?: number;
  className?: string;
}

export default function ParticleField({ 
  type = 'sand', 
  density = 3, // PERFORMANCE: Reduced from 50 to 3
  speed = 0.5,
  className = '' 
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (typeof window === 'undefined') return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < density; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const createParticle = (): Particle => {
      const colors = {
        sand: ['#D4AF37', '#FFD700', '#FFA500'],
        data: ['#00FF41', '#00CC00', '#008F11'],
        void: ['#7B2CBF', '#9D4EDD', '#C77DFF'],
        spice: ['#FF6B35', '#FF8C42', '#FFB347']
      };

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        type
      };
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Special behaviors by type
      switch (particle.type) {
        case 'sand':
          // Drift effect
          particle.vx += (Math.random() - 0.5) * 0.1;
          particle.vy += 0.05; // Gravity
          break;
        case 'data':
          // Matrix fall
          particle.vy += 0.1;
          if (Math.random() < 0.01) {
            particle.opacity = 1; // Flash
          } else {
            particle.opacity *= 0.99;
          }
          break;
        case 'void':
          // Swirl effect
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle + Math.PI / 2) * 0.05;
          particle.vy += Math.sin(angle + Math.PI / 2) * 0.05;
          break;
        case 'spice':
          // Heat shimmer
          particle.vx = Math.sin(particle.y * 0.01) * speed;
          particle.vy -= 0.05; // Rise
          particle.opacity = Math.sin(particle.y * 0.01) * 0.5 + 0.5;
          break;
      }

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) {
        if (particle.type === 'data') {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
          particle.opacity = 1;
        } else {
          particle.y = 0;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        updateParticle(particle);

        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;

        if (particle.type === 'data') {
          // Matrix style text
          ctx.font = `${particle.size * 10}px monospace`;
          ctx.fillText(Math.random() > 0.5 ? '1' : '0', particle.x, particle.y);
        } else {
          // Regular particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Add glow effect
        if (particle.type === 'void' || particle.type === 'spice') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    initParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ 
        mixBlendMode: type === 'void' ? 'screen' : 'normal',
        opacity: type === 'data' ? 0.3 : 0.6,
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)' // GPU acceleration
      }}
    />
  );
}