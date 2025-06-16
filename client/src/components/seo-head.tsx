import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  jsonLd?: object;
}

export default function SEOHead({
  title = "SEO Tools - Professional Website Optimization Tools",
  description = "Comprehensive SEO tools for website optimization, keyword analysis, meta tag generation, and performance monitoring. Free professional tools for digital marketers.",
  keywords = "SEO tools, website optimization, keyword analysis, meta tags, backlink checker, page speed",
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  jsonLd
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('viewport', 'width=device-width, initial-scale=1');

    // Open Graph tags
    updateProperty('og:title', ogTitle || title);
    updateProperty('og:description', ogDescription || description);
    updateProperty('og:type', ogType);
    if (ogImage) updateProperty('og:image', ogImage);

    // Twitter Card tags
    updateMeta('twitter:card', twitterCard);
    updateMeta('twitter:title', ogTitle || title);
    updateMeta('twitter:description', ogDescription || description);
    if (ogImage) updateMeta('twitter:image', ogImage);

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // JSON-LD structured data
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogImage, ogType, twitterCard, jsonLd]);

  return null;
}