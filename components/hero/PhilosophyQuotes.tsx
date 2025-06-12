'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const philosophies = [
  { author: "Frank Herbert", quote: "The mystery of life isn't a problem to solve, but a reality to experience." },
  { author: "Alan Watts", quote: "You are the universe experiencing itself." },
  { author: "Philip K. Dick", quote: "Reality is that which, when you stop believing in it, doesn't go away." },
  { author: "William Gibson", quote: "The future is already here — it's just not evenly distributed." },
  { author: "Aristotle", quote: "Knowing yourself is the beginning of all wisdom." }
];

// Nolan Complexity: Temporal layering of wisdom
export default function PhilosophyQuotes() {
  const [currentPhilosophy, setCurrentPhilosophy] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhilosophy((prev) => (prev + 1) % philosophies.length);
    }, 9000); // Nolan pacing - slower, more contemplative

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-16 mt-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhilosophy}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="text-center"
        >
          <p className="text-sm md:text-base text-white/70 italic font-serif-alt">
            &ldquo;{philosophies[currentPhilosophy].quote}&rdquo;
          </p>
          <p className="text-xs md:text-sm text-white/50 mt-1 font-sans-serif">
            &mdash; {philosophies[currentPhilosophy].author}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}