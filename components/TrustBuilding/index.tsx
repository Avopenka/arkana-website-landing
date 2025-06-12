'use client'

import React from 'react'
import TestimonialsAuthentic from './TestimonialsAuthentic'
import FeatureProofGallery from './FeatureProofGallery'
import TechnicalSpecifications from './TechnicalSpecifications'
import SecurityPrivacyBadges from './SecurityPrivacyBadges'
import FounderCredibility from './FounderCredibility'
import ProofOfLife from './ProofOfLife'
import TrustIndicators, { FloatingTrustBadge } from './TrustIndicators'

export default function TrustBuildingSystem() {
  return (
    <div className="bg-gray-900">
      {/* Live system status - prove it's running */}
      <ProofOfLife />
      
      {/* Authentic testimonials with usage data */}
      <TestimonialsAuthentic />
      
      {/* Live feature demonstrations */}
      <FeatureProofGallery />
      
      {/* Technical specifications proving it's real */}
      <TechnicalSpecifications />
      
      {/* Security and privacy certifications */}
      <SecurityPrivacyBadges />
      
      {/* Founder background and credibility */}
      <FounderCredibility />
    </div>
  )
}

// Export individual components for flexible use
export {
  TestimonialsAuthentic,
  FeatureProofGallery,
  TechnicalSpecifications,
  SecurityPrivacyBadges,
  FounderCredibility,
  ProofOfLife,
  TrustIndicators,
  FloatingTrustBadge
}