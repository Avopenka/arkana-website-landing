'use client'

import { motion } from 'framer-motion'

export function TestimonialsAuthentic() {
  const testimonials = [
    {
      text: "Finally, an AI that respects my privacy. Arkana has transformed how I work.",
      author: "Sarah Chen",
      role: "Software Engineer",
      rating: 5
    },
    {
      text: "The consciousness-aware features are mind-blowing. It knows when I need a break.",
      author: "Marcus Johnson",
      role: "Creative Director",
      rating: 5
    },
    {
      text: "Genesis member #42. Best investment I've made. The founder support is incredible.",
      author: "Elena Rodriguez",
      role: "Entrepreneur",
      rating: 5
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-4">Loved by Early Adopters</h2>
          <p className="text-xl text-gray-400">Join the growing community of Arkana users.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
              
              <div>
                <p className="font-light">{testimonial.author}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}