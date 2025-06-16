import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  noIndex = false 
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    if (description) {
      updateMetaTag('description', description);
      updatePropertyTag('og:description', description);
      updateMetaTag('twitter:description', description);
    }

    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    if (title) {
      updatePropertyTag('og:title', title);
      updateMetaTag('twitter:title', title);
    }

    // Set Open Graph type
    updatePropertyTag('og:type', 'website');
    updateMetaTag('twitter:card', 'summary_large_image');

    // Handle noIndex
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
      if (robots) {
        robots.remove();
      }
    }

    // Handle canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    // Update current URL for Open Graph
    updatePropertyTag('og:url', window.location.href);

  }, [title, description, keywords, canonicalUrl, noIndex]);

  return null;
}
