// Biometric Consciousness Engine
// Privacy-first approach with local processing only

import { useEffect, useState, useCallback, useRef } from 'react';

export interface ConsciousnessState {
  level: number; // 0-1 EQ calibration
  frequency: number; // Dominant brainwave frequency simulation
  amplitude: number; // Energy level
  color: string; // Hex color representation
  emotion: EmotionState;
  pattern: ConsciousnessPattern;
}

export interface EmotionState {
  primary: string;
  secondary: string;
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0 to 1 (calm to excited)
}

export type ConsciousnessPattern = 
  | 'focused' 
  | 'creative' 
  | 'meditative' 
  | 'analytical' 
  | 'intuitive' 
  | 'flowing';

// Mouse movement patterns for EQ state analysis
interface MousePattern {
  velocity: number;
  acceleration: number;
  jerkiness: number;
  circularityScore: number;
  dwellTime: number;
}

// Biometric data processor
export class BiometricEngine {
  private mouseHistory: Array<{ x: number; y: number; timestamp: number }> = [];
  private readonly historySize = 50;
  private calibrationData: Partial<ConsciousnessState> = {};
  
  // Process mouse movement into consciousness indicators
  processMouseMovement(x: number, y: number): MousePattern {
    const now = Date.now();
    this.mouseHistory.push({ x, y, timestamp: now });
    
    // Keep history size manageable
    if (this.mouseHistory.length > this.historySize) {
      this.mouseHistory.shift();
    }
    
    // Need at least 3 points for analysis
    if (this.mouseHistory.length < 3) {
      return {
        velocity: 0,
        acceleration: 0,
        jerkiness: 0,
        circularityScore: 0,
        dwellTime: 0
      };
    }
    
    // Calculate velocity
    const recent = this.mouseHistory.slice(-10);
    const velocities: number[] = [];
    
    for (let i = 1; i < recent.length; i++) {
      const dx = recent[i].x - recent[i-1].x;
      const dy = recent[i].y - recent[i-1].y;
      const dt = recent[i].timestamp - recent[i-1].timestamp;
      const v = Math.sqrt(dx*dx + dy*dy) / (dt || 1);
      velocities.push(v);
    }
    
    const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    
    // Calculate acceleration (change in velocity)
    const accelerations: number[] = [];
    for (let i = 1; i < velocities.length; i++) {
      accelerations.push(Math.abs(velocities[i] - velocities[i-1]));
    }
    const avgAcceleration = accelerations.reduce((a, b) => a + b, 0) / accelerations.length || 0;
    
    // Calculate jerkiness (variance in movement)
    const variance = velocities.reduce((sum, v) => sum + Math.pow(v - avgVelocity, 2), 0) / velocities.length;
    const jerkiness = Math.sqrt(variance) / (avgVelocity + 1);
    
    // Calculate circularity (how circular the movement is)
    const circularityScore = this.calculateCircularity(recent);
    
    // Calculate dwell time (time spent in similar position)
    const dwellTime = this.calculateDwellTime(recent);
    
    return {
      velocity: avgVelocity,
      acceleration: avgAcceleration,
      jerkiness,
      circularityScore,
      dwellTime
    };
  }
  
  // Analyze movement patterns to determine EQ state
  analyzeConsciousness(pattern: MousePattern): ConsciousnessState {
    // Map mouse patterns to consciousness indicators
    let consciousnessLevel = 0.5; // Base level
    let frequency = 10; // Hz (Alpha wave default)
    let amplitude = 0.5;
    let emotionValence = 0;
    let emotionArousal = 0.5;
    let pattern_type: ConsciousnessPattern = 'flowing';
    
    // High velocity + low jerkiness = focused state
    if (pattern.velocity > 5 && pattern.jerkiness < 0.3) {
      consciousnessLevel += 0.2;
      frequency = 30; // Beta waves
      pattern_type = 'focused';
      emotionArousal = 0.8;
    }
    
    // Circular movements = creative/meditative
    if (pattern.circularityScore > 0.7) {
      consciousnessLevel += 0.15;
      frequency = 8; // Alpha/Theta border
      pattern_type = pattern.velocity > 3 ? 'creative' : 'meditative';
      emotionValence = 0.3;
      emotionArousal = 0.3;
    }
    
    // High dwell time = contemplative/analytical
    if (pattern.dwellTime > 500) {
      frequency = 4; // Theta waves
      pattern_type = 'analytical';
      amplitude = 0.3;
      emotionArousal = 0.2;
    }
    
    // Erratic movement = stressed/searching
    if (pattern.jerkiness > 0.8) {
      consciousnessLevel -= 0.1;
      frequency = 40; // High Beta/Gamma
      emotionValence = -0.3;
      emotionArousal = 0.9;
    }
    
    // Smooth, moderate movement = flow state
    if (pattern.velocity > 2 && pattern.velocity < 5 && pattern.jerkiness < 0.4) {
      consciousnessLevel += 0.3;
      frequency = 12; // Alpha waves
      pattern_type = 'flowing';
      emotionValence = 0.5;
      emotionArousal = 0.6;
      amplitude = 0.8;
    }
    
    // Normalize EQ intensity level
    consciousnessLevel = Math.max(0, Math.min(1, consciousnessLevel));
    
    // Determine primary emotion based on valence/arousal
    const emotion = this.mapToEmotion(emotionValence, emotionArousal);
    
    // Generate color based on EQ state
    const color = this.generateConsciousnessColor(consciousnessLevel, frequency, pattern_type);
    
    return {
      level: consciousnessLevel,
      frequency,
      amplitude,
      color,
      emotion,
      pattern: pattern_type
    };
  }
  
