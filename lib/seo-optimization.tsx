// PACA Protocol: Comprehensive SEO Optimization System
// Advanced meta tags, Open Graph, Schema.org, and performance SEO

import React from 'react';
import Head from 'next/head';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    siteName?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  schemaOrg?: any;
  noIndex?: boolean;
  noFollow?: boolean;
  priority?: number;
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

const defaultSEO: Required<Omit<SEOProps, 'schemaOrg'>> = {
  title: 'Arkana - Consciousness-Aware AI Platform',
  description: 'Revolutionary consciousness-aware computing platform that adapts to your mental state for deeper, more meaningful AI interactions. Join the future of human-AI collaboration.',
  keywords: [
    'consciousness AI',
    'artificial intelligence',
    'consciousness computing',
    'AI platform',
    'machine consciousness',
    'human-AI interaction',
    'cognitive computing',
    'consciousness detection',
    'AI awareness',
    'neural interface',
    'mind-machine interface',
    'consciousness research',
    'AI consciousness',
    'cognitive AI',
    'consciousness technology'
  ],
  canonical: 'https://arkana.chat',
  openGraph: {
    title: 'Arkana - Consciousness-Aware AI Platform',
    description: 'Revolutionary consciousness-aware computing platform that adapts to your mental state for deeper, more meaningful AI interactions.',
    image: 'https://arkana.chat/og-image.jpg',
    imageAlt: 'Arkana - Consciousness-Aware AI Platform',
    url: 'https://arkana.chat',
    type: 'website',
    siteName: 'Arkana'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ArkanaPlatform',
    creator: '@ArkanaPlatform',
    title: 'Arkana - Consciousness-Aware AI Platform',
    description: 'Revolutionary consciousness-aware computing platform that adapts to your mental state for deeper, more meaningful AI interactions.',
    image: 'https://arkana.chat/twitter-image.jpg',
    imageAlt: 'Arkana - Consciousness-Aware AI Platform'
  },
  noIndex: false,
  noFollow: false,
  priority: 1.0,
  changeFreq: 'weekly'
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'Arkana - Consciousness-Aware AI Platform | Future of Human-AI Interaction',
    description: 'Experience the future of AI with Arkana\'s consciousness-aware computing platform. Revolutionary technology that adapts to your mental state for deeper, more meaningful interactions.',
    keywords: [
      'consciousness AI platform',
      'AI consciousness detection',
      'human-AI collaboration',
      'consciousness computing',
      'cognitive AI technology',
      'mind-responsive AI',
      'consciousness-aware computing',
      'AI mental state adaptation'
    ],
    openGraph: {
      title: 'Arkana - Consciousness-Aware AI Platform',
      description: 'Experience the future of AI with consciousness-aware computing that adapts to your mental state.',
      type: 'website' as const
    },
    schemaOrg: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Arkana',
      url: 'https://arkana.chat',
      logo: 'https://arkana.chat/logo.png',
      description: 'Consciousness-aware AI platform for revolutionary human-AI interaction',
      foundingDate: '2024',
      sameAs: [
        'https://twitter.com/ArkanaPlatform',
        'https://linkedin.com/company/arkana-platform'
      ]
    }
  },
  
  pricing: {
    title: 'Arkana Pricing - 8 Waves System | Consciousness AI Platform',
    description: 'Transparent wave-based pricing for Arkana\'s consciousness-aware AI platform. Lock in early access pricing and join the revolution in human-AI interaction.',
    keywords: [
      'Arkana pricing',
      'AI platform pricing',
      'consciousness AI cost',
      'wave pricing system',
      'early access pricing',
      'AI subscription'
    ],
    openGraph: {
      title: 'Arkana Pricing - Revolutionary Wave System',
      description: 'Transparent wave-based pricing for consciousness-aware AI. Lock in your price now.',
      type: 'website' as const
    },
    schemaOrg: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Arkana Consciousness Platform',
      description: 'Consciousness-aware AI platform with adaptive pricing waves',
      brand: {
        '@type': 'Brand',
        name: 'Arkana'
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '29',
        highPrice: '59',
        priceValidUntil: '2025-12-31'
      }
    }
  },
  
  beta: {
    title: 'Join Arkana Beta - Early Access to Consciousness AI',
    description: 'Get exclusive early access to Arkana\'s consciousness-aware AI platform. Join our beta program and shape the future of human-AI interaction.',
    keywords: [
      'Arkana beta',
      'AI beta access',
      'consciousness AI beta',
      'early access AI',
      'beta testing AI platform'
    ],
    openGraph: {
      title: 'Join Arkana Beta - Early Access Available',
      description: 'Get exclusive early access to consciousness-aware AI technology.',
      type: 'website' as const
    }
  },
  
  features: {
    title: 'Arkana Features - Consciousness Detection & AI Adaptation',
    description: 'Discover Arkana\'s revolutionary features: consciousness detection, mental state adaptation, voice processing, and memory palace integration.',
    keywords: [
      'AI consciousness detection',
      'mental state adaptation',
      'consciousness mirroring',
      'AI voice processing',
      'memory palace AI',
      'cognitive computing features'
    ],
    openGraph: {
      title: 'Arkana Features - Revolutionary AI Capabilities',
      description: 'Explore consciousness detection, mental state adaptation, and advanced AI features.',
      type: 'website' as const
    }
  },
  
  blog: {
    title: 'Arkana Blog - Consciousness AI Insights & Research',
    description: 'Latest insights on consciousness-aware AI, research developments, and the future of human-AI interaction from the Arkana team.',
    keywords: [
      'consciousness AI blog',
      'AI research',
      'consciousness computing insights',
      'AI development blog',
      'consciousness technology news'
    ],
    openGraph: {
      title: 'Arkana Blog - Consciousness AI Insights',
      description: 'Latest insights on consciousness-aware AI and research developments.',
      type: 'website' as const
    }
  }
};

