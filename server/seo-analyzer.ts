// Real SEO Analysis Functions
export function analyzeSEO(html: string, url: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1] : '';
  
  const h1Matches = html.match(/<h1[^>]*>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>/gi) || [];
  const h3Matches = html.match(/<h3[^>]*>/gi) || [];
  
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const imagesWithAlt = imgMatches.filter(img => /alt=["'][^"']*["']/i.test(img));
  
  const linkMatches = html.match(/<a[^>]*href=["'][^"']*["'][^>]*>/gi) || [];
  const hostname = new URL(url).hostname;
  const internalLinks = linkMatches.filter(link => link.includes(hostname));
  const externalLinks = linkMatches.filter(link => !link.includes(hostname) && /href=["']https?:\/\//i.test(link));
  
  // Calculate SEO score
  let score = 0;
  
  // Title scoring (25 points)
  if (title) {
    score += 10;
    if (title.length >= 30 && title.length <= 60) score += 15;
    else if (title.length > 0) score += 5;
  }
  
  // Meta description scoring (20 points)
  if (metaDescription) {
    score += 10;
    if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 10;
    else if (metaDescription.length > 0) score += 5;
  }
  
  // Heading structure scoring (15 points)
  if (h1Matches.length === 1) score += 10;
  else if (h1Matches.length > 0) score += 5;
  if (h2Matches.length > 0) score += 5;
  
  // Images scoring (15 points)
  if (imgMatches.length > 0) {
    const altRatio = imagesWithAlt.length / imgMatches.length;
    score += Math.round(altRatio * 15);
  }
  
  // HTTPS scoring (10 points)
  if (url.startsWith('https')) score += 10;
  
  // Content length scoring (15 points)
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (textContent.length > 1000) score += 15;
  else if (textContent.length > 500) score += 10;
  else if (textContent.length > 200) score += 5;
  
  return {
    score: Math.min(100, score),
    title: {
      exists: !!title,
      length: title.length,
      optimized: title.length >= 30 && title.length <= 60
    },
    metaDescription: {
      exists: !!metaDescription,
      length: metaDescription.length,
      optimized: metaDescription.length >= 120 && metaDescription.length <= 160
    },
    headings: {
      h1Count: h1Matches.length,
      h2Count: h2Matches.length,
      structure: h1Matches.length === 1 && h2Matches.length > 0
    },
    images: {
      total: imgMatches.length,
      withAlt: imagesWithAlt.length,
      optimized: imgMatches.length > 0 ? (imagesWithAlt.length / imgMatches.length) > 0.8 : true
    },
    links: {
      internal: internalLinks.length,
      external: externalLinks.length,
      broken: 0 // Would need additional checking
    },
    performance: {
      loadTime: 0, // Would need actual performance testing
      mobileOptimized: html.includes('viewport') && html.includes('device-width'),
      httpsEnabled: url.startsWith('https')
    }
  };
}

export function analyzeMetaTags(html: string, url: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1] : '';
  
  const keywordMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)/i);
  const keywords = keywordMatch ? keywordMatch[1].split(',').map(k => k.trim()) : [];
  
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)/i);
  const viewport = viewportMatch ? viewportMatch[1] : '';
  
  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)/i);
  const robots = robotsMatch ? robotsMatch[1] : 'index, follow';
  
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : url;
  
  // Extract Open Graph tags
  const ogMatches = html.match(/<meta[^>]*property=["']og:[^"']*["'][^>]*>/gi) || [];
  const ogTags = ogMatches.map(tag => {
    const propMatch = tag.match(/property=["']og:([^"']*)["']/i);
    const contentMatch = tag.match(/content=["']([^"']*)["']/i);
    return {
      name: `og:${propMatch ? propMatch[1] : ''}`,
      content: contentMatch ? contentMatch[1] : '',
      status: (contentMatch && contentMatch[1]) ? 'good' : 'warning'
    };
  });
  
  // Extract Twitter Card tags
  const twitterMatches = html.match(/<meta[^>]*name=["']twitter:[^"']*["'][^>]*>/gi) || [];
  const twitterTags = twitterMatches.map(tag => {
    const nameMatch = tag.match(/name=["'](twitter:[^"']*)["']/i);
    const contentMatch = tag.match(/content=["']([^"']*)["']/i);
    return {
      name: nameMatch ? nameMatch[1] : '',
      content: contentMatch ? contentMatch[1] : '',
      status: (contentMatch && contentMatch[1]) ? 'good' : 'warning'
    };
  });
  
  // Extract other meta tags
  const httpEquivMatches = html.match(/<meta[^>]*http-equiv[^>]*>/gi) || [];
  const httpEquiv = httpEquivMatches.map(tag => {
    const nameMatch = tag.match(/http-equiv=["']([^"']*)["']/i);
    const contentMatch = tag.match(/content=["']([^"']*)["']/i);
    return {
      name: nameMatch ? nameMatch[1] : '',
      content: contentMatch ? contentMatch[1] : '',
      status: 'good' as const
    };
  });
  
  const customMatches = html.match(/<meta[^>]*name=["'][^"']*["'][^>]*>/gi) || [];
  const customTags = customMatches
    .filter(tag => !/(description|keywords|viewport|robots|twitter:|og:)/i.test(tag))
    .map(tag => {
      const nameMatch = tag.match(/name=["']([^"']*)["']/i);
      const contentMatch = tag.match(/content=["']([^"']*)["']/i);
      return {
        name: nameMatch ? nameMatch[1] : '',
        content: contentMatch ? contentMatch[1] : '',
        status: 'good' as const
      };
    });
  
  // Extract structured data
  const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]*)<\/script>/gi) || [];
  const structuredData = jsonLdMatches.map(script => {
    try {
      const jsonMatch = script.match(/>([^<]*)</);
      return jsonMatch ? JSON.parse(jsonMatch[1]) : {};
    } catch {
      return {};
    }
  });
  
  return {
    title: {
      content: title,
      length: title.length,
      status: (title && title.length >= 30 && title.length <= 60) ? 'good' : 'warning' as const
    },
    description: {
      content: metaDescription,
      length: metaDescription.length,
      status: (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) ? 'good' : 'warning' as const
    },
    keywords,
    viewport,
    robots,
    canonical,
    ogTags,
    twitterTags,
    structuredData,
    httpEquiv,
    customTags
  };
}

