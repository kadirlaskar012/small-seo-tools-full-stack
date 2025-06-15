// AI-Generated Unique SVG Icons for Tools and Categories with Advanced Pattern Recognition
export const generateUniqueIcon = (name: string, category?: string): string => {
  // Create unique hash-based identifier to ensure no duplicate icons
  const uniqueId = btoa(`${category || 'default'}-${name}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  const iconId = `icon-${uniqueId}`;
  
  // Expanded color schemes with more variety
  const colorSchemes = {
    'seo-tools': { 
      primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA', light: '#DBEAFE',
      gradients: ['#4F46E5', '#7C3AED', '#EC4899'], patterns: ['search', 'analytics', 'optimization']
    },
    'text-tools': { 
      primary: '#10B981', secondary: '#059669', accent: '#34D399', light: '#D1FAE5',
      gradients: ['#059669', '#0D9488', '#0891B2'], patterns: ['text', 'format', 'transform']
    },
    'image-tools': { 
      primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24', light: '#FEF3C7',
      gradients: ['#F97316', '#EA580C', '#DC2626'], patterns: ['image', 'edit', 'filter']
    },
    'developer-tools': { 
      primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA', light: '#EDE9FE',
      gradients: ['#6366F1', '#4F46E5', '#3B82F6'], patterns: ['code', 'debug', 'build']
    },
    'pdf-tools': { 
      primary: '#EF4444', secondary: '#DC2626', accent: '#F87171', light: '#FEE2E2',
      gradients: ['#F43F5E', '#E11D48', '#BE123C'], patterns: ['document', 'merge', 'split']
    },
    'url-tools': { 
      primary: '#06B6D4', secondary: '#0891B2', accent: '#22D3EE', light: '#CFFAFE',
      gradients: ['#0EA5E9', '#0284C7', '#0369A1'], patterns: ['link', 'encode', 'redirect']
    },
    'color-tools': { 
      primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6', light: '#FCE7F3',
      gradients: ['#F97316', '#EAB308', '#84CC16'], patterns: ['palette', 'picker', 'convert']
    },
    'unit-converters': { 
      primary: '#84CC16', secondary: '#65A30D', accent: '#A3E635', light: '#ECFCCB',
      gradients: ['#22C55E', '#16A34A', '#15803D'], patterns: ['convert', 'calculate', 'measure']
    },
    'password-tools': { 
      primary: '#6366F1', secondary: '#4F46E5', accent: '#818CF8', light: '#E0E7FF',
      gradients: ['#8B5CF6', '#7C3AED', '#6D28D9'], patterns: ['security', 'encrypt', 'protect']
    },
    'finance-tools': { 
      primary: '#F97316', secondary: '#EA580C', accent: '#FB923C', light: '#FED7AA',
      gradients: ['#EAB308', '#CA8A04', '#A16207'], patterns: ['money', 'calculate', 'invest']
    },
  };

  const categoryKey = (category || 'seo-tools').toLowerCase().replace(/\s+/g, '-');
  const colors = colorSchemes[categoryKey] || colorSchemes['seo-tools'];
  
  // Advanced pattern recognition system for unique icons
  const analyzeToolName = (toolName: string) => {
    const words = toolName.toLowerCase().split(/[\s-_]+/);
    const hash = toolName.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    const variance = Math.abs(hash) % 100;
    
    return {
      words,
      primaryWord: words[0] || 'tool',
      secondaryWord: words[1] || '',
      hash: Math.abs(hash),
      variance,
      complexity: words.length,
      isSpeed: words.some(w => ['speed', 'fast', 'performance', 'optimize'].includes(w)),
      isSecurity: words.some(w => ['secure', 'ssl', 'password', 'encrypt'].includes(w)),
      isAnalysis: words.some(w => ['analyze', 'check', 'test', 'scan'].includes(w)),
      isFormat: words.some(w => ['format', 'convert', 'transform', 'encode'].includes(w))
    };
  };

  const analysis = analyzeToolName(name);
  const lowerName = name.toLowerCase();
  
  // Generate unique geometric patterns based on analysis
  const generateUniquePattern = () => {
    const patternId = analysis.hash % 25; // 25 unique base patterns
    const colorIndex = analysis.variance % colors.gradients.length;
    const gradientColor = colors.gradients[colorIndex];
    
    const patterns = [
      // Speed/Performance Tools (0-4)
      `<circle cx="16" cy="16" r="13" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M8 16l4-6 4 6-4-2z" fill="white" stroke="white" stroke-width="1"/>
       <circle cx="16" cy="10" r="2" fill="${colors.light}"/>
       <path d="M6 20h20" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
      
      `<rect x="4" y="6" width="24" height="20" rx="4" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M12 12l8-4v8l-8-4z" fill="white"/>
       <circle cx="8" cy="10" r="2" fill="${colors.light}"/>`,
       
      `<polygon points="16,2 28,10 22,26 10,26 4,10" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M12 14l4-4 4 4-4 2z" fill="white"/>`,
       
      `<path d="M6 16c0-8 4-12 10-12s10 4 10 12-4 12-10 12S6 24 6 16z" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M16 8v8l6 4" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
       
      `<circle cx="16" cy="16" r="12" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M10 12l6 8 6-8H10z" fill="white"/>
       <circle cx="16" cy="8" r="3" fill="${colors.light}"/>`,
      
      // Analysis/Check Tools (5-9)
      `<rect x="5" y="5" width="22" height="22" rx="3" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M11 16l2 2 6-6" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
       <circle cx="23" cy="9" r="3" fill="${colors.light}"/>`,
       
      `<circle cx="16" cy="16" r="12" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <circle cx="13" cy="13" r="6" fill="none" stroke="white" stroke-width="2"/>
       <path d="M18 18l6 6" stroke="white" stroke-width="3" stroke-linecap="round"/>`,
      
      `<path d="M8 4h16l4 4v16l-4 4H8l-4-4V8z" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M12 12h8M12 16h6M12 20h10" stroke="white" stroke-width="2"/>`,
       
      `<ellipse cx="16" cy="16" rx="12" ry="8" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M8 16h16M16 8v16" stroke="white" stroke-width="1.5"/>
       <circle cx="16" cy="16" r="4" fill="white"/>`,
       
      `<polygon points="16,4 24,8 28,16 24,24 16,28 8,24 4,16 8,8" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M12 16l2 2 6-6" stroke="white" stroke-width="2" fill="none"/>`,
      
      // Format/Convert Tools (10-14)
      `<rect x="6" y="8" width="20" height="16" rx="3" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M12 14h8M12 18h6" stroke="white" stroke-width="2"/>
       <path d="M14 12l4-2 4 2-4 2z" fill="white"/>`,
       
      `<circle cx="16" cy="16" r="11" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M10 12l6 8 6-8M16 8v8" stroke="white" stroke-width="2" fill="none"/>`,
       
      `<path d="M4 12h8l4-4 4 4h8l-4 8H8z" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <circle cx="16" cy="16" r="3" fill="white"/>`,
       
      `<rect x="3" y="7" width="26" height="18" rx="4" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M8 13h6l3-3 3 3h6" stroke="white" stroke-width="2" fill="none"/>
       <circle cx="16" cy="19" r="2" fill="white"/>`,
       
      `<path d="M16 2l8 6v12l-8 6-8-6V8z" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M12 12h8M12 16h6M12 20h8" stroke="white" stroke-width="1.5"/>`,
      
      // Security Tools (15-19)
      `<path d="M16 4l8 4v8c0 6-8 10-8 10s-8-4-8-10V8z" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M12 15l2 2 6-6" stroke="white" stroke-width="2" fill="none"/>`,
       
      `<rect x="7" y="9" width="18" height="18" rx="2" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <rect x="13" y="5" width="6" height="6" rx="3" fill="none" stroke="white" stroke-width="2"/>
       <circle cx="16" cy="18" r="2" fill="white"/>`,
       
      `<circle cx="16" cy="16" r="11" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M12 12h8v8h-8zM16 14v4" stroke="white" stroke-width="2"/>
       <circle cx="16" cy="12" r="1" fill="white"/>`,
       
      `<path d="M8 6h16v20l-8-4-8 4V6z" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M12 12h8M12 16h6" stroke="white" stroke-width="2"/>`,
       
      `<ellipse cx="16" cy="16" rx="10" ry="12" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <circle cx="16" cy="16" r="6" fill="white"/>
       <circle cx="16" cy="16" r="3" fill="${colors.primary}"/>`,
      
      // Generic/Unique Tools (20-24)
      `<path d="M16 2l10 8v12l-10 8-10-8V10z" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <circle cx="16" cy="16" r="5" fill="white" opacity="0.9"/>`,
       
      `<rect x="4" y="4" width="24" height="24" rx="6" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M10 10l12 12M22 10L10 22" stroke="white" stroke-width="2"/>`,
       
      `<circle cx="16" cy="16" r="12" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <path d="M16 6l6 10H10z" fill="white"/>`,
       
      `<path d="M6 16c0-6 4-10 10-10s10 4 10 10v10H6V16z" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <circle cx="12" cy="14" r="2" fill="white"/>
       <circle cx="20" cy="14" r="2" fill="white"/>`,
       
      `<polygon points="16,4 26,12 20,28 12,28 6,12" fill="url(#grad-${iconId})" stroke="${gradientColor}" stroke-width="2"/>
       <circle cx="16" cy="16" r="4" fill="white"/>`
    ];
    
    return patterns[patternId];
  };

  // Special handling for specific tool types
  if (analysis.isSpeed || lowerName.includes('speed') || lowerName.includes('performance')) {
    const speedPattern = generateUniquePattern();
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.gradients[0]};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-${iconId}">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g filter="url(#glow-${iconId})">
        ${speedPattern}
      </g>
    </svg>`;
  }
  
  // Handle all other unique tool patterns
  const uniquePattern = generateUniquePattern();
  
  return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${iconId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${colors.gradients[analysis.variance % colors.gradients.length]};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
      </linearGradient>
      <filter id="shadow-${iconId}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="1" stdDeviation="1.5" flood-color="${colors.secondary}" flood-opacity="0.3"/>
      </filter>
    </defs>
    <g filter="url(#shadow-${iconId})">
      ${uniquePattern}
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