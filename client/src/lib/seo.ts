interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

interface SchemaMarkup {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export class SEOHelper {
  private static instance: SEOHelper;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = window.location.origin;
  }

  public static getInstance(): SEOHelper {
    if (!SEOHelper.instance) {
      SEOHelper.instance = new SEOHelper();
    }
    return SEOHelper.instance;
  }

  /**
   * Generate structured data markup for tools
   */
  public generateToolSchema(tool: {
    title: string;
    description: string;
    url: string;
    category: string;
  }): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.title,
      description: tool.description,
      url: tool.url,
      applicationCategory: tool.category,
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      provider: {
        '@type': 'Organization',
        name: 'The Ultimate Online Tools'
      }
    };
  }

  /**
   * Generate structured data markup for blog posts
   */
  public generateBlogPostSchema(post: {
    title: string;
    content: string;
    excerpt?: string;
    url: string;
    datePublished: string;
    dateModified: string;
  }): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      url: post.url,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      author: {
        '@type': 'Organization',
        name: 'The Ultimate Online Tools'
      },
      publisher: {
        '@type': 'Organization',
        name: 'The Ultimate Online Tools',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      }
    };
  }

  /**
   * Generate website schema markup
   */
  public generateWebsiteSchema(): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'The Ultimate Online Tools',
      description: 'Powerful, fast, and easy-to-use online tools for all your digital needs',
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Inject structured data into page head
   */
  public injectStructuredData(schema: SchemaMarkup): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Generate sitemap data (for future XML sitemap generation)
   */
  public generateSitemapData(
    tools: Array<{ slug: string; updatedAt?: string }>,
    blogPosts: Array<{ slug: string; updatedAt?: string }>
  ): SitemapEntry[] {
    const sitemap: SitemapEntry[] = [];

    // Homepage
    sitemap.push({
      url: this.baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    });

    // Tools
    tools.forEach(tool => {
      sitemap.push({
        url: `${this.baseUrl}/${tool.slug}`,
        lastmod: tool.updatedAt || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Blog posts
    blogPosts.forEach(post => {
      sitemap.push({
        url: `${this.baseUrl}/blog/${post.slug}`,
        lastmod: post.updatedAt || new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      });
    });

    // Static pages
    sitemap.push({
      url: `${this.baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7
    });

    return sitemap;
  }

  /**
   * Generate meta tags for social sharing
   */
  public generateSocialMetaTags(data: {
    title: string;
    description: string;
    url: string;
    image?: string;
    type?: string;
  }): Record<string, string> {
    return {
      // Open Graph
      'og:title': data.title,
      'og:description': data.description,
      'og:url': data.url,
      'og:type': data.type || 'website',
      'og:image': data.image || `${this.baseUrl}/og-image.png`,
      'og:site_name': 'The Ultimate Online Tools',
      
      // Twitter Card
      'twitter:card': 'summary_large_image',
      'twitter:title': data.title,
      'twitter:description': data.description,
      'twitter:image': data.image || `${this.baseUrl}/og-image.png`,
    };
  }

  /**
   * Calculate reading time for blog posts
   */
  public calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  /**
   * Generate SEO-friendly slug from text
   */
  public generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Validate and optimize meta description length
   */
  public optimizeMetaDescription(description: string, maxLength: number = 160): string {
    if (description.length <= maxLength) {
      return description;
    }
    
    // Truncate at word boundary
    const truncated = description.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  }

  /**
   * Generate canonical URL
   */
  public generateCanonicalUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  }
}

// Export singleton instance
export const seoHelper = SEOHelper.getInstance();

// Utility functions for common SEO tasks
export const generateSlug = (text: string): string => seoHelper.generateSlug(text);
export const calculateReadingTime = (content: string): number => seoHelper.calculateReadingTime(content);
export const optimizeMetaDescription = (description: string): string => seoHelper.optimizeMetaDescription(description);