export function analyzeKeywordDensity(text: string, targetKeyword?: string) {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
    "from", "up", "about", "into", "through", "during", "before", "after", "above", "below",
    "between", "among", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
    "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "can",
    "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they", "me", "him",
    "her", "us", "them", "my", "your", "his", "its", "our", "their"
  ]);

  // Clean and process text
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleanText.split(' ').filter(word => word.length > 0);
  const totalWords = words.length;
  
  // Count word frequencies
  const wordCounts = new Map<string, number>();
  const phraseCounts = new Map<string, number>();
  
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  });

  // Generate 2-word and 3-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    const twoWordPhrase = `${words[i]} ${words[i + 1]}`;
    if (!stopWords.has(words[i]) || !stopWords.has(words[i + 1])) {
      phraseCounts.set(twoWordPhrase, (phraseCounts.get(twoWordPhrase) || 0) + 1);
    }
    
    if (i < words.length - 2) {
      const threeWordPhrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      phraseCounts.set(threeWordPhrase, (phraseCounts.get(threeWordPhrase) || 0) + 1);
    }
  }

  // Process keywords
  const keywords = Array.from(wordCounts.entries())
    .map(([keyword, count]) => {
      const density = (count / totalWords) * 100;
      let status: "optimal" | "low" | "high" | "keyword-stuffing" = "optimal";
      
      if (density > 5) status = "keyword-stuffing";
      else if (density > 3) status = "high";
      else if (density < 0.5) status = "low";
      
      return { keyword, count, density, status };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Process phrases
  const phrases = Array.from(phraseCounts.entries())
    .filter(([_, count]) => count >= 2)
    .map(([phrase, count]) => {
      const density = (count / totalWords) * 100;
      let status: "optimal" | "low" | "high" | "keyword-stuffing" = "optimal";
      
      if (density > 2) status = "high";
      else if (density < 0.2) status = "low";
      
      return { keyword: phrase, count, density, status };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Calculate readability score (simplified Flesch Reading Ease)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const syllableCount = words.reduce((acc, word) => acc + estimateSyllables(word), 0);
  const readabilityScore = Math.max(0, Math.min(100, 
    206.835 - (1.015 * (totalWords / Math.max(sentences, 1))) - (84.6 * (syllableCount / totalWords))
  ));

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (targetKeyword) {
    const targetDensity = keywords.find(k => k.keyword.toLowerCase() === targetKeyword.toLowerCase())?.density || 0;
    if (targetDensity < 1) {
      recommendations.push(`Increase usage of target keyword "${targetKeyword}" (current density: ${targetDensity.toFixed(2)}%)`);
    } else if (targetDensity > 3) {
      recommendations.push(`Reduce usage of target keyword "${targetKeyword}" to avoid keyword stuffing (current density: ${targetDensity.toFixed(2)}%)`);
    }
  }

  const highDensityKeywords = keywords.filter(k => k.status === "keyword-stuffing" || k.status === "high");
  if (highDensityKeywords.length > 0) {
    recommendations.push(`Consider reducing usage of: ${highDensityKeywords.slice(0, 3).map(k => k.keyword).join(", ")}`);
  }

  if (readabilityScore < 50) {
    recommendations.push("Consider using shorter sentences and simpler words to improve readability");
  }

  if (totalWords < 300) {
    recommendations.push("Content is quite short. Consider expanding to at least 300 words for better SEO");
  }

  return {
    totalWords,
    uniqueWords: wordCounts.size,
    totalCharacters: text.length,
    readabilityScore: Math.round(readabilityScore),
    keywords,
    phrases,
    stopWords: words.length - totalWords + words.filter(w => stopWords.has(w)).length,
    recommendations
  };
}

function estimateSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}