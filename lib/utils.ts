import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safely replace low contrast text classes
export function fixContrast(className: string): string {
  return className
    .replace(/text-white\/50/g, 'text-white/70')
    .replace(/text-white\/40/g, 'text-white/60')
    .replace(/text-white\/30/g, 'text-white/60')
    .replace(/text-gray-500/g, 'text-gray-400')
    .replace(/text-gray-600/g, 'text-gray-400');
}