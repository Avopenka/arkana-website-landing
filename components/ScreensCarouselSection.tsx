'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export default function ScreensCarouselSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const [activeIndex, setActiveIndex] = useState(0);

  const screens = [
    {
      id: 1,
      title: "Whisper Portal",
      description: "Voice-first interface with natural language processing",
      image: "/horizon.png" // Placeholder - would be replaced with actual screenshot
    },
    {
      id: 2,
      title: "Memory Graph",
      description: "Visual representation of your knowledge network",
      image: "/horizon.png" // Placeholder - would be replaced with actual screenshot
    },
    {
      id: 3,
      title: "Emotion UI",
      description: "Interface that adapts to your current state of mind",
      image: "/horizon.png" // Placeholder - would be replaced with actual screenshot
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % screens.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + screens.length) % screens.length);
  };

  return (
    <section 
      ref={sectionRef}
      className="section bg-deep-black relative overflow-hidden"
    >
      {/* Luxury background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,255,225,0.03),transparent_50%)]"></div>
      
      <div className="container-luxury relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-gradient font-serif mb-4">ELEGANT INTERFACE</h2>
          <p className="text-neutral-gray max-w-2xl mx-auto">
            Discover the mystical beauty of Arkana&apos;s interface, designed to inspire creativity and deep thinking.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="relative"
        >
          {/* Main carousel */}
          <div className="relative h-[500px] md:h-[600px] w-full rounded-xl overflow-hidden mb-8">
            {screens.map((screen, index) => (
              <motion.div
                key={screen.id}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : activeIndex > index ? -100 : 100,
                  scale: activeIndex === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <div className="relative w-full h-full max-w-3xl mx-auto">
                  <Image
                    src={screen.image}
                    alt={screen.title}
                    fill
                    className="object-contain rounded-xl"
                  />
                  
                  {/* Reflection effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-deep-black to-transparent"></div>
                  
                  {/* Screen info */}
                  <div className="absolute bottom-8 left-0 right-0 text-center">
                    <h3 className="text-white font-serif text-xl mb-2">{screen.title}</h3>
                    <p className="text-neutral-gray">{screen.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Navigation arrows */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 hover:bg-black/50 transition-colors"
              aria-label="Previous screen"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 hover:bg-black/50 transition-colors"
              aria-label="Next screen"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Pagination indicators */}
          <div className="flex justify-center space-x-2">
            {screens.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-brand-teal w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to screen ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
