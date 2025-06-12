'use client';
import { useEffect } from 'react';
import Script from 'next/script';
// Analytics component for Plausible
export default function Analytics() {
  useEffect(() => {
    // Initialize any client-side analytics code here
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    }
  }, []);
  return (
    <>
      {/* Plausible Analytics - GDPR Compliant */}
      <Script
        strategy="afterInteractive"
        data-domain="arkana.chat"
        src="https://plausible.io/js/script.js"
      />
      {/* Add custom event tracking */}
      <Script id="plausible-events" strategy="afterInteractive">
        {`
          window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };
        `}
      </Script>
    </>
  );
}
