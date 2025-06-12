'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  priority?: 'high' | 'medium' | 'low';
}

interface LoadingState {
  isLoading: boolean;
  progress: number;
  stage: string;
}

const LoadingStages = [
  { name: 'Initializing', duration: 300 },
  { name: 'Loading Components', duration: 500 },
  { name: 'Optimizing Performance', duration: 400 },
  { name: 'Finalizing', duration: 200 }
];

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  children,
  fallback,
  delay = 0,
  priority = 'medium'
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    stage: LoadingStages[0].name
  });

  useEffect(() => {
    let currentStage = 0;
    let totalProgress = 0;

    const runLoadingSequence = async () => {
      for (const stage of LoadingStages) {
        setLoadingState(prev => ({ ...prev, stage: stage.name }));
        
        // Simulate progressive loading
        const steps = 10;
        const stepDuration = stage.duration / steps;
        const stageWeight = 100 / LoadingStages.length;
        
        for (let i = 0; i <= steps; i++) {
          await new Promise(resolve => setTimeout(resolve, stepDuration));
          const stageProgress = (i / steps) * stageWeight;
          const newProgress = (currentStage * stageWeight) + stageProgress;
          
          setLoadingState(prev => ({ ...prev, progress: newProgress }));
        }
        
        currentStage++;
      }
      
      setTimeout(() => {
        setLoadingState(prev => ({ ...prev, isLoading: false }));
      }, delay);
    };

    runLoadingSequence();
  }, [delay]);

  if (loadingState.isLoading) {
    return fallback || <DefaultProgressiveLoader state={loadingState} priority={priority} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Suspense fallback={<DefaultProgressiveLoader state={loadingState} priority={priority} />}>
        {children}
      </Suspense>
    </motion.div>
  );
};

const DefaultProgressiveLoader: React.FC<{ state: LoadingState; priority: string }> = ({ 
  state, 
  priority 
}) => {
  const priorityColors = {
    high: 'from-red-500 to-orange-500',
    medium: 'from-purple-500 to-blue-500',
    low: 'from-gray-500 to-gray-600'
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center space-y-4">
        {/* Animated Progress Circle */}
        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (state.progress / 100) * 251.2}
              transition={{ duration: 0.3 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-purple-500" stopColor="currentColor" />
                <stop offset="100%" className="text-blue-500" stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {Math.round(state.progress)}%
            </span>
          </div>
        </div>

        {/* Loading Stage */}
        <motion.div
          key={state.stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-semibold"
        >
          {state.stage}
        </motion.div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{
                y: [-4, 4, -4],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>

        {/* Priority Indicator */}
        <div className="text-xs text-gray-400">
          Priority: {priority.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

// Intelligent Component Loader
export const IntelligentLoader: React.FC<{
  component: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  preload?: boolean;
}> = ({ component, fallback, priority = 'medium', preload = false }) => {
  const [LoadedComponent, setLoadedComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const { default: Component } = await component();
        setLoadedComponent(() => Component);
      } catch (error) {
        console.error('Failed to load component:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (preload) {
      loadComponent();
    } else {
      // Load when component becomes visible
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadComponent();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      const element = document.createElement('div');
      observer.observe(element);

      return () => observer.disconnect();
    }
  }, [component, preload]);

  if (isLoading || !LoadedComponent) {
    return <ProgressiveLoader priority={priority}>{fallback}</ProgressiveLoader>;
  }

  return <LoadedComponent />;
};

// Batch Loader for Multiple Components
export const BatchLoader: React.FC<{
  components: Array<{
    component: () => Promise<{ default: React.ComponentType<any> }>;
    props?: any;
    priority?: 'high' | 'medium' | 'low';
  }>;
  onComplete?: () => void;
}> = ({ components, onComplete }) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const totalComponents = components.length;

  useEffect(() => {
    if (loadedCount === totalComponents && onComplete) {
      onComplete();
    }
  }, [loadedCount, totalComponents, onComplete]);

  return (
    <div className="space-y-4">
      {components.map((item, index) => (
        <IntelligentLoader
          key={index}
          component={item.component}
          priority={item.priority}
          fallback={
            <div className="text-center py-8">
              <div className="text-gray-400">Loading component {index + 1}...</div>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default ProgressiveLoader;