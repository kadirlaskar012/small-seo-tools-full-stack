export interface SchemaMarkupConfig {
  "@context": string;
  "@type": string;
  [key: string]: any;
}

export const SCHEMA_TYPES = {
  ARTICLE: "Article",
  BLOG_POSTING: "BlogPosting",
  WEB_APPLICATION: "WebApplication",
  SOFTWARE_APPLICATION: "SoftwareApplication",
  WEB_PAGE: "WebPage",
  FAQ_PAGE: "FAQPage",
  PRODUCT: "Product",
  LOCAL_BUSINESS: "LocalBusiness",
  ORGANIZATION: "Organization",
  WEBSITE: "Website",
  BREADCRUMB_LIST: "BreadcrumbList",
} as const;

export const SCHEMA_FIELD_TEMPLATES = {
  [SCHEMA_TYPES.ARTICLE]: {
    headline: "string",
    author: "object",
    datePublished: "date",
    dateModified: "date",
    image: "string",
    publisher: "object",
    description: "string",
    url: "string",
    mainEntityOfPage: "string",
    wordCount: "number",
    articleSection: "string",
    articleBody: "string",
  },
  [SCHEMA_TYPES.BLOG_POSTING]: {
    headline: "string",
    author: "object",
    datePublished: "date",
    dateModified: "date",
    image: "string",
    publisher: "object",
    description: "string",
    url: "string",
    mainEntityOfPage: "string",
    wordCount: "number",
    blogPost: "string",
  },
  [SCHEMA_TYPES.WEB_APPLICATION]: {
    name: "string",
    description: "string",
    url: "string",
    applicationCategory: "string",
    operatingSystem: "string",
    offers: "object",
    aggregateRating: "object",
    author: "object",
    creator: "object",
    dateCreated: "date",
    softwareVersion: "string",
    featureList: "array",
  },
  [SCHEMA_TYPES.SOFTWARE_APPLICATION]: {
    name: "string",
    description: "string",
    url: "string",
    applicationCategory: "string",
    operatingSystem: "string",
    offers: "object",
    aggregateRating: "object",
    softwareVersion: "string",
    downloadUrl: "string",
    fileSize: "string",
    requirements: "string",
    screenshot: "string",
  },
  [SCHEMA_TYPES.WEB_PAGE]: {
    name: "string",
    description: "string",
    url: "string",
    mainEntity: "object",
    breadcrumb: "object",
    publisher: "object",
    datePublished: "date",
    dateModified: "date",
    inLanguage: "string",
  },
  [SCHEMA_TYPES.FAQ_PAGE]: {
    name: "string",
    description: "string",
    url: "string",
    mainEntity: "array",
    datePublished: "date",
    dateModified: "date",
    publisher: "object",
  },
  [SCHEMA_TYPES.PRODUCT]: {
    name: "string",
    description: "string",
    image: "string",
    brand: "object",
    manufacturer: "object",
    offers: "object",
    aggregateRating: "object",
    review: "array",
    sku: "string",
    gtin: "string",
    category: "string",
  },
  [SCHEMA_TYPES.LOCAL_BUSINESS]: {
    name: "string",
    description: "string",
    url: "string",
    telephone: "string",
    address: "object",
    geo: "object",
    openingHours: "array",
    priceRange: "string",
    aggregateRating: "object",
    image: "string",
  },
  [SCHEMA_TYPES.ORGANIZATION]: {
    name: "string",
    description: "string",
    url: "string",
    logo: "string",
    contactPoint: "object",
    address: "object",
    sameAs: "array",
    foundingDate: "date",
    founder: "object",
  },
  [SCHEMA_TYPES.WEBSITE]: {
    name: "string",
    description: "string",
    url: "string",
    publisher: "object",
    inLanguage: "string",
    potentialAction: "object",
    about: "object",
  },
  [SCHEMA_TYPES.BREADCRUMB_LIST]: {
    itemListElement: "array",
    numberOfItems: "number",
  },
};

export function generateToolSchema(tool: any, category: any): SchemaMarkupConfig {
  return {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPES.WEB_APPLICATION,
    name: tool.title,
    description: tool.description,
    url: `${window.location.origin}/tools/${tool.slug}`,
    applicationCategory: category.name,
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Organization",
      name: "Tools Website",
    },
    creator: {
      "@type": "Organization",
      name: "Tools Website",
    },
    dateCreated: tool.createdAt,
    featureList: [tool.description],
  };
}

export function generateBlogSchema(post: any): SchemaMarkupConfig {
  return {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPES.ARTICLE,
    headline: post.title,
    description: post.excerpt,
    url: `${window.location.origin}/blog/${post.slug}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: "Tools Website",
    },
    publisher: {
      "@type": "Organization",
      name: "Tools Website",
      logo: {
        "@type": "ImageObject",
        url: `${window.location.origin}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${window.location.origin}/blog/${post.slug}`,
    },
    image: post.image || `${window.location.origin}/default-blog-image.jpg`,
    articleBody: post.content,
    wordCount: post.content ? post.content.split(" ").length : 0,
  };
}

export function generateOrganizationSchema(): SchemaMarkupConfig {
  return {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPES.ORGANIZATION,
    name: "Tools Website",
    description: "Comprehensive collection of online tools for SEO, productivity, and development",
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    sameAs: [
      "https://twitter.com/toolswebsite",
      "https://facebook.com/toolswebsite",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: "English",
    },
  };
}

export function generateWebsiteSchema(): SchemaMarkupConfig {
  return {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPES.WEBSITE,
    name: "Tools Website",
    description: "Comprehensive collection of online tools for SEO, productivity, and development",
    url: window.location.origin,
    publisher: {
      "@type": "Organization",
      name: "Tools Website",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${window.location.origin}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>): SchemaMarkupConfig {
  return {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPES.BREADCRUMB_LIST,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
    numberOfItems: items.length,
  };
}

export function injectSchemaMarkup(schema: SchemaMarkupConfig, id?: string): void {
  const schemaId = id || 'schema-markup';
  
  // Remove existing schema if it exists
  const existingSchema = document.getElementById(schemaId);
  if (existingSchema) {
    existingSchema.remove();
  }

  // Create and inject new schema
  const script = document.createElement('script');
  script.id = schemaId;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

export function validateSchemaMarkup(schema: SchemaMarkupConfig): boolean {
  if (!schema["@context"] || !schema["@type"]) {
    return false;
  }
  
  if (schema["@context"] !== "https://schema.org") {
    return false;
  }
  
  return Object.values(SCHEMA_TYPES).includes(schema["@type"] as any);
}

export function generateSchemaPreview(schema: SchemaMarkupConfig): string {
  return JSON.stringify(schema, null, 2);
}