  // Helper: Calculate how circular a movement path is
  private calculateCircularity(points: Array<{ x: number; y: number }>): number {
    if (points.length < 4) return 0;
    
    // Find center of mass
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    
    // Calculate distances from center
    const distances = points.map(p => 
      Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
    );
    
    // Calculate variance in distances (lower = more circular)
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length;
    
    // Convert to 0-1 score (1 = perfect circle)
    return Math.max(0, 1 - (variance / (avgDistance + 1)));
  }
  
  // Helper: Calculate time spent in similar position
  private calculateDwellTime(points: Array<{ x: number; y: number; timestamp: number }>): number {
    if (points.length < 2) return 0;
    
    const threshold = 50; // pixels
    let dwellTime = 0;
    const lastPoint = points[points.length - 1];
    
    for (let i = points.length - 2; i >= 0; i--) {
      const distance = Math.sqrt(
        Math.pow(points[i].x - lastPoint.x, 2) + 
        Math.pow(points[i].y - lastPoint.y, 2)
      );
      
      if (distance < threshold) {
        dwellTime = lastPoint.timestamp - points[i].timestamp;
      } else {
        break;
      }
    }
    
    return dwellTime;
  }
  
  // Map valence/arousal to emotion labels
  private mapToEmotion(valence: number, arousal: number): EmotionState {
    let primary = 'neutral';
    let secondary = 'calm';
    
    // Russell's Circumplex Model of Affect
    if (valence > 0.3 && arousal > 0.6) {
      primary = 'excited';
      secondary = 'joyful';
    } else if (valence > 0.3 && arousal <= 0.6) {
      primary = 'content';
      secondary = 'peaceful';
    } else if (valence <= -0.3 && arousal > 0.6) {
      primary = 'stressed';
      secondary = 'anxious';
    } else if (valence <= -0.3 && arousal <= 0.6) {
      primary = 'melancholic';
      secondary = 'tired';
    } else if (arousal > 0.7) {
      primary = 'alert';
      secondary = 'focused';
    } else if (arousal < 0.3) {
      primary = 'relaxed';
      secondary = 'meditative';
    }
    
    return { primary, secondary, valence, arousal };
  }
  
  // Generate color based on EQ state
  private generateConsciousnessColor(level: number, frequency: number, pattern: ConsciousnessPattern): string {
    // Base colors for different states
    const colors = {
      focused: { r: 255, g: 100, b: 0 },    // Orange
      creative: { r: 147, g: 0, b: 211 },   // Purple
      meditative: { r: 0, g: 128, b: 255 }, // Blue
      analytical: { r: 0, g: 255, b: 128 }, // Green
      intuitive: { r: 255, g: 0, b: 255 },  // Magenta
      flowing: { r: 0, g: 255, b: 255 }     // Cyan
    };
    
    const baseColor = colors[pattern];
    
    // Modulate by EQ intensity level
    const r = Math.round(baseColor.r * (0.5 + level * 0.5));
    const g = Math.round(baseColor.g * (0.5 + level * 0.5));
    const b = Math.round(baseColor.b * (0.5 + level * 0.5));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}

// React hook for EQ state analysis
export function useConsciousnessDetection() {
  const [consciousness, setConsciousness] = useState<ConsciousnessState>({
    level: 0.5,
    frequency: 10,
    amplitude: 0.5,
    color: '#00FFFF',
    emotion: { primary: 'neutral', secondary: 'calm', valence: 0, arousal: 0.5 },
    pattern: 'flowing'
  });
  
  const engineRef = useRef(new BiometricEngine());
  const lastUpdateRef = useRef(0);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    
    // Throttle updates to 60fps
    if (now - lastUpdateRef.current < 16) return;
    lastUpdateRef.current = now;
    
    // Process mouse movement
    const pattern = engineRef.current.processMouseMovement(e.clientX, e.clientY);
    
    // Analyze consciousness
    const newState = engineRef.current.analyzeConsciousness(pattern);
    
    // Smooth transitions
    setConsciousness(prev => ({
      level: prev.level * 0.9 + newState.level * 0.1,
      frequency: prev.frequency * 0.9 + newState.frequency * 0.1,
      amplitude: prev.amplitude * 0.9 + newState.amplitude * 0.1,
      color: newState.color, // Don't smooth color
      emotion: newState.emotion,
      pattern: newState.pattern
    }));
  }, []);
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);
  
  return consciousness;
}

// Privacy-compliant camera EQ state analysis (future implementation)
export function useCameraConsciousness() {
  // This would use TensorFlow.js with a privacy-preserving model
  // that runs entirely in the browser with no data transmission
  // For now, return default state
  return {
    faceDetected: false,
    gazeDirection: { x: 0, y: 0 },
    blinkRate: 15, // blinks per minute
    microExpressions: []
  };
}