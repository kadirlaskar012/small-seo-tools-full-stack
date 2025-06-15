// AI-Generated Unique SVG Icons for Tools and Categories
export const generateUniqueIcon = (name: string, category?: string): string => {
  const iconId = `${category || 'default'}-${name}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  
  // Color schemes based on category
  const colorSchemes = {
    'seo-tools': { 
      primary: '#3B82F6', 
      secondary: '#1E40AF', 
      accent: '#60A5FA',
      light: '#DBEAFE' 
    },
    'text-tools': { 
      primary: '#10B981', 
      secondary: '#059669', 
      accent: '#34D399',
      light: '#D1FAE5' 
    },
    'image-tools': { 
      primary: '#F59E0B', 
      secondary: '#D97706', 
      accent: '#FBBF24',
      light: '#FEF3C7' 
    },
    'developer-tools': { 
      primary: '#8B5CF6', 
      secondary: '#7C3AED', 
      accent: '#A78BFA',
      light: '#EDE9FE' 
    },
    'pdf-tools': { 
      primary: '#EF4444', 
      secondary: '#DC2626', 
      accent: '#F87171',
      light: '#FEE2E2' 
    },
    'url-tools': { 
      primary: '#06B6D4', 
      secondary: '#0891B2', 
      accent: '#22D3EE',
      light: '#CFFAFE' 
    },
    'color-tools': { 
      primary: '#EC4899', 
      secondary: '#DB2777', 
      accent: '#F472B6',
      light: '#FCE7F3' 
    },
    'unit-converters': { 
      primary: '#84CC16', 
      secondary: '#65A30D', 
      accent: '#A3E635',
      light: '#ECFCCB' 
    },
    'password-tools': { 
      primary: '#6366F1', 
      secondary: '#4F46E5', 
      accent: '#818CF8',
      light: '#E0E7FF' 
    },
    'finance-tools': { 
      primary: '#F97316', 
      secondary: '#EA580C', 
      accent: '#FB923C',
      light: '#FED7AA' 
    },
  };

  const categoryKey = (category || 'seo-tools').toLowerCase().replace(/\s+/g, '-');
  const colors = colorSchemes[categoryKey] || colorSchemes['seo-tools'];
  
  // Generate unique icon based on tool name
  const lowerName = name.toLowerCase();
  
  // SEO Tools Specific Icons
  if (lowerName.includes('seo') && lowerName.includes('score')) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.accent};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow-${iconId}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="${colors.secondary}" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#shadow-${iconId})">
        <circle cx="16" cy="16" r="14" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
        <path d="M12 16l3 3 6-6" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="22" cy="10" r="4" fill="${colors.light}" stroke="${colors.primary}" stroke-width="2"/>
        <text x="22" y="14" text-anchor="middle" fill="${colors.primary}" font-size="10" font-weight="bold">S</text>
      </g>
    </svg>`;
  }
  
  if (lowerName.includes('meta') && lowerName.includes('tag')) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="6" width="24" height="20" rx="3" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
      <path d="M8 12h16M8 16h14M8 20h12" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <circle cx="24" cy="8" r="3" fill="${colors.accent}" stroke="white" stroke-width="2"/>
      <text x="24" y="12" text-anchor="middle" fill="white" font-size="8" font-weight="bold">&lt;/&gt;</text>
    </svg>`;
  }
  
  if (lowerName.includes('keyword') && lowerName.includes('density')) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="3" y="4" width="26" height="24" rx="3" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
      <path d="M7 10h18M7 14h16M7 18h14M7 22h12" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <circle cx="26" cy="6" r="4" fill="${colors.light}" stroke="${colors.primary}" stroke-width="2"/>
      <text x="26" y="10" text-anchor="middle" fill="${colors.primary}" font-size="9" font-weight="bold">%</text>
    </svg>`;
  }
  
  if (lowerName.includes('backlink') || lowerName.includes('link')) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M13 19a6 6 0 0 0 10.08.72l4-4a6 6 0 0 0-8.48-8.48l-2.32 2.32" 
            stroke="url(#grad-${iconId})" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M19 13a6 6 0 0 0-10.08-.72l-4 4a6 6 0 0 0 8.48 8.48l2.32-2.32" 
            stroke="${colors.accent}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="11" cy="11" r="3" fill="url(#grad-${iconId})"/>
      <circle cx="21" cy="21" r="3" fill="url(#grad-${iconId})"/>
    </svg>`;
  }
  
  // Text Tools Specific Icons
  if (lowerName.includes('text') && lowerName.includes('case')) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="8" width="24" height="16" rx="3" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
      <text x="10" y="18" fill="white" font-size="12" font-weight="bold">A</text>
      <text x="18" y="20" fill="white" font-size="8" font-weight="normal">a</text>
      <path d="M8 12h4M20 12h4" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 20l4-8 4 8" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  
  if (lowerName.includes('word') && lowerName.includes('counter')) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="5" width="24" height="22" rx="3" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
      <path d="M8 11h16M8 15h14M8 19h12M8 23h10" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <circle cx="24" cy="8" r="4" fill="${colors.light}" stroke="${colors.primary}" stroke-width="2"/>
      <text x="24" y="12" text-anchor="middle" fill="${colors.primary}" font-size="9" font-weight="bold">123</text>
    </svg>`;
  }
  
  // URL Tools Specific Icons
  if (lowerName.includes('base64')) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="7" width="24" height="18" rx="3" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
      <text x="16" y="19" text-anchor="middle" fill="white" font-size="14" font-weight="bold">64</text>
      <path d="M8 12h16M8 22h16" stroke="white" stroke-width="1.5"/>
      <circle cx="7" cy="10" r="1.5" fill="${colors.accent}"/>
      <circle cx="25" cy="24" r="1.5" fill="${colors.accent}"/>
    </svg>`;
  }
  
  if (lowerName.includes('hash')) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
      <path d="M11 11h10M11 21h10" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <path d="M13 8l-3 16M22 8l-3 16" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <circle cx="16" cy="6" r="3" fill="${colors.light}" stroke="${colors.primary}" stroke-width="2"/>
    </svg>`;
  }
  
  // Color Tools Specific Icons
  if (lowerName.includes('color')) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
      <circle cx="16" cy="16" r="8" fill="none" stroke="white" stroke-width="2"/>
      <path d="M16 8v16M8 16h16" stroke="white" stroke-width="1.5"/>
      <circle cx="16" cy="10" r="2.5" fill="#FF6B6B"/>
      <circle cx="22" cy="16" r="2.5" fill="#4ECDC4"/>
      <circle cx="16" cy="22" r="2.5" fill="#45B7D1"/>
      <circle cx="10" cy="16" r="2.5" fill="#FFA07A"/>
    </svg>`;
  }
  
  // Default category icons
  if (category) {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('seo')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="12" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="3"/>
        <circle cx="13" cy="13" r="5" fill="none" stroke="white" stroke-width="2.5"/>
        <path d="M17 17l6 6" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M8 8l4 4M24 8l-4 4" stroke="${colors.accent}" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    }
    
    if (categoryLower.includes('text')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect x="5" y="6" width="22" height="20" rx="3" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
        <path d="M9 12h14M9 16h12M9 20h10" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="26" cy="8" r="3" fill="${colors.accent}" stroke="white" stroke-width="2"/>
      </svg>`;
    }
    
    if (categoryLower.includes('image')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect x="4" y="6" width="24" height="20" rx="3" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
        <circle cx="11" cy="13" r="2.5" fill="white"/>
        <path d="M8 22l6-6 4 4 6-6 2 2v4" fill="${colors.light}" stroke="white" stroke-width="1.5"/>
      </svg>`;
    }
    
    if (categoryLower.includes('pdf')) {
      return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        <path d="M8 4h12l6 6v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" 
              fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
        <path d="M20 4v6h6" stroke="white" stroke-width="2" fill="none"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="10" font-weight="bold">PDF</text>
      </svg>`;
    }
  }
  
  // Generate unique pattern based on name hash for other tools
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const variants = Math.abs(hash) % 12;
  
  const patterns = [
    // Hexagon
    `<polygon points="16,4 26,10 26,22 16,28 6,22 6,10" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
     <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>`,
    
    // Diamond
    `<path d="M16 4L28 16L16 28L4 16z" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
     <circle cx="16" cy="16" r="5" fill="white"/>`,
    
    // Rounded Rectangle
    `<rect x="5" y="8" width="22" height="16" rx="5" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
     <circle cx="12" cy="16" r="3" fill="white"/>
     <circle cx="20" cy="16" r="3" fill="white"/>`,
    
    // Star
    `<path d="M16 2l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>`,
    
    // Triangle
    `<path d="M16 4L28 26H4z" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
     <circle cx="16" cy="18" r="4" fill="white"/>`,
    
    // Octagon
    `<path d="M10 4h12l8 8v12l-8 8H10l-8-8V12z" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
     <path d="M12 12h8v8h-8z" fill="white"/>`,
    
    // Pentagon
    `<path d="M16 2l12 9-5 15H9l-5-15z" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
     <circle cx="16" cy="16" r="5" fill="white" opacity="0.8"/>`,
    
    // Cross
    `<path d="M12 2h8v10h10v8H20v10h-8V20H2v-8h10z" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>`,
    
    // Gear
    `<circle cx="16" cy="16" r="10" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
     <circle cx="16" cy="16" r="5" fill="white"/>
     <path d="M16 6v4M16 22v4M6 16h4M22 16h4" stroke="${colors.accent}" stroke-width="2"/>`,
    
    // Heart
    `<path d="M16 26s-8-6-8-12a6 6 0 0 1 12 0c0 6-4 12-4 12z" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
     <path d="M12 10a4 4 0 0 1 8 0" fill="${colors.light}"/>`,
    
    // Shield
    `<path d="M16 2l10 4v10c0 8-10 14-10 14s-10-6-10-14V6z" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>
     <path d="M12 14l3 3 6-6" stroke="white" stroke-width="2" fill="none"/>`,
    
    // Lightning
    `<path d="M18 2l-8 12h6l-2 16 8-12h-6z" fill="url(#grad-${iconId})" stroke="${colors.accent}" stroke-width="2"/>`
  ];
  
  return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${colors.accent};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
      </linearGradient>
      <filter id="shadow-${iconId}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="${colors.secondary}" flood-opacity="0.3"/>
      </filter>
    </defs>
    <g filter="url(#shadow-${iconId})">
      ${patterns[variants]}
    </g>
  </svg>`;
};

// Category-specific icon generation
export const getCategoryIcon = (categoryName: string): string => {
  return generateUniqueIcon(categoryName, categoryName);
};

// Tool-specific icon generation
export const getToolIcon = (toolName: string, categoryName?: string): string => {
  return generateUniqueIcon(toolName, categoryName);
};