// SEO Component
export const SEOHead: React.FC<SEOProps> = (props) => {
  const seo = { ...defaultSEO, ...props };
  
  // Merge keywords
  const allKeywords = [
    ...defaultSEO.keywords,
    ...(props.keywords || [])
  ].filter((keyword, index, array) => array.indexOf(keyword) === index);

  // Merge Open Graph
  const openGraph = { ...defaultSEO.openGraph, ...props.openGraph };
  
  // Merge Twitter
  const twitter = { ...defaultSEO.twitter, ...props.twitter };

  // Generate robots meta
  const robotsContent = [
    seo.noIndex ? 'noindex' : 'index',
    seo.noFollow ? 'nofollow' : 'follow'
  ].join(', ');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content="Arkana Team" />
      <meta name="copyright" content="© 2024 Arkana. All rights reserved." />
      
      {/* Canonical URL */}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={openGraph.title} />
      <meta property="og:description" content={openGraph.description} />
      <meta property="og:image" content={openGraph.image} />
      <meta property="og:image:alt" content={openGraph.imageAlt} />
      <meta property="og:url" content={openGraph.url} />
      <meta property="og:type" content={openGraph.type} />
      <meta property="og:site_name" content={openGraph.siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitter.card} />
      <meta name="twitter:site" content={twitter.site} />
      <meta name="twitter:creator" content={twitter.creator} />
      <meta name="twitter:title" content={twitter.title} />
      <meta name="twitter:description" content={twitter.description} />
      <meta name="twitter:image" content={twitter.image} />
      <meta name="twitter:image:alt" content={twitter.imageAlt} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#0a0a0a" />
      <meta name="msapplication-TileColor" content="#0a0a0a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Structured Data */}
      {seo.schemaOrg && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seo.schemaOrg)
          }}
        />
      )}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.arkana.chat" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//cdn.arkana.chat" />
      <link rel="dns-prefetch" href="//analytics.arkana.chat" />
    </Head>
  );
};

