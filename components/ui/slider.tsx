"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value?: number[]
  onValueChange?: (value: number[]) => void
  defaultValue?: number[]
  max?: number
  min?: number
  step?: number
  disabled?: boolean
  className?: string
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueChange, defaultValue = [0], max = 100, min = 0, step = 1, disabled = false, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const currentValue = value || internalValue

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseInt(event.target.value)]
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }

    return (
      <div
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
      >
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <div 
            className="absolute h-full bg-primary" 
            style={{ width: `${((currentValue[0] - min) / (max - min)) * 100}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue[0]}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"