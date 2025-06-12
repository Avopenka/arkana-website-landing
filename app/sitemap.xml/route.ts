// PACA Protocol: Dynamic Sitemap Generation
// Comprehensive SEO sitemap with real-time updates

import { NextResponse } from 'next/server';
import { generateSitemap, defaultSitemapEntries, type SitemapEntry } from '@/lib/seo-optimization';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Start with default entries
    let sitemapEntries: SitemapEntry[] = [...defaultSitemapEntries];

    // Add dynamic blog posts if available
    try {
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, priority')
        .eq('published', true)
        .order('updated_at', { ascending: false });

      if (blogPosts) {
        const blogEntries: SitemapEntry[] = blogPosts.map((post: any) => ({
          url: `https://arkana.chat/blog/${post.slug}`,
          lastmod: new Date(post.updated_at).toISOString().split('T')[0],
          changefreq: 'monthly' as const,
          priority: post.priority || 0.6
        }));

        sitemapEntries = [...sitemapEntries, ...blogEntries];
      }
    } catch (error) {
      console.warn('Could not fetch blog posts for sitemap:', error);
    }

    // Add user-generated content pages if available
    try {
      const { data: userPages } = await supabase
        .from('user_pages')
        .select('slug, updated_at')
        .eq('public', true)
        .order('updated_at', { ascending: false });

      if (userPages) {
        const userEntries: SitemapEntry[] = userPages.map((page: any) => ({
          url: `https://arkana.chat/user/${page.slug}`,
          lastmod: new Date(page.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly' as const,
          priority: 0.4
        }));

        sitemapEntries = [...sitemapEntries, ...userEntries];
      }
    } catch (error) {
      console.warn('Could not fetch user pages for sitemap:', error);
    }

    // Generate sitemap XML
    const sitemapXml = generateSitemap(sitemapEntries);

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Return basic sitemap on error
    const basicSitemap = generateSitemap(defaultSitemapEntries);
    
    return new NextResponse(basicSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300', // 5 minute cache on error
      },
    });
  }
}