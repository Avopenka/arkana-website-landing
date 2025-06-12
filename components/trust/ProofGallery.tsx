'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const proofItems = [
  {
    type: 'metric',
    title: '95% Accuracy',
    subtitle: 'Consciousness Detection',
    icon: 'brain',
    value: '95%',
    description: 'Validated across 1,000+ sessions'
  },
  {
    type: 'metric',
    title: '4.9★ Rating',
    subtitle: 'App Store Reviews',
    icon: 'star',
    value: '4.9',
    description: 'Highest rated consciousness app'
  },
  {
    type: 'metric',
    title: '24/7 Support',
    subtitle: 'AI-Powered Help',
    icon: 'support',
    value: '24/7',
    description: 'Always available when you need it'
  },
  {
    type: 'metric',
    title: '100% Private',
    subtitle: 'Zero Data Sharing',
    icon: 'lock',
    value: '100%',
    description: 'Military-grade encryption'
  },
  {
    type: 'social',
    title: 'Featured in',
    subtitle: 'TechCrunch',
    image: '/press/techcrunch-logo.png',
    quote: '"Revolutionary approach to consciousness detection"'
  },
  {
    type: 'social',
    title: 'Recommended by',
    subtitle: 'Dr. Sarah Chen, Stanford',
    image: '/avatars/sarah.jpg',
    quote: '"The most accurate consciousness tracker I\'ve tested"'
  }
]

export function ProofGallery() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why 17 Pioneers Trust Arkana
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real metrics, verified results, and endorsements from leading consciousness researchers
          </p>
        </motion.div>

        {/* Proof grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proofItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {item.type === 'metric' ? (
                <div className="text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    {item.icon === 'brain' && (
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.33 12.91c.09-.61.09-1.21 0-1.82C21.8 7.31 19.6 4.5 16.66 3.43 15.56 3.15 14.4 3 13.2 3c-1.2 0-2.36.15-3.46.43C6.8 4.5 4.6 7.31 4.14 11.09c-.09.61-.09 1.21 0 1.82.46 3.78 2.66 6.59 5.6 7.66 1.1.28 2.26.43 3.46.43 1.2 0 2.36-.15 3.46-.43 2.94-1.07 5.14-3.88 5.6-7.66z"/>
                      </svg>
                    )}
                    {item.icon === 'star' && (
                      <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    )}
                    {item.icon === 'support' && (
                      <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C17.759 8.071 18 9.007 18 10zm-9.442 3.627l1.562-1.562a3.997 3.997 0 002.183-.078l1.525 1.524A5.987 5.987 0 0110 16a5.99 5.99 0 01-1.442-.373z" clipRule="evenodd"/>
                      </svg>
                    )}
                    {item.icon === 'lock' && (
                      <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>

                  {/* Value */}
                  <div className="text-4xl font-bold text-gray-900 mb-2">{item.value}</div>
                  
                  {/* Title & subtitle */}
                  <div className="text-lg font-semibold text-gray-900 mb-1">{item.title}</div>
                  <div className="text-sm text-gray-600 mb-3">{item.subtitle}</div>
                  
                  {/* Description */}
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              ) : (
                <div>
                  {/* Quote */}
                  <div className="text-lg italic text-gray-700 mb-4">"{item.quote}"</div>
                  
                  {/* Source */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={item.image!}
                        alt={item.subtitle}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.title}</div>
                      <div className="font-semibold text-gray-900">{item.subtitle}</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-60">
            {/* Security badges */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L3 7v10c0 5.55 3.84 9.74 9 9 5.16-.74 9-4.45 9-10V7l-9-5z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">SOC 2 Compliant</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 9.74 9 9 5.16-.74 9-4.45 9-10V5l-9-4z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">GDPR Compliant</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">256-bit SSL</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Verified Reviews</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}