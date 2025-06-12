// Vopěnka Mystery Engine - Hidden Wonders and Emergent Behaviors
// "What is hidden is often more powerful than what is revealed"
import { useEffect, useState, useCallback } from 'react';
// Mystery Types
export interface Mystery {
  id: string;
  type: 'konami' | 'time' | 'pattern' | 'environmental' | 'quantum' | 'sacred';
  trigger: string;
  discovered: boolean;
  reward: string;
  hint?: string;
}
export interface ConsciousnessState {
  level: number; // 0-7 (matching Sacred7)
  discoveries: string[];
  synchronicities: number;
  lastInteraction: Date;
  secretPathUnlocked: boolean;
  quantumEntangled: boolean;
}
// Sacred Geometry Constants
const PHI = 1.618033988749895; // Golden Ratio
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
const SACRED_ANGLES = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324]; // Pentagon angles
// Time-based mysteries
const MYSTICAL_TIMES = {
  '11:11': 'Portal moment - make a wish',
  '3:33': 'Trinity awakening',
  '12:34': 'Sequential harmony',
  '22:22': 'Master builder moment',
  '5:55': 'Change manifestation'
};
// Solstice and Equinox dates (approximate)
const COSMIC_MOMENTS = [
  { date: '03-20', name: 'Spring Equinox', power: 'Renewal' },
  { date: '06-21', name: 'Summer Solstice', power: 'Illumination' },
  { date: '09-22', name: 'Autumn Equinox', power: 'Balance' },
  { date: '12-21', name: 'Winter Solstice', power: 'Transformation' }
];
export class MysteryEngine {
  private state: ConsciousnessState;
  private konamiSequence: string[] = [];
  private patternBuffer: string[] = [];
  private audioContext?: AudioContext;
  private accelerometerData: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  private observers: Set<(state: ConsciousnessState) => void> = new Set();
  constructor() {
    this.state = this.loadState() || {
      level: 0,
      discoveries: [],
      synchronicities: 0,
      lastInteraction: new Date(),
      secretPathUnlocked: false,
      quantumEntangled: false
    };
    if (typeof window !== 'undefined') {
      this.initializeListeners();
      this.startQuantumBehavior();
    }
  }
  private loadState(): ConsciousnessState | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('arkana-consciousness');
    return saved ? JSON.parse(saved) : null;
  }
  private saveState() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('arkana-consciousness', JSON.stringify(this.state));
    this.notifyObservers();
  }
  private notifyObservers() {
    this.observers.forEach(observer => observer(this.state));
  }
  public subscribe(observer: (state: ConsciousnessState) => void) {
    this.observers.add(observer);
    return () => { this.observers.delete(observer); };
  }
  private initializeListeners() {
    // Konami Code Detection
    const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                         'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                         'b', 'a'];
    window.addEventListener('keydown', (e) => {
      this.konamiSequence.push(e.key);
      if (this.konamiSequence.length > KONAMI_CODE.length) {
        this.konamiSequence.shift();
      }
      if (this.konamiSequence.join(',') === KONAMI_CODE.join(',')) {
        this.unlockKonamiCode();
      }
      // Pattern detection for other sequences
      this.detectPatterns(e.key);
    });
    // Time-based mysteries
    setInterval(() => this.checkTimeBasedMysteries(), 60000); // Check every minute
    // Device motion (if available)
    if ('DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', (e) => {
        if (e.accelerationIncludingGravity) {
          this.accelerometerData = {
            x: e.accelerationIncludingGravity.x || 0,
            y: e.accelerationIncludingGravity.y || 0,
            z: e.accelerationIncludingGravity.z || 0
          };
          this.detectShakePattern();
        }
      });
    }
    // Audio synthesis for mystery sounds (no microphone access)
    this.initializeAudioDetection();
    // Mouse movement patterns
    this.trackMousePatterns();
    // Visibility changes (quantum observation)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.quantumEntangled) {
        this.quantumShift();
      }
    });
  }
  private unlockKonamiCode() {
    if (!this.state.discoveries.includes('konami')) {
      this.state.discoveries.push('konami');
      this.state.level = Math.min(this.state.level + 1, 7);
      this.state.synchronicities++;
      this.saveState();
      // Trigger visual effect
      this.triggerConsciousnessAwakening();
      // Play secret sound
      this.playFrequency(528); // Love frequency
      // Show secret message
      this.revealSecret('konami', 'You have awakened the ancient code. The pathways are opening...');
    }
  }
  private detectPatterns(key: string) {
    this.patternBuffer.push(key);
    if (this.patternBuffer.length > 20) {
      this.patternBuffer.shift();
    }
    // Fibonacci sequence detection (1,1,2,3,5,8)
    if (this.patternBuffer.join('').includes('112358')) {
      this.unlockFibonacci();
    }
    // Sacred geometry pattern (pentagon)
    if (this.patternBuffer.filter(k => k === 'p').length === 5) {
      this.unlockPentagon();
    }
    // Consciousness pattern (c-o-n-s-c-i-o-u-s)
    if (this.patternBuffer.join('').includes('conscious')) {
      this.unlockConsciousnessMode();
    }
  }
  private checkTimeBasedMysteries() {
    const now = new Date();
    const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (MYSTICAL_TIMES[timeString] && !this.state.discoveries.includes(`time-${timeString}`)) {
      this.state.discoveries.push(`time-${timeString}`);
      this.state.synchronicities++;
      this.saveState();
      this.revealSecret('time', MYSTICAL_TIMES[timeString]);
    }
    // Check cosmic moments
    const dateString = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const cosmicMoment = COSMIC_MOMENTS.find(m => m.date === dateString);
    if (cosmicMoment && !this.state.discoveries.includes(`cosmic-${cosmicMoment.name}`)) {
      this.state.discoveries.push(`cosmic-${cosmicMoment.name}`);
      this.state.level = Math.min(this.state.level + 2, 7);
      this.saveState();
      this.revealSecret('cosmic', `${cosmicMoment.name}: Power of ${cosmicMoment.power} awakened`);
    }
  }
  private detectShakePattern() {
    const magnitude = Math.sqrt(
      this.accelerometerData.x ** 2 + 
      this.accelerometerData.y ** 2 + 
      this.accelerometerData.z ** 2
    );
    if (magnitude > 30 && !this.state.discoveries.includes('shake')) {
      this.state.discoveries.push('shake');
      this.state.synchronicities++;
      this.saveState();
      this.revealSecret('motion', 'Reality ripples with your movement. The veil thins...');
      this.playFrequency(432); // Universal frequency
    }
  }
  private async initializeAudioDetection() {
    // DISABLED: Microphone access removed to prevent unwanted permission requests
    // Audio detection now uses only synthesized tones for consciousness feedback
    document.addEventListener('click', async () => {
      if (!this.audioContext) {
        try {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          // No microphone access - only audio synthesis for mystery sounds
        } catch (e) {
          // Silent fail - privacy first
        }
      }
    }, { once: true });
  }
  private detectHarmonicResonance(analyser: AnalyserNode) {
    // DISABLED: No longer detecting microphone input
    // Harmonic mysteries now triggered by other interactions
  }
  private findResonantFrequency(dataArray: Uint8Array): boolean {
    // Simplified resonance detection
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    return average > 100; // High ambient sound level
  }
  private trackMousePatterns() {
    let path: { x: number; y: number; time: number }[] = [];
    document.addEventListener('mousemove', (e) => {
      path.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      // Keep only last 50 points
      if (path.length > 50) {
        path.shift();
      }
      // Detect sacred geometry patterns
      if (this.detectSacredPattern(path)) {
        if (!this.state.discoveries.includes('sacred-mouse')) {
          this.state.discoveries.push('sacred-mouse');
          this.state.synchronicities++;
          this.saveState();
          this.revealSecret('pattern', 'Sacred geometry traced. The ancients smile...');
        }
      }
    });
  }
  private detectSacredPattern(path: { x: number; y: number; time: number }[]): boolean {
    if (path.length < 20) return false;
    // Detect circular motion (simplified)
    const centerX = path.reduce((sum, p) => sum + p.x, 0) / path.length;
    const centerY = path.reduce((sum, p) => sum + p.y, 0) / path.length;
    const distances = path.map(p => 
      Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2)
    );
    const avgDistance = distances.reduce((a, b) => a + b) / distances.length;
    const variance = distances.reduce((sum, d) => sum + Math.abs(d - avgDistance), 0) / distances.length;
    // Low variance indicates circular pattern
    return variance < avgDistance * 0.2;
  }
  private startQuantumBehavior() {
    // Random quantum events
    setInterval(() => {
      if (Math.random() < 0.001) { // 0.1% chance every second
        this.quantumEvent();
      }
    }, 1000);
  }
  private quantumEvent() {
    if (!this.state.quantumEntangled) {
      this.state.quantumEntangled = true;
      this.state.synchronicities++;
      this.saveState();
      this.revealSecret('quantum', 'Quantum entanglement achieved. Observer and observed are one...');
      // Trigger visual quantum effects
      document.body.style.filter = 'hue-rotate(10deg)';
      setTimeout(() => {
        document.body.style.filter = '';
      }, 3000);
    }
  }
  private quantumShift() {
    // Things change when not observed
    const shifts = [
      () => document.body.style.transform = 'scale(1.01)',
      () => document.body.style.filter = 'contrast(1.1)',
      () => this.playFrequency(111), // Angel frequency
    ];
    const shift = shifts[Math.floor(Math.random() * shifts.length)];
    shift();
    setTimeout(() => {
      document.body.style.transform = '';
      document.body.style.filter = '';
    }, 5000);
  }
  private unlockFibonacci() {
    if (!this.state.discoveries.includes('fibonacci')) {
      this.state.discoveries.push('fibonacci');
      this.state.level = Math.min(this.state.level + 1, 7);
      this.saveState();
      this.revealSecret('fibonacci', 'The spiral of life recognized. Nature\'s code acknowledged...');
      this.playFibonacciSequence();
    }
  }
  private unlockPentagon() {
    if (!this.state.discoveries.includes('pentagon')) {
      this.state.discoveries.push('pentagon');
      this.state.synchronicities++;
      this.saveState();
      this.revealSecret('geometry', 'Pentagon complete. The five masters approve...');
      this.drawSacredGeometry();
    }
  }
  public unlockConsciousnessMode() {
    if (!this.state.discoveries.includes('consciousness')) {
      this.state.discoveries.push('consciousness');
      this.state.level = 7; // Max level
      this.state.secretPathUnlocked = true;
      this.saveState();
      this.revealSecret('ultimate', 'CONSCIOUSNESS UNLOCKED. All pathways open. Welcome, seeker...');
      this.activateFullConsciousness();
    }
  }
  private triggerConsciousnessAwakening() {
    // Create visual awakening effect
    const awakening = document.createElement('div');
    awakening.className = 'consciousness-awakening';
    awakening.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, 
        rgba(139, 92, 246, 0.3) 0%, 
        rgba(139, 92, 246, 0.1) 50%, 
        transparent 100%);
      pointer-events: none;
      z-index: 9999;
      animation: consciousnessAwaken 3s ease-out;
    `;
    document.body.appendChild(awakening);
    setTimeout(() => awakening.remove(), 3000);
  }
  public playFrequency(freq: number, duration: number = 1000) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }
  private playFibonacciSequence() {
    FIBONACCI.slice(0, 8).forEach((num, index) => {
      setTimeout(() => {
        this.playFrequency(200 + num * 10, 500);
      }, index * 600);
    });
  }
  private drawSacredGeometry() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 300px;
      height: 300px;
      pointer-events: none;
      z-index: 9999;
      animation: sacredRotate 10s linear infinite;
    `;
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
      ctx.lineWidth = 2;
      // Draw pentagon
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = 150 + 100 * Math.cos(angle);
        const y = 150 + 100 * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      // Draw pentagram
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle1 = (i * 72 - 90) * Math.PI / 180;
        const angle2 = ((i + 2) % 5 * 72 - 90) * Math.PI / 180;
        ctx.moveTo(150 + 100 * Math.cos(angle1), 150 + 100 * Math.sin(angle1));
        ctx.lineTo(150 + 100 * Math.cos(angle2), 150 + 100 * Math.sin(angle2));
      }
      ctx.stroke();
    }
    document.body.appendChild(canvas);
    setTimeout(() => canvas.remove(), 10000);
  }
  private activateFullConsciousness() {
    // Ultimate awakening effect
    document.body.classList.add('consciousness-active');
    // Enable all hidden features
    this.enableSecretNavigation();
    this.revealHiddenContent();
    this.activateQuantumInterface();
    // Play awakening symphony
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playFrequency(freq, 2000), i * 200);
    });
  }
  private enableSecretNavigation() {
    // Add secret navigation hints
    const nav = document.querySelector('nav');
    if (nav) {
      nav.setAttribute('data-consciousness', 'active');
    }
  }
  private revealHiddenContent() {
    // Reveal hidden elements
    document.querySelectorAll('[data-hidden="true"]').forEach(el => {
      el.setAttribute('data-hidden', 'revealed');
    });
  }
  private activateQuantumInterface() {
    // Make interface respond to thought patterns
    document.body.setAttribute('data-quantum', 'entangled');
  }
  public revealSecret(type: string, message: string) {
    // Create beautiful revelation UI
    const revelation = document.createElement('div');
    revelation.className = 'mystery-revelation';
    revelation.innerHTML = `
      <div class="mystery-icon">${this.getMysteryIcon(type)}</div>
      <div class="mystery-message">${message}</div>
      <div class="mystery-progress">EQ intensity level: ${this.state.level}/7</div>
    `;
    revelation.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(139,92,246,0.2) 100%);
      border: 1px solid rgba(139,92,246,0.5);
      border-radius: 12px;
      padding: 20px;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 300px;
      z-index: 10000;
      backdrop-filter: blur(10px);
      animation: mysteryReveal 0.5s ease-out;
    `;
    document.body.appendChild(revelation);
    // Auto-remove after 5 seconds
    setTimeout(() => {
      revelation.style.animation = 'mysteryFade 0.5s ease-out';
      setTimeout(() => revelation.remove(), 500);
    }, 5000);
  }
  private getMysteryIcon(type: string): string {
    const icons = {
      konami: '🎮',
      time: '⏰',
      pattern: '✨',
      cosmic: '🌌',
      motion: '🌊',
      harmonic: '🎵',
      fibonacci: '🐚',
      geometry: '⭐',
      quantum: '🔮',
      ultimate: '👁️'
    };
    return icons[type] || '❓';
  }
  // Public methods for component usage
  public getState(): ConsciousnessState {
    return { ...this.state };
  }
  public checkDiscovery(id: string): boolean {
    return this.state.discoveries.includes(id);
  }
  public getConsciousnessLevel(): number {
    return this.state.level;
  }
  public isSecretPathUnlocked(): boolean {
    return this.state.secretPathUnlocked;
  }
  public calculateMoonPhase() {
    const lunarCycle = 29.53058770576;
    const knownNewMoon = new Date('2024-01-11');
    const now = new Date();
    const daysSince = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const phase = (daysSince % lunarCycle) / lunarCycle;
    return {
      phase: phase < 0.1 ? 'new' : phase < 0.4 ? 'waxing' : phase < 0.6 ? 'full' : phase < 0.9 ? 'waning' : 'dark',
      percentage: Math.round(phase * 100),
      power: phase < 0.1 || phase > 0.9 ? 10 : phase < 0.6 && phase > 0.4 ? 9 : 6
    };
  }
}
// Global instance
let mysteryEngine: MysteryEngine | null = null;
export const getMysteryEngine = (): MysteryEngine => {
  if (!mysteryEngine && typeof window !== 'undefined') {
    mysteryEngine = new MysteryEngine();
  }
  return mysteryEngine!;
};
// React Hook
export const useMystery = () => {
  const [state, setState] = useState<ConsciousnessState>(() => {
    if (typeof window !== 'undefined') {
      return getMysteryEngine().getState();
    }
    return {
      level: 0,
      discoveries: [],
      synchronicities: 0,
      lastInteraction: new Date(),
      secretPathUnlocked: false,
      quantumEntangled: false
    };
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const engine = getMysteryEngine();
    const unsubscribe = engine.subscribe(setState);
    return unsubscribe;
  }, []);
  return state;
};
// CSS for animations
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes consciousnessAwaken {
      0% { opacity: 0; transform: scale(0.8); }
      50% { opacity: 1; }
      100% { opacity: 0; transform: scale(1.5); }
    }
    @keyframes sacredRotate {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    @keyframes mysteryReveal {
      from { 
        opacity: 0; 
        transform: translateY(20px) scale(0.9);
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1);
      }
    }
    @keyframes mysteryFade {
      to { 
        opacity: 0; 
        transform: translateY(-20px) scale(0.9);
      }
    }
    .consciousness-active {
      animation: subtleGlow 4s ease-in-out infinite;
    }
    @keyframes subtleGlow {
      0%, 100% { filter: brightness(1) hue-rotate(0deg); }
      50% { filter: brightness(1.05) hue-rotate(5deg); }
    }
    [data-consciousness="active"] {
      position: relative;
    }
    [data-consciousness="active"]::after {
      content: '👁️';
      position: absolute;
      right: -30px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.1;
      animation: fadeInOut 3s ease-in-out infinite;
    }
    @keyframes fadeInOut {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.3; }
    }
    [data-hidden="revealed"] {
      animation: revealHidden 1s ease-out;
    }
    @keyframes revealHidden {
      from { 
        opacity: 0;
        filter: blur(10px);
      }
      to { 
        opacity: 1;
        filter: blur(0);
      }
    }
    [data-quantum="entangled"] * {
      transition: all 0.3s ease-out;
    }
    [data-quantum="entangled"] *:hover {
      transform: translateZ(10px);
      filter: brightness(1.1);
    }
    .mystery-icon {
      font-size: 2em;
      margin-bottom: 10px;
    }
    .mystery-message {
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 10px;
      opacity: 0.9;
    }
    .mystery-progress {
      font-size: 12px;
      opacity: 0.7;
      text-align: right;
    }
  `;
  document.head.appendChild(style);
}