// Article SEO component for blog posts
interface ArticleSEOProps extends SEOProps {
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  readingTime?: number;
}

export const ArticleSEO: React.FC<ArticleSEOProps> = ({
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  readingTime,
  ...props
}) => {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    author: {
      '@type': 'Person',
      name: author || 'Arkana Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Arkana',
      logo: {
        '@type': 'ImageObject',
        url: 'https://arkana.chat/logo.png'
      }
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    image: props.openGraph?.image,
    url: props.canonical,
    keywords: [...(props.keywords || []), ...tags].join(', '),
    ...(readingTime && {
      timeRequired: `PT${readingTime}M`
    })
  };

  const enhancedProps = {
    ...props,
    openGraph: {
      ...props.openGraph,
      type: 'article' as const
    },
    schemaOrg: articleSchema
  };

  return (
    <>
      <SEOHead {...enhancedProps} />
      <Head>
        {/* Article-specific meta tags */}
        <meta property="article:published_time" content={publishedTime} />
        {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        {author && <meta property="article:author" content={author} />}
        {section && <meta property="article:section" content={section} />}
        {tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Head>
    </>
  );
};

// Product SEO component for pricing/product pages
interface ProductSEOProps extends SEOProps {
  price?: string;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  sku?: string;
  gtin?: string;
}

export const ProductSEO: React.FC<ProductSEOProps> = ({
  price,
  currency = 'USD',
  availability = 'InStock',
  brand = 'Arkana',
  sku,
  gtin,
  ...props
}) => {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: props.title,
    description: props.description,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    image: props.openGraph?.image,
    ...(sku && { sku }),
    ...(gtin && { gtin }),
    offers: {
      '@type': 'Offer',
      url: props.canonical,
      priceCurrency: currency,
      price: price,
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'Arkana'
      }
    }
  };

  const enhancedProps = {
    ...props,
    openGraph: {
      ...props.openGraph,
      type: 'product' as const
    },
    schemaOrg: productSchema
  };

  return <SEOHead {...enhancedProps} />;
};

// Sitemap generation utility
export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(entries: SitemapEntry[]): string {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Default sitemap entries
export const defaultSitemapEntries: SitemapEntry[] = [
  {
    url: 'https://arkana.chat',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    url: 'https://arkana.chat/features',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    url: 'https://arkana.chat/pricing',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    url: 'https://arkana.chat/beta',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.8
  },
  {
    url: 'https://arkana.chat/blog',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.7
  },
  {
    url: 'https://arkana.chat/about',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    url: 'https://arkana.chat/contact',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.5
  }
];

// Robots.txt generation
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/
Disallow: /*.json$
Disallow: /*.xml$

Sitemap: https://arkana.chat/sitemap.xml
`;
}

// SEO utility functions
export class SEOUtils {
  static generateMetaDescription(content: string, maxLength: number = 160): string {
    const stripped = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    
    if (stripped.length <= maxLength) {
      return stripped;
    }
    
    return stripped.substring(0, maxLength - 3).trim() + '...';
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  static extractKeywords(content: string, maxKeywords: number = 10): string[] {
    const words = content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  static validateSEO(seo: SEOProps): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    if (!seo.title || seo.title.length < 30 || seo.title.length > 60) {
      warnings.push('Title should be between 30-60 characters');
    }

    if (!seo.description || seo.description.length < 120 || seo.description.length > 160) {
      warnings.push('Description should be between 120-160 characters');
    }

    if (!seo.keywords || seo.keywords.length < 5) {
      warnings.push('Should have at least 5 keywords');
    }

    if (!seo.openGraph?.image) {
      warnings.push('Open Graph image is missing');
    }

    if (!seo.canonical) {
      warnings.push('Canonical URL is missing');
    }

    return {
      isValid: warnings.length === 0,
      warnings
    };
  }
}

export default SEOHead;