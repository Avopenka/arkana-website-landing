'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: 'https://eu.i.posthog.com', // EU region
        person_profiles: 'identified_only',
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        capture_pageleave: true,
        autocapture: {
          // Automatically capture clicks on buttons and links
          dom_event_allowlist: ['click'],
          element_allowlist: ['button', 'a'],
          css_selector_allowlist: ['.ph-capture'],
        },
        // Privacy-focused settings
        disable_session_recording: false, // Enable session recording for better UX insights
        mask_all_text: true, // Mask sensitive text by default
        mask_all_element_attributes: true,
        property_denylist: ['$ip'], // Don't capture IP addresses
      })
    }
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}