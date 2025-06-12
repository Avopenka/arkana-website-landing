// PACA Protocol: Dynamic Robots.txt Generation
// SEO-optimized robots.txt with environment-aware rules

import { NextResponse } from 'next/server';
import { generateRobotsTxt } from '@/lib/seo-optimization';

export async function GET() {
  try {
    // Generate environment-specific robots.txt
    const isProduction = process.env.NODE_ENV === 'production';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arkana.chat';

    let robotsContent: string;

    if (isProduction) {
      // Production robots.txt - allow all crawlers
      robotsContent = `User-agent: *
Allow: /

# Optimize crawling for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 3

# Block unwanted areas
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /auth/
Disallow: /dashboard/
Disallow: /test/
Disallow: /debug/

# Block specific files
Disallow: /package.json
Disallow: /package-lock.json
Disallow: /.env*
Disallow: /tsconfig.json
Disallow: /next.config.js

# Allow important assets
Allow: /static/images/
Allow: /static/css/
Allow: /static/js/
Allow: /_next/static/
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Host declaration for clarity
Host: ${siteUrl}`;

    } else {
      // Development/staging robots.txt - block all crawlers
      robotsContent = `User-agent: *
Disallow: /

# This is a development/staging environment
# Please visit ${siteUrl} for the production site`;
    }

    return new NextResponse(robotsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
      },
    });

  } catch (error) {
    console.error('Robots.txt generation error:', error);
    
    // Return basic robots.txt on error
    const basicRobots = generateRobotsTxt();
    
    return new NextResponse(basicRobots, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=300', // 5 minute cache on error
      },
    });
  }
}