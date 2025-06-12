'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

interface BreathingFormProps {
  onSubmit: (data: FormData) => void | Promise<void>;
  className?: string;
  fields: FormField[];
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  required?: boolean;
  validation?: (value: string) => string | null;
}

interface FormData {
  [key: string]: string;
}

export default function BreathingForm({ onSubmit, className = '', fields }: BreathingFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [typingRhythm, setTypingRhythm] = useState<'slow' | 'moderate' | 'fast'>('moderate');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPace, setUserPace] = useState(1); // Multiplier for animations
  
  const typingHistory = useRef<number[]>([]);
  const lastKeyTime = useRef(Date.now());
  const formProgress = useMotionValue(0);
  
  // Transform form progress to visual feedback
  const progressOpacity = useTransform(formProgress, [0, 100], [0.3, 1]);
  const progressScale = useTransform(formProgress, [0, 100], [0.98, 1]);

  // Calculate form completion percentage
  useEffect(() => {
    const filledFields = Object.keys(formData).filter(key => formData[key].length > 0).length;
    const progress = (filledFields / fields.length) * 100;
    formProgress.set(progress);
  }, [formData, fields, formProgress]);

  // Detect typing rhythm
  const detectTypingRhythm = useCallback(() => {
    const currentTime = Date.now();
    const timeDelta = currentTime - lastKeyTime.current;
    
    if (timeDelta < 5000) { // Only track if typing within 5 seconds
      typingHistory.current.push(timeDelta);
      
      // Keep only last 10 keystrokes
      if (typingHistory.current.length > 10) {
        typingHistory.current.shift();
      }
      
      // Calculate average typing speed
      const avgSpeed = typingHistory.current.reduce((a, b) => a + b, 0) / typingHistory.current.length;
      
      if (avgSpeed < 200) {
        setTypingRhythm('fast');
        setUserPace(0.7);
      } else if (avgSpeed > 400) {
        setTypingRhythm('slow');
        setUserPace(1.3);
      } else {
        setTypingRhythm('moderate');
        setUserPace(1);
      }
    }
    
    lastKeyTime.current = currentTime;
  }, []);

  // Handle input changes with rhythm detection
  const handleChange = (name: string, value: string) => {
    detectTypingRhythm();
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Gentle validation with natural timing
  const validateField = useCallback((name: string, value: string) => {
    const field = fields.find(f => f.name === name);
    if (!field) return;

    setTimeout(() => {
      if (field.required && !value) {
        setErrors(prev => ({ ...prev, [name]: 'This field flows with purpose' }));
      } else if (field.validation) {
        const error = field.validation(value);
        if (error) {
          setErrors(prev => ({ ...prev, [name]: error }));
        }
      }
    }, 1000 * userPace); // Delay based on user's pace
  }, [fields, userPace]);

  // Handle form submission with breathing animation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    let hasErrors = false;
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'This field awaits your wisdom';
        hasErrors = true;
      } else if (field.validation && formData[field.name]) {
        const error = field.validation(formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
          hasErrors = true;
        }
      }
    });
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000 * userPace);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      style={{
        opacity: progressOpacity,
        scale: progressScale
      }}
    >
      {/* Progress indicator with organic movement */}
      <motion.div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-cyber-teal to-accent-vibrant-magenta"
          animate={{
            width: `${formProgress.get()}%`,
          }}
          transition={{
            duration: 0.8 * userPace,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      </motion.div>

      {/* Form fields with breathing animations */}
      <AnimatePresence mode="sync">
        {fields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5 * userPace,
              delay: index * 0.1 * userPace,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <BreathingField
              field={field}
              value={formData[field.name] || ''}
              error={errors[field.name]}
              onChange={handleChange}
              onBlur={() => validateField(field.name, formData[field.name] || '')}
              onFocus={() => setFocusedField(field.name)}
              isFocused={focusedField === field.name}
              typingRhythm={typingRhythm}
              userPace={userPace}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Submit button with organic states */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: fields.length * 0.1 * userPace,
          duration: 0.6 * userPace
        }}
      >
        <BreathingSubmitButton
          isSubmitting={isSubmitting}
          isComplete={formProgress.get() === 100}
          userPace={userPace}
        />
      </motion.div>

      {/* Rhythm indicator (subtle feedback) */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: focusedField ? 0.3 : 0 }}
      >
        <RhythmIndicator rhythm={typingRhythm} />
      </motion.div>
    </motion.form>
  );
}

