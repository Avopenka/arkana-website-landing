// Luxury Animation System - LVMH/Dior/Chanel Standard
// Premium easing functions and animation configurations

export const luxuryEasing = {
  // Silk - Ultimate smoothness (Chanel-inspired)
  silk: [0.25, 0.1, 0.25, 1] as const,
  
  // Cashmere - Organic premium feel (Dior-inspired)
  cashmere: [0.23, 1, 0.32, 1] as const,
  
  // Diamond - Precious bounce (LVMH-inspired)
  diamond: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Velvet - Sophisticated entry
  velvet: [0.4, 0, 0.2, 1] as const,
  
  // Crystal - Sharp precision
  crystal: [0.87, 0, 0.13, 1] as const,
  
  // Platinum - Refined elegance
  platinum: [0.16, 1, 0.3, 1] as const,
};

export const luxuryDurations = {
  // Micro-interactions (Jewelry-level precision)
  microTouch: 0.08,          // Button press feedback
  microHover: 0.12,          // Hover state transitions
  microFocus: 0.16,          // Focus ring appearances
  
  // Interface responses (Watch mechanism precision)
  interfaceShift: 0.24,      // Component state changes
  modalEntry: 0.32,          // Modal/overlay appearances
  pageTransition: 0.4,       // Route transitions
  
  // Experiential (Couture-level sophistication)
  contemplative: 0.6,        // Deep state changes
  ceremonial: 0.8,           // Major transitions
  transformative: 1.2,       // Complete experience shifts
  
  // Ambient (Luxury environment)
  breathingCycle: 4.0,       // Gentle pulsing effects
  presenceField: 8.0,        // Environmental ambience
  consciousnessFlow: 12.0,   // Deep meditative cycles
};

export const luxuryTransitions = {
  // Button interactions (Hermès-level craftsmanship)
  buttonHover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: luxuryDurations.microHover,
      ease: luxuryEasing.cashmere,
    },
  },
  
  buttonPress: {
    scale: 0.98,
    transition: {
      duration: luxuryDurations.microTouch,
      ease: luxuryEasing.silk,
    },
  },
  
  // Card interactions (Museum-quality presentation)
  cardHover: {
    scale: 1.015,
    y: -4,
    rotateY: 2,
    rotateX: 1,
    transition: {
      duration: luxuryDurations.interfaceShift,
      ease: luxuryEasing.platinum,
    },
  },
  
  cardPress: {
    scale: 0.995,
    transition: {
      duration: luxuryDurations.microTouch,
      ease: luxuryEasing.silk,
    },
  },
  
  // Text reveals (Editorial sophistication)
  textReveal: {
    initial: { opacity: 0, y: 20, filter: 'blur(2px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: {
      duration: luxuryDurations.contemplative,
      ease: luxuryEasing.cashmere,
    },
  },
  
  // Staggered reveals (Symphony-like orchestration)
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  
  staggerChild: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: luxuryDurations.interfaceShift,
        ease: luxuryEasing.platinum,
      },
    },
  },
  
  // Icon animations (Jewelry-level detail)
  iconFloat: {
    animate: {
      y: [0, -4, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: luxuryDurations.presenceField,
        repeat: Infinity,
        ease: luxuryEasing.silk,
      },
    },
  },
  
  iconHover: {
    rotate: [0, -10, 10, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: luxuryDurations.contemplative,
      ease: luxuryEasing.diamond,
    },
  },
  
  // Shimmer effects (Luxury fabric-inspired)
  shimmerPulse: {
    animate: {
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.05, 1],
      transition: {
        duration: luxuryDurations.breathingCycle,
        repeat: Infinity,
        ease: luxuryEasing.silk,
      },
    },
  },
  
  // Loading states (Premium waiting experience)
  luxuryLoader: {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.1, 1],
      transition: {
        rotate: {
          duration: luxuryDurations.presenceField,
          repeat: Infinity,
          ease: "linear",
        },
        scale: {
          duration: luxuryDurations.breathingCycle,
          repeat: Infinity,
          ease: luxuryEasing.silk,
        },
      },
    },
  },
};

// Luxury gesture feedback (Haptic-like visual responses)
export const luxuryGestures = {
  swipeRight: {
    x: [0, 20, 0],
    opacity: [1, 0.8, 1],
    transition: {
      duration: luxuryDurations.interfaceShift,
      ease: luxuryEasing.cashmere,
    },
  },
  
  swipeLeft: {
    x: [0, -20, 0],
    opacity: [1, 0.8, 1],
    transition: {
      duration: luxuryDurations.interfaceShift,
      ease: luxuryEasing.cashmere,
    },
  },
  
  pullToRefresh: {
    y: [0, 10, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: luxuryDurations.ceremonial,
      ease: luxuryEasing.platinum,
    },
  },
};

// Environmental effects (Luxury ambience)
export const luxuryEnvironment = {
  particleFloat: {
    y: [0, -100, 0],
    x: [0, 20, 0],
    opacity: [0, 0.8, 0],
    scale: [0.5, 1.2, 0.5],
    transition: {
      duration: luxuryDurations.consciousnessFlow,
      repeat: Infinity,
      ease: luxuryEasing.silk,
    },
  },
  
  ambientGlow: {
    scale: [1, 1.15, 1],
    opacity: [0.1, 0.3, 0.1],
    rotate: [0, 360],
    transition: {
      scale: {
        duration: luxuryDurations.presenceField,
        repeat: Infinity,
        ease: luxuryEasing.silk,
      },
      rotate: {
        duration: luxuryDurations.consciousnessFlow * 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
  
  consciousnessOrb: {
    rotateZ: [0, 360],
    scale: [1, 1.05, 1],
    transition: {
      rotateZ: {
        duration: luxuryDurations.consciousnessFlow * 1.5,
        repeat: Infinity,
        ease: "linear",
      },
      scale: {
        duration: luxuryDurations.breathingCycle,
        repeat: Infinity,
        ease: luxuryEasing.silk,
      },
    },
  },
};

// Export convenience functions for common patterns
export const withLuxuryHover = (baseProps: any) => ({
  ...baseProps,
  whileHover: luxuryTransitions.cardHover,
  whileTap: luxuryTransitions.cardPress,
});

export const withLuxuryButton = (baseProps: any) => ({
  ...baseProps,
  whileHover: luxuryTransitions.buttonHover,
  whileTap: luxuryTransitions.buttonPress,
});

export const withStaggeredReveal = (children: unknown[], delay = 0.1) => ({
  initial: "initial",
  animate: "animate",
  variants: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: delay,
        delayChildren: 0.2,
      },
    },
  },
});

// Sacred7 consciousness-specific animations
export const sacred7Animations = {
  presencePulse: {
    animate: {
      boxShadow: [
        "0 0 20px rgba(255,215,0,0.3)",
        "0 0 40px rgba(255,215,0,0.6)",
        "0 0 20px rgba(255,215,0,0.3)",
      ],
      transition: {
        duration: luxuryDurations.breathingCycle,
        repeat: Infinity,
        ease: luxuryEasing.silk,
      },
    },
  },
  
  captureFlow: {
    animate: {
      background: [
        "linear-gradient(45deg, rgba(65,105,225,0.1) 0%, transparent 50%)",
        "linear-gradient(225deg, rgba(65,105,225,0.2) 0%, transparent 50%)",
        "linear-gradient(45deg, rgba(65,105,225,0.1) 0%, transparent 50%)",
      ],
      transition: {
        duration: luxuryDurations.presenceField,
        repeat: Infinity,
        ease: luxuryEasing.silk,
      },
    },
  },
};