// Individual form field with breathing behavior
interface BreathingFieldProps {
  field: FormField;
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  isFocused: boolean;
  typingRhythm: 'slow' | 'moderate' | 'fast';
  userPace: number;
}

function BreathingField({
  field,
  value,
  error,
  onChange,
  onBlur,
  onFocus,
  isFocused,
  typingRhythm,
  userPace
}: BreathingFieldProps) {
  const breathingScale = useMotionValue(1);
  
  // Breathing animation when focused
  useEffect(() => {
    if (isFocused) {
      const interval = setInterval(() => {
        breathingScale.set(1.02);
        setTimeout(() => breathingScale.set(1), 500 * userPace);
      }, 1000 * userPace);
      
      return () => clearInterval(interval);
    }
  }, [isFocused, breathingScale, userPace]);

  const fieldVariants = {
    idle: {
      scale: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    focused: {
      scale: breathingScale.get(),
      borderColor: 'rgba(0, 245, 212, 0.5)',
    },
    error: {
      scale: 1,
      borderColor: 'rgba(255, 100, 100, 0.5)',
    }
  };

  return (
    <div className="space-y-2">
      <motion.label
        htmlFor={field.name}
        className="block text-sm font-medium text-white/70"
        animate={{
          color: isFocused ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)'
        }}
        transition={{ duration: 0.3 * userPace }}
      >
        {field.label}
      </motion.label>
      
      <motion.div
        variants={fieldVariants}
        initial="idle"
        animate={error ? "error" : isFocused ? "focused" : "idle"}
        transition={{
          duration: 0.3 * userPace,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {field.type === 'textarea' ? (
          <motion.textarea
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl
                       text-white placeholder-white/30 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-accent-cyber-teal/50
                       border border-white/10"
            rows={4}
            style={{ scale: breathingScale }}
          />
        ) : (
          <motion.input
            id={field.name}
            name={field.name}
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl
                       text-white placeholder-white/30 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-accent-cyber-teal/50
                       border border-white/10"
            style={{ scale: breathingScale }}
          />
        )}
      </motion.div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 * userPace }}
            className="flex items-center space-x-2 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Submit button with organic states
function BreathingSubmitButton({ 
  isSubmitting, 
  isComplete, 
  userPace 
}: { 
  isSubmitting: boolean; 
  isComplete: boolean; 
  userPace: number;
}) {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting || !isComplete}
      className="w-full py-4 rounded-xl font-medium text-white relative overflow-hidden
                 disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ scale: isComplete ? 1.02 : 1 }}
      whileTap={{ scale: isComplete ? 0.98 : 1 }}
      animate={{
        backgroundColor: isComplete 
          ? 'rgba(0, 245, 212, 0.2)' 
          : 'rgba(255, 255, 255, 0.05)',
        borderColor: isComplete
          ? 'rgba(0, 245, 212, 0.5)'
          : 'rgba(255, 255, 255, 0.1)'
      }}
      transition={{
        duration: 0.5 * userPace,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        border: '1px solid'
      }}
    >
      <AnimatePresence mode="wait">
        {isSubmitting ? (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center space-x-2"
          >
            <BreathingDots />
            <span>Flowing forward</span>
          </motion.div>
        ) : (
          <motion.span
            key="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isComplete ? 'Begin Journey' : 'Complete your flow'}
          </motion.span>
        )}
      </AnimatePresence>
      
      {/* Ripple effect on submit */}
      {isSubmitting && (
        <motion.div
          className="absolute inset-0 bg-accent-cyber-teal"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 1.5 * userPace,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      )}
    </motion.button>
  );
}

// Breathing dots for loading state
function BreathingDots() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.15,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}
    </div>
  );
}

// Rhythm indicator
function RhythmIndicator({ rhythm }: { rhythm: 'slow' | 'moderate' | 'fast' }) {
  const rhythmText = {
    slow: 'Taking your time',
    moderate: 'Natural flow',
    fast: 'Swift fingers'
  };
  
  return (
    <div className="flex items-center space-x-2 text-xs text-white/30">
      <motion.div
        className="w-2 h-2 bg-accent-cyber-teal/50 rounded-full"
        animate={{
          scale: rhythm === 'fast' ? [1, 1.3, 1] : [1, 1.1, 1]
        }}
        transition={{
          duration: rhythm === 'fast' ? 0.5 : 1.5,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />
      <span>{rhythmText[rhythm]}</span>
    </div>
